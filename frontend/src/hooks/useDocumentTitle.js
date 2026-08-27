import { useEffect } from "react";

const useDocumentTitle = (title, addAppName = true) => {
  useEffect(() => {
    const appName = "GiggleGrid";
    const previousTitle = document.title;

    document.title = addAppName ? `${title} | ${appName}` : title;

    return () => {
      document.title = previousTitle;
    };
  }, [title, addAppName]);
};

export default useDocumentTitle;
