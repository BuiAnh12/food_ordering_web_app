import { apiSlice } from "../api/apiSlice";

export const orderApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllOrders: builder.query({
      query: ({ storeId, status, limit, page }) => {
        const params = new URLSearchParams();
        if (Array.isArray(status)) {
          params.append("status", status.join(",")); // Convert array to comma-separated string
        } else if (status) {
          params.append("status", status);
        }
        if (limit) params.append("limit", limit);
        if (page) params.append("page", page);

        return {
          url: `store/${storeId}/order?${params.toString()}`, // Include storeId and query params
          method: "GET",
          credentials: "include",
        };
      },
      keepUnusedDataFor: 0, // Optional: Clear cache immediately when unused
      refetchOnMountOrArgChange: true, // Ensures refetch on component mount

    }),
    getOrder: builder.query({
      query: ({ orderId }) => {
        return {
          url: `store/order/${orderId}`, // Include storeId and query params
          method: "GET",
          credentials: "include",
        };
      },
      keepUnusedDataFor: 0, // Optional: Clear cache immediately when unused
      refetchOnMountOrArgChange: true, // Ensures refetch on component mount

    }),
    updateOrder: builder.mutation({
      query: ({ orderId, updatedData }) => ({
        url: `store/order/${orderId}`,
        method: "PUT",
        credentials: "include",
        body: updatedData,
      }),
    }),
  }),
});

export const { useGetAllOrdersQuery, useGetOrderQuery, useUpdateOrderMutation } = orderApi;