
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";

import Input from "../components/common/Input";
import { loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      toast.error("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const response = await loginUser({
        email: email.trim(),
        password,
      });

      if (!response?.token || !response?.user) {
        throw new Error("Invalid login response from server");
      }

      login(response.token, response.user);

      toast.success("Login successful");
      navigate("/dashboard", { replace: true });

    } catch (error) {
      console.error("LOGIN ERROR:", error);

      toast.error(
        error.response?.data?.message ||
        error.message ||
        "Login failed"
      );
    } finally {
      setLoading(false);
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
            name="email"
            placeholder="Enter email"
            autoComplete="email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                placeholder="Enter password"
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-amber-600"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-amber-500 text-white w-full mt-6 py-3 rounded-lg hover:bg-amber-600 disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <p className="mt-4 text-center text-slate-500">
          Forgot Password?
        </p>

      </div>
    </div>
  );
};

export default LoginPage;
