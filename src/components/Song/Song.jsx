import { useEffect, useState } from "react";
import styles from "./Song.module.css";

export default function Song() {
  const [song, setSong] = useState([]);
  const [state, setState] = useState({ loading: true, error: null });

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/songs.json", { cache: "no-store" });
        if (!res.ok) throw new Error("Ha habido un error en la carga");
        const data = await res.json();
        setSong(Array.isArray(data) ? data.slice(0, 10) : []);
        setState({ loading: false, error: null });
      } catch (err) {
        setState({
          loading: false,
          error: err.message || "Error cargango el JSON",
        });
      }
    };
    load();
  }, []);

  if (state.loading)
    return <p className={styles.status}>Cargando canciones...</p>;
  if (state.error)
    return <p className={styles.statusError}>Error: {state.error}</p>;
  if (!song.length)
    return <p className={styles.status}>No hay canciones que mostrar.</p>;

  return (
    <section className={styles.list}>
      <header className={styles.header}>
        <h2>Canciones</h2>
        <p>Mis canciones favoritas</p>
        <span className={styles.count}>{song.length}</span>
      </header>

      <ul className={styles.grid}>
        {song.map((s) => (
          <li className={styles.card} key={s.id}>
            <figure className={styles.figure}>
              <img
                className={styles.imagenAlbum}
                src={s.imagenAlbum}
                alt={`Carátula de ${s.titulo}`}
                loading="lazy"
                width="300"
                height="300"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://placehold.co/300x450?text=No+Image";
                }}
              />
              <figcaption className={styles.caption}>
                <h3 className={styles.title}>{s.titulo}</h3>
                <h2 className={styles.artista}>{s.artista}</h2>
                <div className={styles.meta}>
                  <span className={styles.duracion}>{s.duracion} min</span>
                  <span className={styles.album}>{s.album}</span>
                  <span className={styles.valoracion}>★ {s.valoracion}</span>
                </div>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}
