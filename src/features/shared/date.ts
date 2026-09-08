/**
 * Formats an ISO date string into a shorter date format
 * @param dateStr ISO date string from database
 */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "";

  const now = new Date();
  const diffInSeconds = (now.getTime() - date.getTime()) / 1000;

  if (diffInSeconds < 60) {
    return "À l'instant";
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return minutes + " minute" + (minutes > 1 ? "s" : "");
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return hours + " heure" + (hours > 1 ? "s" : "");
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return days + " jour" + (days > 1 ? "s" : "");
  } else if (diffInSeconds < 2419200) {
    const weeks = Math.floor(diffInSeconds / 604800);
    return weeks + " semaine" + (weeks > 1 ? "s" : "");
  }

  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}
