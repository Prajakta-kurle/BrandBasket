import { FileIcon, UploadCloud, UploadCloudIcon, XIcon } from "lucide-react"
import { Input } from "../ui/input"
import {Label} from "../ui/label"
import React, { useEffect, useRef } from 'react'
import { Button } from "../ui/button"
import axios from "axios"
import { Skeleton } from "../ui/skeleton"

function ProductImageUpload({
    imageFile,
    setImagefile,
    uploadedImageUrl,
    setUploadedImageUrl,
    setImageLoadingState,
    imageLoadingState,
    isEditMode,
    iscustomStyling = false
}) 

{
  function handleonImageChange(event) {
    console.log(event.target.files);
    const selectedFile = event.target.files?.[0];
  
    if (selectedFile) {
      console.log("File info:", selectedFile);
      console.log("Type:", selectedFile.type, "Size:", selectedFile.size);
      setImagefile(selectedFile);
      console.log("Selected file:", selectedFile);
    }
  }
  
     function handelDragOver(event)
     {
       event.preventDefault();
     }

     function handelDrop(event)
     {
        event.preventDefault();
        const droppedFile = event.dataTransfer.files?.[0]
        if(droppedFile) setImagefile(droppedFile)
     }

     function handelRemoveImage()
     {
        setImagefile(null)
        if(inputRef.current)
        {
            inputRef.current.value = ""
        }
     }

     console.log(imageFile)

     async function uploadImageToCloudinary() {
      try {
      console.log("Uploading...");
        setImageLoadingState(true)
        const data = new FormData();
        data.append('my_file', imageFile);

    
        const response = await axios.post(
          'http://localhost:5000/api/admin/products/upload-image',
          data,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            },
            withCredentials: true
          }
        );
    
        console.log("Upload full response:", response.data);
        if (response?.data?.success) {
          setUploadedImageUrl(response.data.result.url);
           console.log("uploadedImageUrl:", response.data.result.url);
        } else {
          console.warn("Upload failed:", response.data);
        }
        setImageLoadingState(false);
        
      } catch (error) {
        console.error("Image upload error:", error.response?.data || error.message);
      }
    }
    
      
     useEffect(()=>
    {
      if(imageFile !== null) uploadImageToCloudinary()
    },[imageFile])

    const inputRef=useRef(null)
    
  return (
    <div className={`w-full mt-4 ${iscustomStyling ? '' : 'max-w-md mx-auto'}`}>
      <Label className="text-lg font-semibold mb-2 block px-4">Upload Image</Label>
      <div 
       onDragOver= {handelDragOver}
       onDrop={handelDrop} 
       className={`${isEditMode ? 'opacity-60' : '' }border-2 border-dashed rounded-lg p-4 mx-4`}>
        <Input id="image-upload" 
        type="file" 
        className="hidden"
        ref={inputRef} 
        onChange={handleonImageChange}
        disabled={isEditMode} />
        {
            !imageFile ? 
            <Label htmlFor = 'image-upload'
            className={`${isEditMode  ? 'cursor-not-allowed' : ''}flex flex-col items-center justify-center h-32 cursor-pointer`}>
                <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2"/>
                <span>Drag & drop or Click to upload image</span>
            </Label>
             : 
            imageLoadingState ? 
            <Skeleton className='h-10 bg-gray-100'/>:
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                   <FileIcon className="w-8 text-primary mr-2 h-8"/>
                </div>
                <p className="text-sm font-medium">{imageFile.name}</p>
                <Button varient="ghost" 
                size="icon"
                className="text-muted hover:text-foreground"
                onClick={handelRemoveImage}>
                    <XIcon className="w-4 h-4"/>
                    <span className="sr-only">Remove File</span>
                </Button>
            </div>
            
        }
      </div>
    </div>
  )
}

export default ProductImageUpload
