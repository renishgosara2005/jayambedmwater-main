/* eslint-disable react-hooks/set-state-in-effect */
import {
  Card,
  DatePicker,
  Row,
  Col,
  Typography,
  Table,
  Button,
} from "antd";
import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import BASE_URL from "../../api";

const { Title } = Typography;
const { RangePicker } = DatePicker;

const ProfitLoss = () => {
  const [data, setData] = useState({
    income: 0,
    expense: 0,
    shopping: 0,
    costic: 0,
    acid: 0,
    totalExpense: 0,
    profit: 0,
  });

  const fetchData = async () => {
    const res = await fetch("${BASE_URL}/api/profit");
    const result = await res.json();

    console.log("PROFIT 👉", result);

    setData(result);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const generatePDF = () => {
    const doc = new jsPDF();

    doc.text("Profit & Loss Report", 20, 20);

    doc.text(`Income: ₹${data.income}`, 20, 40);
    doc.text(`Expense: ₹${data.expense}`, 20, 50);
    doc.text(`Shopping: ₹${data.shopping}`, 20, 60);
    doc.text(`Costic: ₹${data.costic}`, 20, 70);
    doc.text(`Acid: ₹${data.acid}`, 20, 80);

    doc.text(`Total Expense: ₹${data.totalExpense}`, 20, 100);
    doc.text(`Profit: ₹${data.profit}`, 20, 110);

    doc.save("profit-loss.pdf");
  };

  const tableData = [
    { name: "Water Income", amount: data.income },
    { name: "Diesel", amount: data.expense },
    { name: "Shopping", amount: data.shopping },
    { name: "Costic", amount: data.costic },
    { name: "Acid", amount: data.acid },
  ];

  const columns = [
    { title: "Type", dataIndex: "name" },
    { title: "Amount ₹", dataIndex: "amount" },
  ];

  return (
    <div style={{ padding: 20 }}>
      <Card>
        <Button onClick={generatePDF}>PDF</Button>
      </Card>

      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Title level={5}>Income</Title>
            <Title level={3} style={{ color: "green" }}>
              ₹{data.income}
            </Title>
          </Card>
        </Col>

        <Col span={8}>
          <Card>
            <Title level={5}>Expense</Title>
            <Title level={3} style={{ color: "red" }}>
              ₹{data.totalExpense}
            </Title>
          </Card>
        </Col>

        <Col span={8}>
          <Card>
            <Title level={5}>Profit</Title>
            <Title
              level={3}
              style={{ color: data.profit >= 0 ? "blue" : "red" }}
            >
              ₹{data.profit}
            </Title>
          </Card>
        </Col>
      </Row>

      <Card style={{ marginTop: 20 }}>
        <Table
          columns={columns}
          dataSource={tableData}
          rowKey="name"
          pagination={false}
        />
      </Card>
    </div>
  );
};

export default ProfitLoss;