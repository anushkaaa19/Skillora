const Question = require("../models/Question");

exports.askQuestion = async (req, res) => {
  try {
    const { title, content, category } = req.body;
    const { courseId } = req.params;

    const newQuestion = await Question.create({
      title,
      content,
      category,
      course: courseId,
      askedBy: req.user.id
    });

    res.status(201).json({
      success: true,
      message: "Question asked successfully",
      data: newQuestion
    });
  } catch (err) {
    console.error("Error asking question:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
exports.replyToQuestion = async (req, res) => {
    try {
      const { content } = req.body;
      const { questionId } = req.params;
  
      const question = await Question.findById(questionId);
      if (!question) return res.status(404).json({ success: false, message: "Question not found" });
  
      question.replies.push({ user: req.user.id, content });
      await question.save();
  
      const populated = await question.populate("replies.user", "firstName lastName image");
  
      res.status(200).json({
        success: true,
        message: "Reply added",
        data: populated.replies[populated.replies.length - 1],
      });
    } catch (err) {
      console.error("❌ Error adding reply:", err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };
  
  exports.getQuestionsByCourse = async (req, res) => {
    try {
      const { courseId } = req.params;
  
      const questions = await Question.find({ course: courseId })
        .populate("askedBy", "firstName lastName image")
        .populate("replies.user", "firstName lastName image") // ✅ ADD THIS LINE
        .sort({ createdAt: -1 });
  
      res.status(200).json({
        success: true,
        data: questions
      });
    } catch (err) {
      console.error("Error fetching questions:", err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };
  