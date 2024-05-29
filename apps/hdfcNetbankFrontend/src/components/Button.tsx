type ButtonType = {
  label: string;
  enabled: boolean;
  onClick: () => void;
};

export default function Button({ label, onClick, enabled }: ButtonType) {
  return (
    <div className="py-2">
      <button
        className={`py-2 px-4 rounded-lg transition duration-200 ${
          enabled
            ? "bg-black text-white hover:bg-yellow-500 active:bg-yellow-800 cursor-pointer"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
        onClick={onClick}
        disabled={!enabled}
      >
        {label}
      </button>
    </div>
  );
}
