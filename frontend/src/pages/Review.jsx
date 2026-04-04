import { useEffect, useState } from "react";
import {
  getSubmissions,
  approveSubmission,
  rejectSubmission
} from "../api/submission_api";

import Button from "../components/Button";
import Card from "../components/Card";

export default function Review() {
  const [data, setData] = useState([]);

  const loadData = async () => {
    const res = await getSubmissions();
    setData(res.data);
  };

  useEffect(() => {
    const loadData = async () => {
    const res = await getSubmissions();
    setData(res.data);
  };

  loadData();
  }, []);

  const handleApprove = async (id) => {
    await approveSubmission(id);
    loadData(); // 🔥 refresh UI
  };

  const handleReject = async (id) => {
    await rejectSubmission(id, "Invalid");
    loadData(); // 🔥 refresh UI
  };

  return (
    <div className="p-8 bg-background min-h-screen text-textPrimary">
      <h2 className="text-xl mb-4">Review Submissions</h2>

      <div className="grid gap-4">
        {data.map((item) => (
          <Card key={item._id}>
            <p>{item.description}</p>

            <div className="flex gap-2 mt-2">
              <Button onClick={() => handleApprove(item._id)}>
                Approve
              </Button>

              <Button
                variant="secondary"
                onClick={() => handleReject(item._id)}
              >
                Reject
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}