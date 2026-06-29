import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Input from "../components/common/Input";
import Button from "../components/common/Button";

import { loginUser } from "../services/authService";

const LoginPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const handleSubmit = async (e) => {

  e.preventDefault();

  try {

    const response = await loginUser({

      email,
      password

    });

    // Save JWT Token
    const { login } = useAuth();
    login(response.token);
    
    alert("Login Successful");

    navigate("/dashboard");

  } catch (error) {

    alert(

      error.response?.data?.message ||

      "Login Failed"

    );

  }

};

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">

      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">

        <h1 className="text-3xl font-bold text-center mb-6">
          Login
        </h1>

        <form onSubmit={handleSubmit}>

          <Input
            label="Email"
            type="email"
            placeholder="Enter email"
            autoComplete="email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            label="Password"
            type="password"
            placeholder="Enter password"
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="bg-amber-500 text-white w-full mt-4 py-2 rounded-md hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Login
          </button>

        </form>

        <p className="mt-4 text-center">
          Forgot Password?
        </p>

      </div>

    </div>
  );
};

export default LoginPage;