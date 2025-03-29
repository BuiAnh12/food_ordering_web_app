import { apiSlice } from "../api/apiSlice";

export const staffApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Get all staff in a store
     */
    getAllStaff: builder.query({
      query: (storeId) => ({
        url: `/store/${storeId}/staff`,
        method: "GET",
        credentials: "include",
      }),
    }),

    /**
     * Get details of a specific staff member
     */
    getStaff: builder.query({
      query: ({ storeId, staffId }) => ({
        url: `/store/${storeId}/${staffId}`,
        method: "GET",
        credentials: "include",
      }),
    }),

    /**
     * Add a new staff member to a store
     */
    createStaff: builder.mutation({
      query: ({ storeId, staffData }) => ({
        url: `/store/${storeId}/staff/add`,
        method: "POST",
        body: staffData,
        credentials: "include",
      }),
    }),

    /**
     * Update a staff member's details
     */
    updateStaff: builder.mutation({
      query: ({ storeId, staffData }) => ({
        url: `/store/${storeId}/staff/update`,
        method: "PUT",
        body: staffData,
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useGetAllStaffQuery,
  useGetStaffQuery,
  useCreateStaffMutation,
  useUpdateStaffMutation,
} = staffApi;
