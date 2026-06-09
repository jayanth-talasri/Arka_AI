const Modal = ({
  title,
  children,
}) => {
  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">

      <div className="bg-white rounded-lg p-6 w-96">

        <h2 className="text-xl font-bold mb-4">
          {title}
        </h2>

        {children}

      </div>

    </div>
  );
};

export default Modal;