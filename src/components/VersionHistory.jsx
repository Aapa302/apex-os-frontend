import React from "react";

export default function VersionHistory({
  activeAlgorithm,
  versionSearch,
  setVersionSearch,
  versionStatusFilter,
  setVersionStatusFilter,
  onShowToast,
  T
}) {
  const activeVersions = activeAlgorithm?.versions || [];

  // Filter version history list based on search and status filters
  const filteredVersions = activeVersions.filter(v => {
    const matchesSearch = v.number.toLowerCase().includes(versionSearch.toLowerCase()) ||
                          v.author.toLowerCase().includes(versionSearch.toLowerCase()) ||
                          v.description.toLowerCase().includes(versionSearch.toLowerCase());
    const matchesStatus = versionStatusFilter === "All" || v.status === versionStatusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div style={{
      flex: 1,
      display: "flex",
      flexDirection: "column",
      padding: "24px",
      boxSizing: "border-box",
      overflowY: "auto"
    }}>
      {/* Toolbar & Filters Header */}
      <div style={{
        background: T.surf,
        border: `1px solid ${T.border2}`,
        borderRadius: 12,
        padding: "16px 20px",
        marginBottom: "20px",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 16
      }}>
        <div>
          <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 800, color: T.text1 }}>
            📋 Version History Timeline
          </h3>
          <p style={{ margin: "4px 0 0 0", fontSize: "0.76rem", color: T.text2 }}>
            Audit trail of all finalized sequence model releases and active drafts.
          </p>
        </div>

        {/* Filters */}
        <div style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
          flexWrap: "wrap"
        }}>
          {/* Search box */}
          <input
            type="text"
            value={versionSearch}
            onChange={e => setVersionSearch(e.target.value)}
            placeholder="🔍 Search versions..."
            style={{
              background: T.surf2,
              border: `1px solid ${T.border2}`,
              borderRadius: 8,
              padding: "8px 14px",
              color: T.text1,
              fontSize: "0.82rem",
              outline: "none",
              width: "180px"
            }}
          />

          {/* Status Filter */}
          <select
            value={versionStatusFilter}
            onChange={e => setVersionStatusFilter(e.target.value)}
            style={{
              background: T.surf2,
              border: `1px solid ${T.border2}`,
              borderRadius: 8,
              padding: "8px 14px",
              color: T.text1,
              fontSize: "0.82rem",
              outline: "none",
              cursor: "pointer"
            }}
          >
            <option value="All">All Statuses</option>
            <option value="Draft">Draft</option>
            <option value="Review">Review</option>
            <option value="Approved">Approved</option>
          </select>
        </div>
      </div>

      {/* TIMELINE LIST */}
      {filteredVersions.length === 0 ? (
        <div style={{
          textAlign: "center",
          padding: "60px 20px",
          color: T.text3,
          background: T.surf,
          border: `1px solid ${T.border2}`,
          borderRadius: 12
        }}>
          <div style={{ fontSize: "2rem", marginBottom: 10 }}>📋</div>
          <div>No version history items match the active filters for this algorithm.</div>
        </div>
      ) : (
        <div style={{
          position: "relative",
          paddingLeft: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "24px"
        }}>
          {/* Timeline connecting vertical vertical line */}
          <div style={{
            position: "absolute",
            left: "7px",
            top: "14px",
            bottom: "14px",
            width: "2px",
            background: T.border2
          }} />

          {/* Render version cards */}
          {filteredVersions.map(v => {
            const statusColor = v.status === "Approved" ? T.green : v.status === "Review" ? T.cyan : T.yellow;

            return (
              <div
                key={v.id}
                style={{
                  position: "relative",
                  background: T.surf,
                  border: `1px solid ${T.border2}`,
                  borderRadius: 12,
                  padding: "18px 20px",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 16
                }}
              >
                {/* Timeline circle point */}
                <div style={{
                  position: "absolute",
                  left: "-21px",
                  top: "22px",
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background: statusColor,
                  boxShadow: `0 0 8px ${statusColor}`,
                  zIndex: 5
                }} />

                {/* Version details column */}
                <div style={{ flex: 1, minWidth: "260px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
                    <span style={{
                      fontSize: "1rem",
                      fontWeight: 800,
                      color: T.text1
                    }}>{v.number}</span>

                    {/* Status badge */}
                    <span style={{
                      fontSize: "0.66rem",
                      fontWeight: 800,
                      textTransform: "uppercase",
                      padding: "2px 8px",
                      borderRadius: "4px",
                      background: `${statusColor}15`,
                      border: `1px solid ${statusColor}40`,
                      color: statusColor
                    }}>{v.status}</span>
                  </div>

                  {/* Date and Author */}
                  <div style={{ fontSize: "0.74rem", color: T.text3, marginBottom: 8 }}>
                    Released on <strong style={{ color: T.text2 }}>{v.date}</strong> by <strong style={{ color: T.text2 }}>{v.author}</strong>
                  </div>

                  {/* Description */}
                  <p style={{ margin: 0, fontSize: "0.82rem", color: T.text2, lineHeight: 1.5 }}>
                    {v.description}
                  </p>
                </div>

                {/* Timeline Card Action Buttons */}
                <div style={{
                  display: "flex",
                  gap: 8,
                  alignItems: "center"
                }}>
                  <button
                    onClick={() => onShowToast(`View details for release: ${v.number}`, "info")}
                    style={{
                      padding: "6px 12px",
                      background: T.surf2,
                      border: `1px solid ${T.border2}`,
                      borderRadius: 6,
                      color: T.text1,
                      fontSize: "0.74rem",
                      fontWeight: 600,
                      cursor: "pointer"
                    }}
                  >
                    View
                  </button>
                  <button
                    onClick={() => onShowToast(`Compare current draft with release: ${v.number}`, "info")}
                    style={{
                      padding: "6px 12px",
                      background: T.surf2,
                      border: `1px solid ${T.border2}`,
                      borderRadius: 6,
                      color: T.text1,
                      fontSize: "0.74rem",
                      fontWeight: 600,
                      cursor: "pointer"
                    }}
                  >
                    Compare
                  </button>
                  <button
                    onClick={() => onShowToast(`Restore operation simulated: ${v.number} parameters loaded.`, "success")}
                    style={{
                      padding: "6px 12px",
                      background: `${T.accent}12`,
                      border: `1px solid ${T.accent}40`,
                      borderRadius: 6,
                      color: T.text1,
                      fontSize: "0.74rem",
                      fontWeight: 600,
                      cursor: "pointer"
                    }}
                  >
                    Restore
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
