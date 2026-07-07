import CancelDialog from "@/components/dialog/cancel-dialog/cancel-dialog";

const CancelConfirmDialog = ({ open, onClose, onConfirm, isCancelling }) => {
  return (
    <CancelDialog
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title={"Xác nhận huỷ đơn hàng"}
      description={
        "Bạn có chắc chắn muốn hủy đơn hàng này không? Hành động này không thể hoàn tác."
      }
      isCancelling={isCancelling}
    />
  );
};

export default CancelConfirmDialog;
