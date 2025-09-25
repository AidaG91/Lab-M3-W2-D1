import "./App.css";
import Presentation from "./components/Presentation/Presentation";
import SongAnalytics from "./components/SongAnalytics/SongAnalytics";
import Song from "./components/Song/Song";
import HobbyList from "./components/HobbyList/HobbyList";

export default function App() {
  return (
    <>
      <Presentation />
      <SongAnalytics />
      <Song />
      <HobbyList />
    </>
  );
}
