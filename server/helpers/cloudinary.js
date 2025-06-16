const cloudinary = require ("cloudinary").v2;
const multer = require ("multer");

cloudinary.config ({
    cloud_name : "duuf1unzg",
    api_key : "217881694787334",
    api_secret : "fT0ZNPktdvQ8mOqY6j9j91ztzPA"

})

const storage = new multer.memoryStorage();

async function ImageUploadUtils(file)
{
    const result = await cloudinary.uploader.upload(file, {
        resource_type : "auto"
    })  
    return result; 
}

const upload  = multer({storage,
    limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB limit
})

module.exports = {upload, ImageUploadUtils}