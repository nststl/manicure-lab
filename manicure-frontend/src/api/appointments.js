import { API_BASE } from "./config";

const URL = `${API_BASE}/appointments`;

export async function getAppointments() {
  const res = await fetch(URL);
  if (!res.ok) throw new Error("Failed to load appointments");
  return res.json();
}

export async function createAppointment(data) {
  const res = await fetch(URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create appointment");
  return res.json();
}

export async function updateAppointment(id, data) {
  const res = await fetch(`${URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update appointment");
  return res.json();
}

export async function deleteAppointment(id) {
  const res = await fetch(`${URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete appointment");
  return res.json();
}

export const APPOINTMENT_STATUSES = [
  "scheduled",
  "confirmed",
  "completed",
  "cancelled",
];

export const STATUS_LABELS = {
  scheduled: "Заплановано",
  confirmed: "Підтверджено",
  completed: "Завершено",
  cancelled: "Скасовано",
};
