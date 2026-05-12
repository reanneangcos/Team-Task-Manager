const apiBaseUrl = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000/api";

const getApiOrigin = () => {
  try {
    return new URL(apiBaseUrl).origin;
  } catch {
    return "";
  }
};

export const getMediaUrl = (url?: string | null) => {
  if (!url) {
    return "";
  }

  if (url.startsWith("data:") || url.startsWith("blob:") || url.startsWith("//")) {
    return url;
  }

  const apiOrigin = getApiOrigin();

  if (/^https?:\/\//i.test(url)) {
    try {
      const mediaUrl = new URL(url);

      if (
        apiOrigin &&
        mediaUrl.hostname === "localhost" &&
        !mediaUrl.port &&
        mediaUrl.pathname.startsWith("/storage/")
      ) {
        return `${apiOrigin}${mediaUrl.pathname}${mediaUrl.search}${mediaUrl.hash}`;
      }
    } catch {
      return url;
    }

    return url;
  }

  if (!apiOrigin) {
    return url;
  }

  return `${apiOrigin}${url.startsWith("/") ? url : `/${url}`}`;
};
