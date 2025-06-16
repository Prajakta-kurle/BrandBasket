import ProductFilter from "@/components/shopping_view/filter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";
import { ArrowUpDownIcon } from "lucide-react";
import { sortOptions } from "@/config";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllFilteredProducts,
  fetchProductDetailes,
} from "@/store/shop/products-slice";
import ShoppingProducTile from "@/components/shopping_view/product-tile";
import { createSearchParams, useSearchParams } from "react-router-dom";
import ProductDetailesDialog from "@/components/shopping_view/product_detailes";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useState, useEffect } from "react";
import { toast } from "sonner";

function createSearchParamsHelper(filterParams) {
  const queryParams = [];
  for (const [key, value] of Object.entries(filterParams)) {
    if (Array.isArray(value) && value.length > 0) {
      const paramValue = value.join(",");
      queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
    }
  }
  return queryParams.join("&");
}

function ShoppingListing() {
  const dispatch = useDispatch();
  const { productList, productDetails } = useSelector(
    (state) => state.shoppingProducts
  );  
  const user = useSelector((state) => state.auth.user);
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState("price-lowtohigh");
  const [searchParams, setSearchParams] = useSearchParams();
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { cartItems } = useSelector((state) => state.ShoppingCart)

  const categorySearchParams = searchParams.get('category')

  useEffect(() => {
    if (user && user.id) {
      console.log("Logged in as:", user.id);
    } else {
      console.log("User is not logged in.");
    }
  }, [user]);

  useEffect(() => {
    const savedFilters = JSON.parse(sessionStorage.getItem("filters")) || {};
    setFilters(savedFilters);
  }, [categorySearchParams]);

  useEffect(() => {
    if (filters && Object.keys(filters).length > 0) {
      const createQueryString = createSearchParamsHelper(filters);
      setSearchParams(new URLSearchParams(createQueryString));
    }
  }, [filters]);

  useEffect(() => {
    if (filters !== null && sort !== null) {
      dispatch(fetchAllFilteredProducts({ filterParams: filters, sort }));
    }
  }, [filters, sort, dispatch]);

  const handleSort = (value) => {
    setSort(value);
  };

  const handleFilter = (getSectionId, getCurrentOption) => {
    const updatedFilters = { ...filters };
    const sectionOptions = updatedFilters[getSectionId] || [];

    const optionIndex = sectionOptions.indexOf(getCurrentOption);
    if (optionIndex === -1) {
      sectionOptions.push(getCurrentOption);
    } else {
      sectionOptions.splice(optionIndex, 1);
    }

    if (sectionOptions.length === 0) {
      delete updatedFilters[getSectionId];
    } else {
      updatedFilters[getSectionId] = sectionOptions;
    }

    setFilters(updatedFilters);
    sessionStorage.setItem("filters", JSON.stringify(updatedFilters));
  };

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


 useEffect(() => {
  if (productDetails && Object.keys(productDetails).length > 0) {
    setOpenDetailsDialog(true);
    console.log("Product Details:", productDetails);
  }
}, [productDetails]);


  console.log(productList, "productList");

  return (
    <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6 p-4 md:p-6">
      <ProductFilter filters={filters} handleFilter={handleFilter} />
      <div className="bg-background shadow-sm w-full rounded-lg">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-extrabold">All Products</h2>
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground">
              {productList?.length} Products
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <ArrowUpDownIcon className="h-4 w-4" />
                  <span>Sort by</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                side="bottom"
                sideOffset={8}
                className="absolute left-6 top-full z-50 gap-2 bg-white border rounded shadow-lg w-[200px]"
              >
                <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                  {sortOptions.map((sortItem) => (
                    <DropdownMenuRadioItem
                      key={sortItem.id}
                      value={sortItem.id}
                      className="border-b p-2 hover:bg-gray-100"
                    >
                      {sortItem.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
          {productList && productList.length > 0 ? (
            productList.map((productItem) => (
              <ShoppingProducTile
                key={productItem._id}
                product={productItem}
                handleGetProductDetails={handleGetProductDetails}
                handleAddToCart={handleAddToCart}
              />
            ))
          ) : (
            <p className="col-span-full text-center text-muted-foreground">
              No products found.
            </p>
          )}
        </div>

        <ProductDetailesDialog
          open={openDetailsDialog}
          setOpen={setOpenDetailsDialog}
          productDetails={productDetails}
        />
      </div>
    </div>
  );
}

export default ShoppingListing;
