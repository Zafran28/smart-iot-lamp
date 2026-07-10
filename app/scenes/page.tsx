"use client";

import { useState } from "react";

export default function ScenesPage() {
  const [activeScene, setActiveScene] = useState<number | null>(null);

  const scenes = [
    {
      name: "Good Morning",
      icon: "🌅",
      desc: "Nyalakan lampu + kipas + stop kontak",
      color: "from-yellow-500/20 to-orange-500/10",
    },
    {
      name: "Good Night",
      icon: "🌙",
      desc: "Matikan semua device",
      color: "from-blue-500/20 to-indigo-500/10",
    },
    {
      name: "Movie Time",
      icon: "🎬",
      desc: "Lampu redup + stop kontak TV ON",
      color: "from-purple-500/20 to-pink-500/10",
    },
    {
      name: "Away Mode",
      icon: "🚪",
      desc: "Semua device OFF untuk hemat listrik",
      color: "from-red-500/20 to-rose-500/10",
    },
    {
      name: "Relax Mode",
      icon: "🛋️",
      desc: "Lampu hangat + kipas pelan",
      color: "from-green-500/20 to-emerald-500/10",
    },
  ];

  const activateScene = (index: number) => {
    setActiveScene(index);

    // nanti di sini bisa kirim ke ESP:
    // ws.send("scene1") dll
    console.log("Scene activated:", scenes[index].name);
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-[#0b0f14] to-[#0f172a] text-white p-6 pb-24">

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Scenes</h1>
        <p className="text-gray-400 text-sm">
          Kontrol beberapa device sekaligus dengan 1 tombol
        </p>

        <div className="mt-4 bg-[#121826] p-3 rounded-xl border border-zinc-800">
          <p className="text-xs text-gray-400">Status</p>
          <p className="text-green-400 text-sm">
            Ready to execute scenes
          </p>
        </div>
      </div>

      {/* SCENE LIST */}
      <div className="space-y-4">

        {scenes.map((scene, i) => {
          const active = activeScene === i;

          return (
            <div
              key={i}
              className={`relative p-5 rounded-2xl border transition-all duration-300 overflow-hidden
                ${
                  active
                    ? `bg-linear-to-r ${scene.color} border-green-500 shadow-lg shadow-green-500/10`
                    : "bg-[#121826] border-zinc-800"
                }`}
            >

              {/* glow effect */}
              {active && (
                <div className="absolute inset-0 bg-green-500/5 blur-2xl" />
              )}

              <div className="relative flex justify-between items-center">

                {/* LEFT */}
                <div className="flex items-center gap-3">

                  {/* ICON */}
                  <div className="w-12 h-12 rounded-xl bg-black/30 flex items-center justify-center text-2xl border border-zinc-700">
                    {scene.icon}
                  </div>

                  <div>
                    <h3 className="font-semibold text-sm">
                      {scene.name}
                    </h3>

                    <p className="text-xs text-gray-400 mt-1">
                      {scene.desc}
                    </p>
                  </div>

                </div>

                {/* BUTTON */}
                <button
                  onClick={() => activateScene(i)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all
                    ${
                      active
                        ? "bg-green-500 text-black"
                        : "bg-zinc-800 text-white"
                    }`}
                >
                  {active ? "Active" : "Run"}
                </button>

              </div>
            </div>
          );
        })}

      </div>

      {/* FOOTER INFO */}
      <div className="mt-6 text-xs text-gray-500 text-center">
        Smart Scenes System • Ready for ESP8266 integration
      </div>

    </div>
  );
}