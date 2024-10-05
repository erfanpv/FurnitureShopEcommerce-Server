import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  action: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
}, {
  capped: {
    size: 2000,  
    max: 10, 
  }
});

const activityDb = mongoose.model('Activity', activitySchema);
export default activityDb;
