"use client";

import React, { Fragment } from "react";
import GameTile from "../components/GameTile";
import useSWR from "swr";
import Link from "next/link";
import { redirect, useSearchParams } from "next/navigation";
import { IoArrowBack } from "react-icons/io5";

type Props = {};

export default function Page({}: Props) {
  const searchParams = useSearchParams();
  const steamId = searchParams.get("steamid");
  const fetcher = (url: RequestInfo) => fetch(url).then((res) => res.json());
  const { data, error, isLoading } = useSWR(
    `/api/recentlyplayedgames?steamid=${steamId}`,
    fetcher
  );

  if (!steamId) {
    redirect("/");
  }

  if (error) return <div>Failed to load data: {error.message}</div>;
  if (isLoading) return <div>Loading...</div>;
  if (!data || !data.response || !data.response.games)
    return <div>No games found.</div>;

  return (
    <>
      <Link
        href="/"
        className="text-white text-xl font-bold hover:underline cursor-pointer flex flex-row mt-12 mx-24"
      >
        <IoArrowBack className="text-white text-2xl mr-2" />
        Return
      </Link>

      <div className="flex flex-col items-center m-24 mt-12 text-white text-xl font-bold">
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
    </>
  );
}
