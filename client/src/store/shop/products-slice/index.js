import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  productList: [],
  productDetails: {},
};

export const fetchAllFilteredProducts = createAsyncThunk(
  "/products/getFilteredProducts",
  async ({ filterParams, sort }) => {
    console.log(fetchAllFilteredProducts, "fetchAllFilteredProducts");

    const query = new URLSearchParams({
      ...filterParams,
      sortBy: sort,
    });
    const result = await axios.get(
      `http://localhost:5000/api/shop/products/get?${query}`
    );

    return result?.data;
  }
);

export const fetchProductDetailes = createAsyncThunk(
  "/products/fetchProductDetailes",
  async ({ id }) => {
     console.log("Calling backend with ID:", id); 
    const result = await axios.get(
      `http://localhost:5000/api/shop/products/get/${id}`
    );
    console.log("Response from backend:", result.data);

    return result?.data;
  }
);

const shoppingProductsSlice = createSlice({
  name: "shoppingProducts",
  initialState,
  reducers: {
    setProductDetails : (state)=>{
      state.productDetails = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllFilteredProducts.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchAllFilteredProducts.fulfilled, (state, action) => {
        console.log(action.payload, "Full action.payload");
        state.isLoading = false;
        state.productList = action.payload.data;
      })
      .addCase(fetchAllFilteredProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.productList = [];
      })
         .addCase(fetchProductDetailes.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchProductDetailes.fulfilled, (state, action) => {
        console.log(action.payload, "Full action.payload");
        state.isLoading = false;
        state.productDetails = action.payload.data;
      })
      .addCase(fetchProductDetailes.rejected, (state, action) => {
        state.isLoading = false;
        state.productDetails = null;
      });
  },
});

export const setProductDetails = shoppingProductsSlice.actions;
export default shoppingProductsSlice.reducer;
