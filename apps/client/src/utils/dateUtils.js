import { formatDistanceToNow, format } from "date-fns";
function timeAgo(dateString) {
  try {
    // Handle MongoDB date format ($date with $numberLong)
    if (dateString && typeof dateString === "object" && dateString.$date) {
      const timestamp = Number(dateString.$date.$numberLong);
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    }

    // Handle regular date strings
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Unknown time";
  }
}

function formatFriendlyTimestamp(dateString) {
  try {
    if (dateString && typeof dateString === "object" && dateString.$date) {
      const timestamp = Number(dateString.$date.$numberLong);
      return format(new Date(timestamp), "HH:mm, MMM d");
    }

    // Handle regular date strings
    return format(new Date(dateString), "HH:mm, MMM d");
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Unknown date";
  }
}
export { timeAgo, formatFriendlyTimestamp };
