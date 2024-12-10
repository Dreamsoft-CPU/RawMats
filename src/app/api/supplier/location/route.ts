import { NextRequest, NextResponse } from "next/server";

function extractCoordinatesFromLink(link: string) {
  const coordMatch = link.match(/place\/([^,]+),([^,\/]+)/);

  if (coordMatch) {
    const [, latitude, longitude] = coordMatch;
    return {
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
    };
  }

  throw new Error("Could not extract coordinates from the link");
}

export const POST = async (request: NextRequest) => {
  try {
    const { locationLink } = await request.json();
    const { latitude, longitude } = extractCoordinatesFromLink(locationLink);
    const API_KEY = process.env.GOOGLE_MAPS_API_KEY as string;
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${API_KEY}`,
      {
        next: {
          revalidate: 36000,
        },
        cache: "force-cache",
      },
    );

    const data = await response.json();
    const locationName = data.results[0]?.formatted_address;
    return NextResponse.json({ locationName });
  } catch (error) {
    console.error("Error fetching location name:", error);
    return NextResponse.json({ locationName: null });
  }
};
