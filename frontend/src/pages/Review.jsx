import { useEffect, useState } from "react";
import {
  getSubmissions,
  approveSubmission,
  rejectSubmission,
} from "../api/submission_api";
import Button from "../components/Button";
import Card from "../components/Card";
import StatusBadge from "../components/Statusbadge";
import { Check, X, FileText, Clock, Inbox } from "lucide-react";

export default function Review() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);

  const loadData = async () => {
    try {
      const res = await getSubmissions();
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApprove = async (id) => {
    setActionId(id);
    await approveSubmission(id);
    await loadData();
    setActionId(null);
  };

  const handleReject = async (id) => {
    setActionId(id);
    await rejectSubmission(id, "Invalid submission");
    await loadData();
    setActionId(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-edge border-t-primary" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[32px] font-semibold leading-tight text-content">
          Review Submissions
        </h1>
        <p className="mt-2 text-muted">
          Approve or reject submitted work from your team.
        </p>
      </div>

      {/* Content */}
      {data.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-16">
          <Inbox size={48} className="mb-4 text-muted/40" />
          <p className="text-lg font-medium text-content">
            No submissions to review
          </p>
          <p className="mt-1 text-sm text-muted">
            New submissions will appear here.
          </p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {data.map((item) => (
            <Card key={item._id} className="hover:border-muted/50">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                {/* Left: Icon + Info */}
                <div className="flex min-w-0 items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <FileText size={20} className="text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-content">
                      {item.description || "No description"}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-3">
                      <StatusBadge status={item.status} />
                      <div className="flex items-center gap-1 text-xs text-muted">
                        <Clock size={14} />
                        <span>
                          {item.submitted_at
                            ? new Date(item.submitted_at).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )
                            : "Unknown"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Actions (only for pending) */}
                {item.status === "pending" && (
                  <div className="flex shrink-0 items-center gap-2">
                    <Button
                      variant="success"
                      onClick={() => handleApprove(item._id)}
                      disabled={actionId === item._id}
                    >
                      <Check size={18} className="mr-1.5" />
                      Approve
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleReject(item._id)}
                      disabled={actionId === item._id}
                    >
                      <X size={18} className="mr-1.5" />
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}