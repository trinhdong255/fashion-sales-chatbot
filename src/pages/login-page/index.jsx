import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Button,
  IconButton,
  InputAdornment,
  TextField,
  CircularProgress,
  Box,
  Grid,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation, useLazyGetMyInfoQuery } from "@/services/api/auth";
import background_form from "@/assets/images/form/background-form.jpg";
import { useSnackbar } from "@/components/snackbar";
import { setAuth } from "@/store/redux/auth/reducer";
import { useDispatch } from "react-redux";

const Login = () => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();

  const [login, { isLoading }] = useLoginMutation();
  const [triggerMyInfo] = useLazyGetMyInfoQuery();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();
  const handleMouseUpPassword = (event) => event.preventDefault();

  const handleLogin = async (data) => {
    try {
      const response = await login({
        email: data?.email,
        password: data?.password,
      }).unwrap();

      if (response) {
        dispatch(
          setAuth({
            accessToken: response?.result?.accessToken,
            email: data?.email,
            roles: response?.result?.roles,
          }),
        );
        localStorage.setItem("accessToken", response?.result?.accessToken);
        localStorage.setItem("refreshToken", response?.result?.refreshToken);

        await triggerMyInfo();
        showSnackbar("Đăng nhập thành công!", "success");
        navigate("/");
      }
    } catch (error) {
      if (error && error.data && error.data.message) {
        showSnackbar(`${error.data.message}`, "error");
      }
    }
  };

  return (
    <Box
      component={"main"}
      display={"flex"}
      alignItems={"center"}
      justifyContent={"center"}
      sx={{
        backgroundColor: "#f0f0f0",
      }}
    >
      <Box
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
        minHeight="100vh"
      >
        <Grid
          container
          sx={{
            width: "100%",
            maxWidth: 1000,
            px: {
              xl: 3,
              lg: 3,
              md: 3,
              sm: 0,
              xs: 0,
            },
            py: 6,
            backgroundColor: "white",
            borderRadius: 2,
            boxShadow: 1,
            mx: {
              md: 2,
              sm: 2,
              xs: 2,
            },
          }}
        >
          <Grid size={{ xl: 6, lg: 6, md: 6, sm: 12, xs: 12 }}>
            <Box
              mx={{
                xl: 6,
                lg: 6,
                md: 6,
                sm: 3,
                xs: 3,
              }}
            >
              <Typography
                fontWeight={"bold"}
                sx={{
                  fontSize: {
                    md: "1.6rem",
                    lg: "1.6rem",
                    xl: "1.6rem",
                    sm: "1.4rem",
                    xs: "1.4rem",
                  },
                  textAlign: "center",
                }}
              >
                Thông tin đăng nhập
              </Typography>

              <Typography
                my={4}
                sx={{
                  fontSize: {
                    md: "1.1rem",
                    lg: "1.1rem",
                    xl: "1.1rem",
                    sm: "1rem",
                    xs: "1rem",
                  },
                  textAlign: {
                    sm: "center",
                    xs: "center",
                  },
                }}
              >
                Bạn chưa có tài khoản?
                <Typography
                  component={Link}
                  ml={1}
                  sx={{
                    textDecoration: "none",
                    color: "#666",
                    fontSize: {
                      md: "1.1rem",
                      lg: "1.1rem",
                      xl: "1.1rem",
                      sm: "1rem",
                      xs: "1rem",
                    },
                    transition: "0.2s",
                    "&:hover": {
                      color: "black",
                    },
                  }}
                  to="/register"
                >
                  Tạo tài khoản ngay
                </Typography>
              </Typography>

              <form onSubmit={handleSubmit(handleLogin)}>
                <TextField
                  id="email"
                  label="Email"
                  variant="outlined"
                  disabled={isLoading}
                  fullWidth
                  sx={{ mb: 4 }}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  {...register("email", {
                    required: "Email không được để trống",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Email không hợp lệ",
                    },
                  })}
                />

                <TextField
                  id="password"
                  label="Mật khẩu"
                  type={showPassword ? "text" : "password"}
                  variant="outlined"
                  disabled={isLoading}
                  fullWidth
                  sx={{ mb: 4 }}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  {...register("password", {
                    required: "Mật khẩu không được để trống",
                    minLength: {
                      value: 6,
                      message: "Mật khẩu phải có ít nhất 6 ký tự",
                    },
                  })}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label={
                            showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"
                          }
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          onMouseUp={handleMouseUpPassword}
                          edge="end"
                          disabled={isLoading}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Button
                  variant="contained"
                  fullWidth
                  type="submit"
                  sx={{ fontSize: "1.2rem" }}
                >
                  {isLoading ? (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <CircularProgress
                        size={34}
                        color="inherit"
                        sx={{ mr: 1 }}
                      />
                    </Box>
                  ) : (
                    "Đăng nhập"
                  )}
                </Button>
              </form>

              <Box
                display={"flex"}
                flexDirection={"column"}
                justifyContent={"center"}
                alignItems={"center"}
              >
                <Typography
                  component={Link}
                  to="/forgot-password"
                  mt={3}
                  sx={{
                    textDecoration: "none",
                    color: "#666",
                    fontSize: {
                      md: "1.1rem",
                      lg: "1.1rem",
                      xl: "1.1rem",
                      sm: "1rem",
                      xs: "1rem",
                    },
                    transition: "0.2s",
                    "&:hover": {
                      color: "black",
                    },
                  }}
                >
                  Bạn quên mật khẩu?
                </Typography>

                <Typography
                  component={Link}
                  to="/"
                  mt={3}
                  sx={{
                    textDecoration: "none",
                    color: "#666",
                    fontSize: {
                      md: "1.1rem",
                      lg: "1.1rem",
                      xl: "1.1rem",
                      sm: "1rem",
                      xs: "1rem",
                    },
                    transition: "0.2s",
                    "&:hover": {
                      color: "black",
                    },
                  }}
                >
                  Trở về trang chủ
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid
            size={{
              xl: 6,
              lg: 6,
              md: 6,
            }}
            sx={{ display: { xs: "none", sm: "none", md: "block" } }}
          >
            <img
              style={{
                width: "100%",
                height: "100%",
                borderRadius: 8,
                objectFit: "cover",
              }}
              draggable="false"
              src={background_form}
              alt="Background form"
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Login;
