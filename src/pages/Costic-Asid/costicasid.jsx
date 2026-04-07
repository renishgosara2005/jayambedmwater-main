import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Row,
  Col,
} from "antd";
import { useState, useEffect } from "react";
import BASE_URL from "../../api";

const CosticAcid = () => {
  const [costic, setCostic] = useState([]);
  const [acid, setAcid] = useState([]);

  const [formCostic] = Form.useForm();
  const [formAcid] = Form.useForm();

  const [openCostic, setOpenCostic] = useState(false);
  const [openAcid, setOpenAcid] = useState(false);

  // ✅ FETCH DATA
  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await fetch("${BASE_URL}/api/chemical");
    const data = await res.json();

    setCostic(data.filter((i) => i.type === "costic"));
    setAcid(data.filter((i) => i.type === "acid"));
  };

  // ✅ ADD COSTIC
  const handleAddCostic = async () => {
    const values = await formCostic.validateFields();

    await fetch("${BASE_URL}/api/chemical", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "costic",
        bag: values.bag,
        price: Number(values.price),
        date: values.date.format("DD-MM-YYYY"),
      }),
    });

    fetchData();
    formCostic.resetFields();
    setOpenCostic(false);
  };

  // ✅ ADD ACID
  const handleAddAcid = async () => {
    const values = await formAcid.validateFields();

    await fetch("${BASE_URL}/api/chemical", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "acid",
        container: values.container,
        price: Number(values.price),
        date: values.date.format("DD-MM-YYYY"),
      }),
    });

    fetchData();
    formAcid.resetFields();
    setOpenAcid(false);
  };

  // ✅ DELETE
  const handleDelete = async (id) => {
    await fetch(`${BASE_URL}/api/chemical/${id}`, {
      method: "DELETE",
    });
    fetchData();
  };

  // ✅ TOTAL
  const totalCostic = costic.reduce((s, i) => s + i.price, 0);
  const totalAcid = acid.reduce((s, i) => s + i.price, 0);

  // ✅ COLUMNS
  const costicColumns = [
    { title: "Bag", dataIndex: "bag" },
    { title: "Price", dataIndex: "price" },
    { title: "Date", dataIndex: "date" },
    {
      title: "Action",
      render: (_, record) => (
        <Button danger onClick={() => handleDelete(record._id)}>
          Delete
        </Button>
      ),
    },
  ];

  const acidColumns = [
    { title: "Container", dataIndex: "container" },
    { title: "Price", dataIndex: "price" },
    { title: "Date", dataIndex: "date" },
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
      <Row gutter={20}>
        {/* COSTIC */}
        <Col span={12}>
          <Card
            title="COSTIC"
            extra={<Button onClick={() => setOpenCostic(true)}>+ Add</Button>}
          >
            <Table
              dataSource={costic}
              columns={costicColumns}
              rowKey="_id"
            />
            <h3>Total: ₹{totalCostic}</h3>
          </Card>
        </Col>

        {/* ACID */}
        <Col span={12}>
          <Card
            title="ACID"
            extra={<Button onClick={() => setOpenAcid(true)}>+ Add</Button>}
          >
            <Table dataSource={acid} columns={acidColumns} rowKey="_id" />
            <h3>Total: ₹{totalAcid}</h3>
          </Card>
        </Col>
      </Row>

      {/* COSTIC MODAL */}
      <Modal
        open={openCostic}
        onOk={handleAddCostic}
        onCancel={() => setOpenCostic(false)}
      >
        <Form form={formCostic} layout="vertical">
          <Form.Item name="bag" label="Bag" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="price" label="Price" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item name="date" label="Date" rules={[{ required: true }]}>
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>

      {/* ACID MODAL */}
      <Modal
        open={openAcid}
        onOk={handleAddAcid}
        onCancel={() => setOpenAcid(false)}
      >
        <Form form={formAcid} layout="vertical">
          <Form.Item
            name="container"
            label="Container"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="price" label="Price" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item name="date" label="Date" rules={[{ required: true }]}>
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CosticAcid;