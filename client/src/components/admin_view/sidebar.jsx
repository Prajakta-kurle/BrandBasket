import React, { Fragment } from 'react'
import { ChartNoAxesCombined} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBasket } from 'lucide-react';
import { BadgeCheck } from 'lucide-react';
import { LayoutDashboard } from 'lucide-react';
import { SheetContent, SheetHeader, SheetTitle,Sheet } from '../ui/sheet';

export const adminSidebarMenuItems=[
  {
      id:'dashboard',
      label:'Dashboard',
      path:'/admin/dashboard',
      icons:<LayoutDashboard />
  },
  {
      id:'products',
      label:'Products',
      path:'/admin/products',
      icons:<ShoppingBasket />
  },
  {
      id:'orders',
      label:'Orders',
      path:'/admin/orders',
      icons:<BadgeCheck />
  }
]

function MenuItems({setOpen}){
  const navigate = useNavigate()
  return  <nav className='mt-8 flex flex-col gap-2'>
    {
      adminSidebarMenuItems.map((menuItem)=>(<div 
      key={menuItem.id} 
      onClick={()=>{navigate(menuItem.path)
        setOpen ? setOpen(false) : null
      }}
      className='py-2 px-3 items-center flex gap-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground text-xl cursor-pointer'>

       {menuItem.icons}
       <span>{menuItem.label}</span>
      </div>)
    )}

  </nav>
 
}

function AdminSidebar({open, setOpen}) {
  const navigate = useNavigate()
  return (
    <Fragment>
      <Sheet open={open} onOpenChange={setOpen}> {/*sheet is normaly considered as h2 tag*/}
      <SheetContent side="left" className="w-64">
      <div className='flex flex-col h-full'>
       <SheetHeader className="border-b">
       <SheetTitle className="flex gap-2 mt-5 mb-4">
       <ChartNoAxesCombined size={30}/>
       <span className='text-2xl font-extrabold'>Admin Panel</span> 
       </SheetTitle>
       </SheetHeader>
       <MenuItems setOpen={setOpen}/>
      </div>
      </SheetContent>

      </Sheet>
      <aside className='hidden w-64 flex-col border-r bg-background p-6 lg:flex'>
        <div onClick={()=>navigate('/admin/dashboard')}className='flex items-center gap-2 cursor-pointer'>
        <ChartNoAxesCombined size={30}/>
           <h1 className='text-2xl font-extrabold'>Admin Panel</h1>
        </div>
        <MenuItems setOpen={setOpen}/>
      </aside>
    </Fragment>
  )
}

export default AdminSidebar
