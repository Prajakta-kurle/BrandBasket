import { DialogContent, DialogTitle } from "../ui/dialog";
import React, { useState } from "react";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import CommanForm from "../comman/form";
import { Badge } from "@/components/ui/badge";
import { useDispatch } from "react-redux";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { toast } from "sonner";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  updateOrderStatusForAdmin,
} from "../../store/admin/order-slice";

const initialFormData = {
  status: "",
};

function AdminOrderDetailesView({ orderDetails }) {
  const [formData, setFormData] = useState(initialFormData);
  const dispatch = useDispatch();

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
    userId, // <-- this will now contain { userName, email } after populate
  } = orderDetails;

  function handleUpdateStatus(e) {
    e.preventDefault();
    const { status } = formData;

    dispatch(
      updateOrderStatusForAdmin({ id: orderDetails?._id, orderStatus: status })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(getOrderDetailsForAdmin(orderDetails?._id));
        dispatch(getAllOrdersForAdmin());
        setFormData(initialFormData);
        toast(data?.payload?.message);
      }
    });
  }

  return (
    <DialogContent className="sm:max-w-[600px]">
      <DialogTitle>
        <VisuallyHidden>Order Details</VisuallyHidden>
      </DialogTitle>
      <div className="grid gap-6">
        {/* Order Info */}
        <div className="grid gap-2">
          <InfoRow label="Order Id" value={_id} />
          <InfoRow label="Order Date" value={orderDate?.split("T")[0]} />
          <InfoRow label="Order Price" value={`$${totalAmount}`} />
          <InfoRow label="Payment Method" value={paymentMethod} />
          <InfoRow label="Payment Status" value={paymentStatus} />
          <div className="flex items-center justify-between mt-2">
            <p className="font-medium">Order Status</p>
            <Label>
              <Badge
                className={`py-1 px-2 ${
                  orderStatus === "confirmed"
                    ? "bg-green-500"
                    : orderStatus === "rejected"
                    ? "bg-red-600"
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
                    <span>Price: ${item?.price}</span>
                    <span>Quantity: {item?.quantity}</span>
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
              <span>{userId?.userName || "Unknown User"}</span>
              <span>{addressInfo?.address}</span>
              <span>{addressInfo?.city}</span>
              <span>{addressInfo?.pinCode}</span>
              <span>{addressInfo?.phone}</span>
              <span>{addressInfo?.note || "No notes"}</span>
            </div>
          </div>
        </div>

        {/* Order Status Update Form */}
        <div>
          <CommanForm
            formControls={[
              {
                label: "Order Status",
                name: "status",
                componentType: "select",
                options: [
                  { id: "confirmed", label: "Confirmed" },
                  { id: "pending", label: "Pending" },
                  { id: "inProcess", label: "In Process" },
                  { id: "inShipping", label: "In Shipping" },
                  { id: "delivered", label: "Delivered" },
                  { id: "rejected", label: "Rejected" },
                ],
              },
            ]}
            formData={formData}
            setFormData={setFormData}
            buttonText={"Update Order Status"}
            onSubmit={handleUpdateStatus}
          />
        </div>
      </div>
    </DialogContent>
  );
}

// Reusable row component
function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between mt-2">
      <p className="font-medium">{label}</p>
      <Label>{value}</Label>
    </div>
  );
}

export default AdminOrderDetailesView;
