import { NextResponse } from "next/server";

export async function GET() {
  const found: { ip: string }[] = [];

  const tasks: Promise<void>[] = [];

  for (let i = 20; i <= 30; i++) {
    const ip = `192.168.1.${i}`;

    tasks.push(
      (async () => {
        try {
          const controller = new AbortController();

          const timeout = setTimeout(() => {
            controller.abort();
          }, 500);

          const res = await fetch(`http://${ip}/ping`, {
            signal: controller.signal,
            cache: "no-store",
          });

          clearTimeout(timeout);

          if (!res.ok) return;

          const text = await res.text();

          if (text.trim() === "OK") {
            found.push({ ip });
          }
        } catch {
          // abaikan IP yang tidak merespons
        }
      })()
    );
  }

  await Promise.all(tasks);

  return NextResponse.json({
    success: true,
    devices: found,
  });
}