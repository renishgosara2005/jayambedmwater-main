import Expense from "../models/Expense.js";

// ✅ CREATE
export const createExpense = async (req, res) => {
  try {
    const data = await Expense.create(req.body);
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ GET
export const getExpenses = async (req, res) => {
  try {
    const data = await Expense.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ DELETE
export const deleteExpense = async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};