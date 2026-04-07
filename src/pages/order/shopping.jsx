/* eslint-disable no-unused-vars */
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
} from "antd";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import jsPDF from "jspdf";
import BASE_URL from "../../api";

const { RangePicker } = DatePicker;

const Shopping = () => {
  const [data, setData] = useState([]);
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState([]);

  // FETCH DATA
  const fetchData = async () => {
    const res = await fetch("${BASE_URL}/api/shopping");
    const result = await res.json();
    setData(result);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, []);

  // ADD / UPDATE
  const handleSubmit = async () => {
    const values = await form.validateFields();

    if (editing) {
      await fetch(`${BASE_URL}/api/shopping/${editing._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          supplier: values.supplier,
          price: Number(values.price),
          date: values.date.format("DD-MM-YYYY"),
        }),
      });
    } else {
      await fetch("${BASE_URL}/api/shopping", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.name,
          supplier: values.supplier,
          price: Number(values.price),
          date: values.date.format("DD-MM-YYYY"),
        }),
      });
    }

    fetchData();
    form.resetFields();
    setOpen(false);
    setEditing(null);
  };

  // DELETE
  const handleDelete = async (id) => {
    await fetch(`${BASE_URL}/api/shopping/${id}`, {
      method: "DELETE",
    });

    fetchData();
  };

  // EDIT
  const handleEdit = (record) => {
    setEditing(record);
    form.setFieldsValue({
      ...record,
      date: dayjs(record.date, "DD-MM-YYYY"),
    });
    setOpen(true);
  };

  // FILTER
  const filteredData = data.filter((item) => {
    const matchSearch =
      item.name?.toLowerCase().includes(search.toLowerCase()) ||
      item.supplier?.toLowerCase().includes(search.toLowerCase());

    let matchDate = true;

    if (dateRange.length === 2) {
      const d = dayjs(item.date, "DD-MM-YYYY");
      matchDate =
        d.isAfter(dateRange[0]) && d.isBefore(dateRange[1]);
    }

    return matchSearch && matchDate;
  });

  const total = filteredData.reduce((sum, i) => sum + i.price, 0);

  const columns = [
    { title: "ID", render: (_, __, i) => i + 1 },
    { title: "Item", dataIndex: "name" },
    { title: "Supplier", dataIndex: "supplier" },
    { title: "Price", dataIndex: "price" },
    { title: "Date", dataIndex: "date" },
    {
      title: "Action",
      render: (_, r) => (
        <>
          <Button onClick={() => handleEdit(r)}>Edit</Button>
          <Button danger onClick={() => handleDelete(r._id)}>
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <Card
        title="Shopping"
        extra={<Button onClick={() => setOpen(true)}>+ Add</Button>}
      >
        <div style={{ display: "flex", gap: 10 }}>
          <Input
            placeholder="Search"
            onChange={(e) => setSearch(e.target.value)}
          />
          <RangePicker onChange={(d) => setDateRange(d)} />
        </div>

        <h3>Total ₹{total}</h3>

        <Table columns={columns} dataSource={filteredData} rowKey="_id" />
      </Card>

      <Modal open={open} onOk={handleSubmit} onCancel={() => setOpen(false)}>
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