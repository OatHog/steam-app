import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Player, PlayerSummary } from "@/types/Player";

type Props = {
  player: PlayerSummary;
  isSelected: boolean;
  onPlayerSelection: (player: PlayerSummary) => void;
};

export default function PlayerCard({
  player,
  isSelected,
  onPlayerSelection,
}: Props) {
  const [isChecked, setIsChecked] = React.useState(isSelected);

  useEffect(() => {
    setIsChecked(isSelected);
  }, [isSelected]);

  const handleCheckboxChange = () => {
    // setIsChecked(!isChecked);
    onPlayerSelection(player);
    console.log(`Is Checked: ${isSelected}`);
  };

  return (
    <>
      <input
        id={`player-card-${player.getSteamId}`}
        type="checkbox"
        className="mx-2 hidden"
        checked={isSelected}
        onChange={handleCheckboxChange}
      />
      <label
        htmlFor={`player-card-${player.getSteamId}`}
        className={`mt-2 inline-flex items-center justify-between w-full text-gray-500 bg-white border-2 
              rounded-md cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 
              peer-checked:text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-800 
              dark:hover:bg-gray-700 ${isChecked ? "border-blue-600" : ""} border-gray-200`}
      >
        <div className="gap-4 w-full items-center backdrop-blur-md border-opacity-10 ">
          <div className="flex py-6 my-auto rounded-md mx-2">
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
                href={`/user?steamid=${player.getSteamId}&name=${player.getPersonName}`}
                className="text-md sm:text-xl text-white hover:underline cursor-pointer"
              >
                {player?.getPersonName ? (
                  <p className="mx-1">{player?.getPersonName}</p>
                ) : (
                  "Loading user data..."
                )}
              </Link>
              {player.getGames === false ? (
                <p className="text-md sm:text-lg text-white font-semibold mx-1">
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
      </label>
    </>
  );
}
