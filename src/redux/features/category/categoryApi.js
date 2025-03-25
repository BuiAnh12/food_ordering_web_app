import { apiSlice } from "../api/apiSlice";

export const categoryApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllCategories: builder.query({
      query: ({ storeId, limit, page }) => {
        const params = new URLSearchParams();
        if (limit) params.append("limit", limit);
        if (page) params.append("page", page);

        return {
          url: `store/${storeId}/category?${params.toString()}`, // Correct endpoint for categories
          method: "GET",
          credentials: "include",
        };
      },
      keepUnusedDataFor: 0, // Optional: Clear cache immediately when unused
      refetchOnMountOrArgChange: true, // Ensures refetch on component mount
    }),
  }),
});

export const { useGetAllCategoriesQuery } = categoryApi;
