"use client";

import React, { Fragment, Suspense } from "react";
import GameTile from "../components/GameTile";
import useSWR from "swr";
import Link from "next/link";
import { redirect, useSearchParams } from "next/navigation";
import { IoArrowBack } from "react-icons/io5";
import { Loader2 } from "lucide-react";

type Props = {};

export default function Page({}: Props) {
  // Wrap the part using useSearchParams
  const Content = () => {
    const searchParams = useSearchParams();
    const steamId = searchParams.get("steamid");
    const playerName = searchParams.get("name");

    const fetcher = (url: RequestInfo) => fetch(url).then((res) => res.json());

    const { data, error, isLoading } = useSWR(
      `/api/recentlyplayedgames?steamid=${steamId}`,
      fetcher,
      {
        refreshInterval: 300000,
        revalidateOnFocus: true,
      }
    );

    const data2 = useSWR(`api/ownedgames?steamid=${steamId}`, fetcher, {
      refreshInterval: 300000,
      revalidateOnFocus: true,
    });
    console.dir(data);
    console.dir(data2.data);

    if (!steamId) {
      redirect("/");
    }

    if (error || data2.error)
      return (
        <div className="flex flex-col items-center m-24 mt-12 text-white text-xl font-bold">
          Failed to load data: {data}
        </div>
      );

    if (isLoading || data2.isLoading)
      return (
        <div className="flex flex-col items-center m-24 mt-12 text-white text-xl font-bold">
          <Loader2 className="text-white text-2xl animate-spin" />
        </div>
      );

    if (
      !data ||
      !data.response ||
      !data.response.games ||
      !data2.data.response ||
      !data2.data.response.games
    )
      return (
        <div className="flex flex-col items-center m-24 mt-12 text-white text-2xl font-bold">
          No games found or {playerName}&apos;s games are private.
        </div>
      );

    return (
      <>
        <div className="flex flex-col items-center m-24 mt-12 text-white text-xl font-bold">
          <p className="m-3 mb-8 text-3xl underline">
            {playerName}&apos;s recently played games
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {data.response.games.map((game: SteamGame) => (
              <GameTile
                key={game.appid}
                gameName={game.name}
                gameIconUrl={game.img_icon_url}
                totalPlayTime={game.playtime_forever}
                twoWeekPlayTime={game.playtime_2weeks}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-col items-center m-24 mt-12 text-white text-xl font-bold">
          <p className="m-3 mb-8 text-3xl underline">
            {playerName}&apos;s owned games
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {data2.data.response.games
              .slice()
              .sort((a: any, b: any) => {
                // Sort alphabetically by game name (case-insensitive)
                const nameA = a.name.toLowerCase();
                const nameB = b.name.toLowerCase();
                if (nameA < nameB) return -1;
                if (nameA > nameB) return 1;
                return 0;
              })
              .map((game: SteamGame) => (
                <GameTile
                  key={game.appid}
                  gameName={game.name}
                  gameIconUrl={game.img_icon_url}
                  totalPlayTime={game.playtime_forever}
                  twoWeekPlayTime={game.playtime_2weeks}
                />
              ))}
          </div>
        </div>
      </>
    );
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Link
        href="/"
        className="text-white text-xl font-bold hover:underline cursor-pointer flex flex-row mt-12 mx-24"
      >
        <IoArrowBack className="text-white text-2xl mr-2" />
        Return
      </Link>
      {/* Render the content wrapped in Suspense */}
      <Content />
    </Suspense>
  );
}
