import { Badge } from "../ui/badge";
import React from "react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { brandOptionsMap, categoryOptionsMap } from "@/config";

function ShoppingProducTile({
  product,
  handleGetProductDetails,
  handleAddToCart,
}) {
  return (
   <Card className="w-full max-w-sm mx-auto shadow-sm hover:shadow-md transition">
  <div onClick={() => handleGetProductDetails(product?._id)} className="cursor-pointer">
    <div className="relative">
      <img
        src={product?.image}
        alt={product?.title}
        className="w-full h-60 object-cover rounded-t-lg"
      />
      {product?.totalStock === 0 ? (
        <Badge className="absolute top-3 left-4 bg-red-500 text-white px-2 py-1 text-xs">
          Out of Stock
        </Badge>
      ) : product?.totalStock < 10 ? (
        <Badge className="absolute top-3 left-4 bg-red-500 text-white px-2 py-1 text-xs">
          {`Only ${product?.totalStock} left`}
        </Badge>
      ) : product.salePrice > 0 ? (
        <Badge className="absolute top-3 left-4 bg-red-500 text-white px-2 py-1 text-xs">
          Sale
        </Badge>
      ) : null}
    </div>

    <CardContent className="space-y-1"> {/* Reduced padding */}
      <h2 className="text-lg font-semibold truncate">{product?.title || "Untitled"}</h2>

      <div className="flex justify-between text-sm text-muted-foreground">
        <span>{categoryOptionsMap[product?.category]}</span>
        <span>{brandOptionsMap[product?.brand]}</span>
      </div>

      <div className="flex justify-between items-center">
        <span className={`${product?.salePrice > 0 ? "line-through text-sm" : "text-base font-semibold text-primary"}`}>
          ${product?.price}
        </span>
        {product?.salePrice > 0 && (
          <span className="text-base font-semibold text-primary">${product?.salePrice}</span>
        )}
      </div>
    </CardContent>
  </div>

  <CardFooter className="p-3 pt-0"> {/* 🔹 Reduce padding, remove top padding */}
    {product?.totalStock === 0 ? (
      <Button className="w-full opacity-60 cursor-not-allowed text-sm py-2">
        Out of Stock
      </Button>
    ) : (
      <Button
        onClick={(e) => {
          e.stopPropagation();
          handleAddToCart(product?._id, product?.totalStock);
        }}
        className="w-full text-sm py-2"
      >
        Add to Cart
      </Button>
    )}
  </CardFooter>
</Card>
  );
}

export default ShoppingProducTile;