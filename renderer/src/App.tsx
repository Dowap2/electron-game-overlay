import "./App.css";

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
      <div
        style={{
          position: "absolute",
          top: "100px",
          left: "100px",
          width: "200px",
          height: "50px",
          backgroundColor: "rgba(0,255,0,0.5)",
          pointerEvents: "auto", // 클릭 가능
          color: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
        }}
        onClick={() => {
          console.log("버튼 클릭됨!");
        }}
      >
        클릭 가능한 버튼
      </div>
    </div>
  );
}

export default App;
