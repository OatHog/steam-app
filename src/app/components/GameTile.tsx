"use client";

import Image from "next/image";
import React from "react";
import { formatPlaytime } from "@/utils/formatPlaytime";

type Props = {
  gameName: string;
  totalPlayTime: number;
  twoWeekPlayTime: number;
  gameIconUrl: string | undefined;
};

export default function GameTile({
  gameName,
  gameIconUrl,
  twoWeekPlayTime,
  totalPlayTime,
}: Props) {
  return (
    <div className="rounded-lg bg-white dark:bg-gray-600/80 p-4 max-w-xs w-full flex flex-col">
      {gameIconUrl && (
        <div className="justify-center items-center flex flex-col">
          <Image
            src={gameIconUrl}
            width={48}
            height={48}
            alt={`${gameName} Icon`}
            className="mb-2 rounded-lg"
          />
          <h2 className="text-lg font-semibold mb-2">{gameName}</h2>
        </div>
      )}

      <p className="text-gray-600 dark:text-gray-300 text-sm">
        Total Playtime: {formatPlaytime(totalPlayTime)}
      </p>
      <p className="text-gray-600 dark:text-gray-300 text-sm">
        Last 2 Weeks: {formatPlaytime(twoWeekPlayTime)}
      </p>
    </div>
  );
}
