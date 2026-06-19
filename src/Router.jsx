import { BrowserRouter, Route, Routes } from "react-router";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import MainLayout from "./layouts/MainLayout";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />} />
        <Route index element={<HomePage />} />
        <Route path="/About" element={<AboutPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
