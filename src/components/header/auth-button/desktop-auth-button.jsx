import {
  Typography,
  Menu,
  MenuItem,
  Button,
  Avatar,
  Box,
  Divider,
} from "@mui/material";
import { Link } from "react-router-dom";

const DesktopAuthButton = ({
  handleMenuOpen,
  handleLogout,
  myInfo,
  anchorEl,
  handleMenuClose,
  navigate,
}) => {
  return (
    <Box>
      {myInfo?.id ? (
        <Box>
          <Avatar
            onClick={handleMenuOpen}
            src={myInfo.avatarUrl}
            alt={myInfo.name}
            sx={{ cursor: "pointer" }}
          />

          <Menu
            aria-hidden={!anchorEl}
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <Box py={1} px={2}>
              <Typography fontWeight={"bold"}>{myInfo.name}</Typography>
              <Typography color="#666">{myInfo.email}</Typography>
            </Box>

            <Divider />

            <MenuItem
              onClick={() => {
                navigate(`/account-information/profile/${myInfo.id}`);
                handleMenuClose();
              }}
            >
              Thông tin người dùng
            </MenuItem>
            <MenuItem
              onClick={() => {
                navigate("/my-order");
                handleMenuClose();
              }}
            >
              Đơn hàng của tôi
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleLogout();
                handleMenuClose();
              }}
            >
              Đăng xuất
            </MenuItem>
          </Menu>
        </Box>
      ) : (
        <Box display={"flex"} alignItems={"center"} gap={2}>
          <Button variant="text" component={Link} to="/login" sx={{}}>
            Đăng nhập
          </Button>
          <Button
            variant="contained"
            component={Link}
            to="/register"
            sx={{
              backgroundColor: "#121212",
            }}
          >
            Đăng ký
          </Button>
        </Box>
      )}
    </Box>
  );
};
export default DesktopAuthButton;
