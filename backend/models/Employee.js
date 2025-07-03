const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    empId: { type: String, required: true, unique: true },
    role: { type: String, required: true },
    salary: { type: Number, required: true },
    joinDate: { type: Date, required: true },
    experience: { type: String },
    remarks: { type: String },
    image: { type: String }, // we'll store image URL or base64
  },
  { timestamps: true }
);

module.exports = mongoose.model("Employee", employeeSchema);
