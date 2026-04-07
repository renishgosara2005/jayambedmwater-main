import Chemical from "../models/Chemical.js";

// ✅ CREATE
export const createChemical = async (req, res) => {
  try {
    const data = await Chemical.create(req.body);
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ GET ALL
export const getChemicals = async (req, res) => {
  try {
    const data = await Chemical.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ DELETE
export const deleteChemical = async (req, res) => {
  try {
    await Chemical.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};  