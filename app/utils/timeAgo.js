import { formatDistanceToNow, parseISO, differenceInSeconds, differenceInMinutes, differenceInHours, differenceInDays, differenceInMonths, differenceInYears } from 'date-fns';

export function timeAgo(date) {
  try {
    const parsedDate = parseISO(date);
    const now = new Date();

    const seconds = differenceInSeconds(now, parsedDate);
    if (seconds < 60) {
      return `${seconds}s`;
    }

    const minutes = differenceInMinutes(now, parsedDate);
    if (minutes < 60) {
      return `${minutes}m`;
    }

    const hours = differenceInHours(now, parsedDate);
    if (hours < 24) {
      return `${hours}h`;
    }

    const days = differenceInDays(now, parsedDate);
    if (days < 30) {
      return `${days}d`;
    }

    const months = differenceInMonths(now, parsedDate);
    if (months < 12) {
      return `${months}mo`;
    }

    const years = differenceInYears(now, parsedDate);
    return `${years}y`;
  } catch (error) {
    console.error("Invalid date format:", date, error);
    return "Invalid date";
  }
}
