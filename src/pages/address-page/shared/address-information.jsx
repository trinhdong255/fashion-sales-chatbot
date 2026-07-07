import { Box, Typography, Paper } from "@mui/material";
import { Fragment } from "react";

import { AddAddressModal } from "@/components/address/add-address-modal";
import { UpdateAddressModal } from "@/components/address/update-address-modal";
import { HideAddressModal } from "@/components/address/hide-address-modal";
import { useGetAllAddressesByUserQuery } from "@/services/api/user";

const AddressInformation = () => {
  const {
    data: dataAddress,
    isLoading: isLoadingAddress,
    isError: isErrorAddress,
    error: errorAddress,
  } = useGetAllAddressesByUserQuery(
    {
      page: 0,
      size: 10,
    },
    { refetchOnMountOrArgChange: true },
  );

  const addresses = dataAddress?.result?.items || [];

  return (
    <Fragment>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography
          variant="h4"
          fontWeight={"bold"}
          fontSize={{
            xl: "1.6rem",
            lg: "1.6rem",
            md: "1.4rem",
            sm: "1.2rem",
            xs: "1.2rem",
          }}
        >
          Danh sách địa chỉ
        </Typography>

        <AddAddressModal />
      </Box>

      {isLoadingAddress ? (
        <Box textAlign="center" mt={5}>
          <Typography variant="body1" color="#666">
            Đang tải địa chỉ...
          </Typography>
        </Box>
      ) : isErrorAddress ? (
        <Box textAlign="center" mt={5}>
          <Typography variant="body1" color="error">
            Lỗi tải địa chỉ: {errorAddress?.data?.message}
          </Typography>
        </Box>
      ) : addresses.length === 0 ? (
        <Box textAlign="center" mt={5}>
          <Typography variant="body1" color="#666">
            Chưa có địa chỉ nào được thêm vào. Vui lòng thêm địa chỉ.
          </Typography>
        </Box>
      ) : (
        addresses.map((address) => (
          <Paper
            key={address.id}
            elevation={2}
            sx={{
              p: 3,
              mb: 3,
            }}
          >
            <Box>
              <Typography
                variant="body1"
                fontSize={{ xs: "1rem", sm: "1rem", md: "1rem" }}
              >
                {address.phone}
              </Typography>
              <Typography
                variant="body1"
                fontSize={{ xs: "1rem", sm: "1rem", md: "1rem" }}
              >
                {address.streetDetail}, {address.ward.name},{" "}
                {address.district.name}, {address.province.name}
              </Typography>
              {address.isDefault && (
                <Typography
                  variant="body1"
                  fontWeight="bold"
                  fontSize={{ xs: "1rem", sm: "1rem", md: "1rem" }}
                >
                  Địa chỉ mặc định
                </Typography>
              )}
            </Box>
            <Box display="flex" justifyContent="flex-end" gap={2}>
              <UpdateAddressModal address={address} />
              <HideAddressModal addressId={address.id} />
            </Box>
          </Paper>
        ))
      )}
    </Fragment>
  );
};

export default AddressInformation;
