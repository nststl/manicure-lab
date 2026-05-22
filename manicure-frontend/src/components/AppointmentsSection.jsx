import { useEffect, useMemo, useState } from "react";
import {
  APPOINTMENT_STATUSES,
  STATUS_LABELS,
  createAppointment,
  deleteAppointment,
  updateAppointment,
} from "../api/appointments";

const emptyForm = {
  client: "",
  date: "",
  time: "",
  status: "scheduled",
};

export default function AppointmentsSection({
  appointments,
  clients,
  onRefresh,
  editTarget,
  onClearEditTarget,
}) {
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDate, setFilterDate] = useState("");

  useEffect(() => {
    if (!editTarget) return;
    startEdit(editTarget);
    onClearEditTarget?.();
  }, [editTarget]);

  const filtered = useMemo(() => {
    return appointments.filter((apt) => {
      if (filterStatus !== "all" && apt.status !== filterStatus) return false;
      if (filterDate && apt.date !== filterDate) return false;
      return true;
    });
  }, [appointments, filterStatus, filterDate]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function startEdit(apt) {
    setForm({
      client: apt.client?._id || apt.client,
      date: apt.date,
      time: apt.time,
      status: apt.status,
    });
    setEditingId(apt._id);
  }

  function cancelEdit() {
    setForm(emptyForm);
    setEditingId(null);
  }

  async function handleSubmit() {
    if (!form.client || !form.date || !form.time) return;

    try {
      if (editingId) {
        await updateAppointment(editingId, form);
      } else {
        await createAppointment(form);
      }
      cancelEdit();
      onRefresh();
    } catch (err) {
      alert(err.message || "Помилка збереження");
    }
  }

  async function handleDelete(id) {
    if (!confirm("Видалити цей запис?")) return;

    try {
      await deleteAppointment(id);
      if (editingId === id) cancelEdit();
      onRefresh();
    } catch (err) {
      alert(err.message || "Помилка видалення");
    }
  }

  return (
    <section className="section">
      <div className="section-grid">
        <div className="card">
          <h2>
            {editingId ? "✏️ Редагувати запис" : "📅 Новий запис"}
          </h2>

          {clients.length === 0 ? (
            <p className="muted">Спочатку додайте клієнта</p>
          ) : (
            <div className="form">
              <select
                name="client"
                value={form.client}
                onChange={handleChange}
              >
                <option value="">Оберіть клієнта</option>
                {clients.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name} — {c.phone}
                  </option>
                ))}
              </select>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
              />
              <input
                type="time"
                name="time"
                value={form.time}
                onChange={handleChange}
              />
              <select name="status" value={form.status} onChange={handleChange}>
                {APPOINTMENT_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABELS[s]}
                  </option>
                ))}
              </select>
              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSubmit}
                >
                  {editingId ? "Зберегти" : "Створити запис"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={cancelEdit}
                  >
                    Скасувати
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="card card-grow">
          <div className="card-header">
            <h2>💅 Записи</h2>
            <div className="filters">
              <select
                className="filter-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">Усі статуси</option>
                {APPOINTMENT_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABELS[s]}
                  </option>
                ))}
              </select>
              <input
                type="date"
                className="filter-select"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                title="Фільтр за датою"
              />
              {filterDate && (
                <button
                  type="button"
                  className="btn btn-sm btn-ghost"
                  onClick={() => setFilterDate("")}
                >
                  Скинути дату
                </button>
              )}
            </div>
          </div>

          {filtered.length === 0 && (
            <p className="muted">
              {appointments.length === 0
                ? "Записів поки немає"
                : "Нічого не знайдено за фільтром"}
            </p>
          )}

          <ul className="list">
            {filtered.map((apt) => (
              <li key={apt._id} className="list-item">
                <div className="list-item-main">
                  <span className="list-title">
                    {apt.client?.name || "Клієнт"} — {apt.date} о {apt.time}
                  </span>
                  <span className={`badge badge-${apt.status}`}>
                    {STATUS_LABELS[apt.status] || apt.status}
                  </span>
                </div>
                <div className="list-actions">
                  <button
                    type="button"
                    className="btn btn-sm"
                    onClick={() => startEdit(apt)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(apt._id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
