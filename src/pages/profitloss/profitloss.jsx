/* eslint-disable react-hooks/set-state-in-effect */
import { Card, Row, Col, Typography, Table, Button, message, Spin } from "antd";
import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import BASE_URL from "../../api";

const { Title, Text } = Typography;

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

  const [loading, setLoading] = useState(false);

  // ✅ FETCH DATA (FIXED)
  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${BASE_URL}/api/profit`);
      const result = await res.json();

      console.log("PROFIT 👉", result);

      setData(result || {});
    } catch (err) {
      message.error("API Error ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ✅ PDF
  const generatePDF = () => {
    const doc = new jsPDF();

    doc.text("Profit & Loss Report", 20, 20);

    doc.text(`Income: ₹${data.income}`, 20, 40);
    doc.text(`Expense: ₹${data.totalExpense}`, 20, 50);
    doc.text(`Profit: ₹${data.profit}`, 20, 60);

    doc.save("profit-loss.pdf");
  };

  // ✅ TABLE DATA
  const tableData = [
    { name: "Water Income", amount: data.income },
    { name: "Diesel Expense", amount: data.expense },
    { name: "Shopping", amount: data.shopping },
    { name: "Costic", amount: data.costic },
    { name: "Acid", amount: data.acid },
  ];

  const columns = [
    {
      title: "Type",
      dataIndex: "name",
      render: (t) => <Text strong>{t}</Text>,
    },
    {
      title: "Amount ₹",
      render: (_, r) => (
        <Text strong style={{ color: "#1677ff" }}>
          ₹ {r.amount || 0}
        </Text>
      ),
    },
  ];

  return (
    <div style={{ padding: 10 }}>
      {/* HEADER */}
      <Card
        style={{ marginBottom: 12 }}
        extra={
          <Button type="primary" onClick={generatePDF}>
            Download PDF
          </Button>
        }
      >
        <Title level={4}>📊 Profit & Loss</Title>
      </Card>

      {/* SUMMARY CARDS */}
      <Spin spinning={loading}>
        <Row gutter={[10, 10]}>
          <Col xs={24} sm={12} md={8}>
            <Card>
              <Text>Income</Text>
              <Title level={3} style={{ color: "green" }}>
                ₹ {data.income}
              </Title>
            </Card>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Card>
              <Text>Expense</Text>
              <Title level={3} style={{ color: "red" }}>
                ₹ {data.totalExpense}
              </Title>
            </Card>
          </Col>

          <Col xs={24} sm={24} md={8}>
            <Card>
              <Text>Profit</Text>
              <Title
                level={3}
                style={{
                  color: data.profit >= 0 ? "#1677ff" : "red",
                }}
              >
                ₹ {data.profit}
              </Title>
            </Card>
          </Col>
        </Row>

        {/* TABLE */}
        <Card style={{ marginTop: 15 }}>
          <Table
            columns={columns}
            dataSource={tableData}
            rowKey="name"
            pagination={false}
            scroll={{ x: 400 }} // mobile fix
          />
        </Card>
      </Spin>
    </div>
  );
};

export default ProfitLoss;
