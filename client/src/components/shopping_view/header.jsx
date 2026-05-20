import React, { useEffect, useState } from "react";
import { House, Menu, UserRoundCog, LogOut } from "lucide-react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { ShoppingViewHeaderMenuItems } from "@/config";
import { ShoppingCart } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  Label,
} from "@radix-ui/react-dropdown-menu";
import { logoutUser } from "@/store/authslice";
import UserCartWrapper from "./cart-wrapper";
import { DialogTitle } from "@/components/ui/dialog";
import { fetchCartItems } from "@/store/shop/cart-slice";

function MenuItems() {
  const navigate = useNavigate();
  const Location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  function handleNavigate(getCurrentMenuItem) {
    sessionStorage.removeItem("filters");
    const currentFilter =
      getCurrentMenuItem.id !== "home" &&
      getCurrentMenuItem.id !== "products" &&
      getCurrentMenuItem.id !== "search"
        ? {
            category: [getCurrentMenuItem.id],
          }
        : null;

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));

    location.pathname.includes("listing") && currentFilter !== null
      ? setSearchParams(
          new URLSearchParams(`?category=${getCurrentMenuItem.id}`)
        )
      : navigate(getCurrentMenuItem.path);
  }
 
 
  return (
    <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row">
      {ShoppingViewHeaderMenuItems.map((menuItem) => (
        <Label
          onClick={() => handleNavigate(menuItem)}
          className="text-sm font-md cursor-pointer"
          key={menuItem.id}
        >
          {menuItem.label}
        </Label>
      ))}
    </nav>
  );
}

function HeaderRightContent() {
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.ShoppingCart);
  const [openCartSheet, setOpenCartSheet] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(logoutUser());
  }

  
  useEffect(() => {
    dispatch(fetchCartItems(user?.id));
  }, [dispatch]);

  console.log(cartItems, "usercartitem");

  return (
    <div className="flex lg:items-center lg:flex-row flex-col gap-4">
      {/* Shopping Cart Button */}
      <Sheet open={openCartSheet} onOpenChange={setOpenCartSheet}>
        <SheetTrigger asChild>
          <Button
            onClick={() => setOpenCartSheet(true)}
            variant="outline"
            size="icon"
            className="relative p-2"
          >
            <ShoppingCart className="w-6 h-6" />

            {/* Cart item count badge */}
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold">
              {cartItems?.items?.length || 0}
            </span>

            <span className="sr-only">User cart</span>
          </Button>
        </SheetTrigger>


        {/* User Cart Wrapper */}
        <SheetContent side="right" className="w-96">
          <DialogTitle className="sr-only">User Cart</DialogTitle>
          <UserCartWrapper
            setOpenCartSheet={setOpenCartSheet}
            cartItems={
              cartItems && cartItems.items && cartItems.items.length > 0
                ? cartItems.items
                : []
            }
          />
        </SheetContent>
      </Sheet>

      {/* User Dropdown Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="bg-black">
            <AvatarFallback className="bg-black text-white font-extrabold">
              {user?.userName?.[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
       
        <DropdownMenuContent
          side="right"
          className="w-56 rounded-xl shadow-lg border border-gray-200 p-2 bg-white"
        >
          <DropdownMenuLabel className="text-sm font-semibold text-gray-700">
            Logged in as{" "}
            <span className="text-black font-bold">{user?.userName}</span>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => navigate("/shop/account")}
            className="flex items-center gap-2 hover:bg-gray-100 cursor-pointer rounded-md px-3 py-2 transition"
          >
            <UserRoundCog className="h-4 w-4 text-gray-600" />
            <span className="text-gray-800">Account</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={handleLogout}
            className="flex items-center gap-2 hover:bg-red-50 cursor-pointer rounded-md px-3 py-2 transition text-red-600"
          >
            <LogOut className="h-4 w-4 text-red-600" />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      
      </DropdownMenu>
    </div>
  );
}

function ShoppingHeader() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo and Navigation */}
        <Link to="/shop/home" className="flex items-center gap-2">
          <House className="w-6 h-6" />
          <span className="font-bold">BrandBasket</span>
        </Link>

        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="block lg:hidden">
              <Menu className="w-6 h-6" />
              <span className="sr-only">Toggle header menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full max-w-xs pl-10 pt-10">
            <MenuItems />
            {isAuthenticated && <HeaderRightContent />}
          </SheetContent>
        </Sheet>

        {/* Desktop Menu */}
        <div className="hidden lg:block">
          <MenuItems />
        </div>

        {/* Header Right Content for Desktop */}
        {isAuthenticated && (
          <div className="hidden lg:block">
            <HeaderRightContent />
          </div>
        )}
      </div>
    </header>
  );
}

export default ShoppingHeader;
