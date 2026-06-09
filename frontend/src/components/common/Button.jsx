const Button = ({
  text,
  type = "button",
  onClick,
  className = "",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-4 py-2 rounded-lg font-medium transition ${className}`}
    >
      {text}
    </button>
  );
};

export default Button;