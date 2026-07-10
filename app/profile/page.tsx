"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function ProfilePage() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [name, setName] = useState("Smart Home User");
  const [edit, setEdit] = useState(false);
  const [showWifi, setShowWifi] = useState(false);

  const [espConnected, setEspConnected] = useState(false);
  const [deviceCount] = useState(6);
  const [activeDevice] = useState(2);

  const [espIP, setEspIP] = useState("");
  const [wifiName, setWifiName] = useState("Unknown");

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();

      if (data.user) {
        setUserEmail(data.user.email ?? null);

        const username =
          data.user.user_metadata?.full_name ||
          data.user.email?.split("@")[0] ||
          "Smart Home User";

        setName(username);
      }
    };

    getUser();
  }, []);

  useEffect(() => {
    const ip = localStorage.getItem("esp_ip");

    if (ip) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEspIP(ip);
    }
  }, []);

  useEffect(() => {
    if (!espIP) return;

    const checkESP = async () => {
      try {
        const ping = await fetch(`http://${espIP}/ping`, {
          cache: "no-store",
        });

        if (!ping.ok) {
          setEspConnected(false);
          return;
        }

        setEspConnected(true);

        try {
          const res = await fetch(`http://${espIP}/wifi`, {
            cache: "no-store",
          });

          if (res.ok) {
            const data = await res.json();

            if (data.ssid) {
              setWifiName(data.ssid);
            }
          }
        } catch {}

      } catch {
        setEspConnected(false);
      }
    };

    checkESP();

    const timer = setInterval(checkESP, 2000);

    return () => clearInterval(timer);
  }, [espIP]);

  const logout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  const wsURL = espIP
    ? `ws://${espIP}:81`
    : "-";

  return (
    <div className="min-h-screen bg-linear-to-b from-[#0b0f14] to-[#0f172a] text-white p-6 pb-24">

      {/* HEADER */}

      <div className="flex items-center gap-4">

        <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-green-500 to-emerald-700 flex items-center justify-center text-2xl font-bold">
          {(name || "U").charAt(0).toUpperCase()}
        </div>

        <div className="flex-1">

          {edit ? (
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-zinc-800 px-3 py-2 rounded-lg text-sm w-full outline-none"
            />
                      ) : (
            <>
              <h1 className="text-xl font-bold">{name}</h1>

              <p className="text-sm text-gray-300">
                {userEmail ?? "Belum login"}
              </p>

              <p className="text-xs text-gray-500 mt-1">
                Smart Home Dashboard
              </p>
            </>
          )}

        </div>

        <div className="flex flex-col gap-2">

          <button
            onClick={() => setEdit(!edit)}
            className="text-xs bg-zinc-800 hover:bg-zinc-700 px-3 py-2 rounded-lg transition"
          >
            {edit ? "Save" : "Edit"}
          </button>

          <button
            onClick={logout}
            className="text-xs bg-red-600 hover:bg-red-700 px-3 py-2 rounded-lg transition"
          >
            Logout
          </button>

        </div>

      </div>

      {/* STATUS CARD */}

      <div className="grid grid-cols-2 gap-3 mt-6">

        <div className="bg-[#121826] p-4 rounded-xl border border-zinc-800">
          <p className="text-xs text-gray-400">
            Devices
          </p>

          <p className="text-lg font-bold">
            {deviceCount}
          </p>
        </div>

        <div className="bg-[#121826] p-4 rounded-xl border border-zinc-800">
          <p className="text-xs text-gray-400">
            Active
          </p>

          <p className="text-lg font-bold text-green-400">
            {activeDevice}
          </p>
        </div>

      </div>

      {/* ESP STATUS */}

      <div className="mt-4 bg-[#121826] p-4 rounded-xl border border-zinc-800">

        <p className="text-xs text-gray-400">
          ESP8266 Connection
        </p>

        <div className="flex items-center gap-2 mt-2">

          <span
            className={`w-2 h-2 rounded-full ${
              espConnected
                ? "bg-green-400 animate-pulse"
                : "bg-red-500"
            }`}
          />

          <p
            className={`text-sm ${
              espConnected
                ? "text-green-400"
                : "text-red-400"
            }`}
          >
            {espConnected ? "Connected" : "Disconnected"}
          </p>

        </div>

        <p className="text-xs text-gray-500 mt-2">
          {espIP || "Belum memilih ESP8266"}
        </p>

        <p className="text-xs text-gray-500">
          {wsURL}
        </p>

      </div>

      {/* MENU */}

      <div className="mt-6 space-y-3">

        {/* WIFI SETTINGS */}

        <div className="bg-[#121826] rounded-xl border border-zinc-800 overflow-hidden">

          <button
            onClick={() => setShowWifi(!showWifi)}
            className="w-full p-4 flex items-center justify-between"
          >

            <div className="text-left">

              <p className="font-medium">
                WiFi Settings
              </p>

              <p className="text-xs text-gray-500">
                Configure ESP8266 Network
              </p>

            </div>

            <span
              className={`text-gray-400 transition-transform duration-300 ${
                showWifi ? "rotate-90" : ""
              }`}
            >
              ›
            </span>

          </button>
                    {showWifi && (
            <div className="border-t border-zinc-800 bg-[#0f172a] p-4 space-y-4">

              <div>
                <p className="text-xs text-gray-400">
                  WiFi Name (SSID)
                </p>

                <p className="font-medium">
                  {wifiName}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400">
                  ESP8266 IP Address
                </p>

                <p className="font-medium">
                  {espIP || "-"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400">
                  WebSocket URL
                </p>

                <p className="font-medium break-all">
                  {wsURL}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400">
                  Connection Status
                </p>

                <p
                  className={`font-medium ${
                    espConnected
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {espConnected
                    ? "Connected"
                    : "Disconnected"}
                </p>
              </div>

              <button
                onClick={() => window.location.reload()}
                className="w-full bg-green-600 hover:bg-green-700 transition py-3 rounded-xl font-medium"
              >
                Refresh Connection
              </button>

            </div>
          )}

        </div>

        {/* DEVICE MANAGEMENT */}

        <div className="bg-[#121826] p-4 rounded-xl border border-zinc-800 flex justify-between items-center cursor-pointer hover:bg-[#182133] transition">
          <p>Device Management</p>
          <span className="text-gray-500">›</span>
        </div>

        {/* AUTOMATION */}

        <div className="bg-[#121826] p-4 rounded-xl border border-zinc-800 flex justify-between items-center cursor-pointer hover:bg-[#182133] transition">
          <p>Automation</p>
          <span className="text-gray-500">›</span>
        </div>

        {/* ABOUT */}

        <div className="bg-[#121826] p-4 rounded-xl border border-zinc-800 flex justify-between items-center cursor-pointer hover:bg-[#182133] transition">
          <div>
            <p>About System</p>
            <p className="text-xs text-gray-500 mt-1">
              Floora Smart Home v1.0
            </p>
          </div>

          <span className="text-gray-500">›</span>
        </div>

      </div>

      {/* FOOTER */}

      <div className="mt-8 text-center text-xs text-gray-500 space-y-1">

        <p>
          Smart Home IoT System • ESP8266 + Next.js
        </p>

        <p>
          Logged in as{" "}
          <span className="text-green-400">
            {userEmail ?? "Guest"}
          </span>
        </p>

      </div>

    </div>
  );
}