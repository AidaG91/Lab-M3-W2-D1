import "./App.css";
import Song from "./components/Song/Song";
import HobbyList from "./components/HobbyList/HobbyList";
import Presentacion from "./components/Presentacion/Presentacion";

export default function App() {
  return (
    <>
      <Presentacion />
      <Song />
      <HobbyList />
    </>
  );
}
