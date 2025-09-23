import "./App.css";
import Aficiones from "./components/Aficiones/Aficiones";
import Canciones from "./components/Canciones/Canciones";
import Presentacion from "./components/Presentacion/Presentacion";

export default function App() {
  return (
    <>
      <Presentacion />
      <Canciones />
      <Aficiones />
    </>
  );
}