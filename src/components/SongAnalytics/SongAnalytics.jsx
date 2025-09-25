import { useEffect, useMemo, useState } from "react";
import styles from "./SongAnalytics.module.css";
import SongCard from "../SongCard/SongCard";

export default function SongAnalytics() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Controles (para aplicar filter/sort)
  const [query, setQuery] = useState(""); 
  const [artista, setArtista] = useState("ALL"); 
  const [minValoracion, setMinValoracion] = useState(0);
  const [sortBy, setSortBy] = useState("valoracion"); 
  const [sortDir, setSortDir] = useState("desc");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/songs.json", { cache: "no-store" });
        if (!res.ok) throw new Error("Ha habido un error en la carga");
        const data = await res.json();
        setSongs(Array.isArray(data) ? data.slice(0, 10) : []);
        setLoading(false);
        setError(null);
      } catch (err) {
        setLoading(false);
        setError(err.message || "Error cargando el JSON");
      }
    };
    load();
  }, []);

  // Lista por artistas
  const artistas = useMemo(() => {
    const set = songs.reduce((acc, s) => {
      if (s.artista) acc.add(s.artista);
      return acc;
    }, new Set());
    return ["ALL", ...Array.from(set).sort()];
  }, [songs]);

  // Stats
  const stats = useMemo(() => {
    if (!songs.length) {
      return { avgValoracion: 0, count: 0, best: null, byArtista: {} };
    }

    // promedio de valoracion
    const total = songs.reduce((sum, s) => sum + (s.valoracion ?? 0), 0);
    const avgValoracion = total / songs.length;

    // mejor canción (reduce comparando)
    const best = songs.reduce(
      (acc, s) => (s.valoracion > (acc?.valoracion ?? -1) ? s : acc),
      null
    );

    const byArtista = songs.reduce((acc, s) => {
      const a = s.artista;
      acc[a] = (acc[a] || 0) + 1;
      return acc;
    }, {});

    return { avgValoracion, count: songs.length, best, byArtista };
  }, [songs]);

  // Búsqueda con find
  const iris = useMemo(
    () => songs.find((s) => s.titulo.toLowerCase().includes("iris")),
    [songs]
  );

  // Validaciones 
  const hasLowRated = useMemo(
    () => songs.some((s) => (s.valoracion ?? 0) < 5),
    [songs]
  );

  // Filtro y orden
  const filteredSorted = useMemo(() => {
    const f = songs
      .filter((s) =>
        s.titulo.toLowerCase().includes(query.trim().toLowerCase())
      )
      .filter((s) => (artista === "ALL" ? true : s.artista === artista))
      .filter((s) => (s.valoracion ?? 0) >= Number(minValoracion));

    // sort: crea copia para no mutar array original
    const s = [...f].sort((a, b) => {
      let comp = 0;
      if (sortBy === "valoracion")
        comp = (a.valoracion ?? 0) - (b.valoracion ?? 0);
      else if (sortBy === "duracion")
        comp = (a.duracion ?? 0) - (b.duracion ?? 0);
      else if (sortBy === "titulo") comp = a.titulo.localeCompare(b.titulo);
      return sortDir === "asc" ? comp : -comp;
    });

    return s;
  }, [songs, query, artista, minValoracion, sortBy, sortDir]);

  if (loading) return <p className={styles.status}>Cargando…</p>;
  if (error) return <p className={styles.error}>Error: {error}</p>;

  return (
    <section className={styles.wrapper}>
      <header className={styles.header}>
        <h2>Song Analytics</h2>
        <div className={styles.stats}>
          <span>
            Total: <strong>{stats.count}</strong>
          </span>
          <span>
            Promedio ★ <strong>{stats.avgValoracion.toFixed(2)}</strong>
          </span>
          <span>
            ¿Alguna &lt; 5? <strong>{hasLowRated ? "Sí" : "No"}</strong>
          </span>
          {stats.best && (
            <span>
              Top:{" "}
              <strong>
                {stats.best.titulo} ({stats.best.valoracion})
              </strong>
            </span>
          )}
        </div>
      </header>

      <div className={styles.controls}>
        <input
          className={styles.input}
          placeholder="Buscar por título…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          className={styles.select}
          value={artista}
          onChange={(e) => setArtista(e.target.value)}
        >
          {artistas.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
        <label className={styles.row}>
          Min ★
          <input
            className={styles.number}
            type="number"
            min="0"
            max="10"
            step="0.1"
            value={minValoracion}
            onChange={(e) => setMinValoracion(e.target.value)}
          />
        </label>
        <label className={styles.row}>
          Ordenar por
          <select
            className={styles.select}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="valoracion">valoración</option>
            <option value="duracion">duracion</option>
            <option value="titulo">título</option>
          </select>
        </label>
        <label className={styles.row}>
          Dirección
          <select
            className={styles.select}
            value={sortDir}
            onChange={(e) => setSortDir(e.target.value)}
          >
            <option value="desc">desc</option>
            <option value="asc">asc</option>
          </select>
        </label>
      </div>

      <ul className={styles.grid}>
        {filteredSorted.map((s) => (
          <SongCard key={s.id} song={s} />
        ))}
      </ul>
    </section>
  );
}
