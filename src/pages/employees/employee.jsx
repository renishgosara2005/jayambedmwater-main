/* eslint-disable react-hooks/set-state-in-effect */

import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Row,
  Col,
  Typography,
  Space,
  Popconfirm,
  message,
} from "antd";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../../api";

const { Title } = Typography;

const Employee = () => {
  const [data, setData] = useState([]);
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // ✅ FETCH
  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${BASE_URL}/api/employee`);
      const result = await res.json();

      setData(result);
    } catch (err) {
      message.error("Failed to load data ❌");
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

      await fetch(`${BASE_URL}/api/employee`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.name,
          phone: values.phone,
          work: values.work,
          salary: Number(values.salary),
        }),
      });

      message.success("Employee Added ✅");

      fetchData();
      form.resetFields();
      setOpen(false);
    } catch {
      message.error("Failed ❌");
    }
  };

  // ✅ DELETE
  const handleDelete = async (id) => {
    await fetch(`${BASE_URL}/api/employee/${id}`, {
      method: "DELETE",
    });

    message.success("Deleted 🗑️");
    fetchData();
  };

  // ✅ TABLE
  const columns = [
    {
      title: "ID",
      width: 60,
      render: (_, __, i) => i + 1,
    },
    { title: "Name", dataIndex: "name" },
    { title: "Mobile", dataIndex: "phone" },
    { title: "Work", dataIndex: "work" },
    {
      title: "Salary",
      dataIndex: "salary",
      render: (val) => `₹ ${val}`,
    },
    {
      title: "Action",
      render: (_, record) => (
        <Space wrap>
          <Button
            type="primary"
            size="small"
            onClick={() =>
              navigate(`/employee/${record._id}`, { state: record })
            }
          >
            View
          </Button>

          <Popconfirm
            title="Delete employee?"
            onConfirm={() => handleDelete(record._id)}
          >
            <Button danger size="small">
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 10 }}>
      {/* 🔥 HEADER */}
      <Row gutter={[10, 10]} style={{ marginBottom: 12 }}>
        <Col xs={24} sm={12} md={8}>
          <Title level={4}>👨‍💼 Employees</Title>
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Button
            type="primary"
            block
            onClick={() => setOpen(true)}
          >
            + Add Employee
          </Button>
        </Col>
      </Row>

      {/* 🔥 TABLE CARD */}
      <Card
        bordered={false}
        style={{ borderRadius: 12 }}
      >
        <Table
          columns={columns}
          dataSource={data}
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 5 }}
          scroll={{ x: 600 }}
        />
      </Card>

      {/* 🔥 MODAL */}
      <Modal
        title="Add Employee"
        open={open}
        onOk={handleAdd}
        onCancel={() => setOpen(false)}
        okText="Add"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input placeholder="Enter name" />
          </Form.Item>

          <Form.Item name="phone" label="Mobile">
            <Input placeholder="Enter mobile number" />
          </Form.Item>

          <Form.Item name="work" label="Work">
            <Input placeholder="Work type" />
          </Form.Item>

          <Form.Item name="salary" label="Salary">
            <Input type="number" placeholder="Salary" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Employee;