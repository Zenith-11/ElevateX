import { useState } from "react";
import { createSubmission } from "../api/submission_api";
import Button from "../components/Button";
import Card from "../components/Card";

export default function Submit() {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");

  const handleSubmit = async () => {
    const formData = new FormData();

    formData.append("event_id", "event_demo");
    formData.append("user_id", "user_demo");
    formData.append("description", description);
    formData.append("files", file);

    await createSubmission(formData);
    alert("Submitted!");
  };

  return (
    <div className="min-h-screen flex items-start justify-center pt-24 bg-background text-textPrimary">
    <div className="max-w-md mx-auto">
  <Card>
    <h2 className="text-xl mb-4">Submit Work</h2>

    <input
      type="file"
      className="w-full mb-4 border border-border p-2 rounded-md bg-background"
      onChange={(e) => setFile(e.target.files[0])}
    />

    <textarea
      className="w-full h-24 bg-background border border-border p-2 rounded-md mb-4"
      placeholder="Write a description..."
      onChange={(e) => setDescription(e.target.value)}
    />

    <Button onClick={handleSubmit}>Submit</Button>
  </Card>
</div>
</div>
  );
}