import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = 
{
    isLoading : false,
    reviews : []
}

export const addReview = createAsyncThunk(
    "/order/addReview",
    async(data)=>
    {
        const response = await axios.post(
          "http://localhost:5000/api/shop/review/add" ,
          data
        )
        return response.data;
    }
)

export const getReviews = createAsyncThunk(
    "/order/getReviews",
    async(id)=>
    {
        const responce = await axios.get(
            `http://localhost:5000/api/shop/review/${id}`
        )
        return responce.data;
    }
)

const reviewSlice = createSlice({
    name : "shopReview",
    initialState,
    reducers : {},
    extraReducers : (builder)=>
    {
      builder.addCase(getReviews.pending, (state)=>
    {
        state.isLoading = true;
    }).addCase(getReviews.fulfilled, (state,action)=>
    {
        state.isLoading = false;
        state.reviews = action.payload.data;
    }).addCase(getReviews.rejected, (state)=>
    {
        state.isLoading = false;
        state.reviews = [];
    }) .addCase(addReview.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(addReview.fulfilled, (state, action) => {
      state.isLoading = false;
      // Optional: Push new review to state
      state.reviews.push(action.payload.data); // or however your response is structured
    })
    .addCase(addReview.rejected, (state, action) => {
      state.isLoading = false;
      console.error("Review submission failed", action.error?.message);
    });
    }
})

export default reviewSlice.reducer;