import { Box, Typography } from "@mui/material";

const ErrorItem = ({ error, title }) => {
  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      justifyContent={"center"}
      alignItems={"center"}
      my={6}
    >
      <Typography variant="body1" color="error">
        {title}{" "}
        {error?.data?.message || "Đã có lỗi xảy ra vui lòng thử lại sau."}
      </Typography>
    </Box>
  );
};

export default ErrorItem;
