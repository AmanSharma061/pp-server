import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  notificationFor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  notificationBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },poll:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Poll"
  }
});


const Notification = mongoose.models.Notification || mongoose.model("Notification",notificationSchema);

export default Notification