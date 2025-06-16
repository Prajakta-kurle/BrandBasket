import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authslice";
import AdminProductsSlice from "./admin";
import shoppingProductsSlice from  './shop/products-slice'
import shoppingCartSlice from './shop/cart-slice'
import shopAddressSlice from './shop/address-slice'
import shoppingOrderSlice from './shop/order-slice'
import shoppingSearchSlice from './shop/search-slice'
import ShoppingReviewSlice from './shop/review-slice'
import adminOrderSlice from './admin/order-slice'
import commanFeatureSlice from './comman'

const store = configureStore(
    {
        reducer:
        {
            auth:authReducer,

            adminOrder : adminOrderSlice,
            adminProducts:AdminProductsSlice, 
            
            shoppingProducts:shoppingProductsSlice,
            ShoppingCart:shoppingCartSlice,
            ShoppingAddress : shopAddressSlice,
            shopOrder : shoppingOrderSlice,
            shopSearch : shoppingSearchSlice,
            shopReview : ShoppingReviewSlice,
            
            commanFeature : commanFeatureSlice
        }
    }
)

export default store 