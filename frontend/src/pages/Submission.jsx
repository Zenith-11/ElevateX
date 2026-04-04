import { useEffect, useState } from "react";
import { getSubmissions } from "../api/submission_api";
import Card from "../components/Card";
import StatusBadge from "../components/Statusbadge";
import { FileText, Clock, Inbox } from "lucide-react";

export default function Submissions() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const res = await getSubmissions();
        if (isMounted) setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

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
          My Submissions
        </h1>
        <p className="mt-2 text-muted">
          Track the status of all your submitted work.
        </p>
      </div>

      {/* Content */}
      {data.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-16">
          <Inbox size={48} className="mb-4 text-muted/40" />
          <p className="text-lg font-medium text-content">
            No submissions yet
          </p>
          <p className="mt-1 text-sm text-muted">
            Your submissions will appear here once you submit work.
          </p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {data.map((item) => (
            <Card key={item._id} className="hover:border-muted/50">
              <div className="flex items-start justify-between gap-4">
                {/* Left: Icon + Info */}
                <div className="flex min-w-0 items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <FileText size={20} className="text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-content">
                      {item.description || "No description"}
                    </p>
                    <div className="mt-1 flex items-center gap-2 text-xs text-muted">
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
                          : "Unknown date"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Status */}
                <StatusBadge status={item.status} />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}