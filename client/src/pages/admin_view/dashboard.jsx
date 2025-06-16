import React, { useEffect } from "react";
import ProductImageUpload from "@/components/admin_view/image_upload";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import {
  addFeatureImage,
  getFeatureImage,
  deleteFeatureImage,
} from "@/store/comman";
import { X } from "lucide-react";
import { toast } from "sonner";

function AdminDashboard() {
  const [imageFile, setImagefile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const dispatch = useDispatch();
  const { featureImageList } = useSelector((state) => state.commanFeature);

  console.log(uploadedImageUrl, "uploadedImageUrl");

  function handleUploadFeatureImage() {
    dispatch(addFeatureImage({ image: uploadedImageUrl })).then((data) => {
      if (data?.payload?.success) {
        dispatch(getFeatureImage());
        setImagefile(null);
        setUploadedImageUrl("");
      }
    });
  }

  function handleDeleteFeatureImage(imageId) {
    dispatch(deleteFeatureImage({ imageId })).then((data) => {
      if (data?.payload?.success) {
        toast.success("Image is deleted");
        dispatch(getFeatureImage());
      } else {
        toast.error("Failed to delete image");
      }
    });
  }

  useEffect(() => {
    dispatch(getFeatureImage());
  }, [dispatch]);

  console.log(featureImageList, "featureImageList");

  const allFeatureImages = Array.isArray(featureImageList[0])
  ? featureImageList.flat()
  : featureImageList;

// Remove duplicates by _id
const uniqueFeatureImages = Array.from(
  new Map(allFeatureImages.map((img) => [img._id, img])).values()
);

  return (
    <div>
      <ProductImageUpload
        imageFile={imageFile}
        setImagefile={setImagefile}
        uploadedImageUrl={uploadedImageUrl}
        setUploadedImageUrl={setUploadedImageUrl}
        setImageLoadingState={setImageLoadingState}
        imageLoadingState={imageLoadingState}
        iscustomStyling={true}
        //isEditMode={currentEditedId !== null}
      />
      <Button onClick={handleUploadFeatureImage} className="mt-5 w-full">
        Upload
      </Button>

     <div className="flex flex-col gap-4 mt-5">
  {featureImageList && featureImageList.length > 0 ? (
    uniqueFeatureImages.map((featureImageItem) => (
      <div className="relative" key={featureImageItem._id}>
        <img
          src={featureImageItem.image}
          className="w-full h-[300px] object-cover rounded-t-lg"
          alt="Feature"
        />

        <Button
          onClick={() => handleDeleteFeatureImage(featureImageItem._id)}
          className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1 rounded-full"
        >
          <X size={18} />
        </Button>
      </div>
    ))
  ) : null}
</div>

    </div>
  );
}

export default AdminDashboard;
