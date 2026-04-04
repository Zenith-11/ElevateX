import { format } from "date-fns";
import "./TransactionsList.css";

export default function TransactionsList({ transactions }) {
  return (
    <div className="transactions-list">
      <div className="transactions-header">
        <h3 className="section-title mb-lg">Transaction History</h3>
      </div>

      {transactions.length === 0 ? (
        <div className="empty-state">
          <span className="material-icons-round">receipt_long</span>
          <p>No transactions yet.</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="data-table transactions-table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id} className={`transaction-row transaction-${transaction.type}`}>
                  <td className="desc-cell">
                    <div className="desc-icon">
                      <span className="material-icons-round">
                        {transaction.type === "earn" ? "add_circle" : "remove_circle"}
                      </span>
                    </div>
                    <div className="desc-content">
                      <p className="font-semibold">{transaction.description}</p>
                      {transaction.reference_id && (
                        <p className="text-xs text-muted">{transaction.reference_id}</p>
                      )}
                    </div>
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        transaction.type === "earn" ? "badge-success" : "badge-warning"
                      }`}
                    >
                      {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                    </span>
                  </td>
                  <td
                    className={`amount-cell font-bold ${
                      transaction.type === "earn" ? "text-secondary" : "text-accent"
                    }`}
                  >
                    {transaction.type === "earn" ? "+" : "-"}
                    {transaction.amount.toLocaleString()} pts
                  </td>
                  <td className="date-cell text-muted text-sm">
                    {format(new Date(transaction.timestamp), "MMM d, yyyy HH:mm")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
