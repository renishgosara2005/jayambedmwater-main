import EmployeeEntry from "../models/EmployeeEntry.js";
import DailyChart from "../models/DailyChart.js";

// ✅ ADD ENTRY
export const addEntry = async (req, res) => {
  try {
    const data = await EmployeeEntry.create(req.body);
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ GET BY EMPLOYEE
export const getEntries = async (req, res) => {
  try {
    const data = await EmployeeEntry.find({
      employeeId: req.params.id,
    }).sort({ createdAt: -1 });

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ DELETE
export const deleteEntry = async (req, res) => {
  try {
    await EmployeeEntry.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ WATER BY DATE
export const getWater = async (req, res) => {
  try {
    const { date, name } = req.query;

    const data = await DailyChart.find({
      date,
      employee: name,
    });

    let total = 0;

    data.forEach((item) => {
      total +=
        (item.q1 || 0) +
        (item.q2 || 0) +
        (item.q3 || 0) +
        (item.q4 || 0) +
        (item.q5 || 0) +
        (item.q6 || 0) +
        (item.q7 || 0);
    });

    res.json({ total });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};