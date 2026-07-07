import { Outlet, Navigate } from "react-router-dom";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { Box } from "@mui/material";
import { useSelector } from "react-redux";
import { selectAuth } from "@/store/redux/auth/reducer";

const AccountInformation = () => {
  const auth = useSelector(selectAuth);
  const token = auth?.accessToken;
  const isAuthenticated = token && token !== "undefined" && token !== "null";

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <Box component="main" sx={{ flex: 1 }}>
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
};

export default AccountInformation;
