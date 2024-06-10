import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const playersummaries_endpoint = `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${process.env.STEAM_API_KEY}&steamids=${process.env.STEAM_ID}`;
  
  try {
    const response = await fetch(playersummaries_endpoint, {
      method: "GET",
    });

    if (response.status === 200) {
      const steam = await response.json();

      if (!steam?.response?.players?.length) {
        return NextResponse.json(
          { steam: { personastate: "Offline" } },
          { status: 200 }
        );
      }

      const {
        personaname,
        avatarfull,
        personastate,
        gameextrainfo,
        profileurl,
      } = steam.response.players[0];

      const getStatus =
        personastate === 1
          ? "Online"
          : personastate === 2
            ? "Busy"
            : personastate === 3
              ? "Away"
              : "Offline";

      const getGames = gameextrainfo ? `Playing - ${gameextrainfo}` : false;

      return NextResponse.json(
        {
          steam: {
            getPersonName: personaname,
            getAvatar: avatarfull,
            getStatus,
            getGames,
            getProfileUrl: profileurl,
          },
        },
        { status: 200 }
      );
    } else {
      throw new Error(`Steam API returned status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error fetching Steam data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
