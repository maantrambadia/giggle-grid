import { HugeiconsIcon } from "@hugeicons/react";
import { Alert02Icon, SentIcon } from "@hugeicons/core-free-icons";

const StateMessage = ({
  title,
  description,
  variant = "danger",
  className = "",
}) => {
  const isDanger = variant === "danger";

  return (
    <div
      className={`flex items-center gap-2 text-sm ${
        isDanger ? "text-danger" : "text-muted-foreground"
      } ${className}`}
    >
      <HugeiconsIcon
        icon={isDanger ? Alert02Icon : SentIcon}
        strokeWidth={2}
        className="size-5"
      />
      <span>
        {title ? <span className="font-medium">{title}. </span> : null}
        {description ? <span>{description}</span> : null}
      </span>
    </div>
  );
};

export default StateMessage;
