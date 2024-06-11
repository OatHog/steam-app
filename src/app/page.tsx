"use client";

import useSWR, { mutate } from "swr";
import PlayerCard from "./components/PlayerCard";
import { PlayerSummary } from "@/types/Player";
import { useEffect, useState } from "react";

export default function Home() {
  const fetcher = (url: RequestInfo) => fetch(url).then((res) => res.json());
  const { data, error, isLoading } = useSWR(`/api/playersummaries`, fetcher);

  const [shouldFetch, setShouldFetch] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setShouldFetch(true); // Trigger refetch
    }, 300000); // Fetch every 5 minutes

    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  useEffect(() => {
    if (shouldFetch) {
      mutate([], false); // Manually trigger SWR to refetch without modifying data
      setShouldFetch(false);
    }
  }, [shouldFetch]);

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
