import EmployeeEntry from "../models/EmployeeEntry.js";

// ✅ CREATE ENTRY
export const addEntry = async (req, res) => {
  try {
    const entry = await EmployeeEntry.create(req.body);

    res.status(201).json({
      success: true,
      data: entry,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ✅ GET ALL BY EMPLOYEE
export const getEntriesByEmployee = async (req, res) => {
  try {
    const data = await EmployeeEntry.find({
      employeeId: req.params.id,
    }).sort({ createdAt: -1 });

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ✅ DELETE ENTRY
export const deleteEntry = async (req, res) => {
  try {
    await EmployeeEntry.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Deleted",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ✅ WATER BY DATE
export const getWaterByDate = async (req, res) => {
  try {
    const { date, name } = req.query;

    const data = await EmployeeEntry.find({
      date,
      name,
    });

    const total = data.reduce((sum, i) => sum + (i.liter || 0), 0);

    res.json({ total });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};