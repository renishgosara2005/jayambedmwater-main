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
  Row,
  Col,
  Typography,
  Space,
  message,
  Spin,
} from "antd";
import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import dayjs from "dayjs";
import BASE_URL from "../../api";

const { Title, Text } = Typography;

const API = `${BASE_URL}/api/expense`;

const Expense = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);

  // ✅ FETCH DATA
  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await fetch(API);
      const result = await res.json();

      console.log("Expense API 👉", result);

      // 🔥 FIX (array ensure)
      setData(result.data || result || []);

    } catch {
      message.error("API Error ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ✅ ADD
  const handleAdd = async () => {
    try {
      const values = await form.validateFields();

      await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          driver: values.driver,
          number: values.number,
          expense: Number(values.expense),
          date: values.date.format("DD-MM-YYYY"),
        }),
      });

      message.success("Expense Added ✅");
      setOpen(false);
      form.resetFields();
      fetchData();
    } catch {
      message.error("Failed ❌");
    }
  };

  // ✅ DELETE
  const handleDelete = async (id) => {
    await fetch(`${API}/${id}`, {
      method: "DELETE",
    });

    message.success("Deleted 🗑️");
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
        y
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
      width: 60,
    },
    { title: "Date", dataIndex: "date" },
    { title: "Driver", dataIndex: "driver" },
    { title: "Vehicle", dataIndex: "number" },
    { title: "Expense ₹", dataIndex: "expense" },
    {
      title: "Action",
      render: (_, record) => (
        <Button danger size="small" onClick={() => handleDelete(record._id)}>
          Delete
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: 10 }}>
      {/* HEADER */}
      <Card
        title={<Text strong>Expense Details</Text>}
        extra={
          <Button type="primary" onClick={() => setOpen(true)}>
            + Add Expense
          </Button>
        }
        style={{ borderRadius: 12 }}
      >
        {/* FILTER */}
        <Row gutter={[10, 10]} style={{ marginBottom: 10 }}>
          <Col xs={24} sm={12} md={6}>
            <Input
              placeholder="Search driver / vehicle"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Col>

          <Col xs={24} sm={12} md={6}>
            <DatePicker
              style={{ width: "100%" }}
              onChange={(d) => setSelectedDate(d)}
            />
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Space>
              <Button onClick={generatePDF}>PDF</Button>

              <Button
                onClick={() => {
                  setSearch("");
                  setSelectedDate(null);
                }}
              >
                Clear
              </Button>
            </Space>
          </Col>
        </Row>

        {/* TOTAL */}
        <Title level={5}>💸 Total: ₹{total}</Title>

        {/* TABLE */}
        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={filteredData}
            rowKey="_id"
            scroll={{ x: 800 }}
          />
        </Spin>
      </Card>

      {/* MODAL */}
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
              <Select.Option value="GJ03AX6592">GJ03AX6592</Select.Option>
              <Select.Option value="GJ03W1947">GJ03W1947</Select.Option>
              <Select.Option value="GJ03AZ6929">GJ03AZ6929</Select.Option>
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