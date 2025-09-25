import { useEffect, useMemo, useState } from "react";
import styles from "../SongAnalytics/SongAnalytics.module.css";

export default function ApiSong() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [query, setQuery] = useState("");
  const [artista, setArtista] = useState("ALL");
  const [minValoracion, setMinValoracion] = useState(0);
  const [sortBy, setSortBy] = useState("valoracion");
  const [sortDir, setSortDir] = useState("desc");

  useEffect(() => {
    let canceled = false;

    (async () => {
      try {
        const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
          cache: "no-store",
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const raw = await res.json();

        if (canceled) return;

        const mapped = (Array.isArray(raw) ? raw : []).map((f) => ({
          id: f.id,
          titulo: f.title,
          artista: "",
          album: "",
          imagenAlbum: "",
          duracion: 0,
          valoracion: 0,
        }));

        setSongs(mapped);
        setError(null);
      } catch (e) {
        if (!canceled) setError(e.message || "Error cargando API");
      } finally {
        if (!canceled) setLoading(false);
      }
    })();

    return () => {
      canceled = true;
    };
  }, []);

  // Lista de artistas
  const artistas = useMemo(() => {
    const set = songs.reduce((acc, s) => {
      (s.artista || []).forEach((a) => acc.add(a));
      return acc;
    }, new Set());
    return ["ALL", ...Array.from(set).sort()];
  }, [songs]);

  // Estadísticas rápidas
  const stats = useMemo(() => {
    if (!songs.length)
      return { avgValoracion: 0, count: 0, best: null, byArtista: {} };
    const valoraciones = songs.map((s) => Number(s.valoracion ?? 0));
    const total = valoraciones.reduce((s, r) => s + r, 0);
    const avgValoracion = valoraciones.length ? total / valoraciones.length : 0;

    const best = songs.reduce(
      (acc, s) => ((s.valoracion ?? -1) > (acc?.rating ?? -1) ? s : acc),
      null
    );

    const byArtista = songs.reduce((acc, s) => {
      (s.artista || []).forEach((a) => (acc[a] = (acc[a] || 0) + 1));
      return acc;
    }, {});

    return { avgValoracion, count: songs.length, best, byArtista };
  }, [songs]);

  // Validaciones simples
  const hasLowRated = useMemo(
    () => songs.some((s) => (s.valoracion ?? 0) < 5),
    [songs]
  );

  // Filtro + orden
  const filteredSorted = useMemo(() => {
    const f = songs
      .filter((s) =>
        s.titulo.toLowerCase().includes(query.trim().toLowerCase())
      )
      .filter((s) => (artista === "ALL" ? true : s.artista === artista))
      .filter((s) => (s.valoracion ?? 0) >= Number(minValoracion));

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

      {/* Conteo por artistas (esta API no tiene artistas, por lo que quedará vacío) */}
      <details className={styles.details}>
        <summary>Conteo por artista (reduce)</summary>
        <ul className={styles.tags}>
          {Object.entries(stats.byArtista).map(([a, n]) => (
            <li key={a} className={styles.tag}>
              {a}: {n}
            </li>
          ))}
          {Object.keys(stats.byArtista).length === 0 && (
            <li className={styles.tag}>Sin datos de artistas en esta API</li>
          )}
        </ul>
      </details>

      {/* Listado */}
      <ul className={styles.grid}>
        {filteredSorted.map((s) => (
          <li key={s.id} className={styles.card}>
            <img
              className={styles.imagenAlbum}
              src={s.imagenAlbum || "404.png"}
              alt={`Carátula de ${s.titulo}`}
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src = "404.png";
              }}
            />
            <div className={styles.body}>
              <h3 className={styles.titulo}>{s.titulo}</h3>
              <p className={styles.meta}>
                {s.duracion} • {s.album} • ★ {s.valoracion ?? "N/A"}
              </p>
            </div>
          </li>
        ))}
      </ul>

      {/* Vista simple (títulos) */}
      <details className={styles.details}>
        <summary>Sólo títulos (map)</summary>
        <pre className={styles.code}>
          {JSON.stringify(
            filteredSorted.map((s) => s.titulo),
            null,
            2
          )}
        </pre>
      </details>
    </section>
  );
}
