import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  approvalURL: null,
  isLoading: false,
  orderId: null,
  orderList : [],
  orderDetails : null
};

export const createNewOrder = createAsyncThunk(
  "/order/createNewOrder",
  async (orderData) => {
    const response = await axios.post(
      "http://localhost:5000/api/shop/order/create",
      orderData,
        { withCredentials: true }
    );
    return response.data;
  }
);

export const capturePayment = createAsyncThunk(
  "./order/capturePayment",
  async({paymentId, payerId, orderId})=>
  {
    const response = await axios.post(
      "http://localhost:5000/api/shop/order/capture",
    {
      paymentId,
       payerId,
       orderId
    }
    );
    return response.data;
  }
)
export const getAllOrdersByUserId = createAsyncThunk(
  "./order/getAllOrdersByUserId",
  async(userId)=>
  {
  const response = await axios.get (
    `http://localhost:5000/api/shop/order/list/${userId}`,
  );
  return response.data;
  }
)

export const getOrderDetails = createAsyncThunk(
  "./order/getOrderDetails",
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/shop/order/details/${id}`
      );
      return response.data;
    } catch (error) {
      console.error("❌ Error in getOrderDetails:", error.response?.data || error.message);
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);


const shoppingOrderSlice = createSlice({
  name: "shopOrder",
  initialState,
  reducers: {
    resetOrderDetails : (state)=>
    {
       state.orderDetails = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createNewOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createNewOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.approvalURL = action.payload.approvalUrl;
        state.orderId = action.payload.orderId;
        sessionStorage.setItem(
          'currentOrderId'
          , JSON.stringify(action.payload.orderId))
      })
      .addCase(createNewOrder.rejected, (state) => {
        state.isLoading = false;
        state.approvalURL = null;
        state.orderId = null;
      }).addCase(getAllOrdersByUserId.pending,(state)=>
      {
        state.isLoading = true;
      }).addCase(getAllOrdersByUserId.fulfilled, (state,action)=>
      {
        state.isLoading = false;
        state.orderList = action.payload
      }).addCase(getAllOrdersByUserId.rejected,(state)=>
      {
        state.isLoading = false;  
        state.orderList = []
      }).addCase(getOrderDetails.pending, (state)=>
      {
        state.isLoading = true;
      }).addCase(getOrderDetails.fulfilled,(state,action)=>
      {
        console.log("Fetched orderDetails payload:", action.payload);
        state.isLoading = false;
        state.orderDetails = action.payload.data;
      }).addCase(getOrderDetails.rejected, (state,action)=>
      {
        console.error("❌ getOrderDetails failed:", action.payload || action.error);
        state.isLoading = false;
        state.orderDetails = null;
      })
  },
});

export const {resetOrderDetails} = shoppingOrderSlice.actions;
export default shoppingOrderSlice.reducer;
