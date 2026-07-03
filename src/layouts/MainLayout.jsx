import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CartDrawer from "../components/CartDrawer";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="theme-public flex flex-col min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors duration-300">
      <Navbar/>
      <main className="grow flex flex-col">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
};

export default MainLayout;
