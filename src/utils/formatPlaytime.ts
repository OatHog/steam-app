export function formatPlaytime(minutes: number): string {
  if (minutes === 0) return "Never played.";

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  let formattedTime = "";

  if (hours > 0) {
    formattedTime += `${hours} hour${hours > 1 ? "s" : ""}`;
  }

  if (remainingMinutes > 0) {
    formattedTime += `${hours > 0 ? " " : ""}${remainingMinutes} minute${remainingMinutes > 1 ? "s" : ""}`;
  }

  return formattedTime;
}
