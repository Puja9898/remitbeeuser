import React, { useEffect, useState, useMemo } from "react";
import UserCard from "./components/UserCard";

const API_URL = "https://jsonplaceholder.typicode.com/users";
const USERS_PER_PAGE = 14;

export default function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  // ✅ Fetch users
  useEffect(() => {
    setLoading(true);
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error("Network error");
        return res.json();
      })
      .then((data) => {
        // Create 5 pages (repeated for demo)
        const extended = Array.from({ length: 5 }, (_, i) =>
          data.map((u) => ({
            ...u,
            id: u.id + i * data.length,
            name: `${u.name} ${i + 1}`,
          }))
        ).flat();
        setUsers(extended);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to fetch users");
        setLoading(false);
      });
  }, []);

  // ✅ Search + sort
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = users;
    if (q) {
      list = users.filter((u) => {
        const name = (u.name || "").toLowerCase();
        const email = (u.email || "").toLowerCase();
        const company = (u.company?.name || "").toLowerCase();
        return name.includes(q) || email.includes(q) || company.includes(q);
      });
    }

    // ✅ Sort A–Z / Z–A
    list = [...list].sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      return sortOrder === "asc"
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    });

    return list;
  }, [users, query, sortOrder]);

  // ✅ Pagination
  const totalPages = Math.ceil(filtered.length / USERS_PER_PAGE);
  const startIndex = (page - 1) * USERS_PER_PAGE;
  const visible = filtered.slice(startIndex, startIndex + USERS_PER_PAGE);

  useEffect(() => setPage(1), [query]);

  const toggleSelect = (id) => {
    setSelectedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="app-root">
      <header className="header">
        <h1>RemitBee User Details</h1>
      </header>

      <main className="main">
        {/* ✅ Search + Sort Controls */}
        <div className="controls">
          <input
            className="search"
            type="text"
            placeholder="Search by name, email, or company..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <select
            className="sort"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="asc">Sort A–Z</option>
            <option value="desc">Sort Z–A</option>
          </select>
        </div>

        {/* ✅ Content Display */}
        {loading ? (
          <div className="status">Loading users…</div>
        ) : error ? (
          <div className="status error">Error: {error}</div>
        ) : filtered.length === 0 ? (
          <div className="status empty">No records found.</div>
        ) : (
          <>
            <div className="grid">
              {visible.map((user) => (
                <UserCard
                  key={user.id}
                  user={user}
                  isSelected={selectedId === user.id}
                  onClick={() => toggleSelect(user.id)}
                />
              ))}
            </div>

            {/* ✅ Pagination */}
            <div className="pagination">
              <button
                className="pg-btn"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                ← Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                <button
                  key={num}
                  className={`pg-num ${page === num ? "active" : ""}`}
                  onClick={() => setPage(num)}
                >
                  {num}
                </button>
              ))}

              <button
                className="pg-btn"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next →
              </button>
            </div>
          </>
        )}
      </main>

      <footer className="footer">
        <small>
          Showing {visible.length} of {users.length} users
        </small>
      </footer>
    </div>
  );
}
