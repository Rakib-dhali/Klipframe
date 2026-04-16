import { useState } from "react";
import type { FormData } from "../types";

export default function Login() {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // logic to handle login or signup based on isLogin state
  };

  return (
    <main className="w-full h-screen flex items-center justify-center">
      <div className="bg-gray-900 border border-white text-gray-500 max-w-96 mx-4 md:p-6 p-4 text-left text-sm rounded-xl shadow-[0_35px_35px_0_rgba(0,0,0,0.5)]  shadow-white/10">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-200">
          {isLogin ? "Welcome back" : "Create an account"}
        </h2>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input
            name="name"
            id="name"
            className="w-full bg-transparent border mt-1 border-white outline-none rounded-full py-2.5 px-4"
            type="text"
            placeholder="Enter your Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          )}
          <input
            name="email"
            id="email"
            className="w-full bg-transparent border my-3 border-white outline-none rounded-full py-2.5 px-4"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            name="password"
            id="password"
            className="w-full bg-transparent border mt-1 border-white outline-none rounded-full py-2.5 px-4"
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {isLogin && (
            <div className="text-right py-4">
              <button type="button" className="text-blue-600 underline">
                Forgot Password
              </button>
            </div>
          )}

          <button
            type="submit"
            className="w-full mt-4 mb-3 bg-blue-500 py-2.5 rounded-full text-white"
          >
            {isLogin ? "Log in" : "Sign up"}
          </button>
        </form>

        <p className="text-center mt-4">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-500 underline"
          >
            {isLogin ? "Sign up" : "Log in"}
          </button>
        </p>

        <div className="flex items-center gap-3 my-5">
          <hr className="flex-1 border-white/20" />
          <span className="text-gray-500 text-xs">or continue with</span>
          <hr className="flex-1 border-white/20" />
        </div>

        <button
          type="button"
          className="w-full flex items-center gap-2 justify-center bg-white border border-gray-500/30 py-2.5 rounded-full text-gray-800"
        >
          <img
            className="h-4 w-4"
            src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/googleFavicon.png"
            alt="googleFavicon"
          />
          {isLogin ? "Log in" : "Sign up"} with Google
        </button>
        <button
          type="button"
          className="w-full flex items-center gap-2 justify-center mt-3 bg-black py-2.5 border border-white rounded-full text-white"
        >
          <img
            className="h-4 w-4"
            src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/appleLogo.png"
            alt="appleLogo"
          />
          {isLogin ? "Log in" : "Sign up"} with Apple
        </button>
      </div>
    </main>
  );
}
