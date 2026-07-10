"use client";

import { useRouter } from "next/navigation";
import BottomNav from "@/app/components/BottomNav";
import { rooms } from "@/app/data/rooms";

export default function RoomsPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#0B1220] text-white pb-24">
      <div className="p-6">

        <h1 className="text-2xl font-bold">🏡 Rooms</h1>
        <p className="text-gray-400">Pilih ruangan</p>

        <div className="grid gap-4 mt-6">
          {rooms.map((room) => (
            <div
              key={room.id}
              onClick={() => router.push(`/room/${room.id}`)} // 🔥 PENTING
              className="bg-[#161F2F] p-4 rounded-xl border border-zinc-800 cursor-pointer"
            >
              <h2 className="font-bold">{room.name}</h2>
              <p className="text-sm text-gray-400">{room.ip}</p>
            </div>
          ))}
        </div>

      </div>

      <BottomNav />
    </main>
  );
}