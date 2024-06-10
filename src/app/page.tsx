"use client";

import Image from "next/image";
import Link from "next/link";
import useSWR from "swr";

export default function Home() {
  const fetcher = (url: RequestInfo) => fetch(url).then((res) => res.json());
  const { data } = useSWR(`/api/playersummaries`, fetcher);

  return (
    <main className="flex max-h-screen flex-col items-center p-24 text-white text-xl font-bold">
      <p className="m-3 mb-12">Welcome to my Steam API application.</p>
      <p className="font-normal">
        Here I will be exploring the <strong>Steam API</strong>, both to
        familiarise myself with{" "}
        <strong>React</strong> as well as{" "}
        <strong>learning how to use APIs</strong> in general.
        <br />
        <br />
        Click on a user`s name to view info about their owned games.
      </p>
      <section className="my-16 container">
        <div className="rounded-lg items-center border border-white border-opacity-10">
          <div className="flex py-6 my-auto rounded-md">
            <div className="flex my-auto ml-5 mr-4">
              <div className="w-20 h-20 flex items-center justify-center rounded-lg">
                {data?.steam.getAvatar ? (
                  <Image
                    className="rounded-lg"
                    src={data?.steam.getAvatar}
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
                  href="/user"
                  className="text-md sm:text-xl text-white hover:underline cursor-pointer"
                >
                  {data?.steam.getPersonName
                    ? data?.steam.getPersonName
                    : "Loading user data..."}
                </Link>
                {data?.steam.getGames === false ? (
                  <p className="text-md sm:text-lg text-white font-semibold">
                    {data?.steam.getStatus
                      ? data?.steam.getStatus
                      : "Loading user status..."}
                  </p>
                ) : (
                  <p className="text-white font-normal">
                    {data?.steam.getGames}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
