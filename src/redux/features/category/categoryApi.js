import { apiSlice } from "../api/apiSlice";

export const categoryApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllCategories: builder.query({
      query: ({ storeId, limit, page }) => {
        const params = new URLSearchParams();
        if (limit) params.append("limit", limit);
        if (page) params.append("page", page);

        return {
          url: `store/${storeId}/category?${params.toString()}`,
          method: "GET",
          credentials: "include",
        };
      },
      keepUnusedDataFor: 0,
      refetchOnMountOrArgChange: true,
    }),

    createCategory: builder.mutation({
      query: ({ storeId, name }) => ({
        url: `store/${storeId}/category/add`,
        method: "POST",
        body: { name },
        credentials: "include",
      }),
    }),

    updateCategory: builder.mutation({
      query: ({ categoryId, name }) => ({
        url: `store/category/${categoryId}`,
        method: "PUT",
        body: { name },
        credentials: "include",
      }),
    }),

    deleteCategory: builder.mutation({
      query: ({ categoryId }) => ({
        url: `store/category/${categoryId}`,
        method: "DELETE",
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useGetAllCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;
