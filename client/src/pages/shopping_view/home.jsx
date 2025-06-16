import { Button } from "@/components/ui/button";
import {
  BabyIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloudLightning,
  ShirtIcon,
  UmbrellaIcon,
  WatchIcon,
  Bandage,
  Airplay,
  Dices,
  Dice3,
  AirVent,
  AlignEndHorizontal,
} from "lucide-react";
import React, { useEffect, useState } from "react";
//import { Card, CardContent, CardFooter } from "@components/ui/card";
import { Card, CardContent, CardFooter } from "../../components/ui/card";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllFilteredProducts } from "@/store/shop/products-slice";
import ShoppingProducTile from "@/components/shopping_view/product-tile";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import ProductDetailesDialog from "@/components/shopping_view/product_detailes";
import { fetchProductDetailes } from "@/store/shop/products-slice";
import { addFeatureImage, getFeatureImage } from "@/store/comman";

const categoriesWithIcon = [
  { id: "men", label: "Men", icon: ShirtIcon },
  { id: "women", label: "Women", icon: CloudLightning },
  { id: "kids", label: "Kids", icon: BabyIcon },
  { id: "accesories", label: "Accesories", icon: WatchIcon },
  { id: "footwear", label: "Footwear", icon: UmbrellaIcon },
];

const brandWithIcon = [
  { id: "nike", label: "Nike", icon: Bandage },
  { id: "adidas", label: "Adidas", icon: Airplay },
  { id: "puma", label: "Puma", icon: Dices },
  { id: "levi", label: "Levi's", icon: Dice3 },
  { id: "zara", label: "Zara", icon: AirVent },
  { id: "h&m", label: "H&M", icon: AlignEndHorizontal },
];

function ShoppingHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { productList, productDetails } = useSelector(
    (state) => state.shoppingProducts
  );
   const { featureImageList } = useSelector((state) => state.commanFeature);
  const { user } = useSelector((state) => state.auth);
  

  function handleNavigateToListingPage(getCurrentItem, section) {
    sessionStorage.removeItem("filters");
    const currentFilter = {
      [section]: [getCurrentItem.id],
    };
    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate(`/shop/listing`);
  }

  useEffect(() => {
    if (productDetails && Object.keys(productDetails).length > 0) {
      setOpenDetailsDialog(true);
      console.log("Product Details:", productDetails);
    }
  }, [productDetails]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % featureImageList.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [featureImageList]);

  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price:lowtohigh",
      })
    );
  }, [dispatch]);

  function handleAddToCart(getCurrentProductId) {
    if (!user || !user.id) {
      console.log("Please log in to add items to the cart.");
      return;
    }

    const payload = {
      userId: user.id,
      productId: getCurrentProductId,
      quantity: 1,
    };

    dispatch(addToCart(payload)).then((data) => {
      if (data?.payload) {
        dispatch(fetchCartItems({ userId: user?.id }));
        toast("Product is added to cart");
      } else {
        toast.error("Failed to add product to cart.");
      }
    });
  }

  function handleGetProductDetails(getCurrentProductId) {
    console.log(getCurrentProductId);
    dispatch(fetchProductDetailes({ id: getCurrentProductId }))
      .unwrap()
      .then((res) => {
        // Wait until details are actually fetched
        setOpenDetailsDialog(true);
      })
      .catch((error) => {
        console.error("Failed to fetch product details:", error);
      });
  }

  useEffect(() => {
      dispatch(getFeatureImage());
    }, [dispatch]);
  
  console.log(featureImageList, "featureImagaeList")
  
  return (
    <div className="flex flex-col min-h-screen">
  <div className="relative w-full h-[600px] overflow-hidden">
    {featureImageList && featureImageList.length > 0
      ? featureImageList.map((slide, index) => {
          return (
            slide?.image && (
              <img
                key={slide.id || `${slide.image}-${index}`}
                src={slide.image}
                alt={`featureImageList-${index}`}
                className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${
                  index === currentSlide ? "opacity-100 z-0" : "opacity-0 z-0"
                }`}
              />
            )
          );
        })
      : null}

        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide(
              (prevSlide) => (prevSlide - 1 + featureImageList.length) % featureImageList.length
            )
          }
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white bg-opacity-80 z-10"
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide((prevSlide) => (prevSlide + 1) % featureImageList.length)
          }
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white bg-opacity-80 z-10"
        >
          <ChevronRightIcon className="w-4 h-4" />
        </Button>
      </div>

      <section className="py-10 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Shop By Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categoriesWithIcon.map((categoryItem) => (
              <Card
                onClick={() =>
                  handleNavigateToListingPage(categoryItem, "category")
                }
                key={categoryItem.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <categoryItem.icon className="w-12 h-12 mb-4 text-primary" />
                  <span className="font-bold">{categoryItem.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <section className="py-10 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Shop By Brand</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {brandWithIcon.map((brandItem) => (
              <Card
                onClick={() => handleNavigateToListingPage(brandItem, "brand")}
                key={brandItem.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <brandItem.icon className="w-12 h-12 mb-4 text-primary" />
                  <span className="font-bold">{brandItem.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <section className="py-12 ">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Feature Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productList && productList.length > 0
              ? productList.map((productItem) => (
                  <ShoppingProducTile
                    key={productItem._id} // Use a unique key, such as productItem.id
                    handleGetProductDetails={handleGetProductDetails}
                    product={productItem}
                    handleAddToCart={handleAddToCart}
                  />
                ))
              : null}
          </div>
        </div>
      </section>
      <ProductDetailesDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default ShoppingHome;
