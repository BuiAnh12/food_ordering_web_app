import { apiSlice } from "../api/apiSlice";

export const orderApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllOrders: builder.query({
      query: ({ storeId, status, limit, page }) => {
        const params = new URLSearchParams();
        if (status) params.append("status", status);
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
  }),
});

export const { useGetAllOrdersQuery } = orderApi;