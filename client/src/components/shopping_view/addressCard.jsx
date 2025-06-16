import React from "react";
import {Card, CardContent, CardFooter } from "../ui/card";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Delete } from "lucide-react";

function AddressCard({ addressInfo, handleDeleteAddress,handleEditAddress, setcurrentSelectedAddress,selectedId })

{
  console.log(selectedId,"selectedId", addressInfo?._id)

  return (
  <Card
  onClick={() => {
    if (setcurrentSelectedAddress) {
      setcurrentSelectedAddress(addressInfo);
    }
  }}
  className={`cursor-pointer border-red-700 ${
    selectedId?._id === addressInfo?._id ? 'border-red-900 border-[3px]' : 'border-black'
  }`}
>
  <CardContent
    className={`${
      selectedId === addressInfo?._id ? 'border-black' : ''
    } grid gap-4 p-4`}
  >
    <Label><b>Address:</b> {addressInfo?.address}</Label>
    <Label><b>City:</b> {addressInfo?.city}</Label>
    <Label><b>Pincode:</b> {addressInfo?.pincode}</Label>
    <Label><b>Phone:</b> {addressInfo?.phone}</Label>
    <Label><b>Notes:</b> {addressInfo?.notes}</Label>
  </CardContent>

  <CardFooter className="p-3 justify-between flex" onClick={(e) => e.stopPropagation()}>
    <Button onClick={() => handleEditAddress(addressInfo)}>Edit</Button>
    <Button onClick={() => handleDeleteAddress(addressInfo)}>Delete</Button>
  </CardFooter>
</Card>

  );
}

export default AddressCard;
