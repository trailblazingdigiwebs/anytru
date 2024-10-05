import { formatDistanceToNow, parseISO, differenceInSeconds, differenceInMinutes, differenceInHours, differenceInDays, differenceInMonths, differenceInYears } from 'date-fns';

export function timeAgo(date) {
  try {
    const parsedDate = parseISO(date);
    const now = new Date();

    const seconds = differenceInSeconds(now, parsedDate);
    if (seconds < 60) {
      return `${seconds} sec${seconds > 1 ? 's' : ''} ago`;
    }

    const minutes = differenceInMinutes(now, parsedDate);
    if (minutes < 60) {
      return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
    }

    const hours = differenceInHours(now, parsedDate);
    if (hours < 24) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    }

    const days = differenceInDays(now, parsedDate);
    if (days < 30) {
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }

    const months = differenceInMonths(now, parsedDate);
    if (months < 12) {
      return `${months} month${months > 1 ? 's' : ''} ago`;
    }

    const years = differenceInYears(now, parsedDate);
    return `${years} year${years > 1 ? 's' : ''} ago`;
  } catch (error) {
    console.error("Invalid date format:", date, error);
    return "Invalid date";
  }
}
