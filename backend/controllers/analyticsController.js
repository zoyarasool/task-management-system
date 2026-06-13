const Task = require("../models/Task");

// GET ANALYTICS OVERVIEW
const getOverview = async (req, res) => {
  try {
    const userId = req.user._id;

    const totalTasks = await Task.countDocuments({ owner: userId });

    const completedTasks = await Task.countDocuments({
      owner: userId,
      status: "Completed",
    });

    const pendingTasks = await Task.countDocuments({
      owner: userId,
      status: "Pending",
    });

    const inProgressTasks = await Task.countDocuments({
      owner: userId,
      status: "In Progress",
    });

    // STATUS BREAKDOWN FOR PIE CHART
    const statusBreakdown = await Task.aggregate([
      { $match: { owner: userId } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    res.json({
      totalTasks,
      completedTasks,
      pendingTasks,
      inProgressTasks,
      statusBreakdown,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ANALYTICS TRENDS (weekly/monthly)
const getTrends = async (req, res) => {
  try {
    const userId = req.user._id;
    const { type } = req.query; // 'weekly' or 'monthly'

    let groupBy;

    if (type === "weekly") {
      groupBy = {
        year: { $year: "$createdAt" },
        week: { $week: "$createdAt" },
      };
    } else {
      groupBy = {
        year: { $year: "$createdAt" },
        month: { $month: "$createdAt" },
      };
    }

    const trends = await Task.aggregate([
      { $match: { owner: userId } },
      {
        $group: {
          _id: groupBy,
          total: { $sum: 1 },
          completed: {
            $sum: {
              $cond: [{ $eq: ["$status", "Completed"] }, 1, 0],
            },
          },
          pending: {
            $sum: {
              $cond: [{ $eq: ["$status", "Pending"] }, 1, 0],
            },
          },
          inProgress: {
            $sum: {
              $cond: [{ $eq: ["$status", "In Progress"] }, 1, 0],
            },
          },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.week": 1 } },
    ]);

    res.json(trends);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getOverview, getTrends };