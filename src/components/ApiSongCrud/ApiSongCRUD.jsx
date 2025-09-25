import { useEffect, useMemo, useState } from "react";
// import styles from "../SongAnalytics/SongAnalytics.module.css";
import styles from "./ApiSongCRUD.module.css";

const API = "https://jsonplaceholder.typicode.com/posts";

const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

function toSong(p) {
  const id = Number(p.id);
  const pseudoDuracion = (id % 6) + 2;
  const pseudoValoracion = (id % 5) + 1;

  return {
    id,
    titulo: p.title ?? "Sin título",
    artista: "Desconocido",
    album: "Álbum genérico",
    imagenAlbum: "",
    duracion: pseudoDuracion,
    valoracion: pseudoValoracion,
  };
}

export default function ApiSongCRUD() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("titulo");
  const [sortDir, setSortDir] = useState("desc");
  const [minValoracion, setMinValoracion] = useState(0);

  // ---- Formulario (Create/Update) ----
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    titulo: "",
    artista: "",
    album: "",
    duracion: 0,
    valoracion: 0,
  });

  // ---- READ: carga inicial ----
  useEffect(() => {
    let canceled = false;
    (async () => {
      try {
        const res = await fetch(`${API}?_limit=12`, { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (canceled) return;
        setSongs((Array.isArray(data) ? data : []).map(toSong));
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

  // ---- Derivados ----
  const filteredSorted = useMemo(() => {
    const f = songs
      .filter((s) =>
        s.titulo.toLowerCase().includes(query.trim().toLowerCase())
      )
      .filter((s) => Number(s.valoracion ?? 0) >= Number(minValoracion));

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
  }, [songs, query, minValoracion, sortBy, sortDir]);

  const stats = useMemo(() => {
    if (!songs.length) return { count: 0, avgValoracion: 0, best: null };
    const total = songs.reduce((s, m) => s + (Number(m.valoracion) || 0), 0);
    const avgValoracion = total / songs.length;
    const best = songs.reduce(
      (acc, s) =>
        Number(s.valoracion ?? -1) > Number(acc?.valoracion ?? -1) ? s : acc,
      null
    );

    return { count: songs.length, avgValoracion, best };
  }, [songs]);

  // ---- Handlers Form ----
  const startCreate = () => {
    setEditingId(null);
    setForm({ titulo: "", artista: "", album: "", duracion: 0, valoracion: 0 });
  };

  const startEdit = (s) => {
    setEditingId(s.id);
    setForm({
      titulo: s.titulo ?? "",
      artista: s.artista ?? "",
      album: s.album ?? "",
      duracion: s.duracion ?? 0,
      valoracion: s.valoracion ?? 0,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  // ---- CREATE / UPDATE ----
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formEl = e.currentTarget;
    if (!formEl.checkValidity()) {
      formEl.reportValidity();
      return;
    }

    const payload = {
      title: form.titulo.trim(),
      body: `Artista: ${form.artista}\nÁlbum: ${form.album}`,
      duracion: Number(form.duracion),
      rating: Number(form.valoracion),
    };

    try {
      if (editingId == null) {
        // CREATE
        const res = await fetch(API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const created = await res.json();
        const song = toSong({ ...payload, id: created.id ?? Date.now() });
        setSongs((prev) => [song, ...prev]);
      } else {
        // UPDATE
        const res = await fetch(`${API}/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const updated = await res.json();
        setSongs((prev) =>
          prev.map((s) =>
            s.id === editingId ? toSong({ ...s, ...updated }) : s
          )
        );
      }

      setEditingId(null);
      setForm({
        titulo: "",
        artista: "",
        album: "",
        duracion: 0,
        valoracion: 0,
      });
      setError(null);
    } catch (e2) {
      setError(e2.message || "Error enviando datos");
    }
  };

  // ---- DELETE ----
  const handleDelete = async (id) => {
    if (!confirm("¿Seguro que quieres borrar esta canción?")) return;

    try {
      const res = await fetch(`${API}/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setSongs((prev) => prev.filter((s) => s.id !== id));
      setError(null);
    } catch (e2) {
      setError(e2.message || "Error al borrar");
    }
  };

  if (loading) return <p className={styles.status}>Cargando…</p>;
  if (error) return <p className={styles.error}>Error: {error}</p>;

  return (
    <section className={styles.wrapper}>
      <header className={styles.header}>
        <h2>Canciones — CRUD (API pública)</h2>
        <div className={styles.stats}>
          <span>
            Total: <strong>{stats.count}</strong>
          </span>
          <span>
            Promedio ★ <strong>{stats.avgValoracion.toFixed(2)}</strong>
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

      {/* ---- Formulario Create/Update ---- */}
      <form className={styles.controls} onSubmit={handleSubmit} noValidate>
        <input
          className={styles.input}
          name="titulo"
          placeholder="Título *"
          value={form.titulo}
          onChange={handleChange}
          required
          minLength={2}
          maxLength={100}
        />
        <input
          className={styles.input}
          name="artista"
          placeholder="Artista *"
          value={form.artista}
          onChange={handleChange}
          required
        />
        <input
          className={styles.input}
          name="album"
          placeholder="Álbum"
          value={form.album}
          onChange={handleChange}
        />
        <label className={styles.row}>
          Duración (min)
          <input
            className={styles.number}
            name="duracion"
            type="number"
            value={form.duracion}
            onChange={handleChange}
            min="1"
            max="20"
            step="1"
          />
        </label>

        <label className={styles.row}>
          Valoración (1–5)
          <input
            className={styles.number}
            name="valoracion"
            type="number"
            value={form.valoracion}
            onChange={handleChange}
            min="1"
            max="5"
            step="0.1"
          />
        </label>

        <button type="submit" className={styles.btnPrimary}>
          {editingId == null ? "Crear" : "Guardar cambios"}
        </button>

        {editingId != null && (
          <button
            type="button"
            onClick={startCreate}
            style={{
              padding: ".55rem .9rem",
              borderRadius: ".55rem",
              border: "1px solid #cbd5e1",
              background: "#f8fafc",
            }}
          >
            Cancelar
          </button>
        )}
      </form>

      {/* ---- Filtros simples ---- */}
      <div className={styles.filterGroup}>
        <input
          className={styles.input}
          placeholder="Buscar por título…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <label className={styles.row}>
          Min ★
          <input
            className={styles.number}
            type="number"
            min="0"
            max="5"
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
            <option value="duracion">duración</option>
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

      {/* ---- Grid de tarjetas ---- */}
      <ul className={styles.grid}>
        {filteredSorted.map((s) => (
          <li key={s.id} className={styles.card}>
            <img
              className={styles.imagenAlbum}
              src={
                s.imagenAlbum || "https://placehold.co/300x450?text=No+Image"
              }
              alt={`Carátula de ${s.titulo}`}
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src =
                  "https://placehold.co/300x450?text=No+Image";
              }}
            />
            <div className={styles.body}>
              <h3 className={styles.titulo}>{s.titulo}</h3>
              <p className={styles.meta}>
                {s.artista} • {s.album} • {s.duracion} min • ★ {s.valoracion}
              </p>
              <div
                style={{ display: "flex", justifyContent: "center", gap: ".5rem", marginTop: ".5rem" }}
              >
                <div className={styles.cardActions}>
                  <button
                    type="button"
                    className={`${styles.cardBtn} ${styles.cardBtnEdit}`}
                    onClick={() => startEdit(s)}
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    className={`${styles.cardBtn} ${styles.cardBtnDelete}`}
                    onClick={() => handleDelete(s.id)}
                  >
                    Borrar
                  </button>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
