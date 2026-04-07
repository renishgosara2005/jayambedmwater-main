import DailyChart from "../models/DailyChart.js";

// ✅ CREATE
export const createDailyChart = async (req, res) => {
  try {
    const data = await DailyChart.create(req.body);

    res.status(201).json({
      success: true,
      message: "Daily Chart Created ✅",
      data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Create Error",
      error: err.message,
    });
  }
};

// ✅ GET ALL
export const getDailyChart = async (req, res) => {
  try {
    const data = await DailyChart.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Fetch Error",
      error: err.message,
    });
  }
};

// ✅ UPDATE
export const updateDailyChart = async (req, res) => {
  try {
    const updated = await DailyChart.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        returnDocument: "after", // 🔥 warning fix
      }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Record Not Found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Updated Successfully ✅",
      data: updated,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Update Error",
      error: err.message,
    });
  }
};

// ✅ DELETE
export const deleteDailyChart = async (req, res) => {
  try {
    const deleted = await DailyChart.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Record Not Found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Deleted Successfully ❌",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Delete Error",
      error: err.message,
    });
  }
};