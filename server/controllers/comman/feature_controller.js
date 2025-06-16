const Feature = require('../../models/Feature');

// Add a feature image
const addFeatureImage = async (req, res) => {
  try {
    const { image } = req.body;

    const featuredImage = new Feature({ image });

    await featuredImage.save();

    res.status(200).json({
      success: true,
      data: featuredImage,
    });
  } catch (e) {
    console.error("Error while adding image:", e);
    res.status(500).json({
      success: false,
      message: "Some error occurred",
    });
  }
};

// Get all feature images
const getFeatureImage = async (req, res) => {
  try {
    const getImage = await Feature.find({});

    res.status(200).json({
      success: true,
      data: getImage,
    });
  } catch (e) {
    console.error("Error while getting images:", e);
    res.status(500).json({
      success: false,
      message: "Some error occurred",
    });
  }
};

// Delete a feature image
const deleteFeatureImage = async (req, res) => {
  try {
    const { imageId } = req.params;

    if (!imageId) {
      return res.status(404).json({
        success: false,
        message: "ImageId not found",
      });
    }

    const deletedImage = await Feature.findByIdAndDelete(imageId);

    if (!deletedImage) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    return res.status(200).json({
      success: true,
      id: deletedImage._id,
    });
  } catch (e) {
    console.error("Error while deleting image:", e);
    res.status(500).json({
      success: false,
      message: "Some error occurred",
    });
  }
};

module.exports = {
  addFeatureImage,
  getFeatureImage,
  deleteFeatureImage,
};
