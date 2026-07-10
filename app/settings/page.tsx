"use client";

import BottomNav from "../components/BottomNav";

export default function SettingsPage() {
  const clearPairing = () => {
    localStorage.removeItem("esp_ip");
    alert("Pairing dihapus");
  };

  return (
    <div className="min-h-screen bg-[#0b0f14] text-white p-6 pb-24">
      <h1 className="text-2xl font-bold mb-6">
        Settings
      </h1>

      <button
        onClick={clearPairing}
        className="bg-red-600 px-4 py-3 rounded-lg"
      >
        Hapus Pairing
      </button>

      <BottomNav />
    </div>
  );
}