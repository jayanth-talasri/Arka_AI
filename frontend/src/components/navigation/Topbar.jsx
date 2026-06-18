const Topbar = () => {
  return (
    <div className="bg-white shadow rounded-xl px-6 py-4 flex justify-between items-center mb-6">

      <h1 className="text-2xl font-bold">
        Welcome, Jayanth 👋
      </h1>

      <div className="flex items-center gap-4">

        <input
          type="text"
          placeholder="Search..."
          className="border px-4 py-2 rounded-lg"
        />

        <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center text-white font-bold">
          J
        </div>

      </div>

    </div>
  );
};

export default Topbar;