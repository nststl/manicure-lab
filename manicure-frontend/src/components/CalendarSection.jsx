import { useMemo } from "react";
import { STATUS_LABELS } from "../api/appointments";
import { formatDateLabel, groupByDate } from "../utils/calendar";

export default function CalendarSection({ appointments, onEditAppointment }) {
  const days = useMemo(() => groupByDate(appointments), [appointments]);

  return (
    <section className="section">
      <div className="card">
        <h2>📆 Календар записів</h2>
        <p className="muted subtitle">Розклад майстра по днях</p>

        {days.length === 0 && (
          <p className="muted">Немає записів для календаря</p>
        )}

        <div className="calendar">
          {days.map(({ date, items }) => (
            <div key={date} className="calendar-day">
              <h3 className="calendar-day-title">{formatDateLabel(date)}</h3>
              <ul className="calendar-slots">
                {items.map((apt) => (
                  <li
                    key={apt._id}
                    className={`calendar-slot badge-${apt.status}`}
                  >
                    <span className="slot-time">🕐 {apt.time}</span>
                    <span className="slot-client">
                      👤 {apt.client?.name || "—"}
                    </span>
                    <div className="slot-actions">
                      <span className={`badge badge-${apt.status}`}>
                        {STATUS_LABELS[apt.status]}
                      </span>
                      <button
                        type="button"
                        className="btn btn-sm"
                        onClick={() => onEditAppointment(apt)}
                      >
                        Edit
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
