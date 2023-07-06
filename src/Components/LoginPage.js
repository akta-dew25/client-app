import React, { useState, useEffect, useContext } from "react";
import { Form, Input, Button, Typography, message, Modal } from "antd";
import { useNavigate } from "react-router-dom";
import bghero from "../Image/bg-hero.jpg";
import AuthContext from "../ContextApis/login";
import GetStartedSnippet from "./PreviewGetStartedSnippet";
import axios from "axios";

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
  const [subStatus, setSubStatus] = useState(false);
  const [subscriptionDetails, setSubscriptionDetails] = useState(
    props.subscriptionDetails
  );
  const [subId, setSubId] = useState(false);
  console.log(props.subStatus);
  const onFinish = (values) => {
    let customerLogin = {
      fname: values.fname,
      lname: values.lname,
      email: values.email,
      contact: values.contact,
    };
    setCurrentCustomer(customerLogin);
    sessionStorage.setItem("customerLogin", JSON.stringify(customerLogin));
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
    const filterCustomer = subscriptionDetails?.some(
      (cust) => cust.customerEmail === customerLogin.email
    );
    setExistingCustomer(filterCustomer);
    const filterplanId = subscriptionDetails?.some(
      (id) => id.planId === props.selectedPlan
    );

    setPlanIds(filterplanId);
    const filterPriceId = subscriptionDetails?.some(
      (price) =>
        price.priceslabsId === props?.priceId && price.subscriptionStatus
    );

    setPriceSlabId(filterPriceId);

    const subcriptionStatus = subscriptionDetails?.find(
      (substs) =>
        substs.subscriptionStatus === true &&
        substs?.customerEmail === customerLogin.email &&
        substs.priceslabsId === props?.priceId
    );
    console.log(subcriptionStatus?.subscriptionStatus);
    setSubStatus(subcriptionStatus?.subscriptionStatus);

    const subscriptionIds = subscriptionDetails.find(
      (subId) =>
        subId?.subscriptionStatus === true &&
        subId?.customerEmail === customerLogin.email
    );

    console.log(
      subscriptionIds?.subscriptionId,
      "loginsubbssb",
      props.subscriptionDetails,
      props.subscriptionDetails.find(
        (name) => name.customerEmail === customerLogin.email
      ),
      customerLogin.email
    );
    setSubId(subscriptionIds?.subscriptionId);
  };

  const cancelSubscription = async () => {
    try {
      const res = await axios.put(
        `https://ss.api.hutechlabs.com/api/v1/tenant/${props.tenantId}/product/${props.productId}/subscriptions/${subId}`
      );

      const tempSub = [...(subscriptionDetails || [])];
      if (res?.status === 200) {
        const newSubs = tempSub?.map((s) => ({
          ...s,
          subscriptionStatus:
            s?.subscriptionId === subId ? false : s?.subscriptionStatus,
        }));
        setSubscriptionDetails(newSubs);
      } else {
      }
      message.success("Cancelled Subscription");
      setSubcription(false);
    } catch (error) {
      console.log("error", error);
    }
  };

  console.log(
    "existingCustomer",
    existingCustomer,
    // planIds,
    // priceSlabId,
    subStatus
  );

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
                {
                  pattern: /^[a-zA-Z\s]*$/,
                  message: "Please enter valid name",
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
                {
                  pattern: /^[a-zA-Z\s]*$/,
                  message: "Please enter valid name",
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
                  type: "email",
                },
              ]}
              className="customerDetails"
            >
              <Input placeholder="Email Id" type="email" />
            </Form.Item>
            <Form.Item
              name="contact"
              label="Contact No."
              rules={[
                {
                  required: true,
                  message: "Please enter your contact number!",
                  // type: "number",
                },
                {
                  pattern: /^[0-9]\d{9}$/,
                  message: "Please enter valid number",
                },
              ]}
              className="customerDetails"
            >
              <Input placeholder="Contact Number" maxLength={10} />
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
          subStatus
            ? null
            : props.subscriptionDetails?.some((s) => s.subcriptionStatus)
            ? "Upgrade/Downgrade Subscription"
            : "Create Subscription"
          // !existingCustomer && !subStatus
          //   ? "Create Subscriptions"
          //   : !subStatus
          //   ? "Upgrade/Downgrade Subcription"
          //   : null
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
            style={subStatus ? { color: "#000000" } : { color: "#ffffff" }}
          >
            X
          </div>
        }
        className="viewModal"
      >
        {subStatus ? (
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
                width: "152px",
                marginTop: "5rem",
                background:
                  "linear-gradient(121.06deg, #5b92e5 20.17%, #2087c0 95.26%",
                color: "#ffffff",
              }}
              onClick={() => cancelSubscription()}
            >
              Cancel Subscription
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
            subStatus={subStatus}
          />
        )}
      </Modal>
    </>
  );
};

export default LoginPage;
