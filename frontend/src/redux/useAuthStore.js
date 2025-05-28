import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import { auth, provider, signInWithPopup, signOut } from "../firebase.jsx";

// API and Socket URLs
const API_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5001/api"
    : "/api";

const SOCKET_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5001"
    : undefined;

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  resetEmail: null,
  resetToken: null,

  // Set email and token for password reset flow
  setResetEmail: (email) => set({ resetEmail: email }),
  setResetToken: (token) => set({ resetToken: token }),

  // Request OTP to be sent to email for password reset
  forgotPassword: async (email) => {
    try {
      const res = await axiosInstance.post("/auth/forgot-password", { email });
      toast.success(res.data.message || "OTP sent to your email");
      return { success: true, message: res.data.message };
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Failed to send OTP";
      toast.error(message);
      return { success: false, message };
    }
  },

  // Verify OTP received by email and store temp token for password reset
  verifyOtp: async (email, otp) => {
    try {
      const res = await axiosInstance.post("/auth/verify-otp", { email, otp });
      set({ resetEmail: email, resetToken: res.data.tempToken });
      toast.success("OTP verified! You can now reset your password.");
      return { success: true, data: res.data };
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "OTP verification failed";
      toast.error(message);
      return { success: false, message };
    }
  },

  // Reset password using stored email and temp token
  resetPassword: async (newPassword) => {
    const email = get().resetEmail;
    const token = get().resetToken;

    if (!email || !token) {
      const msg = "No email or token found, please verify OTP first.";
      toast.error(msg);
      return { success: false, message: msg };
    }

    try {
      const res = await axiosInstance.post(
        "/auth/reset-password",
        { email, newPassword, token },
        { withCredentials: true }
      );
      toast.success(res.data.message || "Password reset successful!");
      // Clear resetEmail & resetToken after success
      set({ resetEmail: null, resetToken: null });
      return { success: true, message: res.data.message };
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Password reset failed";
      toast.error(message);
      return { success: false, message };
    }
  },

  // Check if user is already logged in
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
      get().connectSocket();
      return res.data;
    } catch (error) {
      if (error.response?.status === 401) {
        set({ authUser: null });
      }
      return null;
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  // Sign in with Google OAuth using Firebase
  signInWithGoogle: async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const res = await axiosInstance.post("/auth/google", {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      });

      set({ authUser: res.data });
      get().connectSocket();
      toast.success("Signed in with Google!");
    } catch (error) {
      await signOut(auth);
      toast.error("Google sign-in failed");
      throw error;
    }
  },

  // Signup new user
  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      await axiosInstance.post("/auth/signup", data);
      await get().checkAuth();
      toast.success("Account created successfully");
    } catch (error) {
      if (error.response?.data?.errors) {
        error.response.data.errors.forEach((err) => toast.error(err.msg));
      } else {
        toast.error(error.response?.data?.message || "Signup failed");
      }
    } finally {
      set({ isSigningUp: false });
    }
  },

  // Login existing user
  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      get().connectSocket();
      toast.success("Logged in successfully");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
      return false;
    } finally {
      set({ isLoggingIn: false });
    }
  },

  // Logout user
  logout: async () => {
    try {
      await signOut(auth);
      await axiosInstance.post("/auth/logout");
      set({ authUser: null, onlineUsers: [] });
      get().disconnectSocket();
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error(error.response?.data?.message || error.message);
    }
  },

  // Update user profile picture or details
  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  // Connect to socket server and listen for online users
  connectSocket: () => {
    const { authUser, socket } = get();
    if (!authUser?._id || socket?.connected) return;

    const sock = io(SOCKET_URL, {
      query: { userId: authUser._id },
      transports: ["websocket"],
    });

    sock.on("connect", () => console.log("Socket connected"));
    sock.on("disconnect", () => console.log("Socket disconnected"));
    sock.on("getOnlineUsers", (users) => set({ onlineUsers: users }));

    set({ socket: sock });
  },

  // Disconnect socket when user logs out or app unmounts
  disconnectSocket: () => {
    const { socket } = get();
    if (socket?.connected) {
      socket.disconnect();
      set({ socket: null });
    }
  },
}));
