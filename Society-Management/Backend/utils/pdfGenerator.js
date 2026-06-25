import PDFDocument from 'pdfkit';

export const createInvoicePDF = (bill, residentDetails) => {
  const doc = new PDFDocument({ margin: 50 });

  doc
    .fillColor('#1e293b')
    .fontSize(20)
    .text('SMART SOCIETY MANAGEMENT SYSTEM', { align: 'center', underline: true })
    .moveDown(1);

  doc
    .fillColor('#475569')
    .fontSize(14)
    .text('MAINTENANCE INVOICE', { align: 'center' })
    .moveDown(1.5);

  const startX = 50;
  const colWidth = 250;

  doc.fontSize(10).fillColor('#1e293b');
  doc.text(`Invoice No: ${bill.invoiceNumber}`, startX, doc.y);
  doc.text(`Billing Month: ${bill.month}/${bill.year}`, startX + colWidth, doc.y - 12);
  doc.text(`Due Date: ${new Date(bill.dueDate).toLocaleDateString()}`, startX, doc.y + 5);
  doc.text(`Status: ${bill.status}`, startX + colWidth, doc.y - 12 + 5);

  doc.moveDown(2);

  doc
    .fontSize(11)
    .fillColor('#0f172a')
    .text('Billed To:', { underline: true })
    .fontSize(10)
    .text(`Name: ${residentDetails.user.name}`)
    .text(`Flat: ${residentDetails.block}-${residentDetails.flatNumber}`)
    .text(`Phone: ${residentDetails.user.phone}`)
    .text(`Occupancy: ${residentDetails.occupancyType}`);

  doc.moveDown(2);

  const tableTop = doc.y;
  doc
    .fontSize(10)
    .fillColor('#0f172a')
    .text('Charge Category', 50, tableTop, { bold: true })
    .text('Amount ($)', 450, tableTop, { align: 'right', bold: true });

  doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).strokeColor('#cbd5e1').stroke();
  doc.moveDown(1.5);

  const charges = [
    { label: 'Maintenance Charges', value: bill.maintenanceCharges },
    { label: 'Water Charges', value: bill.waterCharges },
    { label: 'Parking Charges', value: bill.parkingCharges },
    { label: 'Electricity Common Charges', value: bill.electricityCommonCharges },
    { label: 'Penalties / Late Fees', value: bill.penalties },
    { label: 'Other Charges', value: bill.otherCharges },
  ];

  let currentY = tableTop + 25;
  charges.forEach((item) => {
    doc
      .fillColor('#334155')
      .text(item.label, 50, currentY)
      .text(item.value.toFixed(2), 450, currentY, { align: 'right' });
    currentY += 20;
  });

  doc.moveTo(50, currentY).lineTo(550, currentY).strokeColor('#94a3b8').stroke();
  currentY += 10;

  doc
    .fontSize(12)
    .fillColor('#0f172a')
    .text('Total Amount:', 50, currentY, { bold: true })
    .text(bill.amount.toFixed(2), 450, currentY, { align: 'right', bold: true });

  currentY += 20;
  doc
    .fontSize(10)
    .fillColor('#475569')
    .text('Paid Amount:', 50, currentY)
    .text(bill.paidAmount.toFixed(2), 450, currentY, { align: 'right' });

  doc
    .moveDown(4)
    .fontSize(9)
    .fillColor('#64748b')
    .text('Please complete payment before the due date to avoid late payment penalties.', { align: 'center' })
    .text('This is a system generated invoice and does not require physical signature.', { align: 'center' });

  doc.end();
  return doc;
};

export default createInvoicePDF;
