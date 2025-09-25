import styles from "./Presentation.module.css";
import myPic from "../../assets/my_pic.png";

export default function Presentacion() {
  return (
    <>
      <div>
        <a
          href="https://github.com/AidaG91"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={myPic} className={styles["my-pic"]} alt="Aïda's pic" />
        </a>
      </div>
      <h1>Aïda</h1>
      <h2>García Musté</h2>
      <div>
        <h3 className={styles.titulo_aficiones}>Mis Aficiones</h3>
        <ul className={styles.aficiones_list}>
          <li><a className={styles.link} href="#bjj">BJJ</a></li>
          <li><a className={styles.link} href="#literatura">Literatura fantástica</a></li>
          <li><a className={styles.link} href="#series">Series</a></li>
          <li><a className={styles.link} href="#videojuegos">Videojuegos</a></li>
        </ul>
      </div>
    </>
  );
}
