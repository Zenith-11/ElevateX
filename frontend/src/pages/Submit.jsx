import { useState, useRef } from "react";
import { createSubmission } from "../api/submission_api";
import Button from "../components/Button";
import Card from "../components/Card";
import { Upload, FileText, X, Send, CheckCircle } from "lucide-react";

export default function Submit() {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [success, setSuccess] = useState(false);
  const inputRef = useRef(null);

  const handleSubmit = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("event_id", "event_demo");
      formData.append("user_id", "user_demo");
      formData.append("description", description);
      formData.append("files", file);

      await createSubmission(formData);
      setFile(null);
      setDescription("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="mx-auto max-w-lg">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[32px] font-semibold leading-tight text-content">
          Submit Work
        </h1>
        <p className="mt-2 text-muted">
          Upload your work and add a description for review.
        </p>
      </div>

      {/* Success Banner */}
      {success && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-success/20 bg-success/10 p-4 text-sm text-success animate-in fade-in">
          <CheckCircle size={18} />
          Submission created successfully!
        </div>
      )}

      <Card>
        <div className="flex flex-col gap-6">
          {/* File Upload Zone */}
          <div>
            <label className="mb-2 block text-sm font-medium text-content">
              Attachment
            </label>
            <div
              className={`relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-all duration-200
                ${
                  dragActive
                    ? "border-primary bg-primary/5"
                    : file
                      ? "border-success/50 bg-success/5"
                      : "border-edge hover:border-muted hover:bg-background/50"
                }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
            >
              <input
                ref={inputRef}
                type="file"
                className="hidden"
                onChange={(e) => setFile(e.target.files[0])}
              />
              {file ? (
                <div className="flex items-center gap-3">
                  <FileText size={20} className="text-success" />
                  <span className="text-sm text-content">{file.name}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                    }}
                    className="rounded-md p-1 text-muted transition-colors hover:bg-edge hover:text-content"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <>
                  <Upload size={24} className="mb-3 text-muted" />
                  <p className="text-sm text-content">
                    Drop your file here, or{" "}
                    <span className="text-primary">browse</span>
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    Any file type accepted
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-medium text-content"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your submission..."
              rows={4}
              className="w-full rounded-lg border border-edge bg-background p-4 text-sm text-content placeholder:text-muted transition-all duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
            />
          </div>

          {/* Submit Button */}
          <Button onClick={handleSubmit} disabled={!file || loading}>
            <Send size={18} className="mr-2" />
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </Card>
    </div>
  );
}