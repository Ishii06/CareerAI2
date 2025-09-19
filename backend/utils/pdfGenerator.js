import PDFDocument from "pdfkit";

export const createPDF = (data) => {
  return new Promise((resolve) => {
    const doc = new PDFDocument({ margin: 50 });
    let buffers = [];

    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => resolve(Buffer.concat(buffers)));

    // Header
    doc.fontSize(22).text(data.name, { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`${data.email} | ${data.phone}`, { align: "center" });
    doc.moveDown(2);

    // Experience
    if (data.experience?.length) {
      doc.fontSize(16).text("Experience", { underline: true });
      data.experience.forEach((exp) => {
        doc.moveDown(0.5);
        doc.fontSize(12).text(`${exp.role} at ${exp.company} (${exp.years})`);
        doc.text(exp.details);
      });
      doc.moveDown();
    }

    // Education
    if (data.education?.length) {
      doc.fontSize(16).text("Education", { underline: true });
      data.education.forEach((edu) => {
        doc.moveDown(0.5);
        doc.fontSize(12).text(`${edu.degree} - ${edu.institution} (${edu.year})`);
      });
      doc.moveDown();
    }

    // Skills
    if (data.skills?.length) {
      doc.fontSize(16).text("Skills", { underline: true });
      doc.fontSize(12).text(data.skills.join(", "));
    }

    doc.end();
  });
};
