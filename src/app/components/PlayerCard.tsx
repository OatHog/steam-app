import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Player, PlayerSummary } from "@/types/Player";

type Props = { player: PlayerSummary };

export default function PlayerCard({ player }: Props) {
  return (
    <section className="mt-6 mb-6 container max-w-2xl">
      <div className="rounded-lg items-center border border-white border-opacity-10">
        <div className="flex py-6 my-auto rounded-md">
          <div className="flex my-auto ml-5 mr-4">
            <div className="w-20 h-20 flex items-center justify-center rounded-lg">
              {player.getAvatar ? (
                <Image
                  className="rounded-lg"
                  src={player.getAvatar}
                  width={100}
                  height={100}
                  alt="steam profile picture"
                />
              ) : (
                <div></div>
              )}
            </div>
            <div className="my-auto ml-3">
              <Link
                href={`/user?steamid=${player.getSteamId}`}
                className="text-md sm:text-xl text-white hover:underline cursor-pointer"
              >
                {player?.getPersonName
                  ? player?.getPersonName
                  : "Loading user data..."}
              </Link>
              {player.getGames === false ? (
                <p className="text-md sm:text-lg text-white font-semibold">
                  {player.getStatus
                    ? player.getStatus
                    : "Loading user status..."}
                </p>
              ) : (
                <p className="text-white font-normal">{player.getGames}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
