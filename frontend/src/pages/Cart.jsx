import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import { ShoppingCart, Trash2, CreditCard } from "lucide-react";
import ShootingStars from "../components/ShootingStars";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCartStore } from "../redux/slices/cartSlice";
import { toast } from "../hooks/use-toast";
import axios from "axios";

const Cart = () => {
  console.log("🧪 ENV TEST KEY:", process.env.REACT_APP_RAZORPAY_KEY);

  const navigate = useNavigate();
  const items = useCartStore((state) => state.items);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const clearCart = useCartStore((state) => state.clearCart);

  const total = items.reduce((acc, item) => acc + (item.price || 0), 0);

  const handleRemoveItem = (id) => {
    removeFromCart(id);
    toast({
      title: "Item removed",
      description: "Course has been removed from your cart",
    });
  };

  const handleCheckout = async () => {
    if (items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add courses to your cart before checking out",
        variant: "destructive",
      });
      return;
    }

    const courseIds = items.map((item) => item._id);
    console.log("🛒 Checkout initiated for courses:", courseIds);

    try {
      const res = await axios.post(
        `http://localhost:4000/api/v1/payment/capturePayment`,
        { coursesId: courseIds },
        { withCredentials: true }
      );

      console.log("✅ capturePayment response:", res.data);

      const { id: order_id, amount, currency } = res.data.message;
      console.log("🔑 RAZORPAY_KEY in env:", process.env.REACT_APP_RAZORPAY_KEY);


      const options = {
        
        key: "rzp_test_QgXo0K42iwFBKw",
        amount,
        currency,
        name: "Skillora",
        description: "Course Purchase",
        image: "/logo.png",
        order_id,
        handler: async function (response) {
          console.log("🔐 Razorpay Response:", response);
          try {
            const verifyRes = await axios.post(
              `http://localhost:4000/api/v1/payment/verifyPayment`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                coursesId: courseIds,
              },
              { withCredentials: true }
            );

            console.log("✅ Payment verified:", verifyRes.data);

            if (verifyRes.data.success) {
              clearCart();
              toast({
                title: "Enrollment Successful!",
                description: "You are now enrolled in your selected courses.",
              });
              navigate("/student/dashboard");
            }
          } catch (err) {
            console.error("❌ Error verifying payment:", err.response?.data || err);
            toast({
              title: "Verification Failed",
              description: "Could not verify payment.",
              variant: "destructive",
            });
          }
        },
        prefill: {
          name: "",
          email: "",
        },
        theme: {
          color: "#6366f1",
        },
      };
      console.log("📦 window.Razorpay exists?", typeof window.Razorpay);

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("❌ Error capturing payment:", err.response?.data || err);
      toast({
        title: "Checkout Error",
        description:
          err.response?.data?.message || "Unable to initiate payment.",
        variant: "destructive",
      });
    }
  };

  // ... (rest of your JSX code remains unchanged)


  return (
    <div className="min-h-screen flex flex-col bg-space space-bg">
      <ShootingStars />
      <Navbar cartItemCount={items.length} />

      <main className="flex-grow container mx-auto py-12 px-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-heading font-bold text-white mb-2">Your Shopping Cart</h1>
            <p className="text-gray-400">
              {items.length === 0
                ? "Your cart is empty. Add some courses and start learning!"
                : `You have ${items.length} ${items.length === 1 ? "course" : "courses"} in your cart.`}
            </p>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-16">
              <div className="mx-auto w-24 h-24 rounded-full bg-space-light/30 flex items-center justify-center mb-4">
                <ShoppingCart size={40} className="text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold text-white mb-4">Your cart is empty</h2>
              <p className="text-gray-400 mb-8">Browse our courses and find something that interests you</p>
              <Link to="/courses">
                <Button className="bg-space-accent hover:bg-space-secondary">Browse Courses</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {items.map((course) => (
                  <Card
                    key={course._id}
                    className="border-space-light bg-space-light/30 backdrop-blur-sm overflow-hidden"
                  >
                    <CardContent className="p-0">
                      <div className="flex flex-col sm:flex-row">
                        <div className="w-full sm:w-40 h-32">
                          <img
                            src={course.thumbnail || course.image}
                            alt={course.courseName || course.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-4 flex-grow flex flex-col justify-between">
                          <div>
                            <h3 className="font-heading font-semibold text-white mb-1">
                              {course.courseName || course.title}
                            </h3>
                            <p className="text-sm text-gray-400 mb-2">
                              {course.instructor?.firstName
                                ? `${course.instructor.firstName} ${course.instructor.lastName}`
                                : course.instructor || "Unknown Instructor"}
                            </p>
                            <div className="flex items-center space-x-2 text-xs text-gray-400">
                              {course.level && (
                                <>
                                  <span className="bg-space-light/50 px-2 py-0.5 rounded">{course.level}</span>
                                  <span>•</span>
                                </>
                              )}
                              {course.duration && <span>{course.duration}</span>}
                            </div>
                          </div>
                          <div className="flex justify-between items-center mt-4">
                            <span className="font-bold text-white">
                              ${course.price?.toFixed(2) || "0.00"}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                              onClick={() => handleRemoveItem(course._id)}
                            >
                              <Trash2 size={16} className="mr-1" />
                              Remove
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div>
                <Card className="border-space-light bg-space-light/30 backdrop-blur-sm sticky top-24">
                  <CardContent className="p-6">
                    <h3 className="font-heading font-semibold text-white text-xl mb-4">
                      Order Summary
                    </h3>

                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between text-gray-300">
                        <span>Subtotal</span>
                        <span>${total.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-gray-300">
                        <span>Discount</span>
                        <span>$0.00</span>
                      </div>
                    </div>

                    <Separator className="my-4 bg-space-light/50" />

                    <div className="flex justify-between text-white font-semibold text-lg mb-6">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>

                    <Button
                      className="w-full bg-space-accent hover:bg-space-secondary mb-2"
                      onClick={handleCheckout}
                    >
                      <CreditCard className="mr-2 h-4 w-4" /> Checkout
                    </Button>

                    <Link to="/courses">
                      <Button
                        variant="outline"
                        className="w-full border-space-light text-white hover:bg-space-light mt-2"
                      >
                        Continue Shopping
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Cart;
