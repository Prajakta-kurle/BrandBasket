const Product = require("../../models/product");

const SearchProducts = async (req, res) => {
  try {
    const { keyword } = req.params;
    console.log("🔍 Searching for keyword:", keyword);

    if (!keyword || typeof keyword !== "string") {
      return res.status(400).json({
        success: false,
        message: "Keyword is required and must be a string",
      });
    }

    const regex = new RegExp(keyword, "i"); // case-insensitive search

    const query = {
      $or: [
        { title: regex },
        { description: regex },
        { category: regex },
        { brand: regex },
      ],
    };

    const searchResults = await Product.find(query);
    console.log("✅ Found:", searchResults.length, "products");

    return res.status(200).json({
      success: true,
      data: searchResults,
    });
  } catch (error) {
    console.error("❌ Search error:", error);
    return res.status(500).json({
      success: false,
      message: "Search failed",
    });
  }
};

module.exports = { SearchProducts };
