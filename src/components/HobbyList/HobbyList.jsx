import { useEffect, useState } from "react";
import styles from "./HobbyList.module.css";

export default function HobbyList() {
  const [hobbies, setHobbies] = useState([]);
  const [state, setState] = useState({ loading: true, error: null });

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/hobbies.json", { cache: "no-store" });
        if (!res.ok) throw new Error("Ha habido un error en la carga");
        const data = await res.json();
        setHobbies(Array.isArray(data) ? data.slice(0, 10) : []);
        setState({ loading: false, error: null });
      } catch (err) {
        setState({
          loading: false,
          error: err.message || "Error cargando el JSON",
        });
      }
    };
    load();
  }, []);

  if (state.loading)
    return <p className={styles.status}>Cargando aficiones...</p>;
  if (state.error)
    return <p className={styles.statusError}>Error: {state.error}</p>;
  if (!hobbies.length)
    return <p className={styles.status}>No hay aficiones que mostrar.</p>;

  return (
    <section className={styles.list}>
      <header className={styles.header}>
        <h2>Aficiones</h2>
      </header>

      <ul className={styles.grid}>
        {hobbies.map((hobby) => (
          <li
            id={hobby.id}
            className={styles.card}
            key={hobby.id}
            style={{ backgroundImage: `url(${hobby.imagen})` }}
          >
            <div className={styles.overlay}>
              <h3>{hobby.titulo}</h3>
              <p>{hobby.descripcion}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
