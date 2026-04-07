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

  // 🔥 FETCH DATA
  const fetchData = async () => {
    const res = await fetch(
      `${BASE_URL}/api/employee/${state._id}`
    );
    const data = await res.json();
    setRecords(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🔥 AUTO SALARY (ONLY ONCE PER MONTH)
  useEffect(() => {
    const addSalary = async () => {
      const monthKey = selectedMonth.format("MM-YYYY");

      const exists = records.find(
        (r) => r.type === "salary" && r.month === monthKey
      );

      if (exists) return;

      await fetch("${BASE_URL}/api/employee", {
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

    if (records.length > 0) {
      addSalary();
    }
  }, [selectedMonth, records]);

  // 🔥 ADD ENTRY
  const handleAdd = async () => {
    if (!amount) return;

    await fetch("${BASE_URL}/api/employee", {
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

    fetchData();
    setAmount("");
  };

  // 🔥 DELETE
  const handleDelete = async (id) => {
    await fetch(`${BASE_URL}/api/employee/${id}`, {
      method: "DELETE",
    });

    fetchData();
  };

  // 🔥 MONTH FILTER
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
    .reduce((sum, r) => sum + r.amount, 0);

  const totalDebit = monthlyData
    .filter((r) => r.type === "debit")
    .reduce((sum, r) => sum + r.amount, 0);

  const balance = totalCredit - totalDebit;

  // 🔥 PDF
  const generateSlip = () => {
    const doc = new jsPDF();

    doc.text("Salary Slip", 20, 20);
    doc.text(`Name: ${state.name}`, 20, 30);
    doc.text(`Month: ${selectedMonth.format("MM-YYYY")}`, 20, 40);

    doc.text(`Salary: ₹${state.salary}`, 20, 55);
    doc.text(`Total Credit: ₹${totalCredit}`, 20, 65);
    doc.text(`Total Debit: ₹${totalDebit}`, 20, 75);
    doc.text(`Final Payable: ₹${balance}`, 20, 85);

    doc.save(`${state.name}-salary-slip.pdf`);
  };

  // 🔥 WATER API (IMPORTANT)
  const getWaterByDate = async (date) => {
    const res = await fetch(
      `${BASE_URL}/api/employee/water/by-date?date=${date.format(
        "DD-MM-YYYY"
      )}&name=${state.name}`
    );

    const data = await res.json();
    setDailyWater(data.total);
  };

  const columns = [
    { title: "Date", dataIndex: "date" },
    {
      title: "Type",
      dataIndex: "type",
      render: (t) => (
        <span
          style={{
            color:
              t === "credit" || t === "salary"
                ? "#52c41a"
                : "#ff4d4f",
            fontWeight: "bold",
          }}
        >
          {t.toUpperCase()}
        </span>
      ),
    },
    { title: "Amount ₹", dataIndex: "amount" },
    {
      title: "Action",
      render: (_, record) => (
        <Button danger onClick={() => handleDelete(record._id)}>
          Delete
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      {/* 🔥 EMPLOYEE INFO */}
      <Card style={{ marginBottom: 20 }}>
        <Title level={4}>{state.name}</Title>
        <Text>📞 {state.phone}</Text> <br />
        <Text>💼 {state.work}</Text> <br />
        <Text strong>Salary: ₹{state.salary}</Text>
      </Card>

      <Row gutter={20}>
        <Col span={16}>
          {/* 🔥 INPUT */}
          <Card style={{ marginBottom: 20 }}>
            <Row gutter={10}>
              <Col>
                <Input
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </Col>

              <Col>
                <Button onClick={() => setType("credit")}>Credit</Button>
              </Col>

              <Col>
                <Button danger onClick={() => setType("debit")}>
                  Debit
                </Button>
              </Col>

              <Col>
                <Button type="primary" onClick={handleAdd}>
                  Add Entry
                </Button>
              </Col>

              <Col>
                <Button onClick={generateSlip}>
                  Salary Slip
                </Button>
              </Col>
            </Row>
          </Card>

          {/* 🔥 MONTH */}
          <Card style={{ marginBottom: 20 }}>
            <DatePicker
              picker="month"
              value={selectedMonth}
              onChange={(val) => setSelectedMonth(val)}
            />
          </Card>

          {/* 🔥 TOTAL */}
          <Row gutter={16}>
            <Col span={8}><Card>Credit ₹{totalCredit}</Card></Col>
            <Col span={8}><Card>Debit ₹{totalDebit}</Card></Col>
            <Col span={8}><Card>Balance ₹{balance}</Card></Col>
          </Row>

          {/* 🔥 MONTH DATA */}
          <Card style={{ marginTop: 20 }}>
            <Table columns={columns} dataSource={monthlyData} rowKey="_id" />
          </Card>

          {/* 🔥 FULL HISTORY */}
          <Card title="Full History" style={{ marginTop: 20 }}>
            <Table columns={columns} dataSource={records} rowKey="_id" />
          </Card>
        </Col>

        {/* 🔥 CALENDAR */}
        <Col span={8}>
          <Card title="Water Calendar">
            <Calendar fullscreen={false} onSelect={getWaterByDate} />
            <Title level={4}>💧 {dailyWater} L</Title>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default EmployeeDetail;