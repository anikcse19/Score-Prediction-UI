import { Routes, Route } from "react-router-dom";
import LivePrediction from "./components/LivePrediction";

function App() {
  return (
    <Routes>
      <Route path="/live-prediction" element={<LivePrediction />} />
    </Routes>
  );
}

export default App;
