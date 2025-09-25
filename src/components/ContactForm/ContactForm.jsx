import { useCallback } from "react";
import styles from "./ContactForm.module.css";

export default function ContactForm() {
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const fd = new FormData(form);
    const data = {};
    for (const [key, value] of fd.entries()) {
      if (key in data) {
        if (Array.isArray(data[key])) data[key].push(value);
        else data[key] = [data[key], value];
      } else {
        data[key] = value;
      }
    }
    console.log("Payload FormData:", data);

    // Aquí harías submit a tu API
    // fetch("/api", { method: "POST", body: fd })
  }, []);

  const handleReset = useCallback(() => {
    console.log("Form reset");
  }, []);

  return (
    <section className={styles.wrap}>
      <form
        className={styles.form}
        onSubmit={handleSubmit}
        onReset={handleReset}
        noValidate
      >
        <h2>Contáctame</h2>

        <fieldset className={styles.fieldset}>
          <div className={styles.grid2}>
            <label className={styles.label}>
              Tu nombre *
              <input
                className={styles.input}
                name="firstName"
                type="text"
                placeholder="Tu nombre aquí"
                required
                minLength={2}
                maxLength={40}
              />
            </label>

            <label className={styles.label}>
              Correo electrónico *
              <input
                className={styles.input}
                name="email"
                type="email"
                placeholder="correo@ejemplo.com"
                required
              />
            </label>

            <label className={styles.label}>
              Mensaje *
              <textarea
                className={styles.input}
                name="mensaje"
                required
                placeholder="Escribe tu mensaje aquí…"
              />
            </label>
          </div>
        </fieldset>

        <div className={styles.actions}>
          <button type="reset" className={styles.btnSecondary}>
            Reset
          </button>
          <button type="submit" className={styles.btnPrimary}>
            Enviar
          </button>
        </div>
      </form>

      <form
        className={styles.form}
        onSubmit={handleSubmit}
        onReset={handleReset}
        noValidate
      >
        <h2>Añadir canción</h2>

        <fieldset className={styles.fieldset}>
          <div className={styles.grid2}>
            <label className={styles.label}>
              Título de la canción *
              <input
                className={styles.input}
                type="text"
                name="titulo"
                required
                placeholder="Nombre de la canción"
              />
            </label>

            <label className={styles.label}>
              Artista *
              <input
                className={styles.input}
                type="text"
                name="artista"
                required
                placeholder="Nombre del artista"
              />
            </label>

            <label className={styles.label}>
              Álbum
              <input
                className={styles.input}
                type="text"
                name="album"
                placeholder="Nombre del álbum"
              />
            </label>

            <label className={styles.label}>
              Duración (minutos)
              <input
                className={styles.input}
                type="number"
                name="duracion"
                min="1"
                max="20"
                placeholder="Ej: 4"
              />
            </label>

            <label className={styles.label}>
              Valoración ⭐
              <input
                className={styles.input}
                type="range"
                name="valoracion"
                min="1"
                max="5"
                defaultValue="5"
              />
            </label>

            <label className={styles.label}>
              Imagen del álbum (URL)
              <input
                className={styles.input}
                type="url"
                name="imagenAlbum"
                placeholder="https://..."
              />
            </label>
          </div>
        </fieldset>

        <div className={styles.actions}>
          <button type="reset" className={styles.btnSecondary}>
            Reset
          </button>
          <button type="submit" className={styles.btnPrimary}>
            Añadir canción
          </button>
        </div>
      </form>
    </section>
  );
}
