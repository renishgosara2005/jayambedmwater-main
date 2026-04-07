/* eslint-disable no-unused-vars */
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
import jsPDF from "jspdf";
import dayjs from "dayjs";
import BASE_URL from "../../api";

const Expense = () => {
  const [data, setData] = useState([]);

  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);

  // ✅ FETCH DATA
  const fetchData = async () => {
    const res = await fetch("${BASE_URL}/api/expense");
    const result = await res.json();
    setData(result);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, []);

  // ✅ ADD
  const handleAdd = async () => {
    const values = await form.validateFields();

    await fetch("${BASE_URL}/api/expense", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        driver: values.driver,
        number: values.number,
        expense: Number(values.expense),
        date: values.date.format("DD-MM-YYYY"),
      }),
    });

    fetchData();
    form.resetFields();
    setOpen(false);
  };

  // ✅ DELETE
  const handleDelete = async (id) => {
    await fetch(`${BASE_URL}/api/expense/${id}`, {
      method: "DELETE",
    });

    fetchData();
  };

  // ✅ FILTER
  const filteredData = data.filter((item) => {
    const matchSearch =
      item.driver?.toLowerCase().includes(search.toLowerCase()) ||
      item.number?.toLowerCase().includes(search.toLowerCase());

    const matchDate = selectedDate
      ? item.date === selectedDate.format("DD-MM-YYYY")
      : true;

    return matchSearch && matchDate;
  });

  // ✅ TOTAL
  const total = filteredData.reduce((sum, item) => sum + item.expense, 0);

  // ✅ PDF
  const generatePDF = () => {
    const doc = new jsPDF();

    doc.text("Expense Report", 20, 20);

    let y = 30;

    filteredData.forEach((item, i) => {
      doc.text(
        `${i + 1}. ${item.driver} - ${item.number} - ₹${item.expense} - ${item.date}`,
        20,
        y,
      );
      y += 10;
    });

    doc.text(`Total Expense: ₹${total}`, 20, y + 10);

    doc.save("expense-report.pdf");
  };

  // ✅ COLUMNS
  const columns = [
    {
      title: "ID",
      render: (_, __, index) => index + 1,
    },
    { title: "Date", dataIndex: "date" },
    { title: "Driver Name", dataIndex: "driver" },
    { title: "Vehicle No", dataIndex: "number" },
    { title: "Expense ₹", dataIndex: "expense" },
    {
      title: "Action",
      render: (_, record) => (
        <Button danger onClick={() => handleDelete(record._id)}>
          Delete
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <Card
        title="Expense Details"
        extra={
          <Button type="primary" onClick={() => setOpen(true)}>
            + Add Expense
          </Button>
        }
      >
        <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
          <Input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <DatePicker onChange={(d) => setSelectedDate(d)} />

          <Button onClick={generatePDF}>PDF</Button>

          <Button
            onClick={() => {
              setSearch("");
              setSelectedDate(null);
            }}
          >
            Clear
          </Button>
        </div>

        <h3>Total Expense: ₹{total}</h3>

        <Table columns={columns} dataSource={filteredData} rowKey="_id" />
      </Card>

      <Modal
        title="Add Expense"
        open={open}
        onOk={handleAdd}
        onCancel={() => setOpen(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="driver" label="Driver" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="number" label="Vehicle" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="GJ01AA1234">GJ03AX6592</Select.Option>
              <Select.Option value="GJ01BB5678">GJ03W1947</Select.Option>
              <Select.Option value="GJ01BB5678">GJ003AZ6929</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="expense" label="Amount" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>

          <Form.Item name="date" label="Date" rules={[{ required: true }]}>
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Expense;
