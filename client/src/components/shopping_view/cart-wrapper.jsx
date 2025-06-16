import React from 'react'
import { SheetContent, SheetHeader, SheetTitle } from '../ui/sheet'
import { Button } from '../ui/button'
import UsrCartItemsContent from './cart-items-content'
import { useNavigate } from 'react-router-dom'

function UserCartWrapper({cartItems, setOpenCartSheet}) {
 const navigate = useNavigate()

   const totalCartAmount = cartItems && cartItems.length > 0
  ? cartItems.reduce(
      (sum, currentItem) =>
        sum + ((currentItem?.salePrice > 0 ? currentItem.salePrice : currentItem.price) * currentItem.quantity),
      0
    )
  : 0;

  return (
   <SheetContent className='sm:max-w-md'>
    <SheetHeader>
        <SheetTitle className='ml-10 mt-5 font-bold text-xl'>Your Cart</SheetTitle>
    </SheetHeader>
    <div className='mt-5 space-y-4'>
        {
            cartItems && cartItems.length > 0 ?
            cartItems.map(item=> <UsrCartItemsContent key={item.productId} cartItems={item}/>) : null
        }
    </div>
    <div className='mt-5 space-y-4'>
        <div className='flex justify-between'>
            <span className='font-bold ml-10'>Total</span>
            <span className='font-bold mr-10'>${totalCartAmount}</span>
        </div>
    </div>

    <Button 
    onClick = {()=>{
    navigate ('/shop/checkout')
    setOpenCartSheet(false)
    }}
   className='w-full mt-5'>
    Checkout
    </Button>
   </SheetContent>
  )
}

export default UserCartWrapper
