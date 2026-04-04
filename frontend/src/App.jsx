import { useState } from "react";
import Submit from "./pages/Submit";
import Submissions from "./pages/Submission";
import Review from "./pages/Review";
import Navbar from "./components/Navbar";

function App() {
  const [page, setPage] = useState("submit");

  const renderPage = () => {
    switch (page) {
      case "submit":
        return <Submit />;
      case "submissions":
        return <Submissions />;
      case "review":
        return <Review />;
      default:
        return <Submit />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-content">
      <Navbar setPage={setPage} currentPage={page} />
      <main className="mx-auto max-w-[1200px] px-6 py-8">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;