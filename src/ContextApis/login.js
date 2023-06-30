import React, { createContext, useState } from "react";

const AuthContext = createContext({
  islogin: null,
  setisLogin: () => {},
});

export const AuthContextProvider = (props) => {
  const [islogin, setIsLogin] = useState("customerLogin" in localStorage);

  const values = {
    islogin: islogin,
    setisLogin: (bool) => setIsLogin(bool),
  };

  return (
    <AuthContext.Provider value={values}>{props.children}</AuthContext.Provider>
  );
};

export default AuthContext;
