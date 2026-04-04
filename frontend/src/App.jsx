import { useState } from "react";
import Submit from "./pages/submit";
import Submissions from "./pages/submission";
import Review from "./pages/Review";
import Navbar from "./components/Navbar";
//import Review from "./pages/Review";
//import Review from "./pages/Review";
//import Submissions from "./pages/submission";
//import Submit from "./pages/submit";

function App() {
  const [page, setPage] = useState("submit");

  const renderPage = () => {
    if (page === "submit") return <Submit/>;
    if (page === "submissions") return <Submissions/>;
    if (page === "review") return <Review/>;
  };

  return (
    <div className="bg-background min-h-screen text-textPrimary">
      <Navbar setPage={setPage} />
      <div className="max-w-[1200px] mx-auto p-6">
        {renderPage()}
      </div>
    </div>
  );; // switch pages manually for demo
}

export default App;