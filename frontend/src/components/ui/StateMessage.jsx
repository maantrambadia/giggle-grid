import { Card } from "@heroui/react";
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
    <Card
      variant="secondary"
      className={`mx-auto mt-10 w-full max-w-xl p-6 text-center ${className}`}
    >
      <div className="flex flex-col items-center gap-3">
        <div
          className={`flex size-12 items-center justify-center rounded-2xl ${
            isDanger
              ? "bg-danger/15 text-danger"
              : "bg-default/20 text-foreground"
          }`}
        >
          <HugeiconsIcon
            icon={isDanger ? Alert02Icon : SentIcon}
            strokeWidth={2}
            className="size-6"
          />
        </div>

        {title ? <div className="text-base font-semibold">{title}</div> : null}
        {description ? (
          <div className="text-sm text-muted-foreground">{description}</div>
        ) : null}
      </div>
    </Card>
  );
};

export default StateMessage;
