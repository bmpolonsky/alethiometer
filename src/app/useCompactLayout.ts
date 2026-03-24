import { useEffect, useState } from "react";

const COMPACT_LAYOUT_MEDIA = "(max-width: 960px)";

function getCompactLayoutMatch() {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }

  return window.matchMedia(COMPACT_LAYOUT_MEDIA).matches;
}

export function isCompactLayoutViewport() {
  return getCompactLayoutMatch();
}

export function useCompactLayout() {
  const [isCompactLayout, setIsCompactLayout] = useState(getCompactLayoutMatch);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return;
    }

    const mediaQuery = window.matchMedia(COMPACT_LAYOUT_MEDIA);
    const handleChange = (event: MediaQueryListEvent) => {
      setIsCompactLayout(event.matches);
    };

    setIsCompactLayout(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return isCompactLayout;
}
