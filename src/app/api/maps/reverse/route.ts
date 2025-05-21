import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  if (!lat || !lon) {
    return NextResponse.json(
      { error: "Both 'lat' and 'lon' parameters are required" },
      { status: 400 },
    );
  }

  const apiKey = process.env.LOCATIONIQ_API_KEY;

  try {
    const response = await fetch(
      `https://us1.locationiq.com/v1/reverse.php?key=${apiKey}&lat=${lat}&lon=${lon}&format=json`,
    );

    if (!response.ok) {
      throw new Error(`LocationIQ API error: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to reverse geocode coordinates";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
