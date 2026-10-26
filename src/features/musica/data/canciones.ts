export type Cancion = {
  slug: string;
  title: string;
  artist: string;
  album: string;
  cover: string;
  /** id de la canción en Spotify (lo que va después de /track/ en el link) */
  spotifyId: string;
};

export const canciones: Cancion[] = [
  {
    slug: "still-loving-you",
    title: "Still Loving You",
    artist: "Scorpions",
    album: "Love at First Sting",
    cover: "/images/discos/still-loving-you.jpg",
    spotifyId: "7kjsCbksOZotNNHOvKsJJh",
  },
  {
    slug: "dull-knives",
    title: "Dull Knives",
    artist: "The Warning",
    album: "Queen of the Murder Scene",
    cover: "/images/discos/dull-knives.jpg",
    spotifyId: "17qrNfLq2XLWTlXO7jn4p7",
  },
  {
    slug: "nightmare",
    title: "Nightmare",
    artist: "Halsey",
    album: "Nightmare",
    cover: "/images/discos/nightmare.jpg",
    spotifyId: "5Qv5p14Fw2J5enzLBP87zZ",
  },
  {
    slug: "hey-you",
    title: "Hey You",
    artist: "Pink Floyd",
    album: "The Wall",
    cover: "/images/discos/hey-you.jpg",
    spotifyId: "7F02x6EKYIQV3VcTaTm7oN",
  },
  {
    slug: "ahora-nada-es-imposible",
    title: "Ahora nada es imposible",
    artist: "Margarita Siempre Viva",
    album: "Un lugar más cierto",
    cover: "/images/discos/ahora-nada-es-imposible.jpg",
    spotifyId: "7bPkgJumKnMSudLZBgB70b",
  },
  {
    slug: "lonely-is-the-muse",
    title: "Lonely is the Muse",
    artist: "Halsey",
    album: "If I Can't Have Love, I Want Power",
    cover: "/images/discos/lonely-is-the-muse.jpg",
    spotifyId: "0V9sq5IPNBuIle9jxB78RA",
  },
];
