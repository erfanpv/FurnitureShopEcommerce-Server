import contactDb from "../../models/schemas/contactSchema.js";

export const sendMessage = async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, email, mobile, subject, message } = req.body.contactData;


    if (!name || !email || !mobile || !subject || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    let contactData = await contactDb.findOne({ userId });

   
    const newContact = {
      name,
      email,
      mobile,
      subject,
      message,
    };


    if (!contactData) {

      contactData = new contactDb({userId,userMessages: [newContact]});
    }else {
      contactData.userMessages.push(newContact);
    }

    await contactData.save();

    res.status(200).json({success:true, message: "Message sent successfully" });
  } catch (error) {
    res.status(500).json({success:false, message: ` Message Send not success - ${error.message}` });
  }
};
