import React from "react";
import Image from "next/image";
import { formatPlaytime } from "@/utils/formatPlaytime";

type Props = {
  gameName: string;
  gameIconUrl: string | undefined;
};

export default function SharedGameTile({ gameIconUrl, gameName }: Props) {
  return (
    <div className="rounded-lg bg-white bg-gray-600/50 backdrop-blur-md p-4 max-w-sm w-full flex flex-col">
      {gameIconUrl && (
        <div className="justify-center items-center flex flex-col">
          <Image
            src={gameIconUrl}
            width={60}
            height={60}
            alt={`${gameName} Icon`}
            className="mb-2 rounded-lg"
          />
          <h2 className="text-lg font-semibold mb-2">{gameName}</h2>
        </div>
      )}
    </div>
  );
}
