"use client";

import { useState } from "react";

export default function PairPage() {
  const [ssid, setSsid] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const connectDevice = async () => {
    setLoading(true);
    setStatus("Connecting...");

    try {
      const res = await fetch("http://192.168.4.1/setup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ssid,
          password,
        }),
      });

      if (res.ok) {
        setStatus(
          "Configuration sent. Device will restart."
        );
      } else {
        setStatus("Failed to connect.");
      }
    } catch {
      setStatus("Cannot reach ESP8266.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0b0f14] text-white p-6">
      <h1 className="text-2xl font-bold mb-6">
        Pair New Device
      </h1>

      <input
        value={ssid}
        onChange={(e) => setSsid(e.target.value)}
        placeholder="WiFi SSID"
        className="w-full p-3 rounded-lg bg-zinc-800 mb-3"
      />

      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="WiFi Password"
        className="w-full p-3 rounded-lg bg-zinc-800 mb-4"
      />

      <button
        onClick={connectDevice}
        disabled={loading}
        className="w-full bg-green-600 py-3 rounded-lg"
      >
        {loading ? "Connecting..." : "Pair Device"}
      </button>

      <p className="mt-4 text-sm text-gray-400">
        {status}
      </p>
    </div>
  );
}