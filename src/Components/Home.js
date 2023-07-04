import React, { useState, useEffect, useContext } from "react";
import { Breadcrumb, Layout, Menu, Button } from "antd";
import { Link, useNavigate, useLocation } from "react-router-dom";
import AuthContext from "../ContextApis/login";

const { Header, Content, Footer } = Layout;

const items = [
  { key: "/", label: "Home", to: "/" },
  // ...(loggedIn
  //   ?
  //    [
  {
    key: "/subscription",
    label: "Subscription",
    to: "/subscription?apikey=",
  },
  // ]
  //   : [{ key: "subscription", label: "Subscription", to: "/login" }]),
  { key: "/contact", label: "Contact", to: "/contact" },
];
const App = (props) => {
  const location = useLocation();
  const loginctx = useContext(AuthContext);
  const [loginDetails, setLoginDetails] = useState(null);

  const [selectedKey, setSelectedKey] = useState(
    sessionStorage.getItem("selectedkey") || location.key
  );
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("customerLogin");
    sessionStorage.removeItem("selectedkey");
    loginctx.setisLogin(false);
    navigate("/");
    // window.location.reload();
  };

  useEffect(() => {
    let parseData = JSON.parse(sessionStorage.getItem("customerLogin"));
    console.log("loginn", loginDetails);

    if (parseData) {
      setLoginDetails(parseData);
    }
  }, []);

  useEffect(() => {
    setSelectedKey(location.pathname);
  }, [location.pathname]);

  console.log(location, "keyss");

  return (
    <Layout>
      <Header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          width: "100%",
        }}
      >
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <div
            style={{
              float: "left",
              width: 120,
              height: 31,
              margin: "16px 24px 16px 0",
              background: "white",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                height: "32px",
                alignItems: "center",
              }}
            >
              E-Kart
            </div>{" "}
          </div>
          <div style={{ width: "100%" }}>
            <Menu
              theme="dark"
              mode="horizontal"
              selectedKeys={selectedKey ? [selectedKey] : []}
            >
              {items.map((item) => (
                <Menu.Item key={item.key} icon={item.icon}>
                  <Link to={item.to}>{item.label}</Link>
                </Menu.Item>
              ))}
            </Menu>
          </div>
          {/* {loggedIn ? ( */}
          {loginctx.islogin && (
            <Button
              type="primary"
              onClick={handleLogout}
              style={{ color: "white", width: "100px" }}
            >
              Logout
            </Button>
          )}

          {/* ) : ( */}
          {/* <Button
              type="primary"
              onClick={handleLogin}
              style={{ color: "white", width: "100px" }}
            >
              Login
            </Button> */}
          {/* )} */}
        </div>
      </Header>
      <Content
        className="site-layout"
        style={{
          padding: "0 50px",
        }}
      >
        <Breadcrumb
          style={{
            margin: "16px 0",
          }}
        >
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>List</Breadcrumb.Item>
          <Breadcrumb.Item>App</Breadcrumb.Item>
        </Breadcrumb>
        <div
          className="site-layout-background"
          style={{
            padding: 24,
            minHeight: 380,
          }}
        >
          {props.main}
        </div>
      </Content>
      <Footer
        style={{
          textAlign: "center",
        }}
      >
        Ant Design ©2018 Created by Ant UED
      </Footer>
    </Layout>
  );
};
export default App;
