import { useState } from "react";
import "./App.css";
import myPic from "./assets/my_pic.png";
import Aficiones from "./components/Aficiones/Aficiones";
import Canciones from "./components/Canciones/Canciones";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <a href="https://github.com/AidaG91" target="_blank">
          <img src={myPic} className="my-pic" alt="Aïda's pic" />
        </a>
      </div>
      <h1>Aïda</h1>
      <h2>García Musté</h2>
      <Canciones />
      <Aficiones />
    </>
  );
}

export default App;
