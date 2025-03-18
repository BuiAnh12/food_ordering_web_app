import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orders: [],
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
};

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setOrder: (state, action) => {
      state.orders = action.payload; 
    },
    resetOrderState: () => initialState,
  },
});

export const { setOrder, resetOrderState } = orderSlice.actions; 

export default orderSlice.reducer;
