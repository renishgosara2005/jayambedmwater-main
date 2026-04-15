import DailyChart from "../models/DailyChart.js";

// ✅ CREATE
export const addDailyChart = async (req, res) => {
  try {
    const data = req.body;

    const totalQty =
      (data.q1 || 0) +
      (data.q2 || 0) +
      (data.q3 || 0) +
      (data.q4 || 0) +
      (data.q5 || 0) +
      (data.q6 || 0) +
      (data.q7 || 0);

    const price = Number(data.price) || 0;

    data.total = totalQty * price;

    const result = await DailyChart.create(data);

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ GET
export const getDailyChart = async (req, res) => {
  try {
    const data = await DailyChart.find().sort({ createdAt: -1 });
    res.json({ data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ UPDATE (🔥 MAIN FIX)
export const updateDailyChart = async (req, res) => {
  try {
    const data = req.body;

    const totalQty =
      (data.q1 || 0) +
      (data.q2 || 0) +
      (data.q3 || 0) +
      (data.q4 || 0) +
      (data.q5 || 0) +
      (data.q6 || 0) +
      (data.q7 || 0);

    const price = Number(data.price) || 0;

    data.total = totalQty * price;

    const updated = await DailyChart.findByIdAndUpdate(
      req.params.id,
      data,
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ DELETE
export const deleteDailyChart = async (req, res) => {
  try {
    await DailyChart.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};