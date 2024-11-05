import React, { useState } from "react";
import Space from "./components/Space";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./components/Home";
import { Login, userStatus } from "./components/login";
import Signup from "./components/signup";
import { RecoilRoot, useRecoilValue } from "recoil";
const App = () => {
  return (
    <RecoilRoot>
      <AppRoutes />
    </RecoilRoot>
  );
};

// Separate AppRoutes component to use the Recoil hook within RecoilRoot context
const AppRoutes = () => {
  const isLoggedIn = useRecoilValue(userStatus);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {isLoggedIn && <Route path="/space" element={<Space />} />}
      </Routes>
    </Router>
  );
};

export default App;
