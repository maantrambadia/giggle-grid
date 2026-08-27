import { Spinner } from "@heroui/react";

const Loading = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Spinner size="xl" />
    </div>
  );
};

export default Loading;
