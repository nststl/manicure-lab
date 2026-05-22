export function groupByDate(appointments) {
  const map = new Map();

  for (const apt of appointments) {
    const list = map.get(apt.date) || [];
    list.push(apt);
    map.set(apt.date, list);
  }

  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, items]) => ({
      date,
      items: items.sort((x, y) => x.time.localeCompare(y.time)),
    }));
}

export function formatDateLabel(dateStr) {
  const date = new Date(`${dateStr}T12:00:00`);
  return date.toLocaleDateString("uk-UA", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
