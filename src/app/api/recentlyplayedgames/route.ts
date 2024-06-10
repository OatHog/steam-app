import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const steamId = searchParams.get("steamid") ?? "";
  const count = searchParams.get("count") ?? "";

  const endpoint = `http://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=${process.env.STEAM_API_KEY}&steamid=${process.env.STEAM_ID}&format=json${count ? `&count=${count}` : ""}`;

  try {
    const response = await fetch(endpoint);

    if (response.ok) {
      const data = await response.json();
      data.response.games = data.response.games.map((game: SteamGame) => ({
        ...game,
        img_icon_url: game.img_icon_url
          ? `${process.env.STEAM_IMAGE_BASE_URL}${game.appid}/${game.img_icon_url}.jpg`
          : null,
      }));
      return NextResponse.json(data);
    } else {
      return NextResponse.json(
        { error: "Failed to fetch data" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error fetching recently played games:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
