import productDb from "../../models/schemas/productSchema.js";

export const searchProducts = async (req, res) => {
  try {
    const { searchQuery } = req.query;
    
    const results = await productDb.find({
      $and: [
        { is_Listed: true },
        {
          $or: [
            { productName: { $regex: searchQuery, $options: "i" } },
            { description: { $regex: searchQuery, $options: "i" } },
            { category: { $regex: searchQuery, $options: "i" } },
          ],
        },
      ],
    });

    res.status(200).json({
      success: true,
      message: "Search Success",
      data: results,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Error searching products - ${error.message}`,
    });
  }
};
