import { Container, Grid, Typography } from "@mui/material";

import ProfileInform from "./shared/profile-information";

import AccountSideBar from "@/components/account-side-bar";
import { useParams } from "react-router-dom";

const Profile = () => {
  const { id } = useParams();

  return (
    <Container
      maxWidth="xl"
      sx={{
        my: {
          xs: 4,
          sm: 4,
          md: 8,
          lg: 8,
          xl: 8,
        },
      }}
    >
      <Grid container spacing={6}>
        <Grid
          size={{ xl: 3, lg: 3, md: 4 }}
          sx={{
            display: {
              xs: "none",
              sm: "none",
              md: "block",
              lg: "block",
              xl: "block",
            },
          }}
        >
          <AccountSideBar id={id} />
        </Grid>

        <Grid size={{ xl: 9, lg: 9, md: 8, sm: 12, xs: 12 }}>
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
            mb={2}
          >
            Hồ sơ người dùng
          </Typography>
          <ProfileInform />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile;
