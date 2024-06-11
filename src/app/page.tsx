"use client";

import Image from "next/image";
import Link from "next/link";
import useSWR from "swr";
import PlayerCard from "./components/PlayerCard";
import { Player, PlayerSummary } from "@/types/Player";

export default function Home() {
  const fetcher = (url: RequestInfo) => fetch(url).then((res) => res.json());
  const { data, error, isLoading } = useSWR(`/api/playersummaries`, fetcher);

  if (error) return <div>Failed to load data: {error.message}</div>;
  if (isLoading) return <div>Loading...</div>;
  if (!data?.steam || data.steam.length === 0)
    return <div>No player data found.</div>;

  return (
    <main className="flex max-h-screen flex-col items-center p-24 text-white text-xl font-bold">
      <p className="m-3 mb-12">Welcome to my Steam API application.</p>
      <p className="font-normal">
        Here I will be exploring the <strong>Steam API</strong>, both to
        familiarise myself with <strong>React</strong> as well as{" "}
        <strong>learning how to use APIs</strong> in general.
        <br />
        <br />
        Click on a user`s name to view info about their owned games.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {data.steam.map((player: PlayerSummary) => (
          <PlayerCard key={player.getPersonName} player={player} />
        ))}
      </div>
    </main>
  );
}
