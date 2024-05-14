import "./App.css";
import { Routes, BrowserRouter, Route } from "react-router-dom";
import Debit from "./pages/Debit";
import Create from "./pages/Create";
import RegisterApp from "./pages/RegisterApp";
import Home from "./pages/Home";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/debit" element={<Debit />} />
          <Route path="/createNetbanking" element={<Create />} />
          <Route path="/registerApp" element={<RegisterApp />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
