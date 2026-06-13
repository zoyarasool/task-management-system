import { useEffect, useState } from "react";
import { getOverview, getTrends } from "../services/analyticsService";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#f0ad4e", "#5bc0de", "#5cb85c"];

function AnalyticsDashboard({ darkMode }) {
  const [overview, setOverview] = useState(null);
  const [trends, setTrends] = useState([]);
  const [trendType, setTrendType] = useState("monthly");

  const cardClass = darkMode
    ? "card bg-secondary text-light shadow p-3"
    : "card shadow p-3";

  useEffect(() => {
    fetchOverview();
  }, []);

  useEffect(() => {
    fetchTrends();
  }, [trendType]);

  const fetchOverview = async () => {
    try {
      const data = await getOverview();
      setOverview(data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchTrends = async () => {
    try {
      const data = await getTrends(trendType);
      setTrends(data);
    } catch (error) {
      console.log(error);
    }
  };

  // FORMAT PIE CHART DATA
  const pieData = overview
    ? overview.statusBreakdown.map((item) => ({
        name: item._id,
        value: item.count,
      }))
    : [];

  // FORMAT BAR CHART DATA
  const barData = trends.map((item) => ({
    name:
      trendType === "monthly"
        ? `Month ${item._id.month}/${item._id.year}`
        : `Week ${item._id.week}/${item._id.year}`,
    Total: item.total,
    Completed: item.completed,
    Pending: item.pending,
    "In Progress": item.inProgress,
  }));

  return (
    <div>
      <h2 className="mb-4">📊 Analytics Dashboard</h2>

      {/* OVERVIEW CARDS */}
      {overview && (
        <div className="row mb-4">
          <div className="col-md-3">
            <div className={`${cardClass} text-center`}>
              <h5>Total Tasks</h5>
              <h2 className="text-primary">{overview.totalTasks}</h2>
            </div>
          </div>
          <div className="col-md-3">
            <div className={`${cardClass} text-center`}>
              <h5>Completed</h5>
              <h2 className="text-success">{overview.completedTasks}</h2>
            </div>
          </div>
          <div className="col-md-3">
            <div className={`${cardClass} text-center`}>
              <h5>Pending</h5>
              <h2 className="text-warning">{overview.pendingTasks}</h2>
            </div>
          </div>
          <div className="col-md-3">
            <div className={`${cardClass} text-center`}>
              <h5>In Progress</h5>
              <h2 className="text-info">{overview.inProgressTasks}</h2>
            </div>
          </div>
        </div>
      )}

      {/* CHARTS ROW */}
      <div className="row mb-4">
        {/* PIE CHART */}
        <div className="col-md-5">
          <div className={cardClass}>
            <h5 className="mb-3">Status Breakdown</h5>
            {pieData.length === 0 ? (
              <p className="text-muted">No data yet</p>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* BAR CHART */}
        <div className="col-md-7">
          <div className={cardClass}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">Task Trends</h5>
              <div>
                <button
                  className={`btn btn-sm me-2 ${
                    trendType === "monthly"
                      ? "btn-primary"
                      : "btn-outline-primary"
                  }`}
                  onClick={() => setTrendType("monthly")}
                >
                  Monthly
                </button>
                <button
                  className={`btn btn-sm ${
                    trendType === "weekly"
                      ? "btn-primary"
                      : "btn-outline-primary"
                  }`}
                  onClick={() => setTrendType("weekly")}
                >
                  Weekly
                </button>
              </div>
            </div>
            {barData.length === 0 ? (
              <p className="text-muted">No data yet</p>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Total" fill="#8884d8" />
                  <Bar dataKey="Completed" fill="#5cb85c" />
                  <Bar dataKey="Pending" fill="#f0ad4e" />
                  <Bar dataKey="In Progress" fill="#5bc0de" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsDashboard;