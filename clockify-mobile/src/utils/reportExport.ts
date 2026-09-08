// Utility functions for exporting reports in CSV, Excel, and PDF formats
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";

export interface ExportSettings {
  name: string;
  durationHours: boolean; // Duration (h) - Visible in PDF, CSV and Excel
  durationDecimal: boolean; // Duration (decimal) - Visible only in CSV and Excel
  barChart: boolean; // Bar chart - Visible only in PDF
  pieChart: boolean; // Pie chart - Visible only in PDF
  note: string;
}

export const defaultExportSettings: ExportSettings = {
  name: "Summary report",
  durationHours: true,
  durationDecimal: true,
  barChart: true,
  pieChart: true,
  note: "",
};

export interface ReportItem {
  project: string;
  client: string;
  description: string;
  timeH: string;
  timeDec: string;
  amount: string;
}

export const sampleReportEntries: ReportItem[] = [
  {
    project: "[SAMPLE] Project Beta",
    client: "[SAMPLE] Client B",
    description: "[SAMPLE] 2cb2450e-a31f-46cf-bcf9-d176d29f9f7f",
    timeH: "05:00:00",
    timeDec: "5.00",
    amount: "75.00",
  },
  {
    project: "[SAMPLE] Project Beta",
    client: "[SAMPLE] Client B",
    description: "[SAMPLE] aa82370e-49e9-4c5e-904a-e355ff6969ab",
    timeH: "04:00:00",
    timeDec: "4.00",
    amount: "0.00",
  },
  {
    project: "[SAMPLE] Project Beta",
    client: "[SAMPLE] Client B",
    description: "[SAMPLE] 8d39ea98-2949-4785-8e3a-b6eed3209540",
    timeH: "04:00:00",
    timeDec: "4.00",
    amount: "20.00",
  },
  {
    project: "[SAMPLE] Project Beta",
    client: "[SAMPLE] Client B",
    description: "[SAMPLE] 7d7e4374-8fd8-4488-8388-11875ac57bda",
    timeH: "04:00:00",
    timeDec: "4.00",
    amount: "48.00",
  },
  {
    project: "[SAMPLE] Project Beta",
    client: "[SAMPLE] Client B",
    description: "[SAMPLE] 6847f75b-16f3-4ece-9e42-2dd3248ad1a0",
    timeH: "04:00:00",
    timeDec: "4.00",
    amount: "60.00",
  },
  {
    project: "[SAMPLE] Project Beta",
    client: "[SAMPLE] Client B",
    description: "[SAMPLE] 5cb4ff6f-1118-4d17-abf4-9e05b535e1e7",
    timeH: "04:00:00",
    timeDec: "4.00",
    amount: "20.00",
  },
  {
    project: "[SAMPLE] Project Beta",
    client: "[SAMPLE] Client B",
    description: "[SAMPLE] 7ad36df0-2989-4fd9-a485-1fd43684ec60",
    timeH: "03:00:00",
    timeDec: "3.00",
    amount: "30.00",
  },
  {
    project: "[SAMPLE] Project Beta",
    client: "[SAMPLE] Client B",
    description: "[SAMPLE] 47788ee9-703a-473c-b869-443e64891ae7",
    timeH: "03:00:00",
    timeDec: "3.00",
    amount: "30.00",
  },
  {
    project: "[SAMPLE] Project Alpha",
    client: "[SAMPLE] Client A",
    description: "[SAMPLE] cce3ca3a-ae5f-48a6-a588-1bb6cac37f7c",
    timeH: "05:00:00",
    timeDec: "5.00",
    amount: "60.00",
  },
  {
    project: "[SAMPLE] Project Alpha",
    client: "[SAMPLE] Client A",
    description: "[SAMPLE] 005aecff-d941-4ccb-86ee-11d559af6c93",
    timeH: "04:00:00",
    timeDec: "4.00",
    amount: "60.00",
  },
  {
    project: "[SAMPLE] Project Alpha",
    client: "[SAMPLE] Client A",
    description: "[SAMPLE] f9b52bcd-7243-44d7-8412-1bc8e632f045",
    timeH: "03:00:00",
    timeDec: "3.00",
    amount: "45.00",
  },
  {
    project: "[SAMPLE] Project Alpha",
    client: "[SAMPLE] Client A",
    description: "[SAMPLE] 0ea826de-cd67-4e29-be2c-696507bc8bfd",
    timeH: "03:00:00",
    timeDec: "3.00",
    amount: "45.00",
  },
  {
    project: "[SAMPLE] Internal Project",
    client: "(Without client)",
    description: "[SAMPLE] 5bf5fe4c-b743-49cc-a3e0-a748ca191918",
    timeH: "04:00:00",
    timeDec: "4.00",
    amount: "0.00",
  },
];

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// 1. Export as CSV matching Clockify reference CSV exactly
export function exportToCsv(
  settings: ExportSettings = defaultExportSettings,
  entries: ReportItem[] = sampleReportEntries
) {
  const headers: string[] = ["Project", "Client", "Description"];
  if (settings.durationHours !== false) headers.push("Time (h)");
  if (settings.durationDecimal !== false) headers.push("Time (decimal)");
  headers.push("Amount (USD)");

  const lines: string[] = [headers.map((h) => `"${h}"`).join(",")];

  for (const item of entries) {
    const row: string[] = [
      `"${item.project}"`,
      `"${item.client || "(Without client)"}"`,
      `"${item.description}"`,
    ];
    if (settings.durationHours !== false) row.push(`"${item.timeH}"`);
    if (settings.durationDecimal !== false) row.push(`"${item.timeDec}"`);
    row.push(`"${item.amount}"`);
    lines.push(row.join(","));
  }

  const csvContent = lines.join("\r\n");
  const blob = new Blob(["\uFEFF" + csvContent], {
    type: "text/csv;charset=utf-8;",
  });
  downloadBlob(blob, "Clockify_Time_Report_Summary_13-07-2026-19-07-2026.csv");
}

