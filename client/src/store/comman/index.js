import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    isLoading : false,
    featureImageList : []
}

export const addFeatureImage = createAsyncThunk(
    'feature/add',
    async(image)=>
    {
        const response = await axios.post(
            "http://localhost:5000/api/comman/feature/add",
            image
        )
       return response.data;
    }
)

export const getFeatureImage = createAsyncThunk(
    "feature/get",
    async()=>
    {
        const response = await axios.get(
            `http://localhost:5000/api/comman/feature/get`
        )
        return response.data;
    }
)
export const deleteFeatureImage = createAsyncThunk(
    "feature/delete",
    async({imageId})=>
    {
         console.log("Deleting from thunk, ID:", imageId);
        const response = await axios.delete(
            `http://localhost:5000/api/comman/feature/delete/${imageId}`
        )
        return response.data;
    }
)

const featureImageSlice = createSlice({
    name : 'commanFeature',
    initialState, 
    reducers:{},
    extraReducers : (builder)=>
    {
     builder.addCase(getFeatureImage.pending, (state)=>
    {
        state.isLoading = true;
    }).addCase(getFeatureImage.fulfilled,(state, action)=>
    {
        state.isLoading = false;
        state.featureImageList=action.payload.data;
    }).addCase(getFeatureImage.rejected, (state)=>
    {
        state.isLoading = false;
        state.featureImageList = []
    }).addCase(deleteFeatureImage.pending,(state)=>
    {
        state.isLoading = true;
    }).addCase(deleteFeatureImage.fulfilled, (state, action) => {
    state.isLoading = false;
    const deletedImageId = action.meta.arg.imageId;
    state.featureImageList = state.featureImageList.filter(
        (image) => image._id !== deletedImageId
    );
    }).addCase(deleteFeatureImage.rejected,(state,action)=>
    {
        state.isLoading = false;
        state.error = action.error.message;
    })
    }

})

export default featureImageSlice.reducer;