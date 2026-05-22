import { useCallback, useEffect, useState } from "react";
import { getAppointments } from "./api/appointments";
import { getClients } from "./api/clients";
import AppointmentsSection from "./components/AppointmentsSection";
import CalendarSection from "./components/CalendarSection";
import ClientsSection from "./components/ClientsSection";
import DashboardSection from "./components/DashboardSection";
import "./App.css";

const VIEWS = [
  { id: "dashboard", label: "🏠 Головна" },
  { id: "clients", label: "👤 Клієнти" },
  { id: "appointments", label: "📅 Записи" },
  { id: "calendar", label: "📆 Календар" },
];

function App() {
  const [view, setView] = useState("dashboard");
  const [clients, setClients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [appointmentEditTarget, setAppointmentEditTarget] = useState(null);

  const loadData = useCallback(async () => {
    setError("");
    try {
      const [clientsRes, appointmentsRes] = await Promise.all([
        getClients(),
        getAppointments(),
      ]);
      setClients(clientsRes);
      setAppointments(appointmentsRes);
    } catch (err) {
      setError(
        "Не вдалося підключитися до сервера. Перевір, що backend працює на :3001"
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  function openAppointmentEdit(apt) {
    setAppointmentEditTarget(apt);
    setView("appointments");
  }

  const today = new Date().toISOString().slice(0, 10);
  const stats = {
    clients: clients.length,
    appointments: appointments.length,
    today: appointments.filter((a) => a.date === today).length,
  };

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-emoji">💅</span>
          <div>
            <strong>Manicure Lab</strong>
            <span className="brand-sub">CRM салону</span>
          </div>
        </div>

        <nav className="nav">
          {VIEWS.map((v) => (
            <button
              key={v.id}
              type="button"
              className={`nav-item ${view === v.id ? "active" : ""}`}
              onClick={() => setView(v.id)}
            >
              {v.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-stats">
          <div className="stat">
            <span className="stat-value">{stats.clients}</span>
            <span className="stat-label">клієнтів</span>
          </div>
          <div className="stat">
            <span className="stat-value">{stats.appointments}</span>
            <span className="stat-label">записів</span>
          </div>
          <div className="stat">
            <span className="stat-value">{stats.today}</span>
            <span className="stat-label">сьогодні</span>
          </div>
        </div>
      </aside>

      <main className="main">
        <header className="page-header">
          <h1>{VIEWS.find((v) => v.id === view)?.label || "💅 Manicure Lab"}</h1>
          {error && (
            <div className="alert alert-error">
              {error}
              <button type="button" className="btn btn-sm" onClick={loadData}>
                Повторити
              </button>
            </div>
          )}
        </header>

        {loading ? (
          <p className="muted loading">Завантаження...</p>
        ) : (
          <>
            {view === "dashboard" && (
              <DashboardSection
                clients={clients}
                appointments={appointments}
                onEditAppointment={openAppointmentEdit}
              />
            )}
            {view === "clients" && (
              <ClientsSection clients={clients} onRefresh={loadData} />
            )}
            {view === "appointments" && (
              <AppointmentsSection
                appointments={appointments}
                clients={clients}
                onRefresh={loadData}
                editTarget={appointmentEditTarget}
                onClearEditTarget={() => setAppointmentEditTarget(null)}
              />
            )}
            {view === "calendar" && (
              <CalendarSection
                appointments={appointments}
                onEditAppointment={openAppointmentEdit}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
