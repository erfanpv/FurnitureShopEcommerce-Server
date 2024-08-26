import productDb from "../../models/schemas/productSchem";

export const getAllProducts = async (req, res) => {
  try {
    const productsList = await productDb.find();
    if (!productsList) {
      return res.status(404).json({ message: "Products Not found" });
    }
    res.status(200).json(productsList);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching Products" });
  }
};
