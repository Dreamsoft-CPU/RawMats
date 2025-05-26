import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json(
      { error: "Query parameter 'q' is required" },
      { status: 400 },
    );
  }

  const apiKey = process.env.LOCATIONIQ_API_KEY;

  try {
    const response = await fetch(
      `https://us1.locationiq.com/v1/search.php?key=${apiKey}&q=${encodeURIComponent(query)}&format=json`,
    );

    if (!response.ok) {
      throw new Error(`LocationIQ API error: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.length === 0) {
      return NextResponse.json({ error: "No results found" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to geocode location";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
