import activityDb from "../../models/schemas/activitySchema.js";

export const logActivity = async (action) => {
  try {
    const maxDocuments = 10;

    const currentCount = await activityDb.countDocuments();

    if (currentCount >= maxDocuments) {
      await activityDb.findOneAndDelete({}, { sort: { date: 1 } }); 
    }

    const newActivity = new activityDb({ action });
    await newActivity.save();
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};
