import { jsPDF } from "jspdf";
import universityLogo from "./logo.png";

export function downloadRecordPDF(record) {
  const doc = new jsPDF();
  const margin = 10;
  const logoSize = 18;
  const logoX = margin;
  const logoY = margin;

  // Add logo
  doc.addImage(universityLogo, "PNG", logoX, logoY, logoSize, logoSize);

  // Header text
  const pageWidth = doc.internal.pageSize.width;
  
  // University name
  doc.setFontSize(16);
  doc.setFont("times", "bold");
  const universityText = "McPHERSON UNIVERSITY";
  const univTextWidth = doc.getStringUnitWidth(universityText) * doc.internal.getFontSize() / doc.internal.scaleFactor;
  doc.text(universityText, (pageWidth - univTextWidth) / 2, logoY + 5);
  
  // University address
  doc.setFontSize(9);
  doc.setFont("times", "normal");
  const addressText = "KM 75 LAGOS-IBADAN EXPRESS WAY, SERIKI SOTAYO, OGUN STATE";
  const addressTextWidth = doc.getStringUnitWidth(addressText) * doc.internal.getFontSize() / doc.internal.scaleFactor;
  doc.text(addressText, (pageWidth - addressTextWidth) / 2, logoY + 10);
  
  // Document title
  doc.setFontSize(13);
  doc.setFont("times", "bold");
  const titleText = "STUDENT DISCIPLINARY RECORD SYSTEM";
  const titleTextWidth = doc.getStringUnitWidth(titleText) * doc.internal.getFontSize() / doc.internal.scaleFactor;
  doc.text(titleText, (pageWidth - titleTextWidth) / 2, logoY + logoSize + 5);
  
  // Divider line
  doc.setLineWidth(0.5);
  doc.line(margin, logoY + logoSize + 10, pageWidth - margin, logoY + logoSize + 10);

  // Student information - perfectly aligned
  const labelMargin = margin;
  
  // Calculate the position where "Punishment Duration:" ends to align all values
  doc.setFontSize(12);
  doc.setFont("times", "bold");
  const longestLabel = "Punishment Duration:";
  const longestLabelWidth = doc.getStringUnitWidth(longestLabel) * doc.internal.getFontSize() / doc.internal.scaleFactor;
  const valueMargin = labelMargin + longestLabelWidth + 5; // 5 units spacing after the colon
  
  let yPos = logoY + logoSize + 20;
  const lineSpacing = 8;
  
  doc.setFontSize(12);
  
  // Helper function to add aligned label-value pairs
  const addAlignedField = (label, value) => {
    doc.setFont("times", "bold");
    doc.text(`${label}:`, labelMargin, yPos);
    doc.setFont("times", "normal");
    doc.text(value, valueMargin, yPos);
    yPos += lineSpacing;
  };

  addAlignedField("Student Name", record.studentName);
  addAlignedField("Matric No", record.matricNumber);
  addAlignedField("Level", record.level || "N/A");
  addAlignedField("Department", record.department);
  addAlignedField("Offense", record.offense);
  addAlignedField("Punishment", record.punishment);
  addAlignedField("Offense Count", record.offenseCount?.toString() || "0"); 
  addAlignedField("Punishment Duration", record.punishmentDuration || "Nil");
  addAlignedField("Resumption Date", record.resumptionPeriod || "Nil");
  addAlignedField("Status", record.status);
  addAlignedField("Date", new Date(record.date).toLocaleDateString());
  
  // Footer
  function getCurrentDate() {
    const date = new Date();
    const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    const months = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
    return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  }

  const footerY = doc.internal.pageSize.height - 15;
  doc.setLineWidth(0.5);
  doc.line(margin, footerY - 5, pageWidth - margin, footerY - 5);
  doc.setFontSize(8);
  doc.setFont("times", "normal");

  // Calculate positions for each footer element
  const footerText1 = "Page 1/1";
  const footerText2 = "STUDENT DISCIPLINARY RECORD SYSTEM";
  const footerText3 = `McU ${getCurrentDate()}`;

  // Get text widths
  const text1Width = doc.getStringUnitWidth(footerText1) * doc.internal.getFontSize() / doc.internal.scaleFactor;
  const text2Width = doc.getStringUnitWidth(footerText2) * doc.internal.getFontSize() / doc.internal.scaleFactor;
  const text3Width = doc.getStringUnitWidth(footerText3) * doc.internal.getFontSize() / doc.internal.scaleFactor;

  // Calculate total width and spacing
  const totalWidth = text1Width + text2Width + text3Width;
  const spacing = (pageWidth - totalWidth - (margin * 2)) / 2; // Equal spacing on both sides

  // Position each element
  let currentX = margin;
  doc.text(footerText1, currentX, footerY);
  currentX += text1Width + spacing;
  doc.text(footerText2, currentX, footerY);
  currentX += text2Width + spacing;
  doc.text(footerText3, currentX, footerY);

  doc.save(`${record.studentName.replace(/\s+/g, '_')}_Disciplinary_Record.pdf`);
}