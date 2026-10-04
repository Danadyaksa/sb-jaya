/**
 * Utilitas untuk mengekspor data ke file CSV yang diformat khusus untuk Microsoft Excel.
 * Menggunakan UTF-8 BOM agar terbaca bersih tanpa karakter rusak dan rapi.
 */

interface CsvExportOptions {
  filename: string;
  title: string;
  metadata?: Record<string, string | number>;
  headers: string[];
  rows: (string | number)[][];
  summaryRow?: (string | number)[];
}

export function exportToCleanCsv({
  filename,
  title,
  metadata = {},
  headers,
  rows,
  summaryRow,
}: CsvExportOptions) {
  const lines: string[] = [];

  // Helper escape CSV cell
  const escapeCell = (val: string | number | undefined | null): string => {
    if (val === undefined || val === null) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  // 1. Header Judul Laporan
  lines.push(escapeCell("TOKO SB JAYA - SUKU CADANG & AKSESORIS"));
  lines.push(escapeCell(title.toUpperCase()));
  lines.push(escapeCell(`Waktu Unduh: ${new Date().toLocaleString("id-ID")}`));

  // 2. Metadata / Ringkasan jika ada
  const metaKeys = Object.keys(metadata);
  if (metaKeys.length > 0) {
    lines.push(""); // baris kosong pemisah
    for (const key of metaKeys) {
      lines.push(`${escapeCell(key)},${escapeCell(metadata[key])}`);
    }
  }

  lines.push(""); // baris kosong sebelum tabel utama

  // 3. Header Tabel
  lines.push(headers.map(escapeCell).join(","));

  // 4. Baris Data Tabel
  for (const row of rows) {
    lines.push(row.map(escapeCell).join(","));
  }

  // 5. Baris Total / Ringkasan Bawah jika ada
  if (summaryRow && summaryRow.length > 0) {
    lines.push(""); // pemisah tipis
    lines.push(summaryRow.map(escapeCell).join(","));
  }

  // Gabungkan dengan BOM UTF-8 (\uFEFF)
  const csvContent = "\uFEFF" + lines.join("\r\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename.endsWith(".csv") ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
