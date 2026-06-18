import { BrowserRouter, Route, Routes } from "react-router";
import HomePage from "./pages/HomePage"
import AboutPage from "./pages/AboutPage";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/About" element={<AboutPage/>} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
