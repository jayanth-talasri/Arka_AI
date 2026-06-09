const Input = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
}) => {
  return (
    <div className="mb-4">
      <label className="block mb-2 text-sm font-medium">
        {label}
      </label>

      <input
        className = "w-full border rounded-lg p-3"
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full border rounded-lg p-3"
      />
    </div>
  );
};

export default Input;