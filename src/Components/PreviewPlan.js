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

const PreviewPlanSnippet = () => {
  const [visible, setVisible] = useState(false);
  const [customerLogin, setCustomerLogin] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(2);
  const [selectedPrice, setSelectedPrice] = useState();
  const [selectedCurrency, setSelectedCurrency] = useState("INR");
  const [previewPlan, setPreviewPlan] = useState([]);
  const [isRotated, setIsRotated] = useState(false);
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [exchangeRate, setExchangeRate] = useState("");
  const checkboxHeight = 40;
  const numCheckboxes = previewPlan[0]?.entitlements.length;
  const totalHeight = checkboxHeight * numCheckboxes;
  const [getCustomer, setGetCustomer] = useState([]);
  const [productId, setProductId] = useState("");
  const [customerDetails, setCustomerDetails] = useState({});
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
      console.log("planlist;;;", allPlans?.data?.plans, tenantIds, productIds);
      setProductId(productIds);

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
      let parseData = JSON.parse(localStorage.getItem("customerLogin") || null);

      setPreviewPlan(finalplans || []);
      setSelectedPrice(a[0]);
      setCustomerDetails(parseData);
      const timer = setTimeout(() => {
        setLoading(false);
      }, 750);
    } catch (error) {
      console.log("error;;;", error);
    }
  };
  console.log("customerdetahshsh", customerDetails);
  const getAllCustomer = async () => {
    try {
      let customer = await axios.get(
        `https://ss.api.hutechlabs.com/api/v1/product/${productId}`,
        { headers: { "Cache-Control": "no-cache" } }
      );
      setGetCustomer(customer?.data);
    } catch (error) {
      message.error("error");
    }
  };

  console.log("customerss", getCustomer);

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

  const handleSelectPlan = (id) => {
    setSelectedPlan(id);
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

  // useEffect(() => {
  //   const handleResize = () => {
  //     setScreenWidth(window.innerWidth);
  //     setScrollLeft(0);
  //     setRightIndex(0);
  //     // location.reload();
  //     // setLoading(true);
  //     setTimeout(() => {
  //       setCardWidth(document.querySelector(".card-div").offsetWidth);
  //       setLoading(false);
  //     }, 100);
  //   };
  //   window.addEventListener("resize", handleResize);
  //   return () => window.removeEventListener("resize", handleResize);
  // }, [screenWidth]);

  // const handleScrollLeft = () => {
  //   const container = document.getElementById("tablespacePreview");
  //   const cards = container.querySelectorAll(".card-div");
  //   const cardWidth = cards[0].offsetWidth;
  //   const containerWidth = container.offsetWidth;
  //   const maxScrollLeft = container.scrollWidth - containerWidth;

  //   if (scrollLeft > 0) {
  //     setScrollLeft((prevScrollLeft) => prevScrollLeft - cardWidth);
  //     setRightIndex((prevRightIndex) => prevRightIndex - 1);
  //     cards.forEach((card) => {
  //       card.style.transform = `translateX(-${scrollLeft - cardWidth}px)`;
  //     });
  //   }
  // };

  // const handleScrollRight = () => {
  //   const container = document.getElementById("tablespacePreview");
  //   const cards = container.querySelectorAll(".card-div");
  //   const cardWidth = cards[0].offsetWidth;
  //   const containerWidth = container.offsetWidth;
  //   const maxScrollLeft = container.scrollWidth - containerWidth;

  //   if (scrollLeft < maxScrollLeft) {
  //     setScrollLeft((prevScrollLeft) => prevScrollLeft + cardWidth);
  //     setRightIndex((prevRightIndex) => prevRightIndex + 1);
  //     cards.forEach((card) => {
  //       card.style.transform = `translateX(-${scrollLeft + cardWidth}px)`;
  //     });
  //   }
  // };

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
          span={24}
          style={{
            marginTop: "20px",
          }}
          className="table-col"
        >
          {/* {previewPlan.length > 3 && scrollLeft > 0 && (
            <>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "16px",
                  color: "#08c",
                }}
                className="scroll-button left"
                onClick={handleScrollLeft}
              >
                <>
                  <ArrowLeftOutlined />
                </>

                &lt;
              </div>
            </>
          )} */}

          {/* {previewPlan.length > 3 && TotalRight > 0 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "16px",
                color: "#08c",
              }}
              className="scroll-button right"
              onClick={handleScrollRight}
            >
              <ArrowRightOutlined />
              &gt;
            </div>
          )} */}
          <Swiper
            breakpoints={{
              320: { slidesPerView: 1, spaceBetween: 5 },
              480: { slidesPerView: 1, spaceBetween: 10 },
              768: { slidesPerView: 3, spaceBetween: 30 },
              900: { slidesPerView: 2, spaceBetween: 30 },
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

                            <div style={{ minHeight: "65px" }}>
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

                        <div>
                          <Button
                            className="previewPlan-button-add"
                            onClick={() => {
                              handleSelectPlan(plan.planId);
                              console.log(plan.planId, "Planiddd");
                              setCustomerLogin(true);
                            }}
                            style={
                              selectedPlan === plan.planId
                                ? { background: "#fff", color: "#000" }
                                : { buttonStyle }
                            }
                          >
                            <span>{plan.button || "Get Started"}</span>
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
            : "Upgrade/Downgrade Subscription"
        }
        footer={null}
        open={customerLogin}
        onOk={() => setCustomerLogin(false)}
        onCancel={() => setCustomerLogin(false)}
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
              setCustomerLogin(false);
            }}
            style={{ color: "#ffffff" }}
          >
            X
          </div>
        }
        className="viewModal"
      >
        {customerDetails === null ? (
          <LoginPage
            onCancel={() => setCustomerLogin(false)}
            setCustomerLogin={setCustomerLogin}
            getAllCustomer={getCustomer}
            previewPlan={previewPlan}
            selectedPlan={selectedPlan}
            selectedPrice={selectedPrice}
            customerDetails={customerDetails}
          />
        ) : (
          <GetStartedSnippet
            onCancel={() => setCustomerLogin(false)}
            getCustomer={getCustomer}
            previewPlan={previewPlan}
            selectedPlan={selectedPlan}
            selectedPrice={selectedPrice}
          />
        )}
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
