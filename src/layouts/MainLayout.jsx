import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
<<<<<<< HEAD
import CartDrawer from "../components/CartDrawer";
import { Outlet } from "react-router";
=======

import { Outlet } from "react-router-dom";
>>>>>>> dca16ef8a52ef2b4f1f75e80b92914534f620f1e

const MainLayout = () => {
  return (
    <div className="theme-public flex flex-col min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors duration-300">
      <Navbar/>
      <main className="flex-grow flex flex-col">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
};

export default MainLayout;
