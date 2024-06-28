import { Player } from "@/types/Player";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const steamIds = [
    process.env.STEAM_ID,
    process.env.JARRYD_STEAM_ID,
    process.env.ROWAN_STEAM_ID,
    process.env.GERRY_STEAM_ID,
    process.env.MARCUS_STEAM_ID,
    process.env.ZUBAIR_STEAM_ID,
    process.env.JOHN_STEAM_ID,
    process.env.KAYLEIGH_STEAM_ID,
  ]
    .filter(Boolean)
    .join(",");

  const playersummaries_endpoint = `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${process.env.STEAM_API_KEY}&steamids=${steamIds}&format=json`;

  try {
    const response = await fetch(playersummaries_endpoint, {
      cache: "no-cache",
    });
    if (response.status === 200) {
      const steamData = await response.json();
      const players = steamData?.response?.players || [];

      const playerSummaries = players.map((player: Player) => ({
        getSteamId: player.steamid,
        getPersonName: player.personaname,
        getAvatar: player.avatarfull,
        getStatus:
          player.personastate === 1
            ? "Online"
            : player.personastate === 2
              ? "Busy"
              : player.personastate === 3
                ? "Away"
                : "Offline",
        getGames: player.gameextrainfo
          ? `Playing - ${player.gameextrainfo}`
          : false,
        getProfileUrl: player.profileurl,
      }));

      return NextResponse.json({ steam: playerSummaries }, { status: 200 });
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

// try {
//   const response = await fetch(playersummaries_endpoint, {
//     method: "GET",
//   });

//   if (response.status === 200) {
//     const steam = await response.json();

//     if (!steam?.response?.players?.length) {
//       return NextResponse.json(
//         { steam: { personastate: "Offline" } },
//         { status: 200 }
//       );
//     }

//     const {
//       personaname,
//       avatarfull,
//       personastate,
//       gameextrainfo,
//       profileurl,
//     } = steam.response.players[0];

//     const getStatus =
//       personastate === 1
//         ? "Online"
//         : personastate === 2
//           ? "Busy"
//           : personastate === 3
//             ? "Away"
//             : "Offline";

//     const getGames = gameextrainfo ? `Playing - ${gameextrainfo}` : false;

//     return NextResponse.json(
//       {
//         steam: {
//           getPersonName: personaname,
//           getAvatar: avatarfull,
//           getStatus,
//           getGames,
//           getProfileUrl: profileurl,
//         },
//       },
//       { status: 200 }
//     );
//   } else {
//     throw new Error(`Steam API returned status: ${response.status}`);
//   }
// } catch (error) {
//   console.error("Error fetching Steam data:", error);
//   return NextResponse.json(
//     { error: "Internal Server Error" },
//     { status: 500 }
//   );
// }
// }
