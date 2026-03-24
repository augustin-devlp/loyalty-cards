"use client";

import jsPDF from "jspdf";

interface TopClient {
  name: string;
  rewards: number;
  stamps: number;
  points: number;
}

interface ChartDay {
  date: string;
  scans: number;
}

interface ExportPDFButtonProps {
  businessName: string;
  totalClients: number;
  stampsTotal: number;
  pointsTotal: number;
  rewardsTotal: number;
  top10: TopClient[];
  chartData: ChartDay[];
  hasStamps: boolean;
  hasPoints: boolean;
}

export default function ExportPDFButton({
  businessName,
  totalClients,
  stampsTotal,
  pointsTotal,
  rewardsTotal,
  top10,
  chartData,
  hasStamps,
  hasPoints,
}: ExportPDFButtonProps) {
  const exportPDF = () => {
    const doc = new jsPDF();
    const now = new Date();
    const dateStr = now.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    // Header
    doc.setFillColor(83, 74, 183);
    doc.rect(0, 0, 210, 30, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("Stampify", 15, 18);
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text("Rapport de fidélité", 55, 18);

    // Title
    doc.setTextColor(30, 30, 30);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(`${businessName} — Rapport de fidélité`, 15, 45);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(120, 120, 120);
    doc.text(`Généré le ${dateStr}`, 15, 53);

    // Separator
    doc.setDrawColor(200, 200, 200);
    doc.line(15, 58, 195, 58);

    // Stats section
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 30, 30);
    doc.text("Statistiques globales", 15, 68);

    const stats: [string, string][] = [
      ["Total clients inscrits", String(totalClients)],
    ];
    if (hasStamps) stats.push(["Tampons distribués (total)", String(stampsTotal)]);
    if (hasPoints) stats.push(["Points distribués (total)", String(pointsTotal)]);
    stats.push(["Récompenses réclamées", String(rewardsTotal)]);

    let y = 78;
    doc.setFontSize(10);
    for (const [label, value] of stats) {
      doc.setFont("helvetica", "normal");
      doc.setTextColor(80, 80, 80);
      doc.text(label, 20, y);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(83, 74, 183);
      doc.text(value, 130, y);
      y += 8;
    }

    // Separator
    y += 4;
    doc.setDrawColor(200, 200, 200);
    doc.line(15, y, 195, y);
    y += 8;

    // Top 10 clients
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 30, 30);
    doc.text("Top 10 clients fidèles", 15, y);
    y += 10;

    if (top10.length === 0) {
      doc.setFontSize(10);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(150, 150, 150);
      doc.text("Aucun client pour l'instant.", 20, y);
      y += 8;
    } else {
      // Table header
      doc.setFillColor(240, 240, 250);
      doc.rect(15, y - 5, 180, 7, "F");
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(83, 74, 183);
      doc.text("#", 18, y);
      doc.text("Nom", 28, y);
      doc.text(hasStamps ? "Tampons" : "Points", 110, y);
      doc.text("Récompenses", 150, y);
      y += 6;

      doc.setFont("helvetica", "normal");
      doc.setTextColor(50, 50, 50);
      for (let i = 0; i < top10.length; i++) {
        const c = top10[i];
        if (i % 2 === 0) {
          doc.setFillColor(248, 248, 252);
          doc.rect(15, y - 4, 180, 6, "F");
        }
        doc.setFontSize(9);
        doc.text(String(i + 1), 18, y);
        doc.text(c.name.substring(0, 30), 28, y);
        doc.text(hasStamps ? String(c.stamps) : String(c.points), 110, y);
        doc.text(String(c.rewards), 150, y);
        y += 7;
        if (y > 260) {
          doc.addPage();
          y = 20;
        }
      }
    }

    // Separator
    y += 4;
    if (y < 260) {
      doc.setDrawColor(200, 200, 200);
      doc.line(15, y, 195, y);
      y += 8;
    } else {
      doc.addPage();
      y = 20;
    }

    // 30-day activity summary
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 30, 30);
    doc.text("Activité sur les 30 derniers jours", 15, y);
    y += 8;

    const totalScans = chartData.reduce((s, d) => s + d.scans, 0);
    const activeDays = chartData.filter((d) => d.scans > 0).length;
    const maxDay = chartData.reduce((max, d) => (d.scans > max.scans ? d : max), { date: "—", scans: 0 });

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80, 80, 80);
    doc.text(`Total scans (30j) : ${totalScans}`, 20, y); y += 7;
    doc.text(`Jours actifs : ${activeDays} / 30`, 20, y); y += 7;
    doc.text(`Jour le plus actif : ${maxDay.date} (${maxDay.scans} scan${maxDay.scans > 1 ? "s" : ""})`, 20, y);

    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(180, 180, 180);
      doc.text(
        `Stampify — ${businessName} — Page ${i}/${pageCount}`,
        105,
        290,
        { align: "center" }
      );
    }

    doc.save(`rapport-stampify-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}.pdf`);
  };

  return (
    <button
      onClick={exportPDF}
      className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-colors hover:bg-gray-50"
      style={{ borderColor: "#e5e7eb", color: "#374151" }}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14,2 14,8 20,8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10,9 9,9 8,9" />
      </svg>
      Exporter en PDF
    </button>
  );
}
