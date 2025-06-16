import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../ui/table";
import { Button } from "../ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import ShoppingOrderDetailesView from "./order_detailes";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersByUserId,
  getOrderDetails,
  resetOrderDetails,
} from "@/store/shop/order-slice";
import { Badge } from "@/components/ui/badge";

function ShoppingOrders() {
  const [openDetailesDialog, setOpenDetailesDialog] = useState(null);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { orderList, orderDetails } = useSelector((state) => state.shopOrder);

  function handleFetchOrderDetails(getId) {
    dispatch(getOrderDetails(getId));
    setOpenDetailesDialog(getId);
  }

  useEffect(() => {
    if (user?.id) {
      dispatch(getAllOrdersByUserId(user.id));
    }
  }, [dispatch, user?.id]);

  useEffect(() => {
    if (
      orderDetails &&
      orderDetails._id &&
      openDetailesDialog !== orderDetails._id
    ) {
      setOpenDetailesDialog(orderDetails._id);
    }
  }, [orderDetails, openDetailesDialog]);

  console.log("User:", user);
  console.log("Order List:", orderList);

  console.log(orderDetails, "orderDetails");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="mt-5">Orders History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order Id</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead>Order Status</TableHead>
              <TableHead>Order Price</TableHead>
              <TableHead>
                <span className="sr-only">Detailes</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderList?.data?.length > 0 ? (
              orderList.data.map((orderItem) => (
                <TableRow key={orderItem._id}>
                  <TableCell>{orderItem._id}</TableCell>
                  <TableCell>{orderItem?.orderDate?.split("T")[0]}</TableCell>
                  <TableCell>
                    <Badge
                     className={`py-1 px-3 ${
                        orderItem?.orderStatus === "confirmed"
                          ? "bg-green-500"
                          : orderItem?.orderStatus === "rejected"
                          ? "bg-red-600 "
                          : "bg-black"
                      }`}
                    >
                      {orderItem.orderStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>₹{orderItem.totalAmount}</TableCell>
                  <TableCell>
                    <Dialog
                      open={openDetailesDialog === orderItem._id}
                      onOpenChange={(isOpen) => {
                        if (!isOpen) {
                          setOpenDetailesDialog(null);
                          dispatch(resetOrderDetails());
                        }
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button
                          onClick={() => handleFetchOrderDetails(orderItem._id)}
                        >
                          View Details
                        </Button>
                      </DialogTrigger>
                      {openDetailesDialog === orderItem._id && (
                        <ShoppingOrderDetailesView
                          orderDetails={orderDetails}
                        />
                      )}
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  You have no orders yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default ShoppingOrders;
