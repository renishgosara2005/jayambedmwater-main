import DailyChart from "../models/DailyChart.js";

// ✅ CREATE (FIX NAME)
export const addDailyChart = async (req, res) => {
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

// ✅ GET
export const getDailyChart = async (req, res) => {
  try {
    const data = await DailyChart.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
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
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ DELETE
export const deleteDailyChart = async (req, res) => {
  try {
    await DailyChart.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted ✅" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};