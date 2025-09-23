import "./App.css";
import Canciones from "./components/Canciones/Canciones";
import HobbyList from "./components/HobbyList/HobbyList";
import Presentacion from "./components/Presentacion/Presentacion";

export default function App() {
  return (
    <>
      <Presentacion />
      <Canciones />
      <HobbyList />
    </>
  );
}
