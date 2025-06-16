import { deleteCartItem, updateCartItemQty } from "@/store/shop/cart-slice"; 
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Minus, Plus, Trash } from "lucide-react";
import { toast } from "sonner";

function UsrCartItemsContent({ cartItems }) {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { cartItems: allCartItems } = useSelector((state) => state.ShoppingCart);
  const { productList } = useSelector((state) => state.shoppingProducts);

  function handleCartDeleteItem(getCartItem) {
    dispatch(deleteCartItem({ userId: user?.id, productId: getCartItem?.productId }))
      .then(data => {
        if (data?.payload?.success) {
          toast("Product is Deleted succesfully");
        }
      });
  }
function handleUpdateQuantity(getCartItem, typeofAction) {
  const getCartItems = allCartItems.items || [];

  const indexOfCurrentCartItem = getCartItems.findIndex(
    (item) => item.productId === getCartItem?.productId
  );

  const getcurrentProductIndex = productList.findIndex(
    (product) => product?._id === getCartItem?.productId 
  );

  const getTotalStock = productList[getcurrentProductIndex]?.totalStock;

  if (typeofAction === "plus") {
    if (indexOfCurrentCartItem > -1 && getTotalStock !== undefined) {
      const getQuantity = getCartItems[indexOfCurrentCartItem].quantity;
      const newQuantity = getQuantity + 1;

      if (newQuantity > getTotalStock) {
        toast.error(`Only ${getTotalStock} quantity available in stock.`);
        return;
      }
    }
  }

  if (typeofAction === "minus" && getCartItem.quantity <= 1) {
    return;
  }

  dispatch(updateCartItemQty({
    userId: user?.id,
    productId: getCartItem?.productId,
    quantity: typeofAction === "plus"
      ? getCartItem.quantity + 1
      : getCartItem.quantity - 1
  })).then((data) => {
    if (data?.payload?.success) {
      toast("Product is updated successfully");
    }
  });

  console.log("indexOfCurrentCartItem", indexOfCurrentCartItem);
  console.log("getTotalStock", getTotalStock);
}



  return (
    <div className="flex items-center space-x-4">
      <img
        src={cartItems?.image}
        alt={cartItems?.title}
        className="w-20 h-20 rounded object-cover ml-6"
      />
      <div className="flex-1">
        <h3 className="font-extrabold">{cartItems?.title}</h3>
        <div className="flex items-center mt-1 gap-2">
          <button
            variant="outline"
            size="icon"
            disabled={cartItems?.quantity === 1}
            className="w-8 h-8 rounded-full"
            onClick={() => handleUpdateQuantity(cartItems, 'minus')}
          >
            <Minus className="w-4 h-4" />
            <span className="sr-only">Decrease</span>
          </button>
          <span className="font-semibold">{cartItems?.quantity}</span>
          <button
            variant="outline"
            size="icon"
            className="w-8 h-8 rounded-full"
            onClick={() => handleUpdateQuantity(cartItems, 'plus')}
          >
            <Plus className="w-4 h-4" />
            <span className="sr-only">Increase</span>
          </button>
        </div>
      </div>
      <div className="flex flex-col items-end mr-6">
        <p className="font-semibold">
          $
          {(
            (cartItems?.salePrice > 0
              ? cartItems?.salePrice
              : cartItems?.price) * cartItems?.quantity
          ).toFixed(2)}
        </p>
        <Trash
          onClick={() => handleCartDeleteItem(cartItems)}
          className='cursor-pointer mt-2'
          size={20}
        />
      </div>
    </div>
  );
}

export default UsrCartItemsContent;
