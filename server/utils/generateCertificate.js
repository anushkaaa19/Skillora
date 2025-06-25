const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

exports.generateCertificate = async ({ studentName, courseName, instructorName }) => {
  return new Promise((resolve, reject) => {
    const tempDir = path.join(__dirname, "../../temp");

    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const filePath = path.join(tempDir, `${Date.now()}_certificate.pdf`);
    const doc = new PDFDocument({
      size: "A4",
      margins: { top: 50, bottom: 50, left: 50, right: 50 }
    });

    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // Background
    doc.rect(0, 0, doc.page.width, doc.page.height).fill("#f5f5f5");

    // Border
    doc
      .save()
      .lineWidth(4)
      .strokeColor("#6C63FF")
      .rect(20, 20, doc.page.width - 40, doc.page.height - 40)
      .stroke()
      .restore();

    // Title
    doc
      .fontSize(30)
      .fillColor("#2e2e2e")
      .font("Helvetica-Bold")
      .text("Certificate of Completion", {
        align: "center",
        lineGap: 8
      });

    doc.moveDown(2);

    // Subheading
    doc
      .fontSize(16)
      .font("Helvetica")
      .text("This is to certify that", {
        align: "center",
        lineGap: 6
      });

    // Student Name
    doc
      .moveDown(0.5)
      .fontSize(22)
      .font("Helvetica-Bold")
      .fillColor("#000")
      .text(studentName, {
        align: "center",
        underline: true
      });

    // Completion line
    doc
      .moveDown(1)
      .fontSize(16)
      .font("Helvetica")
      .fillColor("#333")
      .text("has successfully completed the course", {
        align: "center"
      });

    // Course Name
    doc
      .moveDown(0.5)
      .fontSize(20)
      .font("Helvetica-Bold")
      .fillColor("#000")
      .text(courseName, {
        align: "center",
        underline: true
      });

    doc.moveDown(2);

    // Instructor line
    doc
      .fontSize(14)
      .fillColor("#555")
      .font("Helvetica-Oblique")
      .text(`Instructor: ${instructorName}`, {
        align: "center"
      });

    // Date
    doc
      .moveDown(0.5)
      .fontSize(12)
      .fillColor("#777")
      .text(`Date: ${new Date().toLocaleDateString()}`, {
        align: "center"
      });

    // Footer Branding
    doc.moveDown(4);
    doc
      .fontSize(14)
      .fillColor("#6C63FF")
      .font("Helvetica-Bold")
      .text("Skillora", {
        align: "center"
      });

    doc.end();

    stream.on("finish", async () => {
      try {
        const result = await cloudinary.uploader.upload(filePath, {
          resource_type: "raw",
          folder: "certificates",
          use_filename: true,
          type: "upload", // ensures public access
          access_mode: "public"
        });

        fs.unlinkSync(filePath); // clean temp
        resolve(result.secure_url);
      } catch (err) {
        reject(err);
      }
    });

    stream.on("error", reject);
  });
};
