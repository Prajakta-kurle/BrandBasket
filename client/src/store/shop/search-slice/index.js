import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState ={
isLoading : false,
searchResults : []
}

export const getSearchResults = createAsyncThunk(
  "shop/getSearchResults",
  async (keyword) => {
    const response = await axios.get(
      `http://localhost:5000/api/shop/search/${keyword.trim()}`
    );
    console.log("✅ Received response:", response.data);
    
    // 🟢 Extract only the actual array of products
    return response.data.data;
  }
);


const searchSlice = createSlice({
    name : "shopSearch",
    initialState,
    reducers : {
        resetSearchResults : (state)=>{
            state.searchResults =[]
        }
    },
  extraReducers: (builder) => {
  builder
    .addCase(getSearchResults.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(getSearchResults.fulfilled, (state, action) => {
      state.isLoading = false;
      console.log("⚙️ Redux payload:", action.payload);
      state.searchResults = action.payload;
    })
    .addCase(getSearchResults.rejected, (state) => {
      state.isLoading = false;
      state.searchResults = [];
    });
}

});

export const {resetSearchResults} = searchSlice.actions
export default searchSlice.reducer;
