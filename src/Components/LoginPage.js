import React, { useState } from "react";
import { Form, Input, Button, Typography, message, Modal } from "antd";
import { useNavigate } from "react-router-dom";
import bghero from "../Image/bg-hero.jpg";
import GetStartedSnippet from "./PreviewGetStartedSnippet";

const { Title } = Typography;

const LoginPage = () => {
  const navigate = useNavigate();
  const [subcription, setSubcription] = useState(false);

  const onFinish = (values) => {
    console.log("Received values:", values);
    localStorage.setItem("fname", values.fname);
    localStorage.setItem("lname", values.lname);
    localStorage.setItem("email", values.email);
    localStorage.setItem("contact", values.contact);
    setSubcription(true);
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundImage: `url(${bghero})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div style={{ width: 400 }}>
          <Title level={2} style={{ textAlign: "center", marginBottom: 24 }}>
            Login
          </Title>
          <Form name="login" onFinish={onFinish} layout="vertical">
            <Form.Item
              name="fname"
              label="First Name"
              rules={[
                {
                  required: true,
                  message: "Please enter your first name",
                },
              ]}
            >
              <Input placeholder="First Name" />
            </Form.Item>
            <Form.Item
              name="lname"
              label="Last Name"
              rules={[
                {
                  required: true,
                  message: "Please enter your last name",
                },
              ]}
            >
              <Input placeholder="Last Name" />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                {
                  required: true,
                  message: "Please enter your email!",
                },
              ]}
            >
              <Input placeholder="Email" />
            </Form.Item>
            <Form.Item
              name="contact"
              label="Contact No."
              rules={[
                {
                  required: true,
                  message: "Please enter your password!",
                },
              ]}
            >
              <Input placeholder="Password" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Log in
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
      <Modal
        title={"Create Subcription"}
        footer={null}
        open={subcription}
        onOk={() => setSubcription(false)}
        onCancel={() => setSubcription(false)}
        width={580}
        style={{ borderRadius: "10px" }}
        bodyStyle={{
          overflowX: "hidden",
          // overflowY: "hidden",
          borderRadius: "10px",
          height: "350px",
        }}
        closeIcon={
          <div
            onClick={() => {
              setSubcription(false);
            }}
            style={{ color: "#ffffff" }}
          >
            X
          </div>
        }
        className="viewModal"
      >
        <GetStartedSnippet
          onCancel={() => setSubcription(false)}
          //   previewPlan={previewPlan}
          //   selectedPlan={selectedPlan}
          //   selectedPrice={selectedPrice}
        />
      </Modal>
    </>
  );
};

export default LoginPage;
