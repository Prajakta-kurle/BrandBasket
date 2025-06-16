import React, { Fragment, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import CommanForm from '@/components/comman/form'
import { addProductFormElements } from '@/config'
import ProductImageUpload from '@/components/admin_view/image_upload'
import { useDispatch, useSelector } from 'react-redux'
import { addNewProduct, deleteProduct, editProduct, fetchAllProduct } from '@/store/admin'
import { toast } from 'sonner'
import AdminProductTile from '@/components/admin_view/product-tile'

const initialFormData = {
  image: null,
  title: '',
  description: '',
  category: '',
  brand: '',
  price: '',
  salePrice: '',
  totalStock: ''
}

function AdminProducts() {
  const [openCreateProductesDialog, setopenCreateProductesDialog] = useState(false)
  const [formData, setFormData] = useState(initialFormData)
  const [imageFile, setImagefile] = useState(null)
  const [uploadedImageUrl, setUploadedImageUrl] = useState("")
  const [imageLoadingState, setImageLoadingState] = useState(false)
  const [currentEditedId, setcurrentEditedId] = useState(null)

  const { productList } = useSelector((state) => state.adminProducts)
  const dispatch = useDispatch()


  function onSubmit(event) {
    event.preventDefault();
  
    // Only validate image upload for adding a new product
    if (currentEditedId === null) {
      if (imageLoadingState) {
        toast.warning("Please wait, image is still uploading.");
        return;
      }
  
      if (!uploadedImageUrl) {
        toast.error("Image upload failed or not complete.");
        return;
      }
    }
  
    currentEditedId !== null
      ? (() => {
          dispatch(editProduct({
            id: currentEditedId,
            formData
          })).then((data) => {
            console.log(data, "Edit");
            if (data?.payload?.success) {
              dispatch(fetchAllProduct());
              setopenCreateProductesDialog(false);
              setImagefile(null);
              setFormData(initialFormData);
              setcurrentEditedId(null);
              toast.success("Product updated successfully!", {
                description: formData.title,
              });
            }
          });
        })()
      : (() => {
          dispatch(addNewProduct({
            ...formData,
            price: Number(formData.price) || 0,
            salePrice: Number(formData.salePrice) ||0,
            totalStock: Number(formData.totalStock) ||0,
            image: uploadedImageUrl
          })).then((data) => {
            console.log(data);
            if (data?.payload?.success) {
              dispatch(fetchAllProduct());
              setopenCreateProductesDialog(false);
              setImagefile(null);
              setFormData(initialFormData);
              toast.success("Product added successfully!", {
                description: formData.title,
              });
            }
          });
        })();
  }

  function handleDelete(getCurrentProductId) {
    console.log("Deleting product with ID:", getCurrentProductId); // ✅ Check if this runs
    dispatch(deleteProduct(getCurrentProductId)).then(data => {
      console.log("Delete response:", data); // ✅ Check this
      if (data?.payload?.success) {
        dispatch(fetchAllProduct());
      } else {
        toast.error("Failed to delete product");
      }
    });
  }
  

  function isFormValid()
  {
    return Object.keys(formData).map(key=>formData[key] !== "").every(item=>item)
  }

  useEffect(() => {
    dispatch(fetchAllProduct())
  }, [dispatch])

  console.log(productList, uploadedImageUrl)

  return (
    <Fragment>
      <div className='justify-end flex mb-2 w-full'>
        <Button onClick={() => setopenCreateProductesDialog(true)}>Add New Product</Button>
      </div>
      <div className='grid gap-4 md:grid-cols-3 lg:grid-cols-4'>
        {
          productList && productList.length > 0 &&
          productList.map((productItem) => (
            <AdminProductTile
              key={productItem._id || productItem.title}
              setcurrentEditedId={setcurrentEditedId}
              setopenCreateProductesDialog={setopenCreateProductesDialog}
              product={productItem}
              setFormData={setFormData}
              handleDelete={handleDelete}
            />
          ))
        }
      </div>
      <Sheet
        open={openCreateProductesDialog}
        onOpenChange={()=> 
          {
          setopenCreateProductesDialog(false),
          setcurrentEditedId(null),
          setFormData(initialFormData)
          }
        }
      >
        <SheetContent side="right" className="overflow-auto">
          <SheetHeader>
            <SheetTitle className="py-2 text-2xl">
              {currentEditedId !== null ? "Edit Product"  : "Add New Product"}</SheetTitle>
          </SheetHeader>
          <ProductImageUpload
            imageFile={imageFile}
            setImagefile={setImagefile}
            uploadedImageUrl={uploadedImageUrl}
            setUploadedImageUrl={setUploadedImageUrl}
            setImageLoadingState={setImageLoadingState}
            imageLoadingState={imageLoadingState}
            isEditMode={currentEditedId !== null}
          />
          <div className='py-3 px-5'>
            <CommanForm
              onSubmit={onSubmit}
              formData={formData}
              setFormData={setFormData}
              formControls={addProductFormElements}
              buttonText={currentEditedId !== null ? "Edit" : "Add" }
              isBtnDisabled={!isFormValid()}
            />
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  )}


export default AdminProducts
