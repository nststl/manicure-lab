const API_URL = "http://localhost:3001/api/clients";

export async function getClients() {
  const res = await fetch(API_URL);
  return res.json();
}