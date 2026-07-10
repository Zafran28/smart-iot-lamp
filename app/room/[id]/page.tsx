"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import BottomNav from "@/app/components/BottomNav";
import { rooms, Room } from "@/app/data/rooms";

export default function RoomPage() {
  const router = useRouter();
  const params = useParams();

  const [room, setRoom] = useState<Room | null>(null);
  const [relay, setRelay] = useState<boolean[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const id = params?.id as string;

    const found = rooms.find((r) => r.id === id);

    if (!found) {
      router.replace("/rooms");
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRoom(found);
    setRelay([false, false, false, false, false, false]);
  }, [params, router]);

  const toggleRelay = async (index: number) => {
    if (!room) return;

    const next = !relay[index];

    try {
      setLoading(true);

      const res = await fetch(
        `http://${room.ip}/relay?id=${index + 1}&state=${next ? 1 : 0}`
      );

      if (!res.ok) throw new Error();

      setRelay((prev) => {
        const copy = [...prev];
        copy[index] = next;
        return copy;
      });
    } catch {
      alert("ESP tidak respon");
    } finally {
      setLoading(false);
    }
  };

  if (!room) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#0B1220] text-white">
        Loading...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0B1220] text-white pb-24">
      <div className="p-6">

        <button
          onClick={() => router.push("/rooms")}
          className="text-blue-400 mb-4"
        >
          ← Back
        </button>

        <h1 className="text-3xl font-bold">{room.name}</h1>
        <p className="text-gray-400">{room.ip}</p>

        <div className="grid gap-4 mt-6">
          {room.devices.map((d, i) => (
            <div
              key={i}
              className="bg-[#161F2F] p-4 rounded-xl border border-zinc-800 flex justify-between"
            >
              <div>
                <h2 className="font-semibold">{d}</h2>
                <p className="text-sm text-gray-500">
                  {relay[i] ? "ON" : "OFF"}
                </p>
              </div>

              <button
                disabled={loading}
                onClick={() => toggleRelay(i)}
                className={`px-4 py-2 rounded-lg ${
                  relay[i] ? "bg-green-600" : "bg-zinc-700"
                }`}
              >
                {relay[i] ? "ON" : "OFF"}
              </button>
            </div>
          ))}
        </div>

      </div>

      <BottomNav />
    </main>
  );
}