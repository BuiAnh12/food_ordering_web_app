import { apiSlice } from "../api/apiSlice";

export const toppingApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllTopping: builder.query({
      query: ({ storeId, limit, page }) => {
        const params = new URLSearchParams();
        if (limit) params.append("limit", limit);
        if (page) params.append("page", page);

        return {
          url: `store/${storeId}/topping?${params.toString()}`, // Fix lỗi template string
          method: "GET",
          credentials: "include",
        };
      },
      keepUnusedDataFor: 0, 
      refetchOnMountOrArgChange: true, 
    }),

    getTopping: builder.query({
      query: ({ groupId }) => {
        return {
          url: `store/topping-group/${groupId}`, // Fix lỗi template string
          method: "GET",
          credentials: "include",
        };
      },
      keepUnusedDataFor: 0, 
      refetchOnMountOrArgChange: true, 
    }),

    addToppingToGroup: builder.mutation({
      query: ({ groupId, name, price }) => ({
        url: `store/topping-group/${groupId}/topping`,
        method: "POST",
        body: { name, price },
        credentials: "include",
      }),
    }),

    removeToppingFromGroup: builder.mutation({
      query: ({ groupId, toppingId }) => ({
        url: `store/topping-group/${groupId}/topping/${toppingId}`,
        method: "DELETE",
        credentials: "include",
      }),
    }),
    updateTopping: builder.mutation({
      query: ({ groupId, toppingId, name, price }) => ({
        url: `store/topping-group/${groupId}/topping/${toppingId}`,
        method: "PUT",
        body: { name, price },
        credentials: "include",
      }),
    }),
  }),
});

export const { 
  useGetAllToppingQuery, 
  useGetToppingQuery, 
  useAddToppingToGroupMutation,
  useRemoveToppingFromGroupMutation,
  useUpdateToppingMutation,
} = toppingApi;
