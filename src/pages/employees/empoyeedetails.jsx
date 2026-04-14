/* eslint-disable react-hooks/exhaustive-deps */

import {
  Card,
  Button,
  Input,
  Table,
  DatePicker,
  Row,
  Col,
  Typography,
  Calendar,
  Space,
  message,
  Divider,
} from "antd";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import dayjs from "dayjs";
import BASE_URL from "../../api";

const { Title, Text } = Typography;

const EmployeeDetail = () => {
  const { state } = useLocation();

  const [records, setRecords] = useState([]);
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("debit");
  const [selectedMonth, setSelectedMonth] = useState(dayjs());
  const [dailyWater, setDailyWater] = useState(0);
  const [loading, setLoading] = useState(false);

  // 🔥 FETCH DATA
  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `${BASE_URL}/api/employee/${state._id}`
      );
      const data = await res.json();

      setRecords(data);
    } catch {
      message.error("Failed to load ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🔥 AUTO SALARY
  useEffect(() => {
    const addSalary = async () => {
      const monthKey = selectedMonth.format("MM-YYYY");

      const exists = records.find(
        (r) => r.type === "salary" && r.month === monthKey
      );

      if (exists) return;

      await fetch(`${BASE_URL}/api/employee`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employeeId: state._id,
          name: state.name,
          date: selectedMonth.format("DD-MM-YYYY"),
          type: "salary",
          amount: Number(state.salary),
          month: monthKey,
        }),
      });

      fetchData();
    };

    if (records.length > 0) addSalary();
  }, [selectedMonth, records]);

  // 🔥 ADD ENTRY
  const handleAdd = async () => {
    if (!amount) return message.warning("Enter amount");

    await fetch(`${BASE_URL}/api/employee`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        employeeId: state._id,
        name: state.name,
        date: dayjs().format("DD-MM-YYYY"),
        type,
        amount: Number(amount),
        month: selectedMonth.format("MM-YYYY"),
      }),
    });

    message.success("Added ✅");
    setAmount("");
    fetchData();
  };

  // 🔥 DELETE
  const handleDelete = async (id) => {
    await fetch(`${BASE_URL}/api/employee/${id}`, {
      method: "DELETE",
    });

    message.success("Deleted 🗑️");
    fetchData();
  };

  // 🔥 FILTER
  const monthlyData = records.filter((r) => {
    const d = dayjs(r.date, "DD-MM-YYYY");
    return (
      d.month() === selectedMonth.month() &&
      d.year() === selectedMonth.year()
    );
  });

  // 🔥 TOTAL
  const totalCredit = monthlyData
    .filter((r) => r.type === "credit" || r.type === "salary")
    .reduce((s, r) => s + r.amount, 0);

  const totalDebit = monthlyData
    .filter((r) => r.type === "debit")
    .reduce((s, r) => s + r.amount, 0);

  const balance = totalCredit - totalDebit;

  // 🔥 PDF
  const generateSlip = () => {
    const doc = new jsPDF();

    doc.text("Salary Slip", 20, 20);
    doc.text(`Name: ${state.name}`, 20, 30);
    doc.text(`Month: ${selectedMonth.format("MM-YYYY")}`, 20, 40);
    doc.text(`Salary: ₹${state.salary}`, 20, 55);
    doc.text(`Credit: ₹${totalCredit}`, 20, 65);
    doc.text(`Debit: ₹${totalDebit}`, 20, 75);
    doc.text(`Balance: ₹${balance}`, 20, 85);

    doc.save(`${state.name}.pdf`);
  };

  // 🔥 WATER
  const getWaterByDate = async (date) => {
    const res = await fetch(
      `${BASE_URL}/api/employee/water/by-date?date=${date.format(
        "DD-MM-YYYY"
      )}&name=${state.name}`
    );

    const data = await res.json();
    setDailyWater(data.total || 0);
  };

  const columns = [
    { title: "Date", dataIndex: "date" },
    {
      title: "Type",
      dataIndex: "type",
      render: (t) => (
        <Text strong style={{ color: t === "debit" ? "red" : "green" }}>
          {t.toUpperCase()}
        </Text>
      ),
    },
    { title: "Amount ₹", dataIndex: "amount" },
    {
      title: "Action",
      render: (_, r) => (
        <Button danger size="small" onClick={() => handleDelete(r._id)}>
          Delete
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: 10 }}>
      {/* HEADER */}
      <Card style={{ marginBottom: 10 }}>
        <Title level={4}>{state.name}</Title>
        <Text>📞 {state.phone}</Text><br />
        <Text>💼 {state.work}</Text><br />
        <Text strong>Salary ₹{state.salary}</Text>
      </Card>

      <Row gutter={[10, 10]}>
        {/* LEFT */}
        <Col xs={24} md={16}>
          {/* INPUT */}
          <Card style={{ marginBottom: 10 }}>
            <Space wrap>
              <Input
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />

              <Button onClick={() => setType("credit")}>Credit</Button>
              <Button danger onClick={() => setType("debit")}>
                Debit
              </Button>

              <Button type="primary" onClick={handleAdd}>
                Add
              </Button>

              <Button onClick={generateSlip}>
                PDF
              </Button>
            </Space>
          </Card>

          {/* MONTH */}
          <Card style={{ marginBottom: 10 }}>
            <DatePicker
              picker="month"
              value={selectedMonth}
              onChange={setSelectedMonth}
            />
          </Card>

          {/* TOTAL */}
          <Row gutter={10}>
            <Col xs={24} sm={8}><Card>Credit ₹{totalCredit}</Card></Col>
            <Col xs={24} sm={8}><Card>Debit ₹{totalDebit}</Card></Col>
            <Col xs={24} sm={8}><Card>Balance ₹{balance}</Card></Col>
          </Row>

          <Divider />

          {/* TABLE */}
          <Card title="Monthly Data">
            <Table columns={columns} dataSource={monthlyData} rowKey="_id" loading={loading} />
          </Card>

          <Card title="Full History" style={{ marginTop: 10 }}>
            <Table columns={columns} dataSource={records} rowKey="_id" />
          </Card>
        </Col>

        {/* RIGHT */}
        <Col xs={24} md={8}>
          <Card title="Water">
            <Calendar fullscreen={false} onSelect={getWaterByDate} />
            <Title level={4}>💧 {dailyWater} L</Title>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default EmployeeDetail;