import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getSearchResults,
  resetSearchResults,
} from "@/store/shop/search-slice";
import {
  fetchAllFilteredProducts,
  fetchProductDetailes,
} from "@/store/shop/products-slice";
import ShoppingProducTile from "@/components/shopping_view/product-tile";
import { toast } from "sonner";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import ProductDetailesDialog from "@/components/shopping_view/product_detailes";

function SearchProducts() {
  const [keyword, setKeyword] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const dispatch = useDispatch();
  const { searchResults } = useSelector((state) => state.shopSearch);
  const { cartItems } = useSelector((state) => state.ShoppingCart);
  const user = useSelector((state) => state.auth.user);
  const { productList, productDetails } = useSelector(
    (state) => state.shoppingProducts
  );

  useEffect(() => {
    const delay = setTimeout(() => {
      if (keyword.trim().length > 3) {
        setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
        dispatch(getSearchResults(keyword));
      } else {
        setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
        dispatch(resetSearchResults());
      }
    }, 1000);

    return () => clearTimeout(delay);
  }, [keyword]);

  function handleAddToCart(getCurrentProductId, getTotalStock) {
    let getCartItems = cartItems.items || [];

    if (!user || !user.id) {
      toast.error("Please log in to add items to the cart.");
      return;
    }

    const indexOfCurrentItem = getCartItems.findIndex(
      (item) => item.productId === getCurrentProductId
    );

    if (indexOfCurrentItem > -1) {
      const getQuantity = getCartItems[indexOfCurrentItem].quantity;
      const newQuantity = getQuantity + 1;

      if (newQuantity > getTotalStock) {
        toast.error(`Only ${getTotalStock} quantity available in stock.`);
        return;
      }
    }

    const payload = {
      userId: user.id,
      productId: getCurrentProductId,
      quantity: 1,
    };

    dispatch(addToCart(payload)).then((data) => {
      if (data?.payload) {
        dispatch(fetchCartItems({ userId: user?.id }));
        toast.success("Product added to cart");
      } else {
        toast.error("Failed to add product to cart.");
      }
    });
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetailes({ id: getCurrentProductId }))
      .unwrap()
      .then((res) => {
        setOpenDetailsDialog(true);
      })
      .catch((error) => {
        console.error("Failed to fetch product details:", error);
      });
  }

  useEffect(() => {
    if (productDetails && Object.keys(productDetails).length > 0) {
      setOpenDetailsDialog(true);
      console.log("Product Details:", productDetails);
    }
  }, [productDetails]);

  console.log("From redux searchResults", searchResults);

  return (
    <div className="container mx-auto md:px-6 px-4 py-8">
      <div className="flex justify-center mb-8">
        <div className="w-full flex items-center">
          <Input
            value={keyword}
            name="keyword"
            onChange={(event) => setKeyword(event.target.value)}
            className="py-8"
            placeholder="Search Products..."
          />
        </div>
      </div>
      {!searchResults.length ? (
        <h1 className="text-5xl font-extrabold">No Result found!</h1>
      ) : null}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {searchResults.map((item) => (
          <ShoppingProducTile
            product={item}
            handleAddToCart={handleAddToCart}
            handleGetProductDetails={handleGetProductDetails}
          />
        ))}
      </div>
      <ProductDetailesDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default SearchProducts;
