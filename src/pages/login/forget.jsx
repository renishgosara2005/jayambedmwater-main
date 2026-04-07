import { Card, Form, Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../api";

const ForgotPassword = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      // 🔥 API CALL
      const res = await axios.post(
        "${BASE_URL}/api/auth/forgot-password",
        values
      );

      message.success(res.data.message || "Reset link sent!");

      form.resetFields();

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      console.log(err);
      message.error(
        err.response?.data?.message || "Something went wrong"
      );
    }
  };

  return (
    <div className="forgot-container">
      <h1 className="title">Forgot Password</h1>

      <Card className="forgot-card">
        <p className="subtitle">
          Enter your email to receive a reset link
        </p>

        <Form form={form} layout="vertical">
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Enter email" },
              { type: "email", message: "Invalid email" },
            ]}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>

          <Button type="primary" block onClick={handleSubmit}>
            Send Reset Link
          </Button>

          <Button
            style={{ marginTop: 10 }}
            block
            onClick={() => navigate("/")}
          >
            Back to Login
          </Button>
        </Form>
      </Card>

      <style>{`
        .forgot-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background: #f0f2f5;
          padding: 20px;
        }

        .title {
          margin-bottom: 20px;
          color: #0E87CC;
        }

        .forgot-card {
          width: 100%;
          max-width: 400px;
          border-radius: 12px;
          box-shadow: 0 8px 20px rgba(0,0,0,0.1);
        }

        .subtitle {
          margin-bottom: 15px;
          color: gray;
        }

        @media (max-width: 480px) {
          .forgot-card {
            max-width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default ForgotPassword;