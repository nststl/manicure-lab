import { useEffect, useState } from "react";
import { getClients } from "./api/clients";

const API_URL = "http://localhost:3001/api/clients";

function App() {
  const [clients, setClients] = useState([]);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadClients();
  }, []);

  async function loadClients() {
    try {
      const res = await getClients();
      setClients(res);
    } catch (err) {
      console.log(err);
    }
  }

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function addClient() {
    await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    setForm({ name: "", phone: "", email: "" });
    loadClients();
  }

  async function deleteClient(id) {
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    loadClients();
  }

  function startEdit(client) {
    setForm({
      name: client.name,
      phone: client.phone,
      email: client.email,
    });

    setEditingId(client._id);
  }

  async function updateClient() {
    await fetch(`${API_URL}/${editingId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    setForm({ name: "", phone: "", email: "" });
    setEditingId(null);
    loadClients();
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>💅 Manicure Lab</h1>

      <h2>{editingId ? "✏️ Edit client" : "➕ Add client"}</h2>

      <input
        name="name"
        placeholder="Name"
        value={form.name}
        onChange={handleChange}
      />
      <br />

      <input
        name="phone"
        placeholder="Phone"
        value={form.phone}
        onChange={handleChange}
      />
      <br />

      <input
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
      />
      <br />

      <button onClick={editingId ? updateClient : addClient}>
        {editingId ? "Save" : "Add"}
      </button>

      <h2>Clients</h2>

      {clients.length === 0 && <p>No clients yet</p>}

      {clients.map((c) => (
        <div key={c._id} style={{ marginBottom: 10 }}>
          👤 {c.name} — {c.phone}

          <button style={{ marginLeft: 10 }} onClick={() => startEdit(c)}>
            Edit
          </button>

          <button
            style={{ marginLeft: 10 }}
            onClick={() => deleteClient(c._id)}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default App;