import { useEffect, useState } from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Authlayout from './components/auth/layout'
import AuthLogin from './pages/auth/login'
import AuthRegister from './pages/auth/register'
import AdminLayout from './components/admin_view/layout'
import AdminDashboard from './pages/admin_view/dashboard'
import AdminFeatures from './pages/admin_view/features'
import AdminOrders from './pages/admin_view/orders'
import AdminProducts from './pages/admin_view/products'
import NotFound from './pages/not_found/index'
import ShoppingLayout from './components/shopping_view/layout'
import ShoppingListing from './pages/shopping_view/listing'
import ShoppingHome  from './pages/shopping_view/home'
import ShoppingCheckout from './pages/shopping_view/checkout'
import ShoppingAccount from './pages/shopping_view/account'
import CheckAuth from './components/comman/check_auth'
import  UnauthPAge from './pages/unauth_page'
import { useDispatch, useSelector } from 'react-redux'
import { checkAuth } from './store/authslice'
import { Skeleton } from "@/components/ui/skeleton"
import PaypalReturnPage from './pages/shopping_view/paypal-return';
import PaymentSuccessPage from './pages/shopping_view/payment-success';
import SearchProducts from './pages/shopping_view/search'
import { fetchCartItems } from "@/store/shop/cart-slice";

function App() {
  const {user, isAuthenticated, isLoading}=useSelector((state)=>state.auth)
  const dispatch=useDispatch();

  useEffect(() => {
  const handleAuth = async () => {
    const result = await dispatch(checkAuth());
    const currentUser = result?.payload;
    if (currentUser?.id) {
      dispatch(fetchCartItems(currentUser.id));
    }
  };
  handleAuth();
}, [dispatch]);

  
  useEffect(()=>
    {
      dispatch(checkAuth())
    },[dispatch])

    if(isLoading) return <Skeleton className="w-[800] bg-black h-[600px]" />

   

    console.log (isLoading, user)
  
  return (
    <div className='flex flex-col overflow-hidden bg-white'>
      <Routes>
        {/* Common Component */}
        <Route path ='/' element = {
          <CheckAuth isAuthenticated={isAuthenticated} user={user}></CheckAuth>
        }
        />
        {/* Auth Routes */}
        <Route path='/auth' element={
          <CheckAuth isAuthenticated={isAuthenticated} user={user}>
            <Authlayout/>
          </CheckAuth>}>
          <Route path='login' element={<AuthLogin />} />
          <Route path='register' element={<AuthRegister />} />
        </Route>

        {/* Admin Routes */}
        <Route path='/admin' element={
          <CheckAuth isAuthenticated={isAuthenticated} user={user}>
            <AdminLayout/>
          </CheckAuth>}>
          <Route path='dashboard' element={<AdminDashboard />} />
          <Route path='features' element={<AdminFeatures />} />
          <Route path='orders' element={<AdminOrders />} />
          <Route path='products' element={<AdminProducts />} />
        </Route>

        {/*shopping Routes */}
        <Route path='/shop' element={
          <CheckAuth isAuthenticated={isAuthenticated} user={user}>
          <ShoppingLayout/>
        </CheckAuth>}>
          <Route path='home' element={< ShoppingHome/>} />
          <Route path='account' element={<ShoppingAccount />} />
          <Route path='checkout' element={<ShoppingCheckout />} />
          <Route path='listing' element={<ShoppingListing />} />
          <Route path='paypal-return' element={<PaypalReturnPage/>}/>
         <Route path='payment-success' element={<PaymentSuccessPage/>}/>
         <Route path='search' element={<SearchProducts/>}/>
        </Route>
        <Route path='*' element={<NotFound/>}/>
        <Route path='unauth_page' element={<UnauthPAge/>}/>
      </Routes>
    </div>
  )
}

export default App
