import Customer from "../models/Customer.js";

// ✅ ADD CUSTOMER
export const addCustomer = async (req, res) => {
  try {
    const customer = new Customer(req.body);
    await customer.save();

    res.json({ message: "Customer added", customer });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ GET ALL
export const getCustomers = async (req, res) => {
  const data = await Customer.find();
  res.json(data);
};

// ✅ UPDATE
export const updateCustomer = async (req, res) => {
  try {
    const updated = await Customer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: "after" } // 🔥 new ni jagyae aa use karo
    );

    if (!updated) {
      return res.status(404).json({
        message: "Customer not found ❌",
      });
    }

    res.json({
      message: "Customer updated ✅",
      data: updated,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ✅ DELETE
export const deleteCustomer = async (req, res) => {
  try {
    const deleted = await Customer.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        message: "Customer not found ❌",
      });
    }

    res.json({
      message: "Customer deleted ✅",
      data: deleted,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};