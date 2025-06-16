import { DialogContent, DialogTitle } from "../ui/dialog";
import React from "react";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useSelector } from "react-redux";
import { Badge } from "../ui/badge";

function ShoppingOrderDetailesView({ orderDetails }) {
  const { user } = useSelector((state) => state.auth);

  if (!orderDetails) return <p>Loading...</p>;

  const {
    _id,
    orderDate,
    orderStatus,
    totalAmount,
    paymentMethod,
    paymentStatus,
    cartItems,
    addressInfo,
  } = orderDetails;

  return (
    <DialogContent className="sm:max-w-[600px]">
      <DialogTitle>
        <VisuallyHidden>Order Details</VisuallyHidden>
      </DialogTitle>

      <div className="grid gap-6">
        {/* Order Meta Info */}
        <div className="grid gap-2">
          <div className="flex items-center justify-between mt-6">
            <p className="font-medium">Order Id</p>
            <Label>{_id}</Label>
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="font-medium">Order Date</p>
            <Label>{orderDate?.split("T")[0]}</Label>
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="font-medium">Order Price</p>
            <Label>${totalAmount}</Label>
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="font-medium">Payment Method</p>
            <Label>{paymentMethod}</Label>
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="font-medium">Payment Status</p>
            <Label>{paymentStatus}</Label>
          </div>

           <div className="flex items-center justify-between mt-2">
            <p className="font-medium">Order Status</p>
            <Label>
          <Badge
            className={`py-1 px-3 ${
                orderStatus === "confirmed"
                ? "bg-green-500"
                : orderStatus === "rejected"
                ? "bg-red-600 "
                : "bg-black"
            }`}
          >
            {orderStatus}
          </Badge>
          </Label>
          </div>
        </div>

        <Separator />

        {/* Order Items */}
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Order Details</div>
            <ul className="grid gap-3">
              {cartItems && cartItems.length > 0 ? (
                cartItems.map((item, index) => (
                  <li key={index} className="flex items-center justify-between">
                    <span>{item?.title || "Unnamed Item"}</span>
                    <span> Price : ${item?.price}</span>
                    <span> Quantity : {item?.quantity}</span>
                  </li>
                ))
              ) : (
                <li>No items found.</li>
              )}
            </ul>
          </div>
        </div>

        {/* Shipping Info */}
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Shipping Info</div>
            <div className="grid gap-0.5 text-muted-foreground">
              <span>{user?.userName}</span>
              <span>{addressInfo?.address}</span>
              <span>{addressInfo?.city}</span>
              <span>{addressInfo?.pinCode}</span>
              <span>{addressInfo?.phone}</span>
              <span>{addressInfo?.note || "No notes"}</span>
            </div>
          </div>
        </div>
      </div>
    </DialogContent>
  );
}

export default ShoppingOrderDetailesView;
