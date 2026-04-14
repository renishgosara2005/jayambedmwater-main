/* eslint-disable no-unused-vars */

import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Row,
  Col,
  Typography,
  Space,
  Spin,
  message,
} from "antd";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import jsPDF from "jspdf";
import BASE_URL from "../../api";

const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

const API = `${BASE_URL}/api/shopping`;

const Shopping = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState([]);

  // ✅ FETCH DATA
  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await fetch(API);
      const result = await res.json();

      console.log("Shopping API 👉", result);

      // 🔥 IMPORTANT FIX
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

  // ✅ ADD / UPDATE
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const payload = {
        name: values.name,
        supplier: values.supplier,
        price: Number(values.price),
        date: values.date.format("DD-MM-YYYY"),
      };

      if (editing) {
        await fetch(`${API}/${editing._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        message.success("Updated ✅");
      } else {
        await fetch(API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        message.success("Added ✅");
      }

      fetchData();
      form.resetFields();
      setOpen(false);
      setEditing(null);
    } catch {
      message.error("Failed ❌");
    }
  };

  // ✅ DELETE
  const handleDelete = async (id) => {
    await fetch(`${API}/${id}`, { method: "DELETE" });
    message.success("Deleted 🗑️");
    fetchData();
  };

  // ✅ EDIT
  const handleEdit = (record) => {
    setEditing(record);
    form.setFieldsValue({
      ...record,
      date: dayjs(record.date, "DD-MM-YYYY"),
    });
    setOpen(true);
  };

  // ✅ FILTER
  const filteredData = data.filter((item) => {
    const matchSearch =
      item.name?.toLowerCase().includes(search.toLowerCase()) ||
      item.supplier?.toLowerCase().includes(search.toLowerCase());

    let matchDate = true;

    if (dateRange?.length === 2) {
      const d = dayjs(item.date, "DD-MM-YYYY");

      matchDate =
        d.isSame(dateRange[0], "day") ||
        d.isSame(dateRange[1], "day") ||
        (d.isAfter(dateRange[0]) && d.isBefore(dateRange[1]));
    }

    return matchSearch && matchDate;
  });

  // ✅ TOTAL
  const total = filteredData.reduce((sum, i) => sum + i.price, 0);

  // ✅ PDF
  const generatePDF = () => {
    const doc = new jsPDF();

    doc.text("Shopping Report", 20, 20);

    let y = 30;

    filteredData.forEach((item, i) => {
      doc.text(
        `${i + 1}. ${item.name} - ${item.supplier} - ₹${item.price} - ${item.date}`,
        20,
        y
      );
      y += 10;
    });

    doc.text(`Total: ₹${total}`, 20, y + 10);

    doc.save("shopping-report.pdf");
  };

  // ✅ COLUMNS
  const columns = [
    {
      title: "ID",
      render: (_, __, i) => i + 1,
      width: 60,
    },
    { title: "Item", dataIndex: "name" },
    { title: "Supplier", dataIndex: "supplier" },
    { title: "Price ₹", dataIndex: "price" },
    { title: "Date", dataIndex: "date" },
    {
      title: "Action",
      render: (_, r) => (
        <Space>
          <Button size="small" onClick={() => handleEdit(r)}>
            Edit
          </Button>
          <Button danger size="small" onClick={() => handleDelete(r._id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 10 }}>
      <Card
        title={<Text strong>Shopping</Text>}
        extra={
          <Button type="primary" onClick={() => setOpen(true)}>
            + Add
          </Button>
        }
        style={{ borderRadius: 12 }}
      >
        {/* FILTER */}
        <Row gutter={[10, 10]} style={{ marginBottom: 10 }}>
          <Col xs={24} sm={12} md={6}>
            <Input
              placeholder="Search item / supplier"
              onChange={(e) => setSearch(e.target.value)}
            />
          </Col>

          <Col xs={24} sm={12} md={8}>
            <RangePicker
              style={{ width: "100%" }}
              onChange={(d) => setDateRange(d)}
            />
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Space>
              <Button onClick={generatePDF}>PDF</Button>
              <Button
                onClick={() => {
                  setSearch("");
                  setDateRange([]);
                }}
              >
                Clear
              </Button>
            </Space>
          </Col>
        </Row>

        {/* TOTAL */}
        <Title level={5}>🛒 Total: ₹{total}</Title>

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
        title={editing ? "Edit Item" : "Add Item"}
        open={open}
        onOk={handleSubmit}
        onCancel={() => {
          setOpen(false);
          setEditing(null);
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Item" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="supplier" label="Supplier">
            <Input />
          </Form.Item>

          <Form.Item name="price" label="Price" rules={[{ required: true }]}>
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

export default Shopping;