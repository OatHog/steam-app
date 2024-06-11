import { useEffect, useRef, useState } from "react";
import useSWR, { Fetcher, mutate } from "swr";

export default function useIntervalFetch<Data = any>(
  url: string | null,
  interval: number,
  fetcher: Fetcher<Data> = (...args) => fetch(...args).then((res) => res.json())
) {
  const { data, error, mutate } = useSWR<Data>(url, fetcher, {
    revalidateOnFocus: false, // Prevent automatic refetching on focus
  });

  const intervalRef = useRef<ReturnType<typeof setInterval>>();
  const cacheBusterRef = useRef<number>(Date.now()); // Store timestamp in ref

  useEffect(() => {
    if (!url) return; // Don't run the interval if the URL is null

    const fetchData = async () => {
      try {
        await mutate(); // Trigger revalidation using the updated URL
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    intervalRef.current = setInterval(fetchData, interval);
    return () => {
      clearInterval(intervalRef.current);
    };
  }, [url, interval, mutate]); // Include mutate in dependency array

  useEffect(() => {
    // Update cacheBusterRef to prevent stale data
    cacheBusterRef.current = Date.now();
  }, [data]); // Only update when data changes

  return {
    data,
    error,
    isLoading: !error && !data,
  };
}

// export default function useIntervalFetch(url: string, interval: number) {
//   const { data, error } = useSWR(url);

//   const intervalRef = useRef<ReturnType<typeof setInterval>>();

//   useEffect(() => {
//     intervalRef.current = setInterval(() => {
//       console.log("Fetching data");
//       mutate();
//     }, interval);

//     return () => {
//       console.log("Clearing interval");
//       clearInterval(intervalRef.current);
//     };
//   }, [url, interval]);

//   return {
//     data,
//     error,
//     isLoading: !data && !error,
//   };
// }
