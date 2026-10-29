
import { useState } from "react";
import { Eye, EyeOff, User, Mail } from "lucide-react";
import { toast } from "react-toastify";
import { registerUser } from "../services/authService";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
    };

    if (!payload.name || !payload.email || !payload.password) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      setSubmitting(true);

      console.log("REGISTER PAYLOAD:", {
        name: payload.name,
        email: payload.email,
        password: "[HIDDEN]",
      });

      const response = await registerUser(payload);

      toast.success(
        response?.message || "Registration successful!"
      );

      setFormData({
        name: "",
        email: "",
        password: "",
      });

    } catch (error) {
      console.error(
        "Registration error:",
        error.response?.data || error
      );

      toast.error(
        error.response?.data?.message ||
        "Registration failed. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full rounded-full border border-slate-300 px-4 py-3 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition";

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4 py-8">

      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg w-full max-w-md">

        <h1 className="text-3xl font-bold text-center mb-8 text-slate-900">
          Create Account
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* FULL NAME */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Full Name
            </label>

            <div className="relative">
              <User
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                autoComplete="name"
                required
                className={`${inputClass} pl-11`}
              />
            </div>
          </div>

          {/* EMAIL */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Email
            </label>

            <div className="relative">
              <Mail
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                autoComplete="email"
                required
                className={`${inputClass} pl-11`}
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                autoComplete="new-password"
                minLength={8}
                required
                className={`${inputClass} pr-12`}
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword((prev) => !prev)
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-amber-600"
                aria-label={
                  showPassword ? "Hide password" : "Show password"
                }
              >
                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>

            <p className="text-xs text-slate-500 mt-2">
              Password must contain at least 8 characters.
            </p>
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white font-semibold py-3 rounded-full transition mt-3"
          >
            {submitting ? "Creating Account..." : "Register"}
          </button>

        </form>

      </div>
    </div>
  );
};

export default RegisterPage;
