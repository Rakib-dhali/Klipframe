import { Route, Routes, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./globals.css";
import LenisScroll from "./components/LenisScroll";
import Generate from "./pages/Generate";
import MyGeneration from "./pages/MyGeneration";
import LoginPage from "./pages/Login";
import Preview from "./pages/preview";

export default function App() {
  const { pathname } = useLocation();
  const isLogin = pathname === "/login";

  return (
    <>
      <LenisScroll />
      <div className={isLogin ? "blur-sm pointer-events-none select-none" : ""}>
        <Navbar />
        <main className="pt-20">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/generate" element={<Generate />} />
            <Route path="/generate/:id" element={<Generate />} />
            <Route path="/my-generations" element={<MyGeneration />} />
            <Route path="/preview" element={<Preview />} />
            <Route path="*" element={<div>404</div>} />
          </Routes>
        </main>
        <Footer />
      </div>
            {isLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <LoginPage />
        </div>
      )}

    </>
  );
}
