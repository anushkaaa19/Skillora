const express = require("express");
const { askQuestion, getQuestionsByCourse ,replyToQuestion} = require("../controllers/questionController");
const { auth } = require("../middleware/auth");

const router = express.Router();

router.post("/:courseId", auth, askQuestion);
router.get("/:courseId", auth, getQuestionsByCourse);
router.post("/reply/:questionId", auth, replyToQuestion);

module.exports = router;
