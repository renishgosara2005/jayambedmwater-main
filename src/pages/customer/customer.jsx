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
} from "antd";
import { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import BASE_URL from "../../api";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

const Customers = () => {
  const [data, setData] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [dateRange, setDateRange] = useState([]);
  const [editing, setEditing] = useState(null);

  const [form] = Form.useForm();

  // 🔥 LOAD DATA (API VERSION)
  useEffect(() => {
    fetch("${BASE_URL}/api/daily-chart")
      .then((res) => res.json())
      .then((parsed) => {
        let finalData = [];

        parsed.forEach((item) => {
          for (let i = 1; i <= 7; i++) {
            const liter = item[`q${i}`];
            const emp = item[`q${i}_emp`];

            if (liter > 0) {
              finalData.push({
                key: `${item._id}-${i}`,
                parentId: item._id,
                field: `q${i}`,
                name: item.name,
                employee: emp,
                liter: liter,
                amount: liter * item.price,
                date: item.date,
              });
            }
          }
        });

        setData(finalData);
      })
      .catch((err) => console.log(err));
  }, []);

  // 🔥 FILTER (UNCHANGED)
  const filteredData = data.filter((item) => {
    const matchName = item.name
      ?.toLowerCase()
      .includes(searchName.toLowerCase());

    let matchDate = true;

    if (dateRange && dateRange.length === 2) {
      const itemDate = dayjs(item.date, "DD-MM-YYYY");

      matchDate =
        itemDate.isSame(dateRange[0], "day") ||
        itemDate.isSame(dateRange[1], "day") ||
        (itemDate.isAfter(dateRange[0]) &&
          itemDate.isBefore(dateRange[1]));
    }

    return matchName && matchDate;
  });

  // 🔥 DELETE (API VERSION)
  const handleDelete = async (record) => {
    await fetch(
      `${BASE_URL}/api/daily-chart/${record.parentId}`,
      {
        method: "DELETE",
      }
    );

    setData((prev) => prev.filter((d) => d.key !== record.key));
  };

  // 🔥 EDIT OPEN (UNCHANGED)
  const handleEdit = (record) => {
    setEditing(record);
    form.setFieldsValue({
      name: record.name,
      employee: record.employee,
      liter: record.liter,
    });
  };

  // 🔥 EDIT SAVE (API VERSION)
  const handleSave = async () => {
    const values = await form.validateFields();

    await fetch(
      `${BASE_URL}/api/daily-chart/${editing.parentId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.name,
          [editing.field]: Number(values.liter),
          [`${editing.field}_emp`]: values.employee,
        }),
      }
    );

    window.location.reload();
  };

  // 🔥 PDF (UNCHANGED)
  const generatePDF = () => {
    const doc = new jsPDF();

    doc.text("Customer Report", 20, 20);

    let y = 30;

    filteredData.forEach((item, i) => {
      doc.text(
        `${i + 1}. ${item.name} - ${item.employee} - ${item.liter}L`,
        20,
        y
      );
      y += 10;
    });

    doc.save("customer-report.pdf");
  };

  // 🔥 TABLE (UNCHANGED)
  const columns = [
    { title: "Customer", dataIndex: "name" },
    { title: "Employee", dataIndex: "employee" },
    { title: "Liter", dataIndex: "liter" },
    { title: "Date", dataIndex: "date" },

    {
      title: "Action",
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => handleEdit(record)}>
            Edit
          </Button>

          <Button danger type="link" onClick={() => handleDelete(record)}>
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <Card title="Customer Report">
        <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
          <Input
            placeholder="Search customer..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />

          <RangePicker onChange={(dates) => setDateRange(dates)} />

          <Button type="primary" onClick={generatePDF}>
            Download PDF
          </Button>
        </div>

        <Table columns={columns} dataSource={filteredData} />
      </Card>

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