const { ImageUploadUtils } = require("../../helpers/cloudinary");
const Product = require("../../models/Product");

const handleImageUpload = async (req, res) => {
    try {
      // Check if file exists
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded",
        });
      }
  
      // Debugging logs
      console.log("Received file:", req.file.originalname);
      console.log("Mimetype:", req.file.mimetype);
      console.log("Buffer size:", req.file.buffer?.length);
  
      // Convert file buffer to Base64 data URI
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      const dataUri = `data:${req.file.mimetype};base64,${b64}`;
  
      console.log("Base64 Data URI created (truncated):", dataUri.substring(0, 100) + "...");
  
      // Upload to Cloudinary
      const result = await ImageUploadUtils(dataUri);
  
      console.log("Cloudinary upload result:", result);
  
      return res.status(200).json({
        success: true,
        result,
      });
  
    } catch (error) {
      console.error("Image upload error:", error);
  
      return res.status(500).json({
        success: false,
        message: error.message || "An error occurred during image upload",
      });
    }
  };
  

//add a new product
const addProduct = async (req,res) =>
{
  try
  {
     const {
        image,
        title,
        description,
        category,
        brand, 
        price ,
        salePrice,
        totalStock,
     } =req.body;
     const NewlyCreatedProduct = new Product ({
        image,
        title,
        description,
        category,
        brand, 
        price ,
        salePrice,
        totalStock,
     })

     await NewlyCreatedProduct.save();
     res.status(201).json({
        success : true,
        data : NewlyCreatedProduct
     })
     console.log("Product image URL received:", image);

  }
  catch(e)
  {
    console.log(e);
    res.status(500).json({
        success : false,
        message : "Error occurred"
    })
  }
}

//fetch all products
const fetchAllProduct = async (req,res) =>
{
  try
  {
    const listofProducts = await Product.find({})
    res.status(200).json({
        success : true,
        data : listofProducts
    })
  }
  catch(e)
  {
    console.log(e);
    res.status(500).json({
        success : false,
        message : "Error occurred"
    })
  }
}

//edit a product 
const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Incoming formData:", req.body);

    const {
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
    } = req.body;

    console.log("After destructuring - price:", price, "salePrice:", salePrice);

    // Check if id is a valid ObjectId
    if (!id || typeof id !== 'string') {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID format",
      });
    }

    let findProduct = await Product.findById(id);

    if (!findProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Only update fields if they are not undefined
    if (image !== undefined) findProduct.image = image;
    if (title !== undefined) findProduct.title = title;
    if (description !== undefined) findProduct.description = description;
    if (category !== undefined) findProduct.category = category;
    if (brand !== undefined) findProduct.brand = brand;
    if (price !== undefined) findProduct.price = price;
    if (salePrice !== undefined) findProduct.salePrice = salePrice;
    if (totalStock !== undefined) findProduct.totalStock = totalStock;

    await findProduct.save();

    return res.status(200).json({
      success: true,
      data: findProduct,
    });

  } catch (e) {
    console.error("Error in editProduct:", e);
    return res.status(500).json({
      success: false,
      message: "Server error during product update",
      error: e.message,
    });
  }
};


//delete a product
const deleteProduct = async (req, res) => {
    try {
      const { id } = req.params;  // Extract the product ID from request params
      const deleted = await Product.findByIdAndDelete(id); // Delete the product by ID
  
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: "Product not found"
        });
      }
  
      res.status(200).json({
        success: true,
        message: "Product deleted"
      });
    } catch (e) {
      console.log(e);
      res.status(500).json({
        success: false,
        message: "Error occurred"
      });
    }
  };
  


module.exports = {handleImageUpload, addProduct, fetchAllProduct, editProduct, deleteProduct}

