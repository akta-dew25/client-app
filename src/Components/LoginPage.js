import React, { useState, useEffect, useContext } from "react";
import { Form, Input, Button, Typography, message, Modal } from "antd";
import { useNavigate } from "react-router-dom";
import bghero from "../Image/bg-hero.jpg";
import AuthContext from "../ContextApis/login";
import GetStartedSnippet from "./PreviewGetStartedSnippet";

const { Title } = Typography;

const LoginPage = (props) => {
  const loginctx = useContext(AuthContext);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [subcription, setSubcription] = useState(false);
  const [planIds, setPlanIds] = useState();
  const [currentCustomer, setCurrentCustomer] = useState({});
  const [existingCustomer, setExistingCustomer] = useState(false);
  const [priceSlabId, setPriceSlabId] = useState(false);
  console.log(props.subStatus);
  const onFinish = (values) => {
    let customerLogin = {
      fname: values.fname,
      lname: values.lname,
      email: values.email,
      contact: values.contact,
    };
    setCurrentCustomer(customerLogin);
    localStorage.setItem("customerLogin", JSON.stringify(customerLogin));
    loginctx.setisLogin(true);
    message.success("Login Successfully");
    form.resetFields();
    props.setCustomerLogin(false);
    getFilterCustomer(customerLogin);

    setSubcription(true);
    props.getAllCustomer();
    // window.location.reload();
  };

  const getFilterCustomer = (customerLogin) => {
    const filterCustomer = props?.subscriptionDetails?.some(
      (cust) => cust.customerEmail === customerLogin.email
    );
    setExistingCustomer(filterCustomer);
    const filterplanId = props?.subscriptionDetails?.some(
      (id) => id.planId === props.selectedPlan
    );

    setPlanIds(filterplanId);
    const filterPriceId = props?.subscriptionDetails?.some(
      (price) => price.priceslabsId === props?.priceId
    );

    setPriceSlabId(filterPriceId);
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundImage: `url(${bghero})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div style={{ width: 400 }}>
          <Title level={2} style={{ textAlign: "center", marginBottom: 24 }}>
            Login
          </Title>
          <Form name="login" onFinish={onFinish} layout="vertical" form={form}>
            <Form.Item
              name="fname"
              label="First Name"
              rules={[
                {
                  required: true,
                  message: "Please enter your first name",
                },
              ]}
              className="customerDetails"
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
              className="customerDetails"
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
              className="customerDetails"
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
              className="customerDetails"
            >
              <Input placeholder="Password" />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                style={{ fontSize: "14px", fontWeight: "500" }}
              >
                Log in
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
      <Modal
        title={
          existingCustomer && (planIds || !priceSlabId || !props.subStatus)
            ? "Upgrade/Downgrade Subcription"
            : planIds && existingCustomer && priceSlabId && props.subStatus
            ? null
            : "Create Subscriptions"
        }
        footer={null}
        open={subcription}
        onOk={() => setSubcription(false)}
        onCancel={() => setSubcription(false)}
        width={580}
        style={{ borderRadius: "10px" }}
        bodyStyle={
          existingCustomer
            ? {
                overflowX: "hidden",
                // overflowY: "hidden",
                borderRadius: "10px",
                height: "350px",
                padding: "2rem",
              }
            : {
                overflowX: "hidden",
                // overflowY: "hidden",
                borderRadius: "10px",
                height: "350px",
                padding: "2rem",
              }
        }
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
        {existingCustomer && planIds && priceSlabId && props.subStatus ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <h1> Dear Customer, Your plan is not due for renewal right now.</h1>

            <Button
              style={{
                width: "97px",
                marginTop: "5rem",
                background:
                  "linear-gradient(121.06deg, #5b92e5 20.17%, #2087c0 95.26%",
                color: "#ffffff",
              }}
              onClick={() => setSubcription(false)}
            >
              Ok
            </Button>
          </div>
        ) : (
          <GetStartedSnippet
            onCancel={() => setSubcription(false)}
            getAllCustomer={props.getAllCustomer}
            customerLogin={currentCustomer}
            previewPlan={props.previewPlan}
            selectedPlan={props.selectedPlan}
            selectedPrice={props.selectedPrice}
            subscriptionDetails={props?.subscriptionDetails}
            tenantId={props.tenantId}
            productId={props.productId}
            subId={props?.subId}
            priceSlabId={priceSlabId}
            planIds={planIds}
            existingCustomer={existingCustomer}
            subStatus={props.subStatus}
          />
        )}
      </Modal>
    </>
  );
};

export default LoginPage;
