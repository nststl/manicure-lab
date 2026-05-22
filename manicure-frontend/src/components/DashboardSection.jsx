import { useMemo } from "react";
import { STATUS_LABELS } from "../api/appointments";
import { formatDateLabel } from "../utils/calendar";

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export default function DashboardSection({ clients, appointments, onEditAppointment }) {
  const today = todayStr();

  const todayAppointments = useMemo(
    () =>
      appointments
        .filter((a) => a.date === today)
        .sort((a, b) => a.time.localeCompare(b.time)),
    [appointments, today]
  );

  const upcoming = useMemo(() => {
    return appointments
      .filter((a) => a.date >= today && a.status !== "cancelled")
      .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`))
      .slice(0, 5);
  }, [appointments, today]);

  const recentClients = useMemo(() => clients.slice(0, 5), [clients]);

  return (
    <section className="section">
      <div className="dashboard-grid">
        <div className="card">
          <h2>📋 Сьогодні</h2>
          <p className="muted subtitle">{formatDateLabel(today)}</p>

          {todayAppointments.length === 0 ? (
            <p className="muted">На сьогодні записів немає</p>
          ) : (
            <ul className="list">
              {todayAppointments.map((apt) => (
                <li key={apt._id} className="list-item">
                  <div className="list-item-main">
                    <span className="list-title">
                      🕐 {apt.time} — {apt.client?.name || "Клієнт"}
                    </span>
                    <span className={`badge badge-${apt.status}`}>
                      {STATUS_LABELS[apt.status]}
                    </span>
                  </div>
                  <button
                    className="btn btn-sm"
                    type="button"
                    onClick={() => onEditAppointment(apt)}
                  >
                    Edit
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card">
          <h2>📅 Найближчі записи</h2>
          {upcoming.length === 0 ? (
            <p className="muted">Немає майбутніх записів</p>
          ) : (
            <ul className="list">
              {upcoming.map((apt) => (
                <li key={apt._id} className="list-item">
                  <div className="list-item-main">
                    <span className="list-title">
                      {apt.client?.name} — {apt.date} о {apt.time}
                    </span>
                    <span className={`badge badge-${apt.status}`}>
                      {STATUS_LABELS[apt.status]}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card">
          <h2>👤 Останні клієнти</h2>
          {recentClients.length === 0 ? (
            <p className="muted">Додайте першого клієнта</p>
          ) : (
            <ul className="list">
              {recentClients.map((c) => (
                <li key={c._id} className="list-item">
                  <div className="list-item-main">
                    <span className="list-title">👤 {c.name}</span>
                    <span className="list-meta">{c.phone}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
