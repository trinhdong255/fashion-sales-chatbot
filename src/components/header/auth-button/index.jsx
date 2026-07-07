import { useTheme, useMediaQuery } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectUser } from "@/store/redux/user/reducer";
import { useLogoutMutation } from "@/services/api/auth";
import { clearAuth, selectAuth } from "@/store/redux/auth/reducer";
import DesktopAuthButton from "./desktop-auth-button";
import MobileAuthButton from "./mobile-auth-button";
import { useSnackbar } from "@/components/snackbar";
import { resetStore } from "@/store";

const AuthButton = ({ onCloseDrawer }) => {
  const { showSnackbar } = useSnackbar();
  const auth = useSelector(selectAuth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [logout] = useLogoutMutation();
  const myInfo = useSelector(selectUser);
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      const accessToken = auth.accessToken;

      if (accessToken) {
        await logout({ accessToken }).unwrap();
      }
    } catch (error) {
      if (error?.status !== 401) {
        if (error?.data?.message) {
          showSnackbar(error.data.message, "error");
        } else {
          showSnackbar("Đã có lỗi xảy ra trong quá trình đăng xuất.", "error");
        }
      }
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      dispatch(clearAuth());
      dispatch(resetStore());

      handleMenuClose();
    }
  };

  return isMobile ? (
    <MobileAuthButton
      handleLogout={handleLogout}
      myInfo={myInfo}
      navigate={navigate}
      onCloseDrawer={onCloseDrawer}
    />
  ) : (
    <DesktopAuthButton
      handleMenuOpen={handleMenuOpen}
      handleLogout={handleLogout}
      myInfo={myInfo}
      anchorEl={anchorEl}
      handleMenuClose={handleMenuClose}
      navigate={navigate}
    />
  );
};

export default AuthButton;
