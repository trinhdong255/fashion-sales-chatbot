import { Box, CircularProgress, Typography } from "@mui/material";

const LoadingItem = ({ title }) => {
  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      justifyContent={"center"}
      alignItems={"center"}
      my={6}
    >
      <CircularProgress color="inherit" />
      <Typography
        mt={3}
        textAlign="center"
        variant="h6"
        color="#666"
        fontSize={{
          xl: "1.1rem",
          lg: "1.1rem",
          md: "1.1rem",
          sm: "1rem",
          xs: "1rem",
        }}
      >
        {title}
      </Typography>
    </Box>
  );
};

export default LoadingItem;
