"use client";

import useSWR, { mutate } from "swr";
import PlayerCard from "./components/PlayerCard";
import { PlayerSummary } from "@/types/Player";
import { useEffect, useMemo, useState } from "react";
import useIntervalFetch from "./hooks/useSetInterval";
import PlayerDataDisplay from "./components/PlayerDataDisplay";

export default function Home() {
  const url = useMemo(() => "/api/playersummaries", []);
  const { data, error, isLoading } = useIntervalFetch(url, 300000)

  return <PlayerDataDisplay data={data} error={error} isLoading={isLoading} />;
}
