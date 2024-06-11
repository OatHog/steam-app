"use client";

import { useMemo } from "react";
import useIntervalFetch from "./hooks/useSetInterval";
import PlayerDataDisplay from "./components/PlayerDataDisplay";
import useSWR from "swr";

export default function Home() {
  const fetcher = (url: string) => fetch(url).then((r) => r.json());
  const { data, error, isLoading } = useSWR("/api/playersummaries", fetcher, {
    refreshInterval: 300000,
  });

  return <PlayerDataDisplay data={data} error={error} isLoading={isLoading} />;
}
