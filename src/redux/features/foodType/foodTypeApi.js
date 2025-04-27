import { apiSlice } from "../api/apiSlice";

export const foodTypeApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllFoodType: builder.query({
            query: () => {
                return {
                    url: `/foodType`,
                    method: "GET",
                };
            },
            keepUnusedDataFor: 0,
            refetchOnMountOrArgChange: true,
        }),
    }),
});

export const {
    useGetAllFoodTypeQuery
} = foodTypeApi;