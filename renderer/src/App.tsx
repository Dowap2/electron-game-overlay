import "./App.css";
import Overlay from "./components/Overlay";

function App() {
  return (
    <div
      className="App"
      style={{
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        backgroundColor: "rgba(131, 131, 131, 0.244)",
      }}
    >
      <Overlay />
    </div>
  );
}

export default App;
