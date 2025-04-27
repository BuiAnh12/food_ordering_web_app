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
    checkStoreName: builder.query({
      query: (name) => ({
        url: `/store/check-name/${name}`,
        method: "GET",
      }),
    }),
    registerStore: builder.mutation({
      query: (data) => ({
        url: "store/register",
        method: "POST",
        credentials: "include",
        body: data,
      }),
    })
  }),
});

export const { useGetStoreInformationQuery, useUpdateStoreInformationMutation, useCheckStoreNameQuery, useLazyCheckStoreNameQuery, useRegisterStoreMutation } = storeApi;
