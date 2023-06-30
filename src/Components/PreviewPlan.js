import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  Spin,
  Button,
  Divider,
  Radio,
  Select,
  Modal,
  message,
} from "antd";
import {
  ArrowLeftOutlined,
  CheckCircleFilled,
  ArrowRightOutlined,
} from "@ant-design/icons";
import "./previewPlan.css";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import axios from "axios";
import GreenVector from "../Image/correct.png";
import wrong2 from "../Image/wrong.svg";
import tick from "../Image/tick.svg";
import GetStartedSnippet from "./PreviewGetStartedSnippet";
import LoginPage from "../Components/LoginPage";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/navigation";
import "swiper/css";
import "swiper/css/pagination";
import { Keyboard, Pagination, Navigation } from "swiper";
import locale from "antd/es/date-picker/locale/en_US";
import { useCallback } from "react";

const PreviewPlanSnippet = () => {
  const [visible, setVisible] = useState(false);
  const [customerLogin, setCustomerLogin] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(2);
  const [selectedPrice, setSelectedPrice] = useState();
  const [subId, setSubId] = useState();
  const [subStatus, setSubStatus] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState("INR");
  const [previewPlan, setPreviewPlan] = useState([]);
  const [priceId, setPriceId] = useState();
  const [isRotated, setIsRotated] = useState(false);
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [exchangeRate, setExchangeRate] = useState("");
  const checkboxHeight = 40;
  const numCheckboxes = previewPlan[0]?.entitlements.length;
  const totalHeight = checkboxHeight * numCheckboxes;
  const [subscriptionDetails, setSubscriptionDetails] = useState([]);
  const [productId, setProductId] = useState("");
  const [customerDetails, setCustomerDetails] = useState({});
  const [tenantId, setTenantId] = useState();
  const [existingCustomer, setExistingCustomer] = useState(false);
  const [planIds, setPlanIds] = useState(false);
  const [isPriceSlabIdSame, setIsPriceSlabIdSame] = useState(false);

  const [serParams, _] = useSearchParams();

  useEffect(() => {
    let apiKey = window.location.search.split("=")[1];
    getPlanList(apiKey);
  }, []);

  useEffect(() => {
    if (productId) {
      getAllCustomer();
    }
  }, [productId]);

  const getPlanList = async (apiKey) => {
    const headers = {
      //Paste the API key here:
      Authorization: apiKey,
    };
    setLoading(true);
    try {
      let allPlans = await axios.get(
        `https://ss.api.hutechlabs.com/api/v1/previewPlans`,
        {
          headers: headers,
        }
      );
      const tenantIds = allPlans?.data?.tenantId;
      const productIds = allPlans?.data?.productId;
      setProductId(productIds);
      setTenantId(tenantIds);
      const finalplans = [];
      allPlans?.data?.plans.forEach((pl) => {
        const addedFeatures = [];
        const myplans = [];
        pl?.entitlements.forEach((feature) => {
          if (!addedFeatures?.includes(feature?.entitlements)) {
            myplans.push(feature);
            addedFeatures.push(feature?.entitlements);
          }
        });
        finalplans.push({ ...pl, entitlements: myplans });
      });

      const a = Object.assign(
        [],
        ...finalplans?.map((i) => i.response?.map((i) => i.periodInText))
      );

      setPreviewPlan(finalplans || []);
      setSelectedPrice(a[0]);
      const timer = setTimeout(() => {
        setLoading(false);
      }, 750);
    } catch (error) {
      console.log("error;;;", error);
    }
  };
  const getAllCustomer = async () => {
    try {
      let customer = await axios.get(
        `https://ss.api.hutechlabs.com/api/v1/product/${productId}`,
        { headers: { "Cache-Control": "no-cache" } }
      );
      // message.info(JSON.stringify(customer.data), 10000);
      setSubscriptionDetails(customer?.data);
    } catch (error) {
      message.error("error");
    }
  };

  const navigate = useNavigate();

  const clickPreviewPlan = () => {
    navigate("/productList");
  };

  const apiUrl = `https://open.er-api.com/v6/latest/INR`;

  const fetchExchangeRate = () => {
    setLoading(true);
    axios
      .get(apiUrl)
      .then((response) => {
        const rate = response.data.rates[selectedCurrency];

        setExchangeRate(rate);
      })
      .catch((error) => {
        console.error(error);
      });
    const timer = setTimeout(() => {
      setLoading(false);
    }, 750);
  };

  useEffect(() => {
    fetchExchangeRate();
  }, [selectedCurrency]);

  const handleChange = (value) => {
    setSelectedCurrency(value.value);
    fetchExchangeRate();
  };

  const handleRadioChange = (value) => {
    setSelectedPrice(value);
    setIsRotated(true);
    setTimeout(() => {
      setIsRotated(false);
    }, 1200);
  };

  const [scrollLeft, setScrollLeft] = useState(0);
  const [rightIndex, setRightIndex] = useState(previewPlan.length - 1);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [cardWidth, setCardWidth] = useState(0);

  const TotalRight =
    screenWidth < 760
      ? Math.max(previewPlan.length - rightIndex - 2, 0)
      : Math.max(previewPlan.length - rightIndex - 4, 0);

  const planPeriods = [
    { key: "daily", label: "Daily", value: " /daily" },
    { key: "weekly", label: "Weekly", value: " /weekly" },
    { key: "monthly", label: "Monthly", value: " /month" },
    { key: "quarterly", label: "Quarterly", value: " /Quarterly" },
    { key: "half_yearly", label: "Half Yearly", value: " /half year" },
    { key: "annually", label: "Annually", value: " /year" },
  ];

  const currencyMap = {
    USD: "$",
    INR: "₹",
    EUR: "€",
    GBP: "£",
  };

  //-------------------style--------------------}

  const buttonStyle = {
    background: "linear-gradient(121.06deg, #5b92e5 20.17%, #2087c0 95.26%)",
    color: "#ffffff",
  };
  //-----------------------dicount-----------}
  const commonStylesDiscount = {
    textDecoration: "line-through",
    fontFamily: "Poppins",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: "15px",
    marginLeft: "5px",
    marginBottom: "5px",
  };

  const commonStylesDiscountMonth = {
    fontFamily: "Poppins",
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: "15px",
    marginBottom: "5px",
  };

  const selectedStyleDescription = {
    color: "#DCE9FF",
    fontFamily: "Poppins",
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: "12px",
  };

  const defaultStyleDescription = {
    fontFamily: "Poppins",
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: "12px",
    color: "#16191D",
  };

  const defaultStyleFeature = {
    fontFamily: "Poppins",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: "12px",
  };

  const commonfeeStyles = {
    fontFamily: "Poppins",
    fontStyle: "normal",
    fontWeight: "600",
    fontSize: "26px",
    display: "flex",
    alignItems: "flex-end",
  };

  const commontagStyles = {
    borderRadius: "15px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2px 10px",
  };

  if (loading) {
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
            top: "20%",
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

  const getLatestStatus = (subscriptions, priceid) => {
    let parseData = JSON.parse(localStorage.getItem("customerLogin") || null);
    const email = parseData?.email;
    const filteredsubscriptions = subscriptions
      .filter((sub) => {
        return sub?.customerEmail === email && sub?.priceslabsId === priceid;
      })
      .sort((a, b) => {
        const tempa = Number(a.subscriptionId.replace("SUB", ""));
        const tempb = Number(a.subscriptionId.replace("SUB", ""));
        if (tempa > tempb) {
          return 1;
        }
        return -1;
      });
    console.log(filteredsubscriptions[0]?.subscriptionStatus);

    if (filteredsubscriptions[0]?.subscriptionStatus === undefined) {
      return false;
    }
    return filteredsubscriptions[0]?.subscriptionStatus;
  };
  return (
    <>
      <div className="preview-plan">
        <Row
          style={{
            display: "flex",
            alignItems: "center",
            paddingLeft: "40px",
            paddingRight: "40px",
          }}
        >
          <Col className="radio-div" xs={24} md={4} sm={0} lg={4}></Col>
          <Col className="radio-div" xs={24} md={16} sm={24} lg={16}>
            <Radio.Group
              value={selectedPrice}
              className="radio-button no-border"
              defaultValue={planPeriods[0].key}
              size="large"
              onChange={(e) => handleRadioChange(e.target.value)}
            >
              {planPeriods
                .filter(({ key }) =>
                  Object.assign(
                    [],
                    ...previewPlan?.map((i) =>
                      i.response?.map((i) => i.periodInText)
                    )
                  ).includes(key)
                )
                .map((period) => (
                  <Radio.Button
                    key={period.key}
                    className="button-value"
                    checkedClassName="my-checked-button"
                    value={period.key}
                  >
                    {period.label}
                  </Radio.Button>
                ))}
            </Radio.Group>
          </Col>

          <Col className="radio-div-select" xs={24} md={4} sm={24} lg={4}>
            <Select
              value={selectedCurrency}
              className="select-currency"
              labelInValue
              defaultValue={{
                value: "INR",
                label: "INR",
              }}
              style={{
                width: "20%",
                backgroundColor: "#f2f2f2 ",
                borderRadius: "10px",
                border: "none",
                width: "50%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              onChange={handleChange}
              options={[
                {
                  value: "USD",
                  label: "USD",
                },
                {
                  value: "INR",
                  label: "INR",
                },
                {
                  value: "EUR",
                  label: "EUR",
                },
                {
                  value: "GBP",
                  label: "GBP",
                },
              ]}
            />
          </Col>
        </Row>
        <Col
          xl={{ span: 22, offset: 1 }}
          style={{
            marginTop: "20px",
          }}
          className="table-col"
        >
          <Swiper
            breakpoints={{
              320: { slidesPerView: 1, spaceBetween: 5 },
              480: { slidesPerView: 1, spaceBetween: 10 },
              768: { slidesPerView: 3, spaceBetween: 30 },
              1024: { slidesPerView: 3, spaceBetween: 0 },
            }}
            // slidesPerView={3}
            className="mySwiper"
            pagination={{
              type: "fraction",
            }}
            navigation={true}
            modules={[Navigation]}
          >
            <Col
              id="tablespacePreview"
              className="previewPlan-Card"
              gutter={[0, 0]}
            >
              {previewPlan.map((plan, index) => (
                <Col
                  className="card-div"
                  xs={24}
                  sm={24}
                  md={8}
                  style={{ width: "100%" }}
                >
                  <SwiperSlide>
                    <Card
                      key={index}
                      className={`tablespacePreview ${
                        isRotated ? "is-rotated" : ""
                      }`}
                      bordered={false}
                      title={
                        <div className="card-prev">
                          <span className="card-prev-tittle">
                            {plan.planTitle}
                          </span>
                          {plan.tag && (
                            <span
                              style={
                                selectedPlan === plan.planId
                                  ? {
                                      ...commontagStyles,
                                      backgroundColor: "#ffffff",
                                      color: "black",
                                    }
                                  : {
                                      ...commontagStyles,
                                      backgroundColor: "#3B82DC",
                                      color: "white",
                                    }
                              }
                            >
                              {plan.tag}
                            </span>
                          )}
                        </div>
                      }
                      headStyle={
                        selectedPlan === plan.planId
                          ? {
                              display: "flex",
                              alignItems: "Left",
                              justifyContent: "left",
                              fontFamily: "Poppins",
                              fontStyle: "normal",
                              fontWeight: 600,
                              fontSize: "17px",
                              height: "26px",
                              color: "#ffffff",
                            }
                          : {
                              display: "flex",
                              alignItems: "Left",
                              justifyContent: "left",
                              fontFamily: "Poppins",
                              fontStyle: "normal",
                              fontWeight: 600,
                              fontSize: "20px",
                              height: "26px",
                              marginTop: "10px",
                            }
                      }
                      style={
                        selectedPlan === plan.planId
                          ? {
                              backgroundColor: "#3B82DC",
                              borderRadius: "10px",
                              boxShadow: "0px 4px 7px rgba(0, 0, 0, 0.25)",
                              boxShadow: "rgba(0, 0, 0, 0.15) 0px 1px 10px",
                              borderTop: "10px solid #3B82DC",
                              borderRadius: "10px",
                              width: "80%",
                              marginBottom: "20px",
                              marginLeft: "2.5rem",
                            }
                          : {
                              boxShadow: "rgba(0, 0, 0, 0.15) 0px 1px 10px",
                              borderTop: "10px solid #5b92e5",
                              borderRadius: "10px",
                              width: "80%",
                              marginBottom: "20px",
                              marginLeft: "2.5rem",
                            }
                      }
                    >
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <div
                          style={{
                            height: "auto",
                            minheight: `${totalHeight}px`,
                          }}
                        >
                          <Col className="card-dis" span={24}>
                            <div
                              className="fee-price"
                              style={
                                selectedPlan === plan.planId
                                  ? { ...commonfeeStyles, color: "#ffffff" }
                                  : { ...commonfeeStyles, color: "#16191D" }
                              }
                            >
                              {plan.customPlanStatus ? (
                                <span>
                                  <strong>Custom</strong>
                                </span>
                              ) : null}
                              {plan.response
                                .filter(
                                  (res) => res.periodInText === selectedPrice
                                )
                                .map((selectedPlanPrice) => {
                                  const convertedPrice = (
                                    selectedPlanPrice.monthlyPrice *
                                    exchangeRate
                                  ).toFixed(2);

                                  const convertedDiscountedAmount = (
                                    selectedPlanPrice.actualPrice * exchangeRate
                                  ).toFixed(2);
                                  const selectedPlanPeriod = planPeriods.find(
                                    (p) => p.key === selectedPrice
                                  );

                                  const priceToDisplay =
                                    parseFloat(convertedPrice);
                                  if (priceToDisplay === 0) {
                                    return (
                                      <div>
                                        <span>
                                          <strong>
                                            {!priceToDisplay
                                              ? "Free"
                                              : parseFloat(priceToDisplay)}
                                          </strong>
                                        </span>
                                      </div>
                                    );
                                  } else {
                                    return (
                                      <div>
                                        <span>
                                          {currencyMap[selectedCurrency]}
                                          {selectedPlanPrice.discountValue >
                                          0 ? (
                                            <>
                                              <strong>
                                                {parseFloat(
                                                  convertedDiscountedAmount
                                                )}
                                              </strong>
                                              <span
                                                style={{
                                                  ...commonStylesDiscount,
                                                  color:
                                                    selectedPlan === plan.planId
                                                      ? "#F0F0F0"
                                                      : "#16191D",
                                                }}
                                              >
                                                {currencyMap[selectedCurrency]}
                                                {`${parseFloat(
                                                  priceToDisplay
                                                )}`}
                                              </span>
                                              <span
                                                style={{
                                                  ...commonStylesDiscountMonth,
                                                  color:
                                                    selectedPlan === plan.planId
                                                      ? "#F0F0F0"
                                                      : "#16191D",
                                                }}
                                              >
                                                {selectedPlanPeriod.value}
                                              </span>
                                            </>
                                          ) : (
                                            <>
                                              <strong>
                                                {!priceToDisplay
                                                  ? "Free"
                                                  : parseFloat(priceToDisplay)}
                                              </strong>
                                              <span
                                                style={{
                                                  ...commonStylesDiscountMonth,
                                                  color:
                                                    selectedPlan === plan.planId
                                                      ? "#F0F0F0"
                                                      : "#16191D",
                                                }}
                                              >
                                                {selectedPlanPeriod?.value}
                                              </span>
                                            </>
                                          )}
                                        </span>
                                      </div>
                                    );
                                  }
                                })}
                            </div>

                            <div style={{ minHeight: "auto" }}>
                              <span
                                className="fee-discription"
                                style={
                                  selectedPlan === plan.planId
                                    ? selectedStyleDescription
                                    : defaultStyleDescription
                                }
                              >
                                {plan.description}
                              </span>
                            </div>
                          </Col>

                          <Divider
                            className="plan-divider"
                            style={
                              selectedPlan === plan.planId
                                ? { backgroundColor: "white" }
                                : {}
                            }
                          />

                          <Col
                            className="feature-map"
                            style={{ height: `${totalHeight}px` }}
                          >
                            {plan.lengthyDescriptionStatus ? (
                              <div
                                style={
                                  selectedPlan === plan.planId
                                    ? { color: "white" }
                                    : { color: "black" }
                                }
                              >
                                {plan.lengthyDescription}
                              </div>
                            ) : (
                              plan.entitlements?.map((item, index) => (
                                <Row
                                  // className="feature-check"
                                  gutter={[0, 0]}
                                  key={index}
                                  className={
                                    plan.hideDisableEntitlements &&
                                    item.status === false
                                      ? "no-feature-check"
                                      : "feature-check"
                                  }
                                >
                                  {plan.hideDisableEntitlements &&
                                  item.status === false ? (
                                    ""
                                  ) : (
                                    <div className="checkBox-name">
                                      <div>
                                        {item.status === true &&
                                        selectedPlan === plan.planId ? (
                                          <img
                                            src={tick}
                                            style={{
                                              marginBottom: "7px",
                                              marginRight: "4px",
                                              width: "18px",
                                            }}
                                          />
                                        ) : item.status === true ? (
                                          <img
                                            src={GreenVector}
                                            style={{
                                              marginBottom: "7px",
                                              marginRight: "4px",
                                              width: "18px",
                                            }}
                                          />
                                        ) : (
                                          <img
                                            src={wrong2}
                                            style={{
                                              marginBottom: "7px",
                                              marginRight: "4px",
                                              width: "18px",
                                            }}
                                          />
                                        )}
                                      </div>
                                      <div
                                        style={{
                                          display: "flex",
                                          width: "100%",
                                          justifyContent: "flex-start",
                                          marginRight: "20px",
                                          marginLeft: "10px",
                                        }}
                                      >
                                        <div
                                          className="feature-name"
                                          style={{
                                            ...defaultStyleFeature,
                                            color:
                                              selectedPlan === plan.planId
                                                ? "#ffffff"
                                                : "#16191D",
                                            fontFamily: "Poppins",
                                            fontStyle: "normal",
                                            fontWeight: "500",
                                            fontSize: "12px",
                                            lineHeight: "18px",
                                          }}
                                        >
                                          {item.entitlements}
                                        </div>
                                        <div style={{ marginLeft: "4px" }}>
                                          {}
                                        </div>
                                        {item.count && item.unit ? (
                                          <div
                                            className="feature-unit"
                                            style={{
                                              ...defaultStyleFeature,
                                              color:
                                                selectedPlan === plan.planId
                                                  ? "white"
                                                  : "#16191D",
                                            }}
                                          >
                                            ({} {item.count} {item.unit})
                                          </div>
                                        ) : null}
                                      </div>
                                    </div>
                                  )}
                                </Row>
                              ))
                            )}
                          </Col>
                        </div>

                        <div
                        // style={
                        //   plan.customPlanStatus === true
                        //     ? { display: "none" }
                        //     : {}
                        // }
                        >
                          <Button
                            className="previewPlan-button-add"
                            onClick={() => {
                              setSelectedPlan(plan.planId);

                              const tempSelectedPeriod = plan?.response?.find(
                                (period) =>
                                  period.periodInText === selectedPrice
                              );

                              setPriceId(tempSelectedPeriod?.priceSlabId);
                              let parseData = JSON.parse(
                                localStorage.getItem("customerLogin") || null
                              );

                              const filterCustomer =
                                subscriptionDetails?.filter(
                                  (cust) =>
                                    cust.customerEmail === parseData?.email
                                );
                              setExistingCustomer(filterCustomer.length > 0);

                              const isSlabIdSame = filterCustomer.some(
                                (customer) =>
                                  customer?.priceslabsId ===
                                  tempSelectedPeriod.priceSlabId
                              );

                              setIsPriceSlabIdSame(isSlabIdSame);
                              setCustomerDetails(parseData);

                              const subscriptionIds = subscriptionDetails?.find(
                                (subId) =>
                                  subId?.planId === plan.planId &&
                                  subId.customerEmail === parseData?.email
                              );

                              setPlanIds(!!subscriptionIds);

                              setSubId(subscriptionIds?.subscriptionId);

                              console.log(
                                "tempSelectedPeriod:: ",
                                tempSelectedPeriod
                              );
                              console.log(
                                "subscriptionDetails:: ",
                                subscriptionDetails
                              );
                              // const subcriptionStatus =
                              //   subscriptionDetails?.find(
                              //     (substs) =>
                              //       substs.priceslabsId ===
                              //         tempSelectedPeriod.priceSlabId &&
                              //       substs?.customerEmail === parseData?.email
                              //   );

                              // console.log(
                              //   "subcriptionStatus::: ",
                              //   subcriptionStatus
                              // );
                              setSubStatus(
                                // subcriptionStatus?.subscriptionStatus
                                getLatestStatus(
                                  subscriptionDetails,
                                  tempSelectedPeriod.priceSlabId
                                )
                              );

                              setCustomerLogin(true);
                            }}
                            style={
                              selectedPlan === plan.planId
                                ? { background: "#fff", color: "#000" }
                                : plan.customPlanStatus === true
                                ? { visibility: "hidden" }
                                : { buttonStyle }
                            }
                          >
                            {plan.customPlanStatus === true ? null : (
                              <span>{plan.button || "Get Started"}</span>
                            )}
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </SwiperSlide>
                </Col>
              ))}
            </Col>
          </Swiper>
        </Col>
      </div>

      <Modal
        title={
          customerDetails === null
            ? "Customer Login"
            : existingCustomer && planIds && isPriceSlabIdSame && subStatus
            ? null
            : existingCustomer && planIds && (!isPriceSlabIdSame || !subStatus)
            ? "Upgrade/Downgrade Subscription"
            : existingCustomer && !planIds && !isPriceSlabIdSame && !subStatus
            ? "Create Subscription"
            : null
        }
        footer={null}
        open={customerLogin}
        onOk={() => setCustomerLogin(false)}
        onCancel={() => setCustomerLogin(false)}
        width={580}
        style={{ borderRadius: "10px" }}
        bodyStyle={
          customerDetails === null
            ? {
                overflowX: "hidden",
                // overflowY: "hidden",
                borderRadius: "10px",
                height: "350px",
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
              setCustomerLogin(false);
            }}
            style={{ color: "#ffffff" }}
          >
            X
          </div>
        }
        className="viewModal"
      >
        {
          customerDetails === null ? (
            <LoginPage
              onCancel={() => setCustomerLogin(false)}
              setCustomerLogin={setCustomerLogin}
              getAllCustomer={getAllCustomer}
              subscriptionDetails={subscriptionDetails}
              previewPlan={previewPlan}
              selectedPlan={selectedPlan}
              selectedPrice={selectedPrice}
              customerDetails={customerDetails}
              priceId={priceId}
              tenantId={tenantId}
              productId={productId}
              planList={previewPlan}
              subId={subId}
              existingCustomer={existingCustomer}
              priceSlabId={isPriceSlabIdSame}
              planIds={planIds}
              subStatus={subStatus}
            />
          ) : existingCustomer && planIds && isPriceSlabIdSame && subStatus ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <h1>
                Dear Customer, Your plan is not due for renewal right now.
              </h1>

              <Button
                style={{
                  width: "97px",
                  marginTop: "5rem",
                  background:
                    "linear-gradient(121.06deg, #5b92e5 20.17%, #2087c0 95.26%",
                  color: "#ffffff",
                }}
                onClick={() => setCustomerLogin(false)}
              >
                Ok
              </Button>
            </div>
          ) : (
            <GetStartedSnippet
              onCancel={() => setCustomerLogin(false)}
              subscriptionDetails={subscriptionDetails}
              getAllCustomer={getAllCustomer}
              previewPlan={previewPlan}
              selectedPlan={selectedPlan}
              selectedPrice={selectedPrice}
              tenantId={tenantId}
              existingCustomer={existingCustomer}
              priceSlabId={isPriceSlabIdSame}
              planIds={planIds}
              priceId={priceId}
              productId={productId}
              planList={previewPlan}
              subId={subId}
              subStatus={subStatus}
            />
          )
          // subStatus === false ? (
          //   <div
          //     style={{
          //       display: "flex",
          //       flexDirection: "column",
          //       alignItems: "center",
          //     }}
          //   >
          //     <h1>
          //       You can't upgrade or downgrade your subscription plan through this
          //       plan
          //     </h1>

          //     <Button
          //       style={{
          //         width: "97px",
          //         marginTop: "5rem",
          //         background:
          //           "linear-gradient(121.06deg, #5b92e5 20.17%, #2087c0 95.26%",
          //         color: "#ffffff",
          //       }}
          //       onClick={() => setCustomerLogin(false)}
          //     >
          //       Ok
          //     </Button>
          //   </div>
          // ) : subStatus === true ? (
          //   <div
          //     style={{
          //       display: "flex",
          //       flexDirection: "column",
          //       alignItems: "center",
          //     }}
          //   >
          //     <h1>You can upgrade or downgrade your subscription plan</h1>

          //     <Button
          //       style={{
          //         width: "97px",
          //         marginTop: "5rem",
          //         background:
          //           "linear-gradient(121.06deg, #5b92e5 20.17%, #2087c0 95.26%",
          //         color: "#ffffff",
          //       }}
          //       onClick={() => setCustomerLogin(false)}
          //     >
          //       Ok
          //     </Button>
          //   </div>
          // ) : (
          //   <GetStartedSnippet
          //     onCancel={() => setCustomerLogin(false)}
          //     subscriptionDetails={subscriptionDetails}
          //     previewPlan={previewPlan}
          //     selectedPlan={selectedPlan}
          //     selectedPrice={selectedPrice}
          //     tenantId={tenantId}
          //     priceId={priceId}
          //     productId={productId}
          //     planList={previewPlan}
          //     subStatus={subStatus}
          //   />
          // )
        }
      </Modal>

      <Modal
        title={null}
        footer={null}
        open={visible}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
        className="preview-modal"
      >
        <div
          className="modal-button"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            margin: "40px",
          }}
        >
          <div>
            {" "}
            <CheckCircleFilled
              style={{ color: "#21AF3A", fontSize: "80px", height: "81px" }}
            />
          </div>
          <div>
            <p className="modal-description">
              Your subscription plan has been created successfully!
            </p>
          </div>
          <div>
            <Button
              onClick={() => {
                clickPreviewPlan();
                setVisible(false);
              }}
              className="modal-description-button"
            >
              <span className="subscription-button">
                Go to Subscription Dashboard
              </span>
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default PreviewPlanSnippet;
