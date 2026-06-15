const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 140 },
    description: { type: String, required: true, trim: true, maxlength: 5000 },
    company: { type: String, required: true, trim: true, maxlength: 140 },
    location: { type: String, required: true, trim: true, maxlength: 120 },
    category: {
      type: String,
      required: true,
      enum: [
        "Teacher",
        "Administration",
        "IT / Tech",
        "Design",
        "Healthcare",
        "Engineering",
        "Finance",
        "Others",
      ],
    },
    type: { type: String, required: true, enum: ["government", "private"] },
    vacancies: { type: Number, required: true, min: 1, max: 10000 },
    deadline: { type: Date, required: true },
    experience: { type: String, required: true, trim: true, maxlength: 240 },
    jobType: { type: String, required: true, enum: ["full-time", "part-time", "contract"] },
    requirements: {
      type: [{ type: String, trim: true, maxlength: 500 }],
      default: [],
    },
    applyUrl: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
      validate: {
        validator(value) {
          return !value || /^https?:\/\/\S+$/i.test(value);
        },
        message: "Apply URL must start with http:// or https://",
      },
    },
    imageUrl: { type: String, trim: true, maxlength: 1500, default: "" },
    imagePublicId: { type: String, trim: true, maxlength: 500, default: "" },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(_doc, ret) {
        delete ret._id;
        delete ret.__v;
      },
    },
  },
);

jobSchema.index({
  title: "text",
  company: "text",
  description: "text",
  location: "text",
  requirements: "text",
});
jobSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Job", jobSchema);
