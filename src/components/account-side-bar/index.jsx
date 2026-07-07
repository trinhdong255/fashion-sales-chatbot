import { Box, Typography } from "@mui/material";
import { Link, useLocation } from "react-router-dom";

const AccountSideBar = ({ id }) => {
  const location = useLocation();
  const menuItems = [
    { path: `/account-information/profile/${id}`, label: "Hồ sơ người dùng" },
    {
      path: `/account-information/change-password/${id}`,
      label: "Đổi mật khẩu",
    },
    { path: `/account-information/address/${id}`, label: "Địa chỉ" },
  ];


  return (
    <Box
      sx={{
        border: "1px solid #ddd",
        width: "100%",
        p: 4,
        borderRadius: 2,
        backgroundColor: "#fff",
        boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
      }}
    >
      <Typography
        variant="h4"
        fontWeight={"bold"}
        fontSize={{
          xl: "1.5rem",
          lg: "1.3rem",
          md: "1.1rem",
          sm: "1.2rem",
          xs: "1.2rem",
        }}
        mb={2}
      >
        Thông tin người dùng
      </Typography>

      {menuItems.map((item) => (
        <Link
          to={item.path}
          key={item.path}
          style={{
            textDecoration: "none",
            color: location.pathname === item.path ? "black" : "#666",
            fontWeight: location.pathname === item.path ? "bold" : "normal",
            fontSize: location.pathname === item.path ? "16px" : "14px",
            lineHeight: location.pathname === item.path ? "24px" : "20px",
            padding: "8px 0 8px 30px",
            display: "block",
          }}
        >
          {item.label}
        </Link>
      ))}
    </Box>
  );
};

export default AccountSideBar;
