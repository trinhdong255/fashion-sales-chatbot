import {
  Box,
  Typography,
  Grid,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Stack,
} from "@mui/material";
import { useGetOrderDetailByIdQuery } from "@/services/api/order";
import dayjs from "dayjs";
import { STATUS_CONFIG } from "@/constants";
import ErrorItem from "@/components/error-item/error-item";

const OrderDetailDialog = ({ open, onClose, orderId, onCancelOrder }) => {
  const {
    data: dataOrder,
    isLoading: isLoadingOrder,
    isError: isErrorOrder,
    error: errorOrder,
  } = useGetOrderDetailByIdQuery(orderId, {
    skip: !orderId || !open,
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontWeight: "bold", borderBottom: "1px solid #eee" }}>
        Chi tiết đơn hàng #{orderId}
      </DialogTitle>
      <DialogContent sx={{ py: 3 }}>
        {isLoadingOrder ? (
          <Typography
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"center"}
            alignItems={"center"}
            mt={6}
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
            Đang tải chi tiết đơn hàng...
          </Typography>
        ) : isErrorOrder ? (
          <ErrorItem
            error={errorOrder}
            title={"Lỗi khi tải chi tiết đơn hàng:"}
          />
        ) : dataOrder ? (
          <Box>
            <Grid container spacing={4} mb={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Thông tin giao hàng
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Người nhận:</strong> {dataOrder.customerName}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 0.5 }}
                >
                  <strong>Số điện thoại:</strong>{" "}
                  {dataOrder.address?.phone || "N/A"}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 0.5 }}
                >
                  <strong>Địa chỉ:</strong>{" "}
                  {dataOrder.address
                    ? `${dataOrder.address.streetDetail}, ${dataOrder.address.ward?.name || ""}, ${
                        dataOrder.address.district?.name || ""
                      }, ${dataOrder.address.province?.name || ""}`
                    : "N/A"}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Thông tin đơn hàng
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Ngày đặt hàng:</strong>{" "}
                  {dayjs(dataOrder.orderDate).format("DD/MM/YYYY HH:mm")}
                </Typography>
                <Box display="flex" alignItems="center" mt={1}>
                  <Typography variant="body2" color="text.secondary" mr={1}>
                    <strong>Trạng thái:</strong>
                  </Typography>
                  <Chip
                    label={
                      STATUS_CONFIG[dataOrder.orderStatus]?.label ||
                      dataOrder.orderStatus
                    }
                    color={
                      STATUS_CONFIG[dataOrder.orderStatus]?.color || "default"
                    }
                    size="small"
                  />
                </Box>
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1" fontWeight="bold" mb={2}>
              Sản phẩm đã đặt
            </Typography>
            <Stack spacing={2} mb={3}>
              {dataOrder.orderItems?.map((item) => (
                <Box key={item.id} display="flex" alignItems="center" gap={2}>
                  <img
                    src={
                      item.image?.imageUrl ||
                      item.productVariant?.product?.images?.[0]?.imageUrl ||
                      "https://placehold.co/64"
                    }
                    alt={item.productVariant?.product?.name || "Product image"}
                    style={{
                      width: 64,
                      height: 64,
                      objectFit: "cover",
                      borderRadius: 8,
                      border: "1px solid #eee",
                    }}
                  />
                  <Box flex={1}>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      fontSize="0.95rem"
                    >
                      {item.productVariant?.product?.name || "Sản phẩm"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Phân loại: {item.productVariant?.color?.name || ""},{" "}
                      {item.productVariant?.size?.name || ""}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Số lượng: {item.quantity}
                    </Typography>
                  </Box>
                  <Typography variant="body1" fontWeight="bold">
                    {(item.unitPrice * item.quantity).toLocaleString("vi-VN")}đ
                  </Typography>
                </Box>
              ))}
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Box
              display="flex"
              flexDirection="column"
              gap={1}
              sx={{ maxWidth: 300, ml: "auto" }}
            >
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  Giảm giá:
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  {(dataOrder.discountAmount || 0).toLocaleString("vi-VN")}đ
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mt={1}>
                <Typography variant="h6" fontWeight="bold">
                  Tổng cộng:
                </Typography>
                <Typography variant="h6" fontWeight="bold" color="black">
                  {(dataOrder.totalPrice || 0).toLocaleString("vi-VN")}đ
                </Typography>
              </Box>
            </Box>
          </Box>
        ) : null}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button variant="outlined" onClick={onClose}>
          Đóng
        </Button>
        <Box>
          {dataOrder &&
            (dataOrder.orderStatus === "PENDING" ||
              dataOrder.orderStatus === "PROCESSING") && (
              <Button
                variant="contained"
                color="error"
                onClick={() => onCancelOrder(dataOrder.id)}
              >
                Hủy đơn hàng
              </Button>
            )}
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default OrderDetailDialog;
