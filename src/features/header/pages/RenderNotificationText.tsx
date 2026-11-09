import { Notification } from "../interfaces/headerInterfaces";

export default function RenderNotificationText({notif}: {notif:Notification}) {
    switch (notif.type) {
      case "follow":
        return "started following you.";
      case "like":
        return "liked your post.";
      case "comment":
        return (
          <>
            commented on your post:{" "}
            {notif.text && (
              <span className="italic text-gray-600">
                &quot;{notif.text}&quot;
              </span>
            )}
          </>
        );
      case "reply":
        return (
          <>
            replied to your comment:{" "}
            {notif.text && (
              <span className="italic text-gray-600">
                &quot;{notif.text}&quot;
              </span>
            )}
          </>
        );
      case "follow_request":
        return "sent you a follow request.";
      default:
        return notif.text || "sent you a notification.";
    }
}
