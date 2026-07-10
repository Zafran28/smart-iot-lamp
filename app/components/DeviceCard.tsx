"use client";

export default function DeviceCard({
  name,
  isOn,
  onToggle,
}: {
  name: string;
  isOn: boolean;
  onToggle: () => void;
}) {
  return (
    <div className={`p-5 rounded-2xl border transition-all
      ${isOn ? "bg-green-950/40 border-green-500" : "bg-zinc-900 border-zinc-700"}
    `}>

      <h3 className="font-semibold text-lg">{name}</h3>

      <p className={`text-sm mt-1 ${isOn ? "text-green-400" : "text-red-400"}`}>
        {isOn ? "ON" : "OFF"}
      </p>

      <div className="mt-4 flex justify-between items-center">

        <span className="text-xs text-gray-400">Power</span>

        <button
          onClick={onToggle}
          className={`w-14 h-8 flex items-center rounded-full p-1 transition
          ${isOn ? "bg-green-500 justify-end" : "bg-zinc-700 justify-start"}`}
        >
          <div className="w-6 h-6 bg-white rounded-full"></div>
        </button>

      </div>
    </div>
  );
}