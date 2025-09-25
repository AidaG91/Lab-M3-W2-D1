import styles from "./SongCard.module.css";

export default function SongCard({ song }) {
  const { titulo, artista, album, imagenAlbum, duracion, valoracion } =
    song ?? {};

  return (
    <li className={styles.card}>
      <img
        className={styles.imagenAlbum}
        src={imagenAlbum}
        alt={`Carátula de ${album || "Sin álbum"}`}
        loading="lazy"
        width="300"
        height="300"
        onError={(e) => {
          e.currentTarget.src = "https://placehold.co/300x300?text=No+Image";
        }}
      />
      <div className={styles.body}>
        <h3 className={styles.titulo}>{titulo}</h3>
        <h2 className={styles.artista}>{artista}</h2>
        <div className={styles.meta}>
          <span className={styles.duracion}>{duracion} min</span>
          <span className={styles.album}>{album}</span>
          <span className={styles.valoracion}>★ {valoracion}</span>
        </div>
      </div>
    </li>
  );
}
