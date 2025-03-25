import { apiSlice } from "../api/apiSlice";

export const toppingApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllTopping: builder.query({
      query: ({ storeId, limit, page }) => {
        const params = new URLSearchParams();
        if (limit) params.append("limit", limit);
        if (page) params.append("page", page);

        return {
          url: `store/${storeId}/topping?${params.toString()}`, // Include storeId and query params
          method: "GET",
          credentials: "include",
        };
      },
      keepUnusedDataFor: 0, // Optional: Clear cache immediately when unused
      refetchOnMountOrArgChange: true, // Ensures refetch on component mount

    })
  }),
  
});

export const { useGetAllToppingQuery} = toppingApi;