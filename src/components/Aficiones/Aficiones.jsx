import { useEffect, useMemo, useState } from "react";
import styles from "./Aficiones.module.css";

export default function Aficiones() {
  const aficiones = [
    {
      nombre: "BJJ (Brazilian Jiu-Jitsu)",
      descripcion:
        "Arte marcial centrado en la lucha en el suelo, técnica y estrategia.",
      imagen:
        "https://cdn.shopify.com/s/files/1/0646/4097/files/Las_Reglas_del_Brazilian_Jiu-Jitsu_BJJ_6_1024x1024.jpg?v=1695904192",
    },
    {
      nombre: "Literatura fantástica",
      descripcion:
        "Historias con mundos mágicos, criaturas míticas y aventuras épicas.",
      imagen:
        "https://aclfcft.wordpress.com/wp-content/uploads/2024/08/foto-libros-1.png",
    },
    {
      nombre: "Series",
      descripcion:
        "Me encanta seguir tramas complejas y personajes bien desarrollados.",
      imagen:
        "https://larepublica.cronosmedia.glr.pe/original/2021/04/10/60722fcb046dbb4ac308a8a6.jpg",
    },
    {
      nombre: "Videojuegos",
      descripcion:
        "Experiencias interactivas con historias profundas y decisiones morales.",
      imagen:
        "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/413150/capsule_616x353.jpg?t=1754692865",
    },
  ];

  return (
    <section className={styles.list}>
      <header className={styles.header}>
        <h2>Aficiones</h2>
        <span className={styles.count}>{aficiones.length}</span>
      </header>

      <ul className={styles.grid}>
        {aficiones.map((aficion, index) => (
          <li
            key={index}
            className={styles.card}
            style={{ backgroundImage: `url(${aficion.imagen})` }}
          >
            <div className={styles.overlay}>
              <h3>{aficion.nombre}</h3>
              <p>{aficion.descripcion}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
