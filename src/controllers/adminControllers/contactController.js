import contactDb from "../../models/schemas/contactSchema.js";
import { logActivity } from "../baseControllers/logActivity.js";

export const getAllUserMessages = async (req, res) => {
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
    res
      .status(500).json({ success: false, message: `Error retrieving messages: ${error.message}`});
  }
};

export const getTotalPendingMessageCount = async (req, res) => {
  try {
    const totalPendingMessage = await contactDb.aggregate([
      { $unwind: "$userMessages" },  
      { $match: { "userMessages.messageStatus": "Pending" } }, 
      {
        $group: {
          _id: null,  
          pendingMessageCount: { $sum: 1 },  
        },
      },
    ]);


    res.status(200).json({success: true,message: "Success.",pendingMessageCount: totalPendingMessage[0]?.pendingMessageCount || 0  });
  } catch (error) {
    res.status(500).json({success: false,message: `Error calculating total pending message: ${error.message}` });
  }
};


export const messageStatusUpdate = async (req, res) => {
  try {
    const messageId = req.params.messageId;
    const { newStatus } = req.body;

    if (!["Pending", "Resolved", "Unresolved"].includes(newStatus)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const updatedDocument = await contactDb.findOneAndUpdate(
      { "userMessages._id": messageId }, 
      {
        $set: {
          "userMessages.$.messageStatus": newStatus
        }
      },
      { new: true } 
    );

    if (!updatedDocument) {
      return res.status(404).json({ message: "Message not found" });
    }

    await logActivity(`One Message status ${newStatus}`);
    res.status(200).json({ message: "Status updated successfully", data: updatedDocument});

  } catch (error) {
    res.status(500).json({ success: false, message: `Error Update: ${error.message}` });
  }
};


