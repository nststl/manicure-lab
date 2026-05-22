import { useMemo, useState } from "react";
import {
  createClient,
  deleteClient,
  updateClient,
} from "../api/clients";

const emptyForm = { name: "", phone: "", email: "" };

export default function ClientsSection({ clients, onRefresh }) {
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return clients;
    return clients.filter(
      (c) =>
        c.name?.toLowerCase().includes(q) ||
        c.phone?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q)
    );
  }, [clients, search]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function startEdit(client) {
    setForm({
      name: client.name,
      phone: client.phone,
      email: client.email || "",
    });
    setEditingId(client._id);
  }

  function cancelEdit() {
    setForm(emptyForm);
    setEditingId(null);
  }

  async function handleSubmit() {
    if (!form.name.trim() || !form.phone.trim()) return;

    try {
      if (editingId) {
        await updateClient(editingId, form);
      } else {
        await createClient(form);
      }
      cancelEdit();
      onRefresh();
    } catch (err) {
      alert(err.message || "Помилка збереження");
    }
  }

  async function handleDelete(id) {
    if (!confirm("Видалити клієнта та всі його записи?")) return;

    try {
      await deleteClient(id);
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
          <h2>{editingId ? "✏️ Редагувати клієнта" : "➕ Додати клієнта"}</h2>
          <div className="form">
            <input
              name="name"
              placeholder="Ім'я"
              value={form.name}
              onChange={handleChange}
            />
            <input
              name="phone"
              placeholder="Телефон"
              value={form.phone}
              onChange={handleChange}
            />
            <input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
            />
            <div className="form-actions">
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSubmit}
              >
                {editingId ? "Зберегти" : "Додати"}
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
        </div>

        <div className="card card-grow">
          <div className="card-header">
            <h2>👤 Клієнти</h2>
            <input
              className="search-input"
              placeholder="🔍 Пошук за ім'ям або номером..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {filtered.length === 0 && (
            <p className="muted">
              {search ? "Нікого не знайдено" : "Ще немає клієнтів"}
            </p>
          )}

          <ul className="list">
            {filtered.map((c) => (
              <li key={c._id} className="list-item">
                <div className="list-item-main">
                  <span className="list-title">👤 {c.name}</span>
                  <span className="list-meta">
                    {c.phone}
                    {c.email ? ` · ${c.email}` : ""}
                  </span>
                </div>
                <div className="list-actions">
                  <button
                    type="button"
                    className="btn btn-sm"
                    onClick={() => startEdit(c)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(c._id)}
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
