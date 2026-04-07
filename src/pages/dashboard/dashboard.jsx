import { Card, Row, Col } from "antd";
import {
  UserOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
} from "@ant-design/icons";

const Dashboard = () => {
  // 🔥 Stats data
  const stats = [
    {
      title: "Total Users",
      value: 120,
      icon: <UserOutlined style={{ fontSize: 24 }} />,
    },
    {
      title: "Total Orders",
      value: 80,
      icon: <ShoppingCartOutlined style={{ fontSize: 24 }} />,
    },
    {
      title: "Revenue",
      value: "₹12,000",
      icon: <DollarOutlined style={{ fontSize: 24 }} />,
    },
  ];

  return (
    <div style={{ padding: 20, background: "#f5f5f5", minHeight: "100vh" }}>
      
      {/* 🔥 Title */}
      <h1
        style={{
          fontSize: 24,
          fontWeight: "bold",
          marginBottom: 20,
          color: "#000",
        }}
      >
        Admin Dashboard
      </h1>

      {/* 🔥 Stats Cards */}
      <Row gutter={16}>
        {stats.map((item, index) => (
          <Col span={8} key={index}>
            <Card style={{ borderRadius: 10 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <p style={{ color: "gray" }}>{item.title}</p>
                  <h2 style={{ fontSize: 20 }}>{item.value}</h2>
                </div>
                <div style={{ color: "#1677ff" }}>{item.icon}</div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

    </div>
  );
};

export default Dashboard;