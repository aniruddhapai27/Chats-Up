import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../Context/AuthContext";
import { BACKEND_URL } from "../../utils";
function Login() {
  const { setAuthUser } = useAuth();
  const [userInput, setUserInput] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const handleInput = (e) => {
    setUserInput({
      ...userInput,
      [e.target.id]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post(`${BACKEND_URL}/api/auth/login`, userInput, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });
      const { data } = res;
      toast.success(data.message);
      localStorage.setItem("chatapp", JSON.stringify(data));
      setAuthUser(data);
      setIsLoading(false);

      navigate("/");
    } catch (error) {
      setIsLoading(false);
      toast.error(error?.response?.data?.message || "Login failed");
      console.log(error);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center min-w-80 w-fit h-full mx-auto">
      <div className="w-full p-6 rounded-lg shadow-lg bg-white/10 backdrop-blur-xl border border-white/20 h-3/5">
        <h1 className="text-3xl font-bold text-center text-gray-300 mb-4">
          Login <span className="text-gray-950">Chatters</span>
        </h1>
        <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
          {/* Email Field */}
          <div className="flex flex-col">
            <label htmlFor="email" className="font-bold text-gray-950 text-lg">
              Email:
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              required
              onChange={handleInput}
              className="w-full h-10 px-3 border border-gray-300 rounded-md bg-transparent text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password Field */}
          <div className="flex flex-col">
            <label
              htmlFor="password"
              className="font-bold text-gray-950 text-lg"
            >
              Password:
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              required
              onChange={handleInput}
              className="w-full h-10 px-3 border border-gray-300 rounded-md bg-transparent text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full h-10 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 transition mt-6 lg:mt-8"
          >
            {isLoading ? "Loading..." : "Login"}
          </button>
        </form>
        <p className="text-center text-gray-300  mt-2">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-500 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
