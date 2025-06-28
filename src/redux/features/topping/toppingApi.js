import { apiSlice } from "../api/apiSlice";

export const toppingApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllTopping: builder.query({
      query: ({ storeId, limit, page }) => {
        const params = new URLSearchParams();
        if (limit) params.append("limit", limit);
        if (page) params.append("page", page);

        return {
          url: `topping/store/${storeId}?${params.toString()}`, // Fix lỗi template string
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
          url: `topping/topping-group/${groupId}`, // Fix lỗi template string
          method: "GET",
          credentials: "include",
        };
      },
      keepUnusedDataFor: 0, 
      refetchOnMountOrArgChange: true, 
    }),

    addToppingToGroup: builder.mutation({
      query: ({ groupId, name, price }) => ({
        url: `topping/topping-group/${groupId}/topping`,
        method: "POST",
        body: { name, price },
        credentials: "include",
      }),
    }),

    addToppingGroupOnly: builder.mutation({
      query: ({ storeId, name }) => ({
        url: `topping/store/${storeId}/topping-group/add`,
        method: "POST",
        body: {name},
        credentials: "include",
        headers: {
          "Content-Type": "application/json", // Important!
        },
      }),
    }),
    
    removeToppingFromGroup: builder.mutation({
      query: ({ groupId, toppingId }) => ({
        url: `topping/topping-group/${groupId}/topping/${toppingId}`,
        method: "DELETE",
        credentials: "include",
      }),
    }),
    updateTopping: builder.mutation({
      query: ({ groupId, toppingId, name, price }) => ({
        url: `topping/topping-group/${groupId}/topping/${toppingId}`,
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
  useAddToppingGroupOnlyMutation,
} = toppingApi;
