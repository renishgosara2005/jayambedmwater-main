import { Layout, Menu, Avatar, Dropdown } from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  // SettingOutlined,
  LineChartOutlined,
  ExperimentOutlined, // ✅ FIXED ICON
} from "@ant-design/icons";

import { Outlet, useNavigate } from "react-router-dom";

const { Header, Sider, Content } = Layout;

const AppLayout = () => {
  const navigate = useNavigate();

  const menuItems = [
    { key: "/Dashboard", icon: <DashboardOutlined />, label: "Dashboard" },
    { key: "/daily-chart", icon: <LineChartOutlined />, label: "Daily Chart" },
    { key: "/customers", icon: <UserOutlined />, label: "Customers" },
    { key: "/employee", icon: <UserOutlined />, label: "Employees" },
    { key: "/Shopping", icon: <ShoppingCartOutlined />, label: "Plumbbing" },
    { key: "/expense", icon: <DollarOutlined />, label: "Dielse" },
    { key: "/Profit-Loss", icon: <DollarOutlined />, label: "Profit & Loss" },
    { key: "/costic-asid", icon: <ExperimentOutlined />, label: "Costic-Asid" },
    { key: "/reports", icon: <DashboardOutlined />, label: "Water Tanks" },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* 🔥 SIDEBAR */}
      <Sider width={220}>
        <h2
          style={{
            color: "#fff",
            textAlign: "center",
            padding: 18,
            margin: 0,
            fontWeight: "bold",
          }}
        >
          JayAmbedmWater
        </h2>

        <Menu
          theme="dark"
          mode="inline"
          items={menuItems}
          onClick={(e) => navigate(e.key)}
        />
      </Sider>

      <Layout>
        {/* 🔥 HEADER */}
        <Header
          style={{
            background: "#fff",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            paddingRight: 20,
          }}
        >
          <Dropdown
            menu={{
              items: [
                { key: "1", label: "Profile" },
                { key: "2", label: "Logout" },
              ],
            }}
          >
            <Avatar style={{ cursor: "pointer" }}>R</Avatar>
          </Dropdown>
        </Header>

        {/* 🔥 CONTENT */}
        <Content style={{ margin: 20 }}>
          <div
            style={{
              padding: 20,
              background: "#fff",
              borderRadius: 10,
            }}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;