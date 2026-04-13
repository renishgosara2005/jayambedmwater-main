import { Layout, Menu, Avatar, Dropdown, Button } from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  LineChartOutlined,
  ExperimentOutlined,
  MenuOutlined,
} from "@ant-design/icons";

import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

const { Header, Sider, Content } = Layout;

const AppLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // 📱 SCREEN DETECT
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 992) {
        setMobile(false);
        setCollapsed(true); // tablet → icon only
      } else {
        setMobile(false);
        setCollapsed(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
      <Sider
        collapsible={!mobile}
        collapsed={collapsed}
        trigger={null}
        width={220}
        collapsedWidth={mobile ? 0 : 80}
        style={{
          position: mobile ? "fixed" : "relative",
          zIndex: 1000,
          height: "100vh",
        }}
      >
        {/* LOGO */}
        <h2
          style={{
            color: "#fff",
            textAlign: "center",
            padding: 18,
            margin: 0,
            fontSize: collapsed ? 14 : 18,
          }}
        >
          {collapsed ? "JW" : "JayAmbedmWater"}
        </h2>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]} // ✅ ACTIVE HIGHLIGHT
          items={menuItems}
          onClick={(e) => {
            navigate(e.key);
            if (mobile) setDrawerOpen(false);
          }}
        />
      </Sider>

      <Layout>
        {/* 🔥 HEADER */}
        <Header
          style={{
            background: "#fff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0 20px",
          }}
        >
          {/* 📱 MOBILE MENU BUTTON */}
          {mobile && (
            <Button
              icon={<MenuOutlined />}
              onClick={() => setDrawerOpen(!drawerOpen)}
            />
          )}

          {/* 👤 USER */}
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
        <Content style={{ margin: 16 }}>
          <div
            style={{
              padding: 16,
              background: "#fff",
              borderRadius: 10,
              minHeight: "80vh",
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
