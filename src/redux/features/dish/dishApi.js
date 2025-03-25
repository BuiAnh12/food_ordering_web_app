import { apiSlice } from "../api/apiSlice";

export const dishApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllDish: builder.query({
      query: (storeId) => {
        console.log("Fetching dishes for storeId:", storeId); // Debugging
        return {
          url: `/store/${String(storeId)}/dish`,
          method: "GET",
          credentials: "include",
        };
      },
      async onQueryStarted(_arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
        } catch (error) {
          console.error("Error fetching dishes:", error);
        }
      },
      keepUnusedDataFor: 0, // Optional: Clear cache immediately when unused
      refetchOnMountOrArgChange: true, // Ensures refetch on component mount
      refetchOnFocus: true, // Refetch when the page/tab regains focus
      refetchOnReconnect: true, // Refetch when network reconnects
    }),
    getDish: builder.query({
      query: (dishId) => ({
        url: `/store/dish/${dishId}`,
        method: "GET",
        credentials: "include",
      }),
      async onQueryStarted(_arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
        } catch (error) {
          console.error(error);
        }
      },
      keepUnusedDataFor: 0, // Optional: Clear cache immediately when unused
      refetchOnMountOrArgChange: true, // Ensures refetch on component mount
    }),
    getToppingFromDish: builder.query({
      query: (dishId) => ({
        url: `/store/dish/${dishId}/topping`,
        method: "GET",
        credentials: "include",
      }),
      async onQueryStarted(_arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
        } catch (error) {
          console.error(error);
        }
      },
      keepUnusedDataFor: 0, // Optional: Clear cache immediately when unused
      refetchOnMountOrArgChange: true, // Ensures refetch on component mount
    }),
    updateDish: builder.mutation({
      query: ({ dishId, updatedData }) => ({
        url: `store/dish/${dishId}`,
        method: "PUT",
        credentials: "include",
        body: updatedData,
      }),
    }),
    createDish: builder.mutation({
      query: ({ storeId, dishData }) => ({
        url: `/store/${storeId}/dish/add`,
        method: "POST",
        credentials: "include",
        body: dishData,
      }),
    }),
  }),
});

export const { useGetAllDishQuery, useGetDishQuery, useGetToppingFromDishQuery, useUpdateDishMutation, useCreateDishMutation} = dishApi;
