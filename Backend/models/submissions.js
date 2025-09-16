const mongoose = require("mongoose");

const SubmissionSchema = new mongoose.Schema(
  {
    assignmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    answer: { type: String, required: true },
    submittedAt: { type: Date, default: Date.now },
    reviewed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// ensure one submission per student per assignment at DB level (optional but useful)
SubmissionSchema.index({ assignmentId: 1, studentId: 1 }, { unique: true });

module.exports = mongoose.model("Submission", SubmissionSchema);
