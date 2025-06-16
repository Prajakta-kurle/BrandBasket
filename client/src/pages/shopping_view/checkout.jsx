import React from 'react'
import accImage from '../../assets/Pictures/accImage.jpg'
import Address from '@/components/shopping_view/address'
import { useDispatch, useSelector } from 'react-redux'
import UsrCartItemsContent from '@/components/shopping_view/cart-items-content'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { createNewOrder } from '@/store/shop/order-slice'
import { fetchCartItems } from '@/store/shop/cart-slice'
import { toast} from 'sonner'


function ShoppingCheckout() {
  const { cartItems } = useSelector((state) => state.ShoppingCart)
  const items = Array.isArray(cartItems?.items) ? cartItems.items : [];
  const {user} = useSelector((state) => state.auth)
  const {approvalURL} = useSelector((state)=>state.shopOrder)
  const [currentSelectedAddress, setcurrentSelectedAddress] = useState(null)
  const[isPaymentStart, setisPaymentStart] = useState(false)
  const dispatch = useDispatch()

  console.log("Redux approvalURL:", approvalURL);

  console.log(setcurrentSelectedAddress, "setcurrentSelectedAddress")

  const totalCartAmount = items.length > 0
  ? items.reduce(
      (sum, currentItem) =>
        sum +
        ((currentItem?.salePrice > 0 ? currentItem.salePrice : currentItem.price) *
          currentItem.quantity),
      0
    )
  : 0;

 
  function handleInitiatePaypalPayment(){
      console.log("✅ Checkout button clicked");
    
    if (items.length === 0) {
  toast.error("Your cart is empty. Please add items before placing an order.");
  return;
   }
   
    if(currentSelectedAddress === null)
    {
     toast('plz select one adrees to proceed')
      return;
    }

    const now = new Date().toISOString();
   
    const orderData = {
      userId : user?.id,
      cartId : cartItems?._id,
      cartItems : items.map(singleCartItem => ({
         productId : singleCartItem.productId,
            title : singleCartItem.title,
            image : singleCartItem.image,
            price : singleCartItem.salePrice > 0 ? singleCartItem.salePrice : singleCartItem.price,
            quantity : singleCartItem.quantity
      })),
      addressInfo : {
         addressId : currentSelectedAddress?._id,
        address : currentSelectedAddress.address,
        city : currentSelectedAddress.city,
        pinCode : currentSelectedAddress.pincode,
        phone : currentSelectedAddress.phone,
        notes : currentSelectedAddress.notes,
      },
      orderStatus : 'pending',
      paymentMethod : 'paypal',
      paymentStatus : 'pending',
      totalAmount : totalCartAmount,
      orderDate: now,
      orderUpdateDate: now,

    }

     console.log("📦 Sent Order Data",orderData)
   dispatch(createNewOrder(orderData)).then((data) => {
  console.log("Order response from backend:", data);
  if (data?.payload?.success) {
    console.log("Approval URL:", data.payload.approvalUrl);
    setisPaymentStart(true);
  } else {
    setisPaymentStart(false);
  }
});

  }

  useEffect(() => {
  if (user?.id) {
    dispatch(fetchCartItems({ userId: user.id }));
  }
}, [user, dispatch]);

   
 useEffect(() => {
  if (approvalURL) {
    console.log("Redirecting to PayPal:", approvalURL);
    window.location.href = approvalURL;
  }
}, [approvalURL]);


console.log('Selected Address:', currentSelectedAddress)


  return (
    <div className='flex flex-col'>
      <div className='h-[400px] w-full relative overflow-hidden'>
        <img
          src={accImage}
          className='w-full h-full object-cover object-center'
        />
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 p-5'>
        <Address selectedId={currentSelectedAddress} setcurrentSelectedAddress={setcurrentSelectedAddress} />

        <div className='flex flex-col gap-4'>
          {items.length > 0
            ? items.map((item) => (
                <UsrCartItemsContent key={item.productId} cartItems={item} />
              ))
            : <p>No items in cart</p>
          }

          <div className='mt-5 space-y-4'>
            <div className='flex justify-between'>
              <span className='font-bold ml-10'>Total</span>
              <span className='font-bold mr-10'>${totalCartAmount}</span>
            </div>
          </div>

          <div className='mt-4 w-full'>
            <Button onClick = {handleInitiatePaypalPayment}
            className='w-full'>
              {
                isPaymentStart ? 'Processing payment..' : 'Checkout With Paypal'
              }
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShoppingCheckout
