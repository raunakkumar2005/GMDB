const proxyUrl = "https://api.allorigins.win/raw?url=";

export const fetchWikimediaImage = async (genre) => {
  const params = new URLSearchParams({
    action: "query",
    format: "json",
    origin: "*",
    prop: "imageinfo",
    generator: "search",
    gsrlimit: "1",
    gsrsearch: `${genre} anime`,
    iiprop: "url",
  });

  try {
    const wikimediaApiUrl = `https://commons.wikimedia.org/w/api.php?${params.toString()}`;
    const res = await fetch(proxyUrl + encodeURIComponent(wikimediaApiUrl));
    if (!res.ok) throw new Error("Wikimedia API error");

    const data = await res.json();
    const pages = data.query?.pages;

    if (!pages) return null;

    const firstPage = Object.values(pages)[0];
    return firstPage.imageinfo?.[0]?.url || null;
  } catch (e) {
    console.error("Wikimedia fetch failed:", e);
    return null;
  }
};
