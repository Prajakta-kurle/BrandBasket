import React from "react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";

function AdminProductTile({
  product,
  setFormData,
  setopenCreateProductesDialog,
  setcurrentEditedId,
  handleDelete
}) {

  console.log(product); // To check the values of price and salePrice

  return (
    <Card className="w-full max-w-sm mx-auto">
      <div>
        <div className="relative">
          <img
            src={product?.image || "path/to/default-image.jpg"}
            alt={product?.title}
            className="w-full h-[300px] object-cover rounded-t-lg"
          />
        </div>
        <CardContent>
          <h2 className="text-xl font-bold mb-2 mt-2">{product?.title}</h2>
          <div className="flex justify-between items-center mb-2">
            {Number(product?.salePrice) > 0 ? (
              <>
                <span className="line-through text-lg font-semibold text-primary">
                  ${product?.price || 0}
                </span> 
                <span className="text-lg font-bold text-red-600">
                  ${product?.salePrice || 0}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-primary">
                ${product?.price}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600">
            In Stock: {product?.totalStock ?? 0}
          </p>
        </CardContent>
        <CardFooter className="flex items-center justify-between ">
          <Button
            onClick={() => {
              setopenCreateProductesDialog(true);
              //currentEditedId(product?._id)
              setcurrentEditedId(product?._id);
              setFormData(product);
            }}
          >
            Edit
          </Button>
          <Button onClick={()=>
            {handleDelete(product?._id)
            }
            }>
            Delete</Button>
        </CardFooter>
      </div>
    </Card>
  );
}

export default AdminProductTile;
