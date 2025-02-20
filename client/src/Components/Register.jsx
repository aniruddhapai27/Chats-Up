import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../Context/AuthContext";
import { BACKEND_URL } from "../../utils";

function Register() {
  const { setAuthUser } = useAuth();
  const [userInput, setUserInput] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Handle input change
  const handleInput = (e) => {
    const { id, value } = e.target;
    setUserInput((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // Handle gender selection
  const handleGenderChange = (e) => {
    setUserInput((prev) => ({
      ...prev,
      gender: e.target.value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (userInput.password !== userInput.confirmPassword) {
      setIsLoading(false);
      return toast.error("Passwords do not match!");
    }
    setIsLoading(true);
    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/auth/register`,
        userInput,
        { withCredentials: true }
      );
      const { data } = res;
      toast.success(data.message);
      localStorage.setItem("chatapp", JSON.stringify(data));
      console.log(data);
      setAuthUser(data);
      setIsLoading(false);
      navigate("/login");
    } catch (error) {
      setIsLoading(false);
      toast.error(error?.response?.data?.message || "Registrations failed");
      console.error(error);
    }
  };

  return (
    <div className="mt-20 lg:mt-0 flex flex-col items-center justify-center min-w-80 w-fit h-full mx-auto">
      <div className="w-full p-6 rounded-lg shadow-lg bg-white/10 backdrop-blur-xl border border-white/20">
        <h1 className="text-3xl font-bold text-center text-gray-300 mb-4">
          Register <span className="text-gray-950">Chatters</span>
        </h1>
        <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="flex flex-col">
            <label
              htmlFor="fullname"
              className="font-bold text-gray-950 text-lg"
            >
              Full Name:
            </label>
            <input
              id="fullname"
              type="text"
              placeholder="Enter your full name"
              required
              onChange={handleInput}
              className="w-full h-10 px-3 border border-gray-300 rounded-md bg-transparent text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Username */}
          <div className="flex flex-col">
            <label
              htmlFor="username"
              className="font-bold text-gray-950 text-lg"
            >
              Username:
            </label>
            <input
              id="username"
              type="text"
              placeholder="Choose a username"
              required
              onChange={handleInput}
              className="w-full h-10 px-3 border border-gray-300 rounded-md bg-transparent text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Email */}
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

          {/* Password */}
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

          {/* Confirm Password */}
          <div className="flex flex-col">
            <label
              htmlFor="confirmPassword"
              className="font-bold text-gray-950 text-lg"
            >
              Confirm Password:
            </label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              required
              onChange={handleInput}
              className="w-full h-10 px-3 border border-gray-300 rounded-md bg-transparent text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Gender Selection */}
          <div className="flex flex-col">
            <label className="font-bold text-gray-950 text-lg">Gender:</label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2 text-gray-200">
                <input
                  type="radio"
                  value="male"
                  checked={userInput.gender === "male"}
                  onChange={handleGenderChange}
                  className="w-5 h-5 accent-blue-500"
                />
                <span>Male</span>
              </label>
              <label className="flex items-center space-x-2 text-gray-200">
                <input
                  type="radio"
                  value="female"
                  checked={userInput.gender === "female"}
                  onChange={handleGenderChange}
                  className="w-5 h-5 accent-pink-500"
                />
                <span>Female</span>
              </label>
            </div>
          </div>

          {/* Register Button */}
          <button
            type="submit"
            className="w-full h-10 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 transition mt-6 lg:mt-8"
          >
            {isLoading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-center text-gray-300 mt-2">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
