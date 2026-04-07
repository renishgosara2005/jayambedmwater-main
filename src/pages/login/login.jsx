import { Card, Form, Input, Button } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../api";

const Login = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const values = await form.validateFields();

      // ✅ API CALL
      const res = await axios.post(
        "${BASE_URL}/api/auth/login",
        values,
      );

      // ✅ Store token
      localStorage.setItem("token", res.data.token);

      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Login Failed ❌");
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: 100 }}>
      <Card style={{ width: 350 }}>
        <h2>Login</h2>

        <Form form={form} layout="vertical">
          <Form.Item name="email" label="Email" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true }]}
          >
            <Input.Password />
          </Form.Item>

          <Button type="primary" block onClick={handleLogin}>
            Login
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
