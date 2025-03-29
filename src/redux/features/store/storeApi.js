import { apiSlice } from "../api/apiSlice";

export const storeApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getStoreInformation: builder.query({
      query: (id) => ({
        url: `/store/${id}`,
        method: "GET",
        credentials: "include",
      }),
    }),
    updateStoreInformation: builder.mutation({
      query: ({ storeId, updates }) => ({
        url: `/store/${storeId}`,
        method: "PUT",
        credentials: "include",
        body: updates,
      }),
    }),
  }),
});

export const { useGetStoreInformationQuery, useUpdateStoreInformationMutation } = storeApi;
