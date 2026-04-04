import { useEffect, useState } from "react";
import { getSubmissions } from "../api/submission_api";
import Card from "../components/Card";
import StatusBadge from "../components/Statusbadge";

export default function Submissions() {
  const [data, setData] = useState([]);

  useEffect(() => {
   let isMounted = true;

  const loadData = async () => {
    try {
      const res = await getSubmissions();
      console.log(res.data);
      if (isMounted) {
        setData(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  loadData();

  return () => {
    isMounted = false;
  };
  }, []);

  

  return (
    <div className="p-8 bg-background min-h-screen text-textPrimary">
      <h2 className="text-xl mb-4">My Submissions</h2>

      <div className="grid gap-4">
        {data.map((item) => (
          <Card key={item._id}>
            <p>{item.description}</p>
            <StatusBadge status={item.status} />
          </Card>
        ))}
      </div>
    </div>
  );
}