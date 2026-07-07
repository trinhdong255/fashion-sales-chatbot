import {
  Container,
  Tab,
  Tabs,
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  Divider,
  Stack,
} from "@mui/material";
import { Fragment, useState } from "react";
import dayjs from "dayjs";
import {
  useGetOrdersByCurrentUserQuery,
  useCancelOrderMutation,
} from "@/services/api/order";
import { useSnackbar } from "@/components/snackbar";
import WallpaperRepresentative from "@/components/wallpaper-representative";
import { ORDER_STATUS_TABS, STATUS_CONFIG } from "@/constants";
import OrderDetailDialog from "./shared/order-detail-dialog";
import CancelConfirmDialog from "./shared/cancel-confim-order";
import { useNavigate } from "react-router-dom";
import LoadingItem from "@/components/loading-item/loading-item";
import ErrorItem from "@/components/error-item/error-item";

const MyOrder = () => {
  const token = localStorage.getItem("accessToken");
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [status, setStatus] = useState("PENDING");
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [openCancel, setOpenCancel] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);

  const {
    data: orders,
    isLoading,
    isFetching,
    isError,
  } = useGetOrdersByCurrentUserQuery(status);

  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation();

  if (!token) {
    navigate("/login");
    return;
  }

  const handleTabChange = (event, newValue) => {
    setStatus(newValue);
  };

  const handleOpenDetail = (orderId) => {
    setSelectedOrderId(orderId);
    setOpenDetail(true);
  };

  const handleCloseDetail = () => {
    setOpenDetail(false);
    setSelectedOrderId(null);
  };

  const handleOpenCancel = (orderId, e) => {
    if (e) e.stopPropagation();
    setOrderToCancel(orderId);
    setOpenCancel(true);
  };

  const handleCloseCancel = () => {
    setOpenCancel(false);
    setOrderToCancel(null);
  };

  const handleConfirmCancel = async () => {
    if (!orderToCancel) return;
    try {
      await cancelOrder(orderToCancel).unwrap();
      showSnackbar("Hủy đơn hàng thành công!", "success");
      handleCloseCancel();
      // If detail dialog was open for this order, close it as well
      if (selectedOrderId === orderToCancel) {
        handleCloseDetail();
      }
    } catch (err) {
      const errMsg = err?.data?.message || "Có lỗi xảy ra khi hủy đơn hàng.";
      showSnackbar(errMsg, "error");
    }
  };

  const handleCancelFromDetail = (orderId) => {
    handleOpenCancel(orderId);
  };

  const orderList = orders || [];

  if (isLoading) {
    return <LoadingItem title={"Đang tải đơn hàng..."} />;
  }

  if (isError) {
    return <ErrorItem title={"Lỗi tải danh sách đơn hàng:"} />;
  }

  return (
    <Fragment>
      <WallpaperRepresentative titleHeader="Đơn hàng của tôi" />

      <Container maxWidth="lg" sx={{ pb: 8 }}>
        <Tabs
          value={status}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            my: 4,
            "& .MuiTab-root": { color: "#666", fontSize: "1rem" },
            "& .Mui-selected": { color: "#000", fontWeight: "bold" },
            "& .MuiTabs-indicator": { backgroundColor: "black" },
          }}
        >
          {ORDER_STATUS_TABS.map((tab) => (
            <Tab key={tab.value} value={tab.value} label={tab.label} />
          ))}
        </Tabs>

        {orderList.length === 0 ? (
          <Box textAlign="center" py={8}>
            <Typography variant="h6" color="text.secondary">
              Không có đơn hàng nào trong trạng thái này.
            </Typography>
          </Box>
        ) : (
          <Grid
            container
            spacing={3}
            sx={{ opacity: isFetching ? 0.5 : 1, transition: "opacity 0.2s" }}
          >
            {orderList.map((order) => (
              <Grid size={{ xs: 12 }} key={order.id}>
                <Card
                  variant="outlined"
                  sx={{
                    borderRadius: 2,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                    "&:hover": {
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    },
                    transition: "box-shadow 0.2s ease-in-out",
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      flexWrap="wrap"
                      gap={2}
                      mb={2}
                    >
                      <Box>
                        <Typography variant="h6" fontWeight="bold">
                          Mã đơn hàng: #{order.id}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 0.5 }}
                        >
                          Ngày đặt:{" "}
                          {dayjs(order.orderDate).format("DD/MM/YYYY HH:mm")}
                        </Typography>
                      </Box>
                      <Chip
                        label={
                          STATUS_CONFIG[order.orderStatus]?.label ||
                          order.orderStatus
                        }
                        color={
                          STATUS_CONFIG[order.orderStatus]?.color || "default"
                        }
                      />
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Người nhận:</strong> {order.customerName}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 0.5 }}
                        >
                          <strong>Số điện thoại:</strong>{" "}
                          {order.address?.phone || "N/A"}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 0.5 }}
                        >
                          <strong>Địa chỉ:</strong>{" "}
                          {order.address?.streetDetail || "N/A"}
                        </Typography>
                      </Grid>
                      <Grid
                        size={{ xs: 12, sm: 6 }}
                        display="flex"
                        flexDirection="column"
                        justifyContent="space-between"
                        alignItems={{ xs: "flex-start", sm: "flex-end" }}
                      >
                        <Box
                          textAlign={{ xs: "left", sm: "right" }}
                          mb={{ xs: 2, sm: 0 }}
                        >
                          <Typography variant="body2" color="text.secondary">
                            Tổng thanh toán
                          </Typography>
                          <Typography
                            variant="h6"
                            fontWeight="bold"
                            color="black"
                          >
                            {order.totalPrice.toLocaleString("vi-VN")}đ
                          </Typography>
                        </Box>
                        <Stack direction="row" spacing={2} mt={1}>
                          {(order.orderStatus === "PENDING" ||
                            order.orderStatus === "PROCESSING") && (
                            <Button
                              variant="outlined"
                              color="error"
                              size="small"
                              onClick={(e) => handleOpenCancel(order.id, e)}
                            >
                              Hủy đơn
                            </Button>
                          )}
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleOpenDetail(order.id)}
                          >
                            Xem chi tiết
                          </Button>
                        </Stack>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* Order Details Dialog */}
      <OrderDetailDialog
        open={openDetail}
        onClose={handleCloseDetail}
        orderId={selectedOrderId}
        onCancelOrder={handleCancelFromDetail}
      />

      {/* Cancel Confirmation Dialog */}
      <CancelConfirmDialog
        open={openCancel}
        onClose={handleCloseCancel}
        onConfirm={handleConfirmCancel}
        isCancelling={isCancelling}
      />
    </Fragment>
  );
};

export default MyOrder;
