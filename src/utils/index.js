const showFormattedDate = (date, locale = "id") => {
  const d = new Date(date);
  if (isNaN(d)) return "-";

  if (locale === "en") {
    return d.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "2-digit",
    });
  }

  const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  return `${days[d.getDay()]}, ${String(d.getDate()).padStart(2, "0")} ${months[d.getMonth()]} ${d.getFullYear()}`;
};

const truncateText = (text, maxLength = 25, fallback = "Tidak ada isi") => {
  if (!text || !text.trim()) return fallback;
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
};

export { showFormattedDate, truncateText };
