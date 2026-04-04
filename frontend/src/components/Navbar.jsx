//import { useState } from "react";

export default function Navbar({ setPage }) {
  return (
    <div className="w-full border-b border-border bg-surface">
      <div className="max-w-[1200px] mx-auto flex justify-between items-center p-4">
        <h1 className="text-lg font-medium">ElevateX</h1>

        <div className="flex gap-4">
          <button
  onClick={() => setPage("submit")}
  className="px-3 py-1 rounded-md bg-surface hover:bg-primary text-sm"
>
  Submit
</button>
          <button onClick={() => setPage("submissions")} className="text-textSecondary hover:text-white">
            Submissions
          </button>
          <button onClick={() => setPage("review")} className="text-textSecondary hover:text-white">
            Review
          </button>
        </div>
      </div>
    </div>
  );
}