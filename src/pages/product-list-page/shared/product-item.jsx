import {
  Card,
  CardContent,
  Grid,
  Pagination,
  Skeleton,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useState, useEffect, useMemo, Fragment } from "react";

import CardProduct from "./card-product";
import { useGetProductsByCategoryByUserQuery } from "@/services/api/category";
import { useGetAllProductForUserQuery } from "@/services/api/product";
import { normalizeString, slugify } from "@/utils";

const ProductItem = ({ selectedCategory, categoryId, searchQuery }) => {
  const [clientPageNo, setClientPageNo] = useState(0);
  const [pageSize] = useState(18);
  const [sortType, setSortType] = useState("");

  useEffect(() => {
    setClientPageNo(1);
  }, [selectedCategory, searchQuery]);

  const {
    data: dataGetAllProductsByCategory,
    isLoading: isLoadingAllProductsByCategory,
    isError: isErrorGetAllProductsByCategory,
    error: errorGetAllProductsByCategory,
  } = useGetProductsByCategoryByUserQuery(
    {
      categoryId,
      page: 0,
      size: 100,
    },
    {
      skip: !categoryId,
    },
  );

  const {
    data: dataAllProducts,
    isLoading: isLoadingAllProducts,
    isError: isErrorProduct,
    error: errorProduct,
  } = useGetAllProductForUserQuery(
    {
      page: 0,
      size: 100,
    },
    {
      skip: !!categoryId,
    },
  );

  const dataProductsByCategory = categoryId
    ? dataGetAllProductsByCategory
    : dataAllProducts;

  const filteredProducts = useMemo(() => {
    // Handle data structure safety
    const items =
      dataProductsByCategory?.result?.items ||
      dataProductsByCategory?.items ||
      [];

    return items.filter((item) => {
      // A. Check Category
      // If we filtered by categoryId on the server, we bypass client-side category filtering
      const matchesCategory = categoryId
        ? true
        : selectedCategory
          ? item.category?.name &&
            slugify(item.category.name) === selectedCategory
          : true;

      // B. Check Search (Client Side)
      const matchesSearch = searchQuery
        ? normalizeString(item.name || "").includes(
            normalizeString(searchQuery),
          )
        : true;

      return matchesCategory && matchesSearch;
    });
  }, [dataProductsByCategory, selectedCategory, categoryId, searchQuery]);

  // Sort products based on selected sort type
  const sortedProducts = useMemo(() => {
    if (!filteredProducts || filteredProducts.length === 0) return [];

    const products = [...filteredProducts];

    switch (sortType) {
      case "price_asc":
        return products.sort((a, b) => a.price - b.price);

      case "price_desc":
        return products.sort((a, b) => b.price - a.price);

      case "name_asc":
        return products.sort((a, b) => {
          const nameA = (a.name || "").toLowerCase();
          const nameB = (b.name || "").toLowerCase();
          return nameA.localeCompare(nameB);
        });

      case "name_desc":
        return products.sort((a, b) => {
          const nameA = (a.name || "").toLowerCase();
          const nameB = (b.name || "").toLowerCase();
          return nameB.localeCompare(nameA);
        });

      default:
        return products;
    }
  }, [filteredProducts, sortType]);

  // Client-side pagination calculations
  const totalFilteredProducts = sortedProducts.length;
  const totalClientPages = Math.ceil(totalFilteredProducts / pageSize);
  const startIndex = (clientPageNo - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentPageProducts = sortedProducts.slice(startIndex, endIndex);

  const handlePageChange = (event, value) => {
    setClientPageNo(value);
  };

  const handleSortChange = (event) => {
    setSortType(event.target.value);
    setClientPageNo(1);
  };

  // Check if there are no products to display
  const hasNoProducts =
    !isLoadingAllProductsByCategory &&
    !isErrorGetAllProductsByCategory &&
    (!currentPageProducts || currentPageProducts.length === 0);

  return (
    <Fragment>
      {/* Sort Control */}
      {totalFilteredProducts > 0 && (
        <Box sx={{ mb: 3, display: "flex", justifyContent: "flex-end" }}>
          <FormControl color="inherit" size="small" sx={{ minWidth: 200 }}>
            <InputLabel color="inherit">Sắp xếp theo</InputLabel>
            <Select
              color="inherit"
              value={sortType}
              label="Sắp xếp theo"
              onChange={handleSortChange}
            >
              <MenuItem color="inherit" value="">
                Mặc định
              </MenuItem>
              <MenuItem color="inherit" value="price_asc">
                Giá: Thấp đến cao
              </MenuItem>
              <MenuItem color="inherit" value="price_desc">
                Giá: Cao đến thấp
              </MenuItem>
              <MenuItem color="inherit" value="name_asc">
                Tên: A-Z
              </MenuItem>
              <MenuItem color="inherit" value="name_desc">
                Tên: Z-A
              </MenuItem>
            </Select>
          </FormControl>
        </Box>
      )}

      {isLoadingAllProductsByCategory || isLoadingAllProducts ? (
        <Grid container spacing={2} columns={10}>
          {[...Array(pageSize)].map((_, index) => (
            <Grid size={2} key={index}>
              <Card sx={{ mt: 2 }}>
                <Skeleton variant="rectangular" height={180} />
                <CardContent>
                  <Skeleton variant="text" />
                  <Skeleton variant="text" />
                  <Skeleton variant="text" />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : isErrorGetAllProductsByCategory || isErrorProduct ? (
        <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
          <Typography color="error">
            {isErrorGetAllProductsByCategory
              ? errorGetAllProductsByCategory?.message
              : errorProduct?.message}
          </Typography>
        </Box>
      ) : hasNoProducts ? (
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          sx={{ py: 8, width: "100%", textAlign: "center" }}
        >
          <Typography
            variant="h6"
            color="#666"
            fontSize={{
              xs: "1rem",
              sm: "1rem",
              md: "1.2rem",
            }}
          >
            Không có sản phẩm nào để hiển thị.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {currentPageProducts?.map((product) => (
            <Grid size={{ xl: 2, lg: 2, md: 3, sm: 4, xs: 6 }} key={product.id}>
              <CardProduct product={product} />
            </Grid>
          ))}

          {/* Client-side pagination */}
          {totalClientPages > 0 && (
            <Box
              display={"flex"}
              alignItems={"center"}
              justifyContent={"center"}
              sx={{ width: "100%", mt: 10 }}
            >
              <Pagination
                count={totalClientPages}
                page={clientPageNo}
                onChange={handlePageChange}
                size="large"
                variant="outlined"
              />
            </Box>
          )}
        </Grid>
      )}
    </Fragment>
  );
};

export default ProductItem;
