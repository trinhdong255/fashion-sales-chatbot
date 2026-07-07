import { slugify } from "@/utils";
import { Home, NavigateNext } from "@mui/icons-material";
import { Box, Breadcrumbs, Container, Typography } from "@mui/material";
import { useLocation, Link as RouterLink } from "react-router-dom";

const BreadcrumbNav = () => {
  const location = useLocation();
  const pathNames = location.pathname.split("/").filter((x) => x);
  const searchParams = new URLSearchParams(location.search);
  const category = searchParams.get("category");

  // Map of paths to display names
  const breadcrumbNameMap = {
    "/blog": "Bài viết",
    "/about": "Về chúng tôi",
    "/help": "Trợ giúp",
    "/all-products": "Tất cả sản phẩm",
    "/product-details": "Chi tiết sản phẩm",
    "/checkout": "Thanh toán",
    "/my-order": "Đơn hàng của tôi",
  };

  const hiddenPaths = ["/checkout-success", "/vnpay-return"];

  // Do not render breadcrumb for these paths
  if (hiddenPaths.includes(location.pathname)) {
    return null;
  }

  const categoryMap = {
    "ao-thun": "Áo thun",
    "ao-so-mi": "Áo sơ mi",
    "ao-khoac": "Áo khoác",
    "quan-tay": "Quần tây",
    "quan-shorts": "Quần shorts",
    "phu-kien": "Phụ kiện",
  };

  const getDisplayNameFromSlug = (slug) => {
    const normalizedSlug = slugify(slug); // Ensure slug is in the correct format
    return (
      categoryMap[normalizedSlug] ||
      slug.charAt(0).toUpperCase() + slug.slice(1)
    );
  };

  return (
    <Box bgcolor={"#f9f9f9"}>
      <Container maxWidth="lg">
        <Breadcrumbs aria-label="breadcrumb" separator={<NavigateNext />}>
          {/* Always show Home link if not on root */}
          {location.pathname !== "/" && (
            <RouterLink to="/" color="inherit">
              <Box my={2} display="flex" alignItems="center">
                <Home fontSize="small" color="action" />
              </Box>
            </RouterLink>
          )}

          {pathNames.map((value, index) => {
            const last = index === pathNames.length - 1;
            const to = `/${pathNames.slice(0, index + 1).join("/")}`;

            // Handle dynamic routes (e.g., /product-details/:id, /blog/:id)
            const isDynamic = value.match(/^[0-9a-fA-F-]+$/); // Match UUID or numbers
            let displayName = isDynamic
              ? breadcrumbNameMap[to.replace(value, "")] || value // Use base path for dynamic routes
              : breadcrumbNameMap[to] ||
                value.charAt(0).toUpperCase() + value.slice(1); // Fallback to capitalized value

            return last ? (
              <Typography color="inherit" key={to}>
                {displayName}
              </Typography>
            ) : (
              <Typography
                to={to}
                sx={{ color: "inherit", textDecoration: "none" }}
                key={to}
              >
                {displayName}
              </Typography>
            );
          })}

          {/* Add category breadcrumb if present */}
          {category && pathNames.includes("all-products") && (
            <Typography color="text.primary" key="category">
              {getDisplayNameFromSlug(category)}
            </Typography>
          )}
        </Breadcrumbs>
      </Container>
    </Box>
  );
};

export default BreadcrumbNav;
