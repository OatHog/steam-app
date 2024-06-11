"use client";

import PlayerDataDisplay from "./components/PlayerDataDisplay";
import useSWR from "swr";

export default function Home() {
  const fetcher = (url: string) => fetch(url).then((r) => r.json());
  const { data, error, isLoading } = useSWR("/api/playersummaries", fetcher, {
    refreshInterval: 300000,
    // revalidateIfStale: true,
  });

  return <PlayerDataDisplay data={data} error={error} isLoading={isLoading} />;
}
