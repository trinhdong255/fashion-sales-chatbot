// Layout imports
import AccountInformation from "@/layouts/account-information-layout";
import MainLayout from "@/layouts/main-layout";
import ProductListsLayout from "@/layouts/product-list-layout";
import ProductDetailsLayout from "@/layouts/product-detail-layout";

// Page imports
import Login from "@/pages/login-page";
import Register from "@/pages/register-page";
import VerifyAccount from "@/pages/verify-account-page";
import ResetPassword from "@/pages/reset-password-page";
import ForgotPassword from "@/pages/forgot-password-page";
import ForgotPasswordVerify from "@/pages/forgot-password-page/shared/forgot-password-verify";
import Profile from "@/pages/profile-page";
import Address from "@/pages/address-page";
import ProductDetails from "@/pages/product-detail-page";
import ProductLists from "@/pages/product-list-page";
import About from "@/pages/about-page";
import Home from "@/pages/home-page";
import Help from "@/pages/help-page";
import Blog from "@/pages/blog-page";
import BlogDetail from "@/pages/blog-page/shared/blog-detail";
import ChangePassword from "@/pages/change-password-page";
import MyOrders from "@/pages/my-order-page";
import Checkout from "@/pages/checkout-page";
import CheckoutSuccess from "@/pages/checkout-success-page";
import NotFound from "@/pages/not-found-page";
import VnPayReturn from "@/pages/vnpay-return-page";
import { Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <Routes>
      {/* Check route not found */}
      <Route path="*" element={<NotFound />} />

      {/* Dependencies component Header and Footer */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="help" element={<Help />} />
        <Route path="blog" element={<Blog />} />
        <Route path="blog/:id" element={<BlogDetail />} />
        <Route path="about" element={<About />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="checkout-success" element={<CheckoutSuccess />} />
        <Route path="vnpay-return" element={<VnPayReturn />} />
        <Route path="my-order" element={<MyOrders />} />
      </Route>

      {/* Login */}
      <Route path="/login" element={<Login />} />

      {/* Forgot Password */}
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route
        path="/forgot-password-verify"
        element={<ForgotPasswordVerify />}
      />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Register */}
      <Route path="/register" element={<Register />} />
      <Route path="/verify-account" element={<VerifyAccount />} />

      {/* Product Lists */}
      <Route path="/all-products" element={<ProductListsLayout />}>
        <Route index element={<ProductLists />} />
      </Route>

      {/* Product Details */}
      <Route path="/product-details/:id" element={<ProductDetailsLayout />}>
        <Route index element={<ProductDetails />} />
      </Route>

      {/* Account Inform */}
      <Route path="/account-information" element={<AccountInformation />}>
        <Route path="profile/:id" element={<Profile />} />
        <Route path="change-password/:id" element={<ChangePassword />} />
        <Route path="address/:id" element={<Address />} />
      </Route>
    </Routes>
  );
};

export default App;
