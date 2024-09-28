import contactDb from "../../models/schemas/contactSchema.js"

export const getAllUserMessages  = async (req,res) => {
  try {
    const allMessages = await contactDb.find();

    if (!allMessages) {
      return res.status(404).json({ success: false, message: "No messages found" });
    }

    if (allMessages.length === 0) {
      return res.status(200).json({ success: false, message: "No messages found" });
    }

    res.status(200).json({ success: true, data: allMessages });

  } catch (error) {
     res.status(500).json({ success: false, message: `Error retrieving messages: ${error.message}` });
  }
}