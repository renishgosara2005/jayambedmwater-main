import Expense from "../models/Expense.js";
import Shopping from "../models/Shopping.js";
import Chemical from "../models/Chemical.js";
import DailyChart from "../models/DailyChart.js";

export const getProfit = async (req, res) => {
  try {
    let income = 0,
      expense = 0,
      shopping = 0,
      costic = 0,
      acid = 0;

    const daily = await DailyChart.find();
    const exp = await Expense.find();
    const shop = await Shopping.find();
    const chem = await Chemical.find();

    // INCOME
    daily.forEach((d) => {
      income += Number(d.total || 0);
    });

    // EXPENSE
    exp.forEach((e) => {
      expense += Number(e.expense || 0);
    });

    // SHOPPING
    shop.forEach((s) => {
      shopping += Number(s.price || 0);
    });

    // CHEMICAL
    chem.forEach((c) => {
      if (c.type === "costic") costic += Number(c.price || 0);
      if (c.type === "acid") acid += Number(c.price || 0);
    });

    const totalExpense = expense + shopping + costic + acid;
    const profit = income - totalExpense;

    res.json({
      income,
      expense,
      shopping,
      costic,
      acid,
      totalExpense,
      profit,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};