"use client";

import { usePathname, useRouter } from "next/navigation";

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  const menu = [
    { id: "home", icon: "🏠", path: "/" },
    { id: "devices", icon: "💡", path: "/devices" },
    { id: "rooms", icon: "🏡", path: "/rooms" },
    { id: "scenes", icon: "⚡", path: "/scenes" },
    { id: "profile", icon: "👤", path: "/profile" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#0b0f14] border-t border-zinc-800 z-50">
      <div className="flex justify-around py-3 text-xs">

        {menu.map((item) => {
          const active = pathname === item.path;

          return (
            <button
              key={item.id}
              onClick={() => router.push(item.path)}
              className={`flex flex-col items-center ${
                active ? "text-white" : "text-gray-500"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
            </button>
          );
        })}

      </div>
    </div>
  );
}