/* eslint-disable react-hooks/set-state-in-effect */
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
} from "antd";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import BASE_URL from "../../api";

const API = "${BASE_URL}/api/customer";

const DailyChart = () => {
  const [data, setData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [filteredData, setFilteredData] = useState([]);

  const [open, setOpen] = useState(false);
  const [cellModal, setCellModal] = useState(false);

  const [form] = Form.useForm();
  const [cellForm] = Form.useForm();

  const [selectedCell, setSelectedCell] = useState(null);

  const employees = ["Manveer kaka", "Vijay", "Bhano"];

  // 🔥 LOAD DATA FROM BACKEND
  useEffect(() => {
    fetch(API)
      .then((res) => res.json())
      .then((res) => setData(res));
  }, []);

  // 🔥 FILTER DATE
  useEffect(() => {
    const dateStr = selectedDate.format("DD-MM-YYYY");
    const filtered = data.filter((item) => item.date === dateStr);
    setFilteredData(filtered);
  }, [selectedDate, data]);

  // 🔥 ADD CUSTOMER (API)
  const handleAdd = async () => {
    const values = await form.validateFields();

    const payload = {
      name: values.name,
      price: Number(values.price),
      date: selectedDate.format("DD-MM-YYYY"),
      q1: 0,
      q2: 0,
      q3: 0,
      q4: 0,
      q5: 0,
      q6: 0,
      q7: 0,
      total: 0,
    };

    const res = await fetch(`${API}/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await res.json();

    setData((prev) => [...prev, result.customer]);

    form.resetFields();
    setOpen(false);
  };

  // 🔥 DELETE
  const handleDelete = async (id) => {
    await fetch(`${API}/${id}`, {
      method: "DELETE",
    });

    setData(data.filter((item) => item._id !== id));
  };

  // 🔥 EDIT (ONLY UI)
  const handleEdit = (record) => {
    form.setFieldsValue({
      name: record.name,
      price: record.price,
    });

    setSelectedCell({ editKey: record._id });
    setOpen(true);
  };

  // 🔥 CELL CLICK
  const handleCellClick = (record, field) => {
    setSelectedCell({ record, field });
    setCellModal(true);
  };

  // 🔥 CELL SAVE (API UPDATE)
  const handleCellSave = async () => {
    const values = await cellForm.validateFields();

    let updatedItem;

    const updated = data.map((item) => {
      if (item._id === selectedCell.record._id) {
        updatedItem = {
          ...item,
          [selectedCell.field]: Number(values.liter),
          [`${selectedCell.field}_emp`]: values.employee,
        };

        const totalQty =
          updatedItem.q1 +
          updatedItem.q2 +
          updatedItem.q3 +
          updatedItem.q4 +
          updatedItem.q5 +
          updatedItem.q6 +
          updatedItem.q7;

        updatedItem.total = totalQty * updatedItem.price;

        return updatedItem;
      }
      return item;
    });

    setData(updated);

    await fetch(`${API}/update/${selectedCell.record._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedItem),
    });

    setCellModal(false);
    cellForm.resetFields();
  };

  // 🔥 DAILY TOTAL
  const totalLiters = filteredData.reduce(
    (sum, item) =>
      sum +
      item.q1 +
      item.q2 +
      item.q3 +
      item.q4 +
      item.q5 +
      item.q6 +
      item.q7,
    0
  );

  const grandTotal = filteredData.reduce((sum, item) => sum + item.total, 0);

  // 🔥 MONTHLY
  const monthlyData = data.filter((item) => {
    const d = dayjs(item.date, "DD-MM-YYYY");
    return (
      d.month() === selectedDate.month() &&
      d.year() === selectedDate.year()
    );
  });

  const monthlyLiters = monthlyData.reduce(
    (sum, item) =>
      sum +
      item.q1 +
      item.q2 +
      item.q3 +
      item.q4 +
      item.q5 +
      item.q6 +
      item.q7,
    0
  );

  const monthlyAmount = monthlyData.reduce((sum, item) => sum + item.total, 0);

  // 🔥 MONTH SUMMARY
  const monthSummary = {};
  data.forEach((item) => {
    const d = dayjs(item.date, "DD-MM-YYYY");
    const key = d.format("MM-YYYY");

    if (!monthSummary[key]) {
      monthSummary[key] = { month: key, amount: 0 };
    }

    monthSummary[key].amount += item.total;
  });

  const monthTableData = Object.values(monthSummary);

  // 🔥 COLUMN
  const getColumn = (num) => ({
    title: num,
    render: (_, record) => (
      <div
        style={{ cursor: "pointer" }}
        onClick={() => handleCellClick(record, `q${num}`)}
      >
        {record[`q${num}`] || 0} L
        <div style={{ fontSize: 10 }}>{record[`q${num}_emp`]}</div>
      </div>
    ),
  });

  const columns = [
    { title: "Name", dataIndex: "name" },
    getColumn(1),
    getColumn(2),
    getColumn(3),
    getColumn(4),
    getColumn(5),
    getColumn(6),
    getColumn(7),
    { title: "Total ₹", dataIndex: "total" },
    {
      title: "Action",
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Button danger type="link" onClick={() => handleDelete(record._id)}>
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
        <DatePicker value={selectedDate} onChange={setSelectedDate} />

        <Button
          type="primary"
          onClick={() => {
            setSelectedCell(null);
            form.resetFields();
            setOpen(true);
          }}
        >
          + Add Customer
        </Button>
      </div>

      <Card title="Daily Supply">
        <Table
          rowKey="_id"
          columns={columns}
          dataSource={filteredData}
          pagination={false}
        />

        <div style={{ marginTop: 20, textAlign: "right" }}>
          <h3>Daily Water: {totalLiters} L</h3>
          <h3>Daily Amount: ₹{grandTotal}</h3>

          <hr />

          <h3 style={{ color: "blue" }}>Monthly Water: {monthlyLiters} L</h3>
          <h2 style={{ color: "green" }}>
            Monthly Amount: ₹{monthlyAmount}
          </h2>
        </div>
      </Card>

      <Card title="Month Wise Summary" style={{ marginTop: 20 }}>
        <Table
          dataSource={monthTableData}
          columns={[
            { title: "Month", dataIndex: "month" },
            { title: "Total ₹", dataIndex: "amount" },
          ]}
        />
      </Card>

      {/* ADD */}
      <Modal
        title="Add Customer"
        open={open}
        onOk={handleAdd}
        onCancel={() => setOpen(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Customer Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="price" label="Price per Liter" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>

      {/* CELL */}
      <Modal
        title="Top Up Entry"
        open={cellModal}
        onOk={handleCellSave}
        onCancel={() => setCellModal(false)}
      >
        <Form form={cellForm} layout="vertical">
          <Form.Item name="employee" label="Employee Name" rules={[{ required: true }]}>
            <Select>
              {employees.map((emp) => (
                <Select.Option key={emp} value={emp}>
                  {emp}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="liter" label="Liters" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DailyChart;