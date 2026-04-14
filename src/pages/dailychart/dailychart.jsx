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
  Row,
  Col,
  Typography,
  Divider,
  message,
  Spin,
} from "antd";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import BASE_URL from "../../api";

const { Title, Text } = Typography;

const API = `${BASE_URL}/api/daily-chart`;

const DailyChart = () => {
  const [data, setData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [cellModal, setCellModal] = useState(false);

  const [form] = Form.useForm();
  const [cellForm] = Form.useForm();

  const [selectedCell, setSelectedCell] = useState(null);

  const employees = ["Manveer kaka", "Vijay", "Bhano", ""];

  // ✅ FETCH DATA (FIXED)
  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await fetch(API);
      const result = await res.json();

      console.log("API 👉", result);

      // 🔥 IMPORTANT FIX
      setData(result.data || []);

    } catch (err) {
      message.error("API Error ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ✅ FILTER
  useEffect(() => {
    const dateStr = selectedDate.format("DD-MM-YYYY");

    const filtered = data.filter((i) => i.date === dateStr);

    setFilteredData(filtered);
  }, [selectedDate, data]);

  // ✅ ADD
  const handleAdd = async () => {
    try {
      const values = await form.validateFields();

      await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          price: Number(values.price),
          date: selectedDate.format("DD-MM-YYYY"),
          q1: 0, q2: 0, q3: 0, q4: 0, q5: 0, q6: 0, q7: 0,
          total: 0,
        }),
      });

      message.success("Customer Added ✅");
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

  // ✅ CELL CLICK
  const handleCellClick = (record, field) => {
    setSelectedCell({ record, field });
    setCellModal(true);
  };

  // ✅ CELL SAVE
  const handleCellSave = async () => {
    const values = await cellForm.validateFields();

    const updatedItem = {
      ...selectedCell.record,
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

    await fetch(`${API}/${updatedItem._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedItem),
    });

    message.success("Updated ✅");
    setCellModal(false);
    cellForm.resetFields();
    fetchData();
  };

  // ✅ TOTAL
  const totalLiters = filteredData.reduce(
    (s, i) =>
      s +
      i.q1 +
      i.q2 +
      i.q3 +
      i.q4 +
      i.q5 +
      i.q6 +
      i.q7,
    0
  );

  const grandTotal = filteredData.reduce((s, i) => s + i.total, 0);

  // ✅ COLUMN
  const getColumn = (num) => ({
    title: num,
    align: "center",
    render: (_, record) => (
      <div
        onClick={() => handleCellClick(record, `q${num}`)}
        style={{
          cursor: "pointer",
          padding: 6,
          borderRadius: 6,
        }}
      >
        <b>{record[`q${num}`] || 0} L</b>
        <div style={{ fontSize: 11, color: "#999" }}>
          {record[`q${num}_emp`] || "-"}
        </div>
      </div>
    ),
  });

  const columns = [
    { title: "Name", dataIndex: "name", fixed: "left" },
    getColumn(1),
    getColumn(2),
    getColumn(3),
    getColumn(4),
    getColumn(5),
    getColumn(6),
    getColumn(7),
    { title: "Total ₹", dataIndex: "total", align: "center" },
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
      <Row gutter={[10, 10]} style={{ marginBottom: 12 }}>
        <Col xs={24} sm={12} md={6}>
          <DatePicker
            value={selectedDate}
            onChange={setSelectedDate}
            style={{ width: "100%" }}
          />
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Button type="primary" block onClick={() => setOpen(true)}>
            + Add Customer
          </Button>
        </Col>
      </Row>

      {/* TABLE */}
      <Card title={<Text strong>Daily Supply</Text>} bordered={false}>
        <Spin spinning={loading}>
          <Table
            rowKey="_id"
            columns={columns}
            dataSource={filteredData}
            pagination={false}
            scroll={{ x: 900 }}
          />
        </Spin>

        <Divider />

        <Row justify="end">
          <Col>
            <Title level={5}>💧 {totalLiters} L</Title>
            <Title level={4} style={{ color: "#1677ff" }}>
              ₹ {grandTotal}
            </Title>
          </Col>
        </Row>
      </Card>

      {/* ADD MODAL */}
      <Modal
        title="Add Customer"
        open={open}
        onOk={handleAdd}
        onCancel={() => setOpen(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Customer" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="price" label="Price" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>

      {/* CELL MODAL */}
      <Modal
        title="Update Entry"
        open={cellModal}
        onOk={handleCellSave}
        onCancel={() => setCellModal(false)}
      >
        <Form form={cellForm} layout="vertical">
          <Form.Item name="employee" label="Employee" rules={[{ required: true }]}>
            <Select>
              {employees.map((e) => (
                <Select.Option key={e}>{e}</Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="liter" label="Liter" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DailyChart;