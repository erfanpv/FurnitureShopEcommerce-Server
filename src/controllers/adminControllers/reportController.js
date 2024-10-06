import orderDb from "../../models/schemas/orderSchema.js";
import productDb from "../../models/schemas/productSchema.js";
import userDb from "../../models/schemas/userSchema.js";
import PDFDocument from "pdfkit";

export const createReports = async (req, res) => {
  const { reportType, dateRange, startDate, endDate } = req.body;

  try {
    let query = {};

    if (dateRange === "custom") {
      if (!startDate || !endDate) {
        return res
          .status(400)
          .json({ message: "Start and end dates are required." });
      }

      if (reportType === "orders") {
        query.orderDetails = {
          $elemMatch: {
            createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
          },
        };
      } else {
        query.createdAt = {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        };
      }
    } else {
      const dateConditions = {
        last30days: {
          $gte: new Date(new Date().setDate(new Date().getDate() - 30)),
        },
        last60days: {
          $gte: new Date(new Date().setDate(new Date().getDate() - 60)),
        },
        thisYear: {
          $gte: new Date(new Date().getFullYear(), 0, 1),
        },
      };
      if (reportType === "orders") {
        query.orderDetails = {
          $elemMatch: {
            createdAt: dateConditions[dateRange],
          },
        };
      } else {
        query.createdAt = dateConditions[dateRange];
      }
    }

    let reportData;

    switch (reportType) {
      case "orders":
        reportData = await orderDb.find(query);
        break;
      case "customers":
        reportData = await userDb.find({ role: { $ne: "admin" }, ...query });

        break;
      case "products":
        reportData = await productDb.find(query);
        break;
      default:
        return res.status(400).json({ message: "Invalid report type" });
    }

    if (!reportData || reportData.length === 0) {
      return res
        .status(404)
        .json({ message: "No data found for the specified criteria." });
    }

    const doc = new PDFDocument();
    let buffers = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => {
      const pdfData = Buffer.concat(buffers);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", 'attachment; filename="report.pdf"');
      res.send(pdfData);
    });

    doc.fontSize(25).text(`Report Type: ${reportType}`, { align: "center" });
    doc.text(`Date Range: ${dateRange}`, { align: "center" });
    doc.moveDown();

    if (reportType === "orders") {
      reportData.forEach((item, index) => {
        doc.fontSize(18).text(`Order ${index + 1}`, { underline: true });

        item.orderDetails.forEach((orderDetail, orderIndex) => {
          doc.text(`Order ID: ${orderDetail.orderId}`);
          doc.text(`Payment ID: ${orderDetail.paymentId}`);
          doc.text("Products:");

          orderDetail.products.forEach((product, pIndex) => {
            doc.text(`  - Product Name: ${product.productId.productName}`);
            doc.text(`    Description: ${product.productId.description}`);
            doc.text(`    Price: $${product.productId.price}`);
            doc.moveDown();
          });

          doc.moveDown(); 
        });

        doc.moveDown();
      });
    } else if (reportType === "customers") {
      reportData.forEach((customer, index) => {
        doc.fontSize(18).text(`Customer ${index + 1}`, { underline: true });
        doc.fontSize(12).text(`Name: ${customer.firstName} ${customer.lastName}`);
        doc.text(`Email: ${customer.email}`);
        doc.text(
          `Account Created: ${new Date(
            customer.createdAt
          ).toLocaleDateString()}`
        );
        doc.moveDown();
      });
    } else if (reportType === "products") {
      reportData.forEach((product, index) => {
        doc.fontSize(18).text(`Product ${index + 1}`, { underline: true });
        doc.fontSize(12).text(`Product Name: ${product.productName}`);
        doc.text(`Description: ${product.description}`);
        doc.text(`Price: $${product.price}`);
        doc.text(`Category: ${product.category}`);
        doc.text(`Stock: ${product.stockQuantity}`);
        doc.text(
          `Product Added: ${new Date(product.createdAt).toLocaleDateString()}`
        );
        doc.moveDown();
      });
    }
    doc.end();
  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).json({ message: "Server error" });
  }
};
