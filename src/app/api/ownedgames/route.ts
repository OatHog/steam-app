import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const steamId = searchParams.get("steamid") ?? ""; // Get steamid from query parameters
  const count = searchParams.get("count") ?? "";

  const baseUrl = "http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/";
  const apiKey = process.env.STEAM_API_KEY;

  const endpoint = new URL(baseUrl);
  endpoint.searchParams.set("key", apiKey!)
  endpoint.searchParams.set("steamid", steamId)
  endpoint.searchParams.set("format", "json")
  endpoint.searchParams.set("include_appinfo", "true");

  if (count) {
    endpoint.searchParams.set("count", count);
  }

  // const endpoint = `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=
  //           ${process.env.STEAM_API_KEY}&steamid=${steamId}&format=json${count ? `&count=${count}` : ""}`;

  try {
    const response = await fetch(endpoint, {
      cache: "no-cache",
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Steam API returned status: ${response.status}: ${errorText}`
      );
    }

    const data = await response.json();
    data.response.games = data.response.games.map((game: SteamGame) => ({
      ...game,
      img_icon_url: game.img_icon_url
        ? `${process.env.STEAM_IMAGE_BASE_URL}${game.appid}/${game.img_icon_url}.jpg`
        : null,
    }));

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching owned games:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
