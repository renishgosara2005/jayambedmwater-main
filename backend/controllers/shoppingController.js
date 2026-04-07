import Shopping from "../models/Shopping.js";

// ✅ CREATE
export const createShopping = async (req, res) => {
  try {
    const data = await Shopping.create(req.body);
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ GET
export const getShopping = async (req, res) => {
  try {
    const data = await Shopping.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ DELETE
export const deleteShopping = async (req, res) => {
  try {
    await Shopping.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ UPDATE
export const updateShopping = async (req, res) => {
  try {
    const data = await Shopping.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};  