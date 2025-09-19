import PDFDocument from "pdfkit";

export const createPDF = ({ name, email, phone, enhancedText, template }) => {
  return new Promise((resolve) => {
    const doc = new PDFDocument({ margin: 50, size: "A4" });
    let buffers = [];

    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => resolve(Buffer.concat(buffers)));

    // Colors per template
    const colors = {
      classic: { title: "#000000", section: "#444444", bullet: "#000000" },
      modern: { title: "#0d6efd", section: "#6c757d", bullet: "#0d6efd" },
      creative: { title: "#FF4D6D", section: "#0DCAF0", bullet: "#FF4D6D" },
    };
    const color = colors[template] || colors.classic;

    // ===== Header =====
    doc.fillColor(color.title).fontSize(20).font("Helvetica-Bold").text(name, { align: "center" });
    doc.moveDown(0.2);
    doc.fontSize(10).fillColor("black").font("Helvetica").text(`${email} | ${phone}`, { align: "center" });
    doc.moveDown(1);

    // ===== Body =====
    const lines = enhancedText.split("\n");
    const sectionHeadings = ["SUMMARY", "EDUCATION", "SKILLS", "PROJECTS", "EXPERIENCE"];

    lines.forEach((line) => {
      line = line.trim();
      if (!line) return;

      // Detect headings (must match exactly, case-insensitive)
      if (sectionHeadings.includes(line.toUpperCase())) {
        doc.moveDown(0.5);
        doc.fillColor(color.section).fontSize(14).font("Helvetica-Bold").text(line, { underline: true });
        doc.moveDown(0.2);
      }
      // Bullet points
      else if (line.startsWith("•") || line.startsWith("-")) {
        doc.fillColor(color.bullet).fontSize(10).font("Helvetica").text(line.replace(/^[-•]\s*/, "• "), {
          indent: 15,
          lineGap: 2,
        });
      }
      // Normal body text
      else {
        doc.fillColor("black").fontSize(10).font("Helvetica").text(line, {
          lineGap: 2,
        });
      }
    });

    doc.end();
  });
};
