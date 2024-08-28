import addressDb from "../../models/schemas/addressSchema.js";

export const addAddress = async (req, res) => {
  const  userId  = req.params.id;
  const { addressData } = req.body;
  
  try {
    const newAddress = new addressDb({
      userId,
      addressData,
    });
    const savedAddress = await newAddress.save();
    res.status(201).json({message:`Address saved successfully ${savedAddress}`});
  } catch (error) {
    res.status(500).json({ message: `Error adding address - ${error.message}` });
  }
};

export const getAddress = async (req, res) => {
  const userId  = req.params.id;

  try {
    const addresses = await addressDb.find({ userId });
    res.status(200).json(addresses);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving addresses", error });
  }
};

export const updateAddress = async (req, res) => {
  const userId = req.params.id;
  const { addressData } = req.body;

  try {
    const updatedAddress = await addressDb.findOneAndUpdate(
      { userId }, 
      { $set: { addressData } }, 
      { new: true, runValidators: true, context: 'query' } 
    );

    if (!updatedAddress) {
      return res.status(404).json({ message: "Address not found for the specified user" });
    }

    res.status(200).json({ message: "Address updated successfully", updatedAddress });
  } catch (error) {
   
    res.status(500).json({ message: "Error updating address", error: error.message });
  }
};

