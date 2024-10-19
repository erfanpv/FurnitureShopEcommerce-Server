import addressDb from "../../models/schemas/addressSchema.js"
export const addAddress = async (req, res) => {
  const { userId, pincode, street, city, state, country, phone } = req.body;

  try {
    let userAddress = await addressDb.findOne({ userId });

    if (!userAddress) {
      userAddress = new addressDb({
        userId,
        allAddresses: [{ pincode, street, city, state, country }],
      });
    } else {
      userAddress.allAddresses.push({ pincode, street, city, state, country });
    }

    await userAddress.save();
    res.status(201).json({ message: "Address added successfully", userAddress });
  } catch (error) {
    res.status(500).json({ message: "Error adding address", error });
  }
};

export const getAllAddresses = async (req, res) => {
  const { userId } = req.params;

  try {
    const userAddress = await addressDb.findOne({ userId });

    if (!userAddress) {
      return res.status(404).json({ message: "No addresses found for this user" });
    }

    res.status(200).json(userAddress.allAddresses);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving addresses", error });
  }
};

export const updateAddress = async (req, res) => {
  const { userId, addressId } = req.params;
  const { pincode, street, city, state, country, phone } = req.body;

  try {
    const userAddress = await addressDb.findOne({ userId });

    if (!userAddress) {
      return res.status(404).json({ message: "No addresses found for this user" });
    }

    const addressIndex = userAddress.allAddresses.findIndex(
      (address) => address._id.toString() === addressId
    );

    if (addressIndex === -1) {
      return res.status(404).json({ message: "Address not found" });
    }

    userAddress.allAddresses[addressIndex] = { pincode, street, city, state, country };

    await userAddress.save();
    res.status(200).json({ message: "Address updated successfully", userAddress });
  } catch (error) {
    res.status(500).json({ message: "Error updating address", error });
  }
};

export const deleteAddress = async (req, res) => {
  const { userId, addressId } = req.params;

  try {
    const userAddress = await addressDb.findOne({ userId });

    if (!userAddress) {
      return res.status(404).json({ message: "No addresses found for this user" });
    }

    userAddress.allAddresses = userAddress.allAddresses.filter(
      (address) => address._id.toString() !== addressId
    );

    await userAddress.save();
    res.status(200).json({ message: "Address deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting address", error });
  }
};