// 2. Export as Excel (.xlsx) matching Clockify reference XLSX exactly
export function exportToExcel(
  settings: ExportSettings = defaultExportSettings,
  entries: ReportItem[] = sampleReportEntries
) {
  // Group entries by project
  const projectGroups: Record<
    string,
    {
      projectName: string;
      clientName: string;
      entries: ReportItem[];
      totalH: number;
      totalAmount: number;
    }
  > = {};

  let grandTotalSeconds = 0;
  let grandTotalAmount = 0;

  for (const item of entries) {
    const key = item.project;
    if (!projectGroups[key]) {
      projectGroups[key] = {
        projectName: item.project,
        clientName: item.client,
        entries: [],
        totalH: 0,
        totalAmount: 0,
      };
    }
    projectGroups[key].entries.push(item);
    const dec = parseFloat(item.timeDec) || 0;
    projectGroups[key].totalH += dec;
    projectGroups[key].totalAmount += parseFloat(item.amount) || 0;

    grandTotalSeconds += dec * 3600;
    grandTotalAmount += parseFloat(item.amount) || 0;
  }

  const rows: any[][] = [];
  // Row 1: Header
  const headers: any[] = ["Project", "Description"];
  if (settings.durationHours !== false) headers.push("Time (h)");
  if (settings.durationDecimal !== false) headers.push("Time (decimal)");
  headers.push("Amount (USD)");
  rows.push(headers);

  // Helper to format hours into HH:MM:SS
  const formatSecs = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = Math.floor(secs % 60);
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s
      .toString()
      .padStart(2, "0")}`;
  };

  for (const group of Object.values(projectGroups)) {
    const projLabel =
      group.clientName && group.clientName !== "(Without client)"
        ? `${group.projectName} - ${group.clientName}`
        : group.projectName;

    // Project summary header row
    const groupSummaryRow: any[] = [projLabel, null];
    if (settings.durationHours !== false) groupSummaryRow.push(formatSecs(group.totalH * 3600));
    if (settings.durationDecimal !== false) groupSummaryRow.push(group.totalH);
    groupSummaryRow.push(group.totalAmount > 0 ? group.totalAmount : group.projectName.includes("Internal") ? null : 0);
    rows.push(groupSummaryRow);

    // Child entry rows
    for (const ent of group.entries) {
      const childRow: any[] = [null, ent.description];
      if (settings.durationHours !== false) childRow.push(ent.timeH);
      if (settings.durationDecimal !== false) childRow.push(parseFloat(ent.timeDec));
      childRow.push(parseFloat(ent.amount));
      rows.push(childRow);
    }
  }

  // Grand Total Row matching reference
  const totalRow: any[] = ["Total (13/07/2026 - 19/07/2026)", null];
  if (settings.durationHours !== false) totalRow.push(formatSecs(grandTotalSeconds));
  if (settings.durationDecimal !== false) totalRow.push(grandTotalSeconds / 3600);
  totalRow.push(grandTotalAmount);
  rows.push(totalRow);

  const worksheet = XLSX.utils.aoa_to_sheet(rows);

  // Set column widths matching reference
  const cols: any[] = [
    { wch: 38 }, // Project
    { wch: 48 }, // Description
  ];
  if (settings.durationHours !== false) cols.push({ wch: 16 });
  if (settings.durationDecimal !== false) cols.push({ wch: 16 });
  cols.push({ wch: 16 });
  worksheet["!cols"] = cols;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, settings.name || "Summary report");

  // Output binary XLSX file
  const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([wbout], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  downloadBlob(blob, "Clockify_Time_Report_Summary_13-07-2026-19-07-2026.xlsx");
}

// 3. Export as PDF matching Clockify reference PDF exactly
export function exportToPdf(
  settings: ExportSettings = defaultExportSettings,
  entries: ReportItem[] = sampleReportEntries
) {
  const doc = new jsPDF({
    unit: "pt",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;

  // PAGE 1: Summary, Daily Bar Chart, Donut Chart with Legend
  // --- Header ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(20, 24, 33);
  doc.text(settings.name || "Summary report", margin, 65);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text("13/07/2026 - 19/07/2026", margin, 85);
  if (settings.note && settings.note.trim()) {
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    doc.text(`Note: ${settings.note.trim()}`, margin, 98);
  }

  // Totals line
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text("Total: ", margin, 112);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text("50:00:00", margin + 30, 112);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text("Billable: ", margin + 110, 112);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text("42:00:00", margin + 155, 112);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text("Amount: ", margin + 235, 112);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text("493,00 USD", margin + 285, 112);

  // Top-right Clockify Logo matching reference PDF
  const logoX = pageWidth - margin - 145;
  const logoY = 42;

  // Blue rounded icon container
  doc.setFillColor(0, 176, 255);
  doc.roundedRect(logoX, logoY, 36, 36, 6, 6, "F");

  // Clock symbol inside container
  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(2.2);
  doc.circle(logoX + 18, logoY + 18, 9, "S");
  doc.line(logoX + 18, logoY + 18, logoX + 18, logoY + 12);
  doc.line(logoX + 18, logoY + 18, logoX + 23, logoY + 18);

  // Clockify text
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(15, 23, 42);
  doc.text("clockify", logoX + 44, logoY + 26);

  // --- Daily Bar Chart ---
  const chartY = 150;
  const chartH = 160;
  const chartBottom = chartY + chartH;

  // Draw dashed horizontal grid lines and Y-axis labels
  const ySteps = [
    { label: "14,0h", val: 14 },
    { label: "12,0h", val: 12 },
    { label: "10,0h", val: 10 },
    { label: "8,0h", val: 8 },
    { label: "6,0h", val: 6 },
    { label: "4,0h", val: 4 },
    { label: "2,0h", val: 2 },
    { label: "0,0h", val: 0 },
  ];

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);

  for (const step of ySteps) {
    const yPos = chartBottom - (step.val / 16) * chartH;
    doc.text(step.label, margin, yPos + 3);

    // dashed line
    doc.setDrawColor(235, 238, 242);
    doc.setLineWidth(0.8);
    for (let x = margin + 35; x < pageWidth - margin; x += 6) {
      doc.line(x, yPos, x + 3, yPos);
    }
  }

  // Daily bars data matching reference
  const dayBars = [
    { day: "Mon, Jul 13", total: 12, billable: 12, label: "12:00:00h" },
    { day: "Tue, Jul 14", total: 15, billable: 15, label: "15:00:00h" },
    { day: "Wed, Jul 15", total: 7, billable: 3, label: "07:00:00h" },
    { day: "Thu, Jul 16", total: 7, billable: 7, label: "07:00:00h" },
    { day: "Fri, Jul 17", total: 9, billable: 5, label: "09:00:00h" },
    { day: "Sat, Jul 18", total: 0, billable: 0, label: "00:00:00h" },
    { day: "Sun, Jul 19", total: 0, billable: 0, label: "00:00:00h" },
  ];

  const barAreaX = margin + 45;
  const barAreaW = pageWidth - margin - barAreaX;
  const colW = barAreaW / dayBars.length;
  const barW = 52;

  dayBars.forEach((d, idx) => {
    const cx = barAreaX + idx * colW + colW / 2;
    const bx = cx - barW / 2;

    // Label above bar
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(110, 120, 135);
    doc.text(d.label, cx, chartBottom - (Math.max(d.total, 0.5) / 16) * chartH - 6, {
      align: "center",
    });

    if (d.total > 0) {
      const nonBillable = d.total - d.billable;

      if (nonBillable > 0) {
        // Total top portion (non-billable - light olive/lime green #a3cf68)
        const topH = (d.total / 16) * chartH;
        doc.setFillColor(163, 207, 104);
        doc.rect(bx, chartBottom - topH, barW, topH, "F");
      }

      if (d.billable > 0) {
        // Billable portion (darker olive green #8ec549)
        const billH = (d.billable / 16) * chartH;
        doc.setFillColor(142, 197, 73);
        doc.rect(bx, chartBottom - billH, barW, billH, "F");
      }
    }

    // X-axis day label
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(51, 65, 85);
    doc.text(d.day, cx, chartBottom + 16, { align: "center" });
  });

  // --- Project Breakdown Section ---
  const projSectionY = chartBottom + 55;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text("Project", margin, projSectionY);

  // Horizontal divider below Project title
  doc.setDrawColor(241, 245, 249);
  doc.setLineWidth(1);
  doc.line(margin, projSectionY + 8, pageWidth - margin, projSectionY + 8);

  // Donut chart parameters
  const donutCenterX = margin + 75;
  const donutCenterY = projSectionY + 80;
  const donutOuterR = 64;
  const donutInnerR = 42;

  // Segments: Project Beta (62%), Project Alpha (30%), Internal Project (8%)
  const donutData = [
    { percent: 0.62, color: [113, 75, 61] }, // Brown
    { percent: 0.30, color: [255, 152, 0] }, // Orange
    { percent: 0.08, color: [0, 176, 255] }, // Blue
  ];

  let currentAngle = -Math.PI / 2; // start at top

  donutData.forEach((seg) => {
    const segAngle = seg.percent * Math.PI * 2;
    const endAngle = currentAngle + segAngle;

    const points: [number, number][] = [];
    const steps = 30;
    for (let i = 0; i <= steps; i++) {
      const a = currentAngle + (i / steps) * segAngle;
      points.push([donutOuterR * Math.cos(a), donutOuterR * Math.sin(a)]);
    }

    doc.setFillColor(seg.color[0], seg.color[1], seg.color[2]);
    const relPoints: [number, number][] = [[points[0][0], points[0][1]]];
    for (let i = 1; i < points.length; i++) {
      relPoints.push([points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1]]);
    }
    relPoints.push([-points[points.length - 1][0], -points[points.length - 1][1]]);
    doc.lines(relPoints, donutCenterX, donutCenterY, [1, 1], "F", true);

    currentAngle = endAngle;
  });

  // Inner cutout circle
  doc.setFillColor(255, 255, 255);
  doc.circle(donutCenterX, donutCenterY, donutInnerR, "F");

  // Center text in donut
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text("50:00:00", donutCenterX, donutCenterY + 4, { align: "center" });

  // Legend on right side of donut chart matching reference
  const legendX = donutCenterX + donutOuterR + 40;
  const legendItems = [
    {
      bullet: [113, 75, 61],
      name: "[SAMPLE] Project Beta - [SAMPLE] Client B",
      time: "31:00:00",
      pct: "62,00%",
    },
    {
      bullet: [255, 152, 0],
      name: "[SAMPLE] Project Alpha - [SAMPLE] Client A",
      time: "15:00:00",
      pct: "30,00%",
    },
    {
      bullet: [0, 176, 255],
      name: "[SAMPLE] Internal Project",
      time: "04:00:00",
      pct: "8,00%",
    },
  ];

  legendItems.forEach((item, idx) => {
    const ly = projSectionY + 36 + idx * 30;

    // Bullet circle
    doc.setFillColor(item.bullet[0], item.bullet[1], item.bullet[2]);
    doc.circle(legendX, ly - 3, 3, "F");

    // Project Name
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(30, 41, 59);
    doc.text(item.name, legendX + 10, ly);

    // Duration
    doc.text(item.time, pageWidth - margin - 80, ly);

    // Percentage
    doc.setTextColor(100, 116, 139);
    doc.text(item.pct, pageWidth - margin - 20, ly);

    // Divider line between items
    doc.setDrawColor(248, 250, 252);
    doc.setLineWidth(0.8);
    doc.line(legendX, ly + 12, pageWidth - margin, ly + 12);
  });

  // Footer Page 1
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text("gcem", margin, pageHeight - 35);
  doc.text("1", pageWidth - margin - 10, pageHeight - 35);

  // ==========================================
  // PAGE 2: Detailed Entries Table matching PDF Page 2
  // ==========================================
  doc.addPage("a4");

  let p2Y = 60;

  // Table Header
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text("Project / Description", margin, p2Y);
  doc.text("Duration", pageWidth - margin - 130, p2Y);
  doc.text("Amount", pageWidth - margin - 40, p2Y);

  p2Y += 12;
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.8);
  doc.line(margin, p2Y, pageWidth - margin, p2Y);
  p2Y += 20;

  // Hierarchical list of projects and entries matching reference Page 2
  const page2Groups = [
    {
      header: "[SAMPLE] Project Beta - [SAMPLE] Client B",
      duration: "31:00:00",
      amount: "283,00 USD",
      items: [
        { desc: "[SAMPLE] 2cb2450e-a31f-46cf-bcf9-d176d29f9f7f", dur: "05:00:00", amt: "75,00 USD" },
        { desc: "[SAMPLE] aa82370e-49e9-4c5e-904a-e355ff6969ab", dur: "04:00:00", amt: "0,00 USD" },
        { desc: "[SAMPLE] 8d39ea98-2949-4785-8e3a-b6eed3209540", dur: "04:00:00", amt: "20,00 USD" },
        { desc: "[SAMPLE] 7d7e4374-8fd8-4488-8388-11875ac57bda", dur: "04:00:00", amt: "48,00 USD" },
        { desc: "[SAMPLE] 6847f75b-16f3-4ece-9e42-2dd3248ad1a0", dur: "04:00:00", amt: "60,00 USD" },
        { desc: "[SAMPLE] 5cb4ff6f-1118-4d17-abf4-9e05b535e1e7", dur: "04:00:00", amt: "20,00 USD" },
        { desc: "[SAMPLE] 7ad36df0-2989-4fd9-a485-1fd43684ec60", dur: "03:00:00", amt: "30,00 USD" },
        { desc: "[SAMPLE] 47788ee9-703a-473c-b869-443e64891ae7", dur: "03:00:00", amt: "30,00 USD" },
      ],
    },
    {
      header: "[SAMPLE] Project Alpha - [SAMPLE] Client A",
      duration: "15:00:00",
      amount: "210,00 USD",
      items: [
        { desc: "[SAMPLE] cce3ca3a-ae5f-48a6-a588-1bb6cac37f7c", dur: "05:00:00", amt: "60,00 USD" },
        { desc: "[SAMPLE] 005aecff-d941-4ccb-86ee-11d559af6c93", dur: "04:00:00", amt: "60,00 USD" },
        { desc: "[SAMPLE] f9b52bcd-7243-44d7-8412-1bc8e632f045", dur: "03:00:00", amt: "45,00 USD" },
        { desc: "[SAMPLE] 0ea826de-cd67-4e29-be2c-696507bc8bfd", dur: "03:00:00", amt: "45,00 USD" },
      ],
    },
    {
      header: "[SAMPLE] Internal Project",
      duration: "04:00:00",
      amount: "0,00 USD",
      items: [
        { desc: "[SAMPLE] 5bf5fe4c-b743-49cc-a3e0-a748ca191918", dur: "04:00:00", amt: "0,00 USD" },
      ],
    },
  ];

  for (const group of page2Groups) {
    // Project header row (bold)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42);
    doc.text(group.header, margin, p2Y);
    doc.text(group.duration, pageWidth - margin - 130, p2Y);
    doc.text(group.amount, pageWidth - margin - 60, p2Y);

    p2Y += 6;
    doc.setDrawColor(241, 245, 249);
    doc.setLineWidth(0.6);
    doc.line(margin, p2Y, pageWidth - margin, p2Y);
    p2Y += 18;

    // Sub-entries (indented)
    for (const item of group.items) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(51, 65, 85);
      doc.text(item.desc, margin + 18, p2Y);
      doc.text(item.dur, pageWidth - margin - 130, p2Y);
      doc.text(item.amt, pageWidth - margin - 60, p2Y);

      p2Y += 5;
      doc.setDrawColor(248, 250, 252);
      doc.setLineWidth(0.5);
      doc.line(margin + 18, p2Y, pageWidth - margin, p2Y);
      p2Y += 18;
    }

    p2Y += 10;
  }

  // Footer Page 2
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text("gcem", margin, pageHeight - 35);
  doc.text("2", pageWidth - margin - 10, pageHeight - 35);

  doc.save("Clockify_Time_Report_Summary_13-07-2026-19-07-2026.pdf");
}
