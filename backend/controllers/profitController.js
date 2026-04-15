import DailyChart from "../models/DailyChart.js";
import Expense from "../models/Expense.js";
import Shopping from "../models/Shopping.js";

export const getProfit = async (req, res) => {
  try {
    // ✅ WATER INCOME
    const daily = await DailyChart.find();

    let income = 0;

    daily.forEach((d) => {
      const qty =
        (d.q1 || 0) +
        (d.q2 || 0) +
        (d.q3 || 0) +
        (d.q4 || 0) +
        (d.q5 || 0) +
        (d.q6 || 0) +
        (d.q7 || 0);

      income += qty * (d.price || 0);
    });

    // ✅ EXPENSE
    const expenses = await Expense.find();
    const expense = expenses.reduce((s, i) => s + i.expense, 0);

    // ✅ SHOPPING
    const shoppingData = await Shopping.find();
    const shopping = shoppingData.reduce((s, i) => s + i.price, 0);

    // (optional future)
    const costic = 0;
    const acid = 0;

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
