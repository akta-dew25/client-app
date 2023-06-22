import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PreviewPlanSnippet from "./Components/PreviewPlan";
import Home from "./Components/Home";
import Contact from "./Components/Contact";
import MainPage from "./Components/MainPage";
import PreviewGetStartedSnippet from "./Components/PreviewGetStartedSnippet";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* <Route path="/getStarted" element={<PreviewGetStartedSnippet />} /> */}
          <Route path="/" element={<Home main={<MainPage />} />} />
          <Route
            path="/subscription"
            element={<Home main={<PreviewPlanSnippet />} />}
          />
          <Route path="/Contact" element={<Home main={<Contact />} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
