import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generateBillingPDF = (order) => {
  const doc = new jsPDF();

  // Header
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("JUVELLE", 14, 22);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("INVOICE", 170, 22);

  doc.setLineWidth(0.5);
  doc.line(14, 26, 196, 26);

  // Order Info
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Order ID:", 14, 34);
  doc.setFont("helvetica", "normal");
  doc.text(order.orderId, 32, 34);

  doc.setFont("helvetica", "bold");
  doc.text("Order Date:", 14, 40);
  doc.setFont("helvetica", "normal");
  doc.text(new Date(order.orderDate).toLocaleString("en-IN"), 38, 40);

  // Customer Info
  doc.setFont("helvetica", "bold");
  doc.text("Billed To:", 14, 52);
  doc.setFont("helvetica", "normal");
  doc.text(
    [order.fullName, order.email, order.phoneNumber, order.address],
    14,
    58,
  );

  // Items Table
  const tableData = order.items.map((item) => [
    item.productName,
    item.size,
    item.quantity.toString(),
    `Rs. ${item.priceAtOrder.toLocaleString("en-IN")}`,
    `Rs. ${(item.priceAtOrder * item.quantity).toLocaleString("en-IN")}`,
  ]);

  autoTable(doc, {
    startY: 85,
    head: [["Product Name", "Size", "Qty", "Unit Price", "Total"]],
    body: tableData,
    theme: "striped",
    headStyles: { fillColor: [85, 56, 88] }, // Matches royal/cocoa vibe
    margin: { top: 10 },
  });

  // Total Amount
  const finalY = doc.lastAutoTable.finalY || 85;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Total Amount:", 130, finalY + 12);
  doc.text(`Rs. ${order.amount.toLocaleString("en-IN")}`, 170, finalY + 12);

  // Payment Info
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(
    `Payment Method: ${order.paymentMethod === "razorpay" ? "Razorpay" : "COD"}`,
    14,
    finalY + 12,
  );
  doc.text(`Payment Status: ${order.paymentStatus}`, 14, finalY + 18);

  doc.save(`Invoice_Juvelle_${order.orderId.substring(0, 8)}.pdf`);
};

export const generateShippingPDF = (order) => {
  const doc = new jsPDF();

  doc.setLineWidth(1);
  doc.rect(10, 10, 190, 120); // Border for label

  // Header
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("SHIPPING LABEL", 105, 25, { align: "center" });

  doc.setLineWidth(0.5);
  doc.line(10, 32, 200, 32);

  // Sender
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("FROM:", 15, 42);
  doc.setFont("helvetica", "normal");
  doc.text(
    [
      "Juvelle Store",
      "Contact: juvelle.store@gmail.com",
      "Phone: +91 9061506630",
    ],
    15,
    50,
  );

  doc.line(10, 70, 200, 70);

  // Recipient (To)
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("TO:", 15, 80);
  doc.setFontSize(12);
  doc.text(order.fullName, 15, 88);
  doc.setFont("helvetica", "normal");

  // Address wrap handling
  const splitAddress = doc.splitTextToSize(order.address, 100);
  doc.text(splitAddress, 15, 96);

  const addressLines = splitAddress.length;
  doc.text(`Phone: ${order.phoneNumber}`, 15, 96 + addressLines * 6);

  // Order Ref
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Order Ref:", 135, 80);
  doc.setFont("helvetica", "normal");
  doc.text(order.orderId.substring(0, 12).toUpperCase(), 135, 86);

  doc.save(`ShippingLabel_${order.orderId.substring(0, 8)}.pdf`);
};
