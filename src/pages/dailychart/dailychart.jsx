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

  const employees = ["Manveer kaka", "Vijay", "Bhano", "--"];

  // ✅ FETCH
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch(API);
      const result = await res.json();
      setData(result.data || []);
    } catch {
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
    setFilteredData(data.filter((i) => i.date === dateStr));
  }, [selectedDate, data]);

  // ✅ ADD
  const handleAdd = async () => {
    const values = await form.validateFields();

    await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
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
      }),
    });

    message.success("Added ✅");
    setOpen(false);
    form.resetFields();
    fetchData();
  };

  // ✅ DELETE
  const handleDelete = async (id) => {
    await fetch(`${API}/${id}`, { method: "DELETE" });
    fetchData();
  };

  // ✅ CELL SAVE
  const handleCellSave = async () => {
    const values = await cellForm.validateFields();

    const updated = {
      ...selectedCell.record,
      [selectedCell.field]: Number(values.liter),
      [`${selectedCell.field}_emp`]: values.employee,
    };

    await fetch(`${API}/${updated._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });

    message.success("Updated ✅");
    setCellModal(false);
    fetchData();
  };

  const getColumn = (num) => ({
    title: num,
    align: "center",
    render: (_, r) => (
      <div
        onClick={() => {
          setSelectedCell({ record: r, field: `q${num}` });
          setCellModal(true);
        }}
      >
        <b>{r[`q${num}`] || 0} L</b>
        <div style={{ fontSize: 11 }}>{r[`q${num}_emp`] || "-"}</div>
      </div>
    ),
  });

  // ✅ TOTAL
  const totalLiters = filteredData.reduce(
    (s, i) =>
      s +
      (i.q1 || 0) +
      (i.q2 || 0) +
      (i.q3 || 0) +
      (i.q4 || 0) +
      (i.q5 || 0) +
      (i.q6 || 0) +
      (i.q7 || 0),
    0,
  );

  const grandTotal = filteredData.reduce((s, i) => {
    const qty =
      (i.q1 || 0) +
      (i.q2 || 0) +
      (i.q3 || 0) +
      (i.q4 || 0) +
      (i.q5 || 0) +
      (i.q6 || 0) +
      (i.q7 || 0);
    return s + qty * (i.price || 0);
  }, 0);

  const columns = [
    { title: "Name", dataIndex: "name" },
    getColumn(1),
    getColumn(2),
    getColumn(3),
    getColumn(4),
    getColumn(5),
    getColumn(6),
    getColumn(7),

    // 🔥 TOTAL COLUMN FIX
    {
      title: "Total ₹",
      render: (_, r) => {
        const qty =
          (r.q1 || 0) +
          (r.q2 || 0) +
          (r.q3 || 0) +
          (r.q4 || 0) +
          (r.q5 || 0) +
          (r.q6 || 0) +
          (r.q7 || 0);
        return <b>₹ {qty * (r.price || 0)}</b>;
      },
    },

    {
      title: "Action",
      render: (_, r) => (
        <Button danger onClick={() => handleDelete(r._id)}>
          Delete
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: 10 }}>
      <Row gutter={[10, 10]}>
        <Col xs={24} md={6}>
          <DatePicker
            value={selectedDate}
            onChange={setSelectedDate}
            style={{ width: "100%" }}
          />
        </Col>

        <Col xs={24} md={6}>
          <Button type="primary" block onClick={() => setOpen(true)}>
            + Add Customer
          </Button>
        </Col>
      </Row>

      <Card title="Daily Supply" style={{ marginTop: 10 }}>
        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={filteredData}
            rowKey="_id"
            pagination={false}
            scroll={{ x: 900 }}
          />
        </Spin>

        <Divider />

        <Row gutter={10}>
          <Col xs={24} md={12}>
            <Card>💧 {totalLiters} L</Card>
          </Col>

          <Col xs={24} md={12}>
            <Card>₹ {grandTotal}</Card>
          </Col>
        </Row>
      </Card>

      <Modal open={open} onOk={handleAdd} onCancel={() => setOpen(false)}>
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Customer" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="price" label="Price" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        open={cellModal}
        onOk={handleCellSave}
        onCancel={() => setCellModal(false)}
      >
        <Form form={cellForm} layout="vertical">
          <Form.Item
            name="employee"
            label="Employee"
            rules={[{ required: true }]}
          >
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
