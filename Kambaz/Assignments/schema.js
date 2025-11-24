import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
  {
    _id: String,
    title: String,
    course: String,
    description: String,
    points: Number,
    dueDate: String,
    availableFrom: String,
    availableUntil: String,
    assignmentGroup: String,
    displayGradeAs: String,
    submissionType: String,
    assignTo: String,
    textEntry: Boolean,
    websiteUrl: Boolean,
    mediaRecordings: Boolean,
    studentAnnotation: Boolean,
    fileUpload: Boolean,
    completed: Boolean,
  },
  { collection: "assignments" }
);

export default assignmentSchema;
