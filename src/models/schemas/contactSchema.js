import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  userMessages: [
    {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      mobile: {
        type: String,
        required: true,
      },
      subject: {
        type: String,
        required: true,
      },
      message: {
        type: String,
        required: true,
      },
      messageStatus: {
        type: String,
        enum: ["Pending", "Resolved", "Unresolved"],
        default: "Pending",
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const contactDb = mongoose.model("contactDatas", contactSchema);
export default contactDb;
