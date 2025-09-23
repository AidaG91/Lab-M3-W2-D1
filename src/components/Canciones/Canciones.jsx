import { useEffect, useState } from "react";
import styles from "./Canciones.module.css";

export default function Canciones() {
  const [canciones, setCanciones] = useState([]);
  const [state, setState] = useState({ loading: true, error: null });

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/canciones.json", { cache: "no-store" });
        if (!res.ok) throw new Error("Ha habido un error en la carga");
        const data = await res.json();
        setCanciones(Array.isArray(data) ? data.slice(0, 10) : []);
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

  if (state.loading) return <p className={styles.status}>Cargando canciones...</p>;
  if (state.error) return <p className={styles.statusError}>Error: {state.error}</p>;
  if (!canciones.length) return <p className={styles.status}>No hay canciones que mostrar.</p>;

  return (
    <section className={styles.list}>
      <header className={styles.header}>
        <h2>Canciones</h2>
        <p>Mis canciones favoritas</p>
        <span className={styles.count}>{canciones.length}</span>
      </header>

      <ul className={styles.grid}>
        {canciones.map((c) => (
          <li className={styles.card} key={c.id}>
            <figure className={styles.figure}>
              <img
                className={styles.imagenAlbum}
                src={c.imagenAlbum}
                alt={`Carátula de ${c.titulo}`}
                loading="lazy"
                width="300"
                height="300"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://placehold.co/300x450?text=No+Image";
                }}
              />
              <figcaption className={styles.caption}>
                <h3 className={styles.title}>{c.titulo}</h3>
                <h2 className={styles.artista}>{c.artista}</h2>
                <p className={styles.meta}>
                  <span className={styles.duracion}>{c.duracion}</span>
                  <span className={styles.dot}>•</span>
                  <span>{c.album}</span>
                  <span className={styles.dot}>•</span>
                  <span className={styles.valoracion}>★ {c.valoracion}</span>
                </p>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}
