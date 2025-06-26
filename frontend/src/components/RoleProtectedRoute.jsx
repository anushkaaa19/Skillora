import { Navigate } from "react-router-dom";
import { useAuthStore } from "../redux/slices/authSlice";

const RoleProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuthStore();

  console.log("🛡️ Allowed roles:", allowedRoles);
  console.log("🛡️ Protected route: isAuthenticated", isAuthenticated);
  console.log("🛡️ Protected route: user", user);

  if (!isAuthenticated) return <Navigate to="/login" />;

  // ❌ If role is not allowed, redirect to the correct dashboard
  if (!allowedRoles.includes(user?.accountType)) {
    const fallbackPath =
      user?.accountType === "Instructor"
        ? "/instructor/dashboard"
        : "/student/dashboard";

    return <Navigate to={fallbackPath} />;
  }

  return children;
};

export default RoleProtectedRoute;
