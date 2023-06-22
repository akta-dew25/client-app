import React, { useEffect, useState } from "react";
import { Form, Input, Col, Button, Row, Spin, message } from "antd";
import axios from "axios";

const GetStartedSnippet = (props) => {
  const [form] = Form.useForm();
  const TenantId = JSON.parse(localStorage.getItem("TENANT_ID"));
  const productId = JSON.parse(localStorage.getItem("productIds"));
  console.log("eeeee", productId, TenantId);
  const [isLoading, setIsLoading] = useState(false);
  let array = props?.previewPlan?.find(
    (id) => id?.planId === props?.selectedPlan
  );
  let priceSlab = array?.response?.find(
    (priceId) => priceId?.periodInText === props?.selectedPrice
  );

  const onFinish = async (values) => {
    setIsLoading(true);
    let subcriptionData = {
      firstname: values.firstname,
      lastname: values.lastname,
      email: values.email,
      contactNumber: values.contactNumber,
      subscriptionDto: {
        planId: props.selectedPlan,
        priceSlabId: priceSlab.priceSlabId,
      },
    };

    try {
      let response = await axios.post(
        `https://ss.api.hutechlabs.com/api/v1/tenants/${TenantId}/products/${productId}/subscription`,
        subcriptionData
      );
      setIsLoading(false);
      props.onCancel();
      form.resetFields();
      message.success("Subcription Created Sucessfully");
    } catch (error) {
      console.log("error");
    }
  };
  useEffect(() => {
    form.setFieldsValue({
      firstname: localStorage.getItem("fname"),
      lastname: localStorage.getItem("lname"),
      email: localStorage.getItem("email"),
      contactNumber: localStorage.getItem("contact"),
      subscriptionDto: {
        planId: array?.planTitle,
        priceSlabId:
          priceSlab?.periodInText?.charAt(0).toUpperCase() +
          priceSlab?.periodInText?.slice(1),
      },
    });
  }, [props.selectedPlan]);

  if (isLoading) {
    return (
      <div
        style={{
          height: "70vh",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Spin
          size="large"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            margin: "-10px",
            zIndex: "100",
            opacity: "0.7",
            backgroundColor: "transparent",
          }}
        />
      </div>
    );
  }
  return (
    <>
      <div>
        <Form
          form={form}
          layout="vertical"
          name="form_in_modal"
          onFinish={onFinish}
        >
          <Row gutter={[16, 0]}>
            <Col xs={24} sm={24} md={24} lg={12}>
              <Form.Item
                name="firstname"
                label="First Name"
                rules={[
                  { required: true, message: "Please input first name!" },
                ]}
                className="my-form"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12}>
              <Form.Item
                name="lastname"
                label="Last Name"
                rules={[{ required: true, message: "Please input last name!" }]}
                className="my-form"
              >
                <Input />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={24} lg={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Please input email address!" },
                  {
                    type: "email",
                    message: "Please input a valid email address!",
                  },
                ]}
                className="my-form"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12}>
              <Form.Item
                name="contactNumber"
                label="Contact Number"
                rules={[
                  { required: true, message: "Please input contact number!" },
                  {
                    pattern: /^[0-9]{10}$/,
                    message: "Please input valid phone number!",
                  },
                ]}
                className="my-form"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12}>
              <Form.Item
                name={["subscriptionDto", "planId"]}
                label="Plan "
                rules={[
                  { required: true, message: "Please select a plan ID!" },
                ]}
                className="my-form"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12}>
              <Form.Item
                name={["subscriptionDto", "priceSlabId"]}
                label="Price Slab "
                rules={[
                  { required: true, message: "Please select a price slab ID!" },
                ]}
                className="my-form"
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16} justify="end">
            <Col>
              <Button onClick={props.onCancel}>Cancel</Button>
            </Col>
            <Col>
              <Button type="primary" htmlType="submit">
                Save
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    </>
  );
};
export default GetStartedSnippet;
