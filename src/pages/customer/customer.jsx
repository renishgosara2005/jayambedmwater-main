/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */

import {
  Card,
  Table,
  Button,
  Input,
  DatePicker,
  Modal,
  Form,
  Row,
  Col,
  Typography,
  Space,
  message,
} from "antd";
import { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import BASE_URL from "../../api";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;
const { Title } = Typography;

const API = `${BASE_URL}/api/daily-chart`;

const Customers = () => {
  const [data, setData] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [dateRange, setDateRange] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm();

  // ✅ FETCH DATA (FIXED)
  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await fetch(API);
      const parsed = await res.json();

      const rawData = parsed.data || [];

      let finalData = [];

      rawData.forEach((item) => {
        for (let i = 1; i <= 7; i++) {
          const liter = item[`q${i}`];
          const emp = item[`q${i}_emp`];

          if (liter && liter > 0) {
            finalData.push({
              key: `${item._id}-${i}`,
              parentId: item._id,
              field: `q${i}`,
              name: item.name,
              employee: emp || "-",
              liter,
              amount: liter * (item.price || 0),
              date: item.date,
              price: item.price,
            });
          }
        }
      });

      setData(finalData);
    } catch (err) {
      console.log("Fetch Error ❌", err);
      message.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ✅ FILTER
  const filteredData = data.filter((item) => {
    const matchName = item.name
      ?.toLowerCase()
      .includes(searchName.toLowerCase());

    let matchDate = true;

    if (dateRange?.length === 2) {
      const itemDate = dayjs(item.date, "DD-MM-YYYY");

      matchDate =
        itemDate.isSame(dateRange[0], "day") ||
        itemDate.isSame(dateRange[1], "day") ||
        (itemDate.isAfter(dateRange[0]) && itemDate.isBefore(dateRange[1]));
    }

    return matchName && matchDate;
  });

  // ✅ DELETE
  const handleDelete = async (record) => {
    await fetch(`${API}/${record.parentId}`, {
      method: "DELETE",
    });

    message.success("Deleted 🗑️");
    fetchData();
  };

  // ✅ EDIT
  const handleEdit = (record) => {
    setEditing(record);

    form.setFieldsValue({
      name: record.name,
      employee: record.employee,
      liter: record.liter,
    });
  };

  // ✅ SAVE UPDATE
  const handleSave = async () => {
    const values = await form.validateFields();

    const updated = {
      name: values.name,
      [editing.field]: Number(values.liter),
      [`${editing.field}_emp`]: values.employee,
      price: editing.price, // important
    };

    await fetch(`${API}/${editing.parentId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });

    message.success("Updated ✅");
    setEditing(null);
    fetchData();
  };

  // ✅ PDF
  const generatePDF = () => {
    const doc = new jsPDF();

    doc.text("Customer Report", 20, 20);

    let y = 30;

    filteredData.forEach((item, i) => {
      doc.text(
        `${i + 1}. ${item.name} - ${item.employee} - ${item.liter}L - ₹${item.amount}`,
        20,
        y,
      );
      y += 10;
    });

    doc.text(`Total Entries: ${filteredData.length}`, 20, y + 10);

    doc.save("customer-report.pdf");
  };

  // ✅ TOTAL
  const totalLiter = filteredData.reduce((s, i) => s + i.liter, 0);
  const totalAmount = filteredData.reduce((s, i) => s + i.amount, 0);

  // ✅ TABLE
  const columns = [
    { title: "Customer", dataIndex: "name" },
    { title: "Employee", dataIndex: "employee" },
    {
      title: "Liter",
      render: (_, r) => <b>{r.liter} L</b>,
    },
    {
      title: "Amount",
      render: (_, r) => <b>₹ {r.amount}</b>,
    },
    { title: "Date", dataIndex: "date" },
    {
      title: "Action",
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Button danger type="link" onClick={() => handleDelete(record)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 10 }}>
      <Card title={<Title level={4}>Customer Report</Title>} bordered={false}>
        {/* 🔥 FILTER */}
        <Row gutter={[10, 10]} style={{ marginBottom: 15 }}>
          <Col xs={24} sm={12} md={8}>
            <Input
              placeholder="Search customer..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />
          </Col>

          <Col xs={24} sm={12} md={8}>
            <RangePicker
              style={{ width: "100%" }}
              onChange={(dates) => setDateRange(dates)}
            />
          </Col>

          <Col xs={24} sm={24} md={4}>
            <Button type="primary" block onClick={generatePDF}>
              PDF
            </Button>
          </Col>
        </Row>

        {/* 🔥 TOTAL */}
        <Row gutter={10} style={{ marginBottom: 10 }}>
          <Col xs={24} md={12}>
            <Card>💧 Total Liter: {totalLiter} L</Card>
          </Col>

          <Col xs={24} md={12}>
            <Card>₹ Total Amount: {totalAmount}</Card>
          </Col>
        </Row>

        {/* 🔥 TABLE */}
        <Table
          columns={columns}
          dataSource={filteredData}
          loading={loading}
          scroll={{ x: 700 }}
        />
      </Card>

      {/* 🔥 MODAL */}
      <Modal
        title="Edit Entry"
        open={!!editing}
        onOk={handleSave}
        onCancel={() => setEditing(null)}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Customer" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item
            name="employee"
            label="Employee"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="liter" label="Liter" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Customers;
  