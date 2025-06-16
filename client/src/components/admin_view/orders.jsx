import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
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
import AdminOrderDetailesView from "./order_Detailes";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  resetOrderDetails,
} from "../../store/admin/order-slice";
import { Badge } from "@/components/ui/badge";

function AdminOrdersView() {
  const { orderList, orderDetails } = useSelector((state) => state.adminOrder);
  const dispatch = useDispatch();
  const [openDetailesDialog, setOpenDetailesDialog] = useState(null);

  function handleFetchOrderDetails(getId) {
    dispatch(getOrderDetailsForAdmin(getId));
  }

  useEffect(() => {
    dispatch(getAllOrdersForAdmin());
  }, [dispatch]);

  useEffect(() => {
    if (orderDetails != null) setOpenDetailesDialog(orderDetails._id);
  }, [orderDetails]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="mt-5">All Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-20">Order Id</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total Price</TableHead>
              <TableHead>
                <span className="sr-only">Details</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderList && orderList.length > 0 ? (
              orderList.map((orderItem) => (
                <TableRow key={orderItem._id}>
                  <TableCell>{orderItem?._id}</TableCell>
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
                      {orderItem?.orderStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>{orderItem?.totalAmount}</TableCell>
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
                        <AdminOrderDetailesView
                          key={orderItem._id}
                          orderDetails={orderDetails}
                        />
                      )}
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No orders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default AdminOrdersView;
