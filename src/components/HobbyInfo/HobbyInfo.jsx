import styles from "./HobbyInfo.module.css";

export default function HobbyInfo({ hobby }) {
  if (!hobby) return new Error("No se encontró la afición");

  return (
    <div className={styles.overlay}>
      <h3>{hobby.titulo}</h3>
      <p>{hobby.descripcion}</p>
    </div>
  );
}
