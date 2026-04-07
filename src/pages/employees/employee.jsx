import { Card, Table, Button, Modal, Form, Input } from "antd";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../../api";

const Employee = () => {
  const [data, setData] = useState([]);
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // ✅ FETCH
  const fetchData = async () => {
    const res = await fetch("${BASE_URL}/api/employee");
    const result = await res.json();

    console.log("EMP 👉", result);

    setData(result);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, []);

  // ✅ ADD
  const handleAdd = async () => {
    const values = await form.validateFields();

    await fetch("${BASE_URL}/api/employee", {
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

    fetchData();
    form.resetFields();
    setOpen(false);
  };

  // ✅ DELETE
  const handleDelete = async (id) => {
    await fetch(`${BASE_URL}/api/employee/${id}`, {
      method: "DELETE",
    });

    fetchData();
  };

  const columns = [
    {
      title: "ID",
      render: (_, __, i) => i + 1,
    },
    { title: "Name", dataIndex: "name" },
    { title: "Mobile", dataIndex: "phone" },
    { title: "Work", dataIndex: "work" },
    { title: "Salary", dataIndex: "salary" },

    {
      title: "Action",
      render: (_, record) => (
        <>
          <Button
            onClick={() =>
              navigate(`/employee/${record._id}`, { state: record })
            }
          >
            View
          </Button>

          <Button danger onClick={() => handleDelete(record._id)}>
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <Card
        title="Employees"
        extra={<Button onClick={() => setOpen(true)}>+ Add</Button>}
      >
        <Table columns={columns} dataSource={data} rowKey="_id" />
      </Card>

      <Modal open={open} onOk={handleAdd} onCancel={() => setOpen(false)}>
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="phone" label="Mobile">
            <Input />
          </Form.Item>

          <Form.Item name="work" label="Work">
            <Input />
          </Form.Item>

          <Form.Item name="salary" label="Salary">
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Employee;