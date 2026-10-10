import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/**
 * Format date for reports
 */
export const formatReportDate = (dateVal) => {
  if (!dateVal) return "-";
  const d = new Date(dateVal);
  if (isNaN(d.getTime())) return String(dateVal);
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

/**
 * Format currency for reports (clean text without symbols for Excel or with ₹ for PDF)
 */
export const formatReportCurrency = (amount, includeSymbol = true) => {
  const num = Number(amount) || 0;
  if (!includeSymbol) return num;
  return `Rs. ${num.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

/**
 * EXCEL EXPORT UTILITY
 * Exports data to an formatted .xlsx workbook
 */
export const exportToExcel = async ({
  filename = "Export_Data",
  sheetName = "Sheet1",
  columns = [],
  data = [],
}) => {
  try {
    // Transform data according to defined columns
    const formattedRows = data.map((item, index) => {
      const row = { "S.No": index + 1 };
      columns.forEach((col) => {
        if (col.excelFormat) {
          row[col.header] = col.excelFormat(item[col.key], item);
        } else if (col.format) {
          row[col.header] = col.format(item[col.key], item);
        } else {
          row[col.header] = item[col.key] ?? "-";
        }
      });
      return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(formattedRows);

    // Compute automatic column widths to avoid text truncation
    const colKeys = Object.keys(formattedRows[0] || {});
    const colWidths = colKeys.map((key) => {
      let maxLen = key.length;
      formattedRows.forEach((r) => {
        const valStr = String(r[key] ?? "");
        if (valStr.length > maxLen) maxLen = valStr.length;
      });
      return { wch: Math.min(Math.max(maxLen + 3, 10), 40) };
    });
    worksheet["!cols"] = colWidths;

    // Set cell alignment to center vertically and horizontally for all Excel cells
    if (worksheet["!ref"]) {
      const range = XLSX.utils.decode_range(worksheet["!ref"]);
      for (let R = range.s.r; R <= range.e.r; ++R) {
        for (let C = range.s.c; C <= range.e.c; ++C) {
          const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
          const cell = worksheet[cellAddress];
          if (!cell) continue;
          cell.s = {
            alignment: {
              horizontal: "center",
              vertical: "center",
              wrapText: true,
            },
          };
          if (R === 0) {
            cell.s.font = { bold: true };
          }
        }
      }
    }

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    // Trigger file download
    const cleanFilename = `${filename.replace(/[^a-zA-Z0-9_-]/g, "_")}_${
      new Date().toISOString().split("T")[0]
    }.xlsx`;
    XLSX.writeFile(workbook, cleanFilename);
    return true;
  } catch (error) {
    console.error("exportToExcel error:", error);
    throw error;
  }
};

/**
 * PDF EXPORT UTILITY
 * Generates an A4 PDF perfectly fitted with autoTable and headers/footers
 */
export const exportToPdf = async ({
  filename = "Export_Report",
  title = "Report",
  subtitle = "",
  columns = [],
  data = [],
  orientation = "landscape", // "landscape" or "portrait"
  columnStyles = {},
  summaryRow = null,
}) => {
  try {
    // A4 dimensions in points:
    // portrait: 595.28 x 841.89
    // landscape: 841.89 x 595.28
    const doc = new jsPDF({
      orientation,
      unit: "pt",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 28;

    // Header Branding Background
    doc.setFillColor(15, 12, 28);
    doc.rect(0, 0, pageWidth, 54, "F");

    // Brand title
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("DailyDocket", margin, 26);

    // Document title
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(210, 210, 220);
    doc.text(`|  ${title}`, margin + 85, 26);

    // Generated Date & Time
    const timestampStr = `Generated: ${new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })} ${new Date().toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
    doc.setFontSize(8.5);
    doc.setTextColor(180, 180, 195);
    doc.text(timestampStr, pageWidth - margin, 26, { align: "right" });

    // Subtitle / Metrics Banner
    if (subtitle) {
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(108, 92, 231);
      doc.text(subtitle, margin, 44);
    }

    // Prepare table headers and rows
    const tableHeaders = [
      ["#", ...columns.map((c) => c.header)],
    ];

    const tableRows = data.map((item, idx) => [
      idx + 1,
      ...columns.map((c) => {
        if (c.pdfFormat) return c.pdfFormat(item[c.key], item);
        if (c.format) return c.format(item[c.key], item);
        return item[c.key] ?? "-";
      }),
    ]);

    // Prepare table footer if summary provided
    const tableFooters = summaryRow ? [["", ...summaryRow]] : undefined;

    // Build default column styles with first column centered index
    const computedColStyles = {
      0: { halign: "center", cellWidth: 26 },
      ...columnStyles,
    };

    // AutoTable Generation
    autoTable(doc, {
      head: tableHeaders,
      body: tableRows,
      foot: tableFooters,
      startY: 62,
      margin: { left: margin, right: margin, bottom: 35, top: 62 },
      theme: "grid",
      styles: {
        font: "helvetica",
        fontSize: orientation === "landscape" ? 8 : 8.5,
        cellPadding: orientation === "landscape" ? 4.5 : 5,
        overflow: "linebreak",
        valign: "middle",
        halign: "center",
        lineColor: [225, 228, 232],
        lineWidth: 0.5,
      },
      headStyles: {
        fillColor: [108, 92, 231], // Accent purple/indigo
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: orientation === "landscape" ? 8.5 : 9,
        valign: "middle",
        halign: "center",
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252],
        valign: "middle",
        halign: "center",
      },
      bodyStyles: {
        textColor: [30, 41, 59],
        valign: "middle",
        halign: "center",
      },
      footStyles: {
        fillColor: [238, 242, 255],
        textColor: [79, 70, 229],
        fontStyle: "bold",
        fontSize: orientation === "landscape" ? 8.5 : 9,
        valign: "middle",
        halign: "center",
      },
      columnStyles: computedColStyles,
      didDrawPage: (hookData) => {
        // Page number and confidentiality footer
        const pageNum = doc.internal.getNumberOfPages();
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(140, 145, 155);

        // Footer left: application watermark
        doc.text("DailyDocket Business Management System", margin, pageHeight - 14);

        // Footer right: page numbers
        doc.text(
          `Page ${hookData.pageNumber} of ${pageNum}`,
          pageWidth - margin,
          pageHeight - 14,
          { align: "right" }
        );
      },
    });

    const cleanFilename = `${filename.replace(/[^a-zA-Z0-9_-]/g, "_")}_${
      new Date().toISOString().split("T")[0]
    }.pdf`;
    doc.save(cleanFilename);
    return true;
  } catch (error) {
    console.error("exportToPdf error:", error);
    throw error;
  }
};
