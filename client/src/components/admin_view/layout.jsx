import React, { useState } from 'react'
import AdminSidebar from './sidebar'
import AdminHeader from './header'
import { Outlet } from 'react-router-dom';


function AdminLayout() {

  const [openSidebar, setOpenSibar] = useState(false)
  return (
    <div className='flex min-h-screen w-full'>
        {/*admin sidebar*/}
        <AdminSidebar open={openSidebar} setOpen={setOpenSibar}/>
      <div className='flex flex-col flex-1'>
        {/*admin header*/}
        <AdminHeader setOpen={setOpenSibar}/>
        <main className='flex-1 flex-col flex bg/muted/40 p-4 md:p-6'>
            <Outlet/>
        </main>
         
      </div>
    </div>
  )
}

export default AdminLayout
