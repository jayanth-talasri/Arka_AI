import { useState } from "react";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import { toast } from "react-toastify";
import { registerUser } from "../services/authService";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

  try {
    const response = await registerUser(formData);

    console.log(response);

    toast.success("Registration Successful");

  } catch (error) {
    toast.error(error.response?.data?.message || "Registration Failed");
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">

      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">

        <h1 className="text-3xl font-bold text-center mb-6">
          Create Account
        </h1>

        <form onSubmit={handleSubmit}>

          <Input
            label="Full Name"
            name="name"
            placeholder="Enter name"
            onChange={handleChange}
          />

          <Input
            label="Email"
            type="email"
            name="email"
            placeholder="Enter email"
            onChange={handleChange}
          />

          <Input
            label="Password"
            type="password"
            name="password"
            placeholder="Enter password"
            onChange={handleChange}
          />

          <Button
            type="submit"
            text="Register"
            className="bg-amber-500 text-white w-full mt-4"
          />

        </form>

      </div>

    </div>
  );
};

export default RegisterPage;