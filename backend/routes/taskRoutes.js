const express = require("express");
const router = express.Router();

const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  shareTask,
  getSharedTasks,
  addAttachment,
} = require("../controllers/taskController");

const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// CREATE
router.post("/", protect, createTask);

// READ ALL (owned tasks)
router.get("/", protect, getTasks);

// GET TASKS SHARED WITH ME
router.get("/shared", protect, getSharedTasks);

// READ ONE
router.get("/:id", protect, getTaskById);

// UPDATE
router.put("/:id", protect, updateTask);

// SHARE TASK
router.put("/:id/share", protect, shareTask);

// ADD ATTACHMENT
router.post("/:id/attachments", protect, upload.single("file"), addAttachment);

// DELETE
router.delete("/:id", protect, deleteTask);

module.exports = router;