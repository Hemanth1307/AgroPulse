
import React, { useEffect, useState } from "react";
import "./App.css";

const crops = {
  Tomato: 0.8,
  Rice: 1.1,
  Wheat: 1.0,
  Maize: 0.9,
  Potato: 0.85,
  Groundnut: 0.7,
  Cotton: 0.9,
};

function App() {
  // LOGIN
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // DASHBOARD
  const [page, setPage
