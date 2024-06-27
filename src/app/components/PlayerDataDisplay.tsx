import React, { useEffect, useState } from "react";
import PlayerCard from "./PlayerCard";
import { Player, PlayerSummary } from "@/types/Player";
import useSWR from "swr";
import GameTile from "./GameTile";
import SharedGameTile from "./SharedGameTile";

type Props = { data: any; error: any; isLoading: any };

export default function PlayerDataDisplay({ data, error, isLoading }: Props) {
  const [selectedPlayers, setSelectedPlayers] = useState<PlayerSummary[]>([]);

  const handlePlayerSelection = (player: PlayerSummary) => {
    const isSelected = selectedPlayers.some(
      (selectedPlayer) => selectedPlayer.getSteamId === player.getSteamId,
    );
    const updatedSelection = isSelected
      ? selectedPlayers.filter(
          (selectedPlayer) => selectedPlayer.getSteamId !== player.getSteamId,
        )
      : [...selectedPlayers, player];
    setSelectedPlayers(updatedSelection);
  };

  // Handle fetching shared games for selected users
  const [sharedGames, setSharedGames] = useState<SteamGame[]>([]);

  // TODO: Figure out why this returns a 500 error so often.
  useEffect(() => {
    const fetchSharedGames = async () => {
      if (selectedPlayers.length === 0) {
        setSharedGames([]);
        return;
      }

      try {
        // Fetch games for all selected players concurrently
        const allPlayersGamesPromises = selectedPlayers.map((player) =>
          fetch(`api/ownedgames?steamid=${player.getSteamId}`)
            .then((res) => res.json())
            .then((data) => data.response.games),
        );

        const allPlayersGames = await Promise.all(allPlayersGamesPromises);

        // Find common games across all players
        const sharedGames = allPlayersGames.reduce(
          (acc, playerGames, index) => {
            if (index === 0) {
              return playerGames; // Initialize with the first player's games
            }
            // Keep only games that are present in both the accumulator and the current player's games
            return acc.filter((accGame: SteamGame) =>
              playerGames.some(
                (game: SteamGame) => game.appid === accGame.appid,
              ),
            );
          },
          [],
        );

        setSharedGames(sharedGames);
      } catch (error) {
        console.error("Error fetching shared games:", error);
        setSharedGames([]); // Handle error by clearing shared games
      }
    };

    fetchSharedGames();
  }, [selectedPlayers]);

  if (error) return <div>Failed to load data: {error.message}</div>;
  if (isLoading) return <div>Loading...</div>;
  if (!data?.steam || data.steam.length === 0)
    return <div>No player data found.</div>;

  return (
    <main className="flex max-h-screen flex-col items-center p-24 text-white text-xl font-bold textcen">
      <p className="m-3 mb-12">Welcome to my Steam API application.</p>
      <p className="font-normal text-pretty stroke-black">
        Here I will be exploring the <strong>Steam API</strong>, both to
        familiarise myself with <strong>React</strong> as well as{" "}
        <strong>learning how to use APIs</strong> in general.
        <br />
        <br />
        Click on a user&apos;s name to view info about their owned games.
        <br />
        <br />
        Alternatively, you can select multiple users to see what games they all
        own in common.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {data.steam
          .sort((a: PlayerSummary, b: PlayerSummary) =>
            a.getPersonName.localeCompare(b.getPersonName),
          )
          .map((player: PlayerSummary) => (
            <PlayerCard
              key={player.getSteamId}
              player={player}
              isSelected={selectedPlayers.includes(player)}
              onPlayerSelection={handlePlayerSelection}
            />
          ))}
      </div>
      <hr />
      <p className="mt-12 font-bold text-pretty my-6">
        {selectedPlayers.length > 0 ? (
          <>
            {selectedPlayers.length === 1 ? (
              <span key={selectedPlayers[0].getSteamId}>
                {selectedPlayers[0].getPersonName}
              </span>
            ) : (
              <>
                {selectedPlayers
                  .slice(0, selectedPlayers.length - 2)
                  .map((player) => (
                    <span key={player.getSteamId}>
                      {player.getPersonName}
                      {", "}
                    </span>
                  ))}
                {selectedPlayers.length > 2 ? (
                  <>
                    <span
                      key={
                        selectedPlayers[selectedPlayers.length - 2].getSteamId
                      }
                    >
                      {
                        selectedPlayers[selectedPlayers.length - 2]
                          .getPersonName
                      }
                    </span>
                    <span
                      key={
                        selectedPlayers[selectedPlayers.length - 1].getSteamId
                      }
                    >
                      {" and "}
                      {
                        selectedPlayers[selectedPlayers.length - 1]
                          .getPersonName
                      }
                    </span>
                  </>
                ) : (
                  <>
                    <span
                      key={
                        selectedPlayers[selectedPlayers.length - 1].getSteamId
                      }
                    >
                      {
                        selectedPlayers[selectedPlayers.length - 1]
                          .getPersonName
                      }{" "}
                      {" and "}
                    </span>
                    <span
                      key={
                        selectedPlayers[selectedPlayers.length - 2].getSteamId
                      }
                    >
                      {
                        selectedPlayers[selectedPlayers.length - 2]
                          .getPersonName
                      }
                    </span>
                  </>
                )}
              </>
            )}
            {selectedPlayers.length > 1 ? `${"'"}s` : `${"'"}s`} owned games.
          </>
        ) : (
          "No players selected yet."
        )}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {sharedGames.map((game: SteamGame) => (
          <SharedGameTile
            key={game.appid}
            gameName={game.name}
            gameIconUrl={game.img_icon_url}
          />
        ))}
      </div>
    </main>
  );
}
