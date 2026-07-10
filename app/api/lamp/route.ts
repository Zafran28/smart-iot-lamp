const ESP_IP = "http://192.168.1.37";

export async function POST(req: Request) {
  try {
    const { index, cmd } = await req.json();

    const url = `${ESP_IP}/${cmd}${index + 1}`;

    console.log("CALL ESP:", url);

    const res = await fetch(url, {
      method: "GET",
      cache: "no-store",
    });

    const text = await res.text();

    console.log("ESP RESPONSE:", text);

    return Response.json({
      ok: true,
      url,
      response: text,
    });

  } catch (err) {
    console.error("API ERROR:", err);

    return Response.json(
      { ok: false, error: String(err) },
      { status: 500 }
    );
  }
}