import { baseApi } from "./index";
import { TAG_KEYS } from "@/constants/tag-keys";

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    cancelOrder: builder.mutation({
      query: (orderId) => ({
        url: `/v1/private/orders/${orderId}/cancel`,
        method: "PUT",
      }),
      invalidatesTags: [TAG_KEYS.ORDER],
    }),

    updateAddressByOrder: builder.mutation({
      query: ({ orderId, ...addressData }) => ({
        url: `/v1/private/orders/${orderId}/address`,
        method: "PUT",
        data: addressData,
      }),
      invalidatesTags: [TAG_KEYS.ORDER],
    }),

    calculateShippingFee: builder.mutation({
      query: (shippingData) => ({
        url: "/v1/private/shipping/calculate-fee",
        method: "POST",
        data: shippingData,
      }),
      invalidatesTags: [TAG_KEYS.ORDER],
    }),

    createOrder: builder.mutation({
      query: (orderData) => ({
        url: "/v1/private/orders",
        method: "POST",
        data: orderData,
      }),
      invalidatesTags: [TAG_KEYS.ORDER],
    }),

    createPaymentCallbackByOrder: builder.mutation({
      query: ({ orderId, responseCode }) => ({
        url: `/v1/private/orders/vn-pay-callback`,
        method: "POST",
        params: { orderId, responseCode },
      }),
      invalidatesTags: [TAG_KEYS.ORDER],
    }),

    getOrdersByCurrentUser: builder.query({
      query: (orderStatus) => ({
        url: `/v1/private/user/orders`,
        params: { orderStatus },
      }),
      transformResponse: (response) => {
        return response.result;
      },
      providesTags: [TAG_KEYS.ORDER],
    }),

    getPaymentByOrder: builder.query({
      query: (orderId) => ({
        url: `/v1/private/orders/${orderId}/vn-pay`,
      }),
      transformResponse: (response) => {
        return response.result;
      },
      providesTags: [TAG_KEYS.ORDER],
    }),

    getRetryPaymentByOrder: builder.query({
      query: (orderId) => ({
        url: `/v1/private/orders/${orderId}/payment-retry`,
      }),
      transformResponse: (response) => {
        return response.result;
      },
      providesTags: [TAG_KEYS.ORDER],
    }),

    getOrderDetailById: builder.query({
      query: (orderId) => ({
        url: `/v1/private/orders/${orderId}/details`,
      }),
      transformResponse: (response) => {
        return response.result;
      },
      providesTags: [TAG_KEYS.ORDER],
    }),
  }),
});

export const {
  useCancelOrderMutation,
  useUpdateAddressByOrderMutation,
  useCalculateShippingFeeMutation,
  useCreateOrderMutation,
  useCreatePaymentCallbackByOrderMutation,
  useGetOrdersByCurrentUserQuery,
  useGetPaymentByOrderQuery,
  useLazyGetPaymentByOrderQuery,
  useGetRetryPaymentByOrderQuery,
  useGetOrderDetailByIdQuery,
} = orderApi;
