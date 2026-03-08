import React from "react";
import { Card, Table, Typography, Tag, Divider, Space, Image } from "antd";

const { Text, Title } = Typography;

const sampleData = {
  clientName: "Cox Architecture",
  project: "Infinity Sydney",
  projectSerial:
    "Indult Sydney - NSW - ON240012463 - NSW -2025 - R10 ( Package 01)",
  scope: "Supply & Installation of Furniture",
  date: "04-08-2025",
  categories: [
    {
      key: "loose-furniture",
      label: "Loose Furniture",
      items: [
        {
          key: "1",
          slNo: "CH03",
          image:
            "https://placehold.co/120x120/f9c7c7/e07070?text=Chair",
          description: {
            product: "Percy Chair",
            features: [
              "Lounge chair",
              "Padded and upholstered seat and back",
              "Metal frame with integrated armrests",
              "4-legged base",
              "Dimensions (W × D × H): 700 × 760 × 720 mm",
            ],
            bold: [
              "Manufacturer: NaughtOne",
              "Warranty: 10 Years",
              "Delivery: 14–16 Weeks",
            ],
          },
          qty: 2,
          rate: "AUD 4,523.00",
          amount: "AUD 9,523.00",
          gp: "25%",
          delivery: {
            label: "Delivery, Placement & Rubbish Removal",
            rate: "AUD 4,523.00",
            amount: "AUD 4,523.00",
          },
        },
      ],
    },
  ],
  totals: {
    total: "AUD 4,523.00",
    gst: "AUD 4,523.00",
    grandTotal: "AUD 4,523.00",
  },
};

const styles = {
  wrapper: {
    background: "#f0f2f5",
    minHeight: "100vh",
    padding: "32px 24px",
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
  },
  outerCard: {
    maxWidth: 1080,
    margin: "0 auto",
    borderRadius: 12,
    boxShadow: "0 4px 24px rgba(0,0,0,0.09)",
    border: "1px solid #e4e8ef",
    overflow: "hidden",
  },
  previewTitle: {
    fontSize: 17,
    fontWeight: 700,
    color: "#1a1a2e",
    marginBottom: 20,
    letterSpacing: "-0.2px",
  },
  infoCard: {
    background: "#ffffff",
    border: "1px solid #e8ecf2",
    borderRadius: 10,
    padding: "18px 22px",
    marginBottom: 22,
  },
  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 20,
  },
  infoLeft: {
    flex: 1,
  },
  infoLine: {
    marginBottom: 7,
    fontSize: 13.5,
    color: "#3a3a4c",
    lineHeight: "1.6",
  },
  infoLabel: {
    fontWeight: 700,
    color: "#1a1a2e",
    marginRight: 5,
  },
  infoValue: {
    color: "#4e5470",
    fontWeight: 400,
  },
  dateValue: {
    color: "#d97706",
    fontWeight: 500,
  },
  logoBox: {
    border: "1px solid #e8ecf2",
    borderRadius: 10,
    padding: "14px 22px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 160,
    background: "#fafbfc",
  },
  logoText: {
    fontSize: 22,
    fontWeight: 800,
    color: "#1565c0",
    letterSpacing: "-0.5px",
  },
  logoD: {
    background: "#1565c0",
    color: "#fff",
    borderRadius: "50%",
    width: 32,
    height: 32,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 18,
    fontWeight: 800,
    marginRight: 8,
  },
  tableHeader: {
    background: "#1a1a2e",
    color: "#fff",
    fontWeight: 600,
    fontSize: 13,
    padding: "10px 14px",
  },
  categoryRow: {
    background: "#f0f4fa",
    fontWeight: 700,
    color: "#1a1a2e",
    fontSize: 13.5,
    padding: "9px 14px",
    borderBottom: "1px solid #dce3ef",
  },
  productName: {
    fontWeight: 700,
    fontSize: 14,
    color: "#1a1a2e",
    marginBottom: 5,
  },
  featureText: {
    fontSize: 12.5,
    color: "#555b7a",
    lineHeight: "1.7",
  },
  boldFeature: {
    fontWeight: 700,
    fontSize: 12.5,
    color: "#1a1a2e",
    lineHeight: "1.7",
  },
  deliveryRow: {
    background: "#fafbfd",
    borderTop: "1px solid #eaeff7",
  },
  amountText: {
    fontWeight: 600,
    color: "#1a1a2e",
    fontSize: 13.5,
  },
  totalsSection: {
    display: "flex",
    justifyContent: "flex-end",
    paddingTop: 4,
  },
  totalsTable: {
    width: 340,
  },
  totalsRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 16px",
    borderBottom: "1px solid #eaeff7",
    fontSize: 13.5,
  },
  totalsLabel: {
    color: "#4e5470",
    fontWeight: 500,
  },
  totalsValue: {
    fontWeight: 600,
    color: "#1a1a2e",
  },
  grandTotalRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 16px",
    background: "#f0f4fa",
    borderRadius: "0 0 8px 8px",
    fontSize: 14,
  },
  grandTotalLabel: {
    fontWeight: 700,
    color: "#1a1a2e",
  },
  grandTotalValue: {
    fontWeight: 800,
    color: "#1a1a2e",
    fontSize: 15,
  },
  gpTag: {
    fontSize: 11,
    color: "#6b7280",
    marginTop: 4,
    display: "block",
  },
};

export default function QuotePreview() {
  const { clientName, project, projectSerial, scope, date, categories, totals } =
    sampleData;

  return (
    <div style={styles.wrapper}>
      <Card style={styles.outerCard} bodyStyle={{ padding: "28px 30px" }}>
        {/* Title */}
        <div style={styles.previewTitle}>Preview</div>

        {/* Info Header */}
        <div style={styles.infoCard}>
          <div style={styles.infoRow}>
            <div style={styles.infoLeft}>
              <div style={styles.infoLine}>
                <span style={styles.infoLabel}>Client Name:</span>
                <span style={styles.infoValue}>{clientName}</span>
              </div>
              <div style={styles.infoLine}>
                <span style={styles.infoLabel}>Project:</span>
                <span style={styles.infoValue}>{project}</span>
              </div>
              <div style={styles.infoLine}>
                <span style={styles.infoLabel}>Project Serial:</span>
                <span style={styles.infoValue}>{projectSerial}</span>
              </div>
              <div style={styles.infoLine}>
                <span style={styles.infoLabel}>Scope:</span>
                <span style={styles.infoValue}>{scope}</span>
              </div>
              <div style={styles.infoLine}>
                <span style={styles.infoLabel}>Date:</span>
                <span style={styles.dateValue}>{date}</span>
              </div>
            </div>
            {/* Logo */}
            <div style={styles.logoBox}>
              <span style={styles.logoD}>D</span>
              <span style={styles.logoText}>DRIZMO</span>
            </div>
          </div>
        </div>

        {/* Table */}
        <div
          style={{
            border: "1px solid #dce3ef",
            borderRadius: 10,
            overflow: "hidden",
          }}
        >
          {/* Header Row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "80px 160px 1fr 90px 120px 130px",
              background: "#1a1a2e",
            }}
          >
            {["SL. No", "Image", "Description", "QTY", "Rate", "Amount"].map(
              (h) => (
                <div
                  key={h}
                  style={{
                    ...styles.tableHeader,
                    textAlign: h === "SL. No" || h === "Image" ? "center" : h === "QTY" || h === "Rate" || h === "Amount" ? "right" : "left",
                  }}
                >
                  {h}
                </div>
              )
            )}
          </div>

          {categories.map((cat) => (
            <div key={cat.key}>
              {/* Category Label */}
              <div
                style={{
                  ...styles.categoryRow,
                  gridColumn: "1 / -1",
                }}
              >
                {cat.label}
              </div>

              {cat.items.map((item) => (
                <div key={item.key}>
                  {/* Main product row */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "80px 160px 1fr 90px 120px 130px",
                      borderBottom: "1px solid #eaeff7",
                      alignItems: "start",
                    }}
                  >
                    {/* SL No */}
                    <div
                      style={{
                        padding: "18px 10px",
                        textAlign: "center",
                        fontWeight: 700,
                        color: "#1a1a2e",
                        fontSize: 13,
                        borderRight: "1px solid #eaeff7",
                      }}
                    >
                      <div>{item.slNo}</div>
                      <div style={styles.gpTag}>GP: {item.gp}</div>
                    </div>

                    {/* Image */}
                    <div
                      style={{
                        padding: "14px 12px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRight: "1px solid #eaeff7",
                      }}
                    >
                      <img
                        src={item.image}
                        alt="product"
                        style={{
                          width: 110,
                          height: 110,
                          objectFit: "contain",
                          borderRadius: 8,
                        }}
                      />
                    </div>

                    {/* Description */}
                    <div
                      style={{
                        padding: "16px 14px",
                        borderRight: "1px solid #eaeff7",
                      }}
                    >
                      <div style={styles.productName}>
                        Product : {item.description.product}
                      </div>
                      {item.description.features.map((f, i) => (
                        <div key={i} style={styles.featureText}>
                          {f}
                        </div>
                      ))}
                      <div style={{ marginTop: 6 }}>
                        {item.description.bold.map((b, i) => (
                          <div key={i} style={styles.boldFeature}>
                            {b}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* QTY */}
                    <div
                      style={{
                        padding: "18px 14px",
                        textAlign: "right",
                        fontSize: 13.5,
                        color: "#1a1a2e",
                        fontWeight: 500,
                        borderRight: "1px solid #eaeff7",
                      }}
                    >
                      {item.qty}
                    </div>

                    {/* Rate */}
                    <div
                      style={{
                        padding: "18px 14px",
                        textAlign: "right",
                        fontSize: 13.5,
                        color: "#4e5470",
                        borderRight: "1px solid #eaeff7",
                      }}
                    >
                      {item.rate}
                    </div>

                    {/* Amount */}
                    <div
                      style={{
                        padding: "18px 14px",
                        textAlign: "right",
                        ...styles.amountText,
                      }}
                    >
                      {item.amount}
                    </div>
                  </div>

                  {/* Delivery row */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "80px 160px 1fr 90px 120px 130px",
                      borderBottom: "1px solid #eaeff7",
                      background: "#fafbfd",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ borderRight: "1px solid #eaeff7", padding: "12px 0" }} />
                    <div style={{ borderRight: "1px solid #eaeff7", padding: "12px 0" }} />
                    <div
                      style={{
                        padding: "12px 14px",
                        fontSize: 13,
                        color: "#4e5470",
                        borderRight: "1px solid #eaeff7",
                      }}
                    >
                      {item.delivery.label}
                    </div>
                    <div style={{ borderRight: "1px solid #eaeff7" }} />
                    <div
                      style={{
                        padding: "12px 14px",
                        textAlign: "right",
                        fontSize: 13,
                        color: "#4e5470",
                        borderRight: "1px solid #eaeff7",
                      }}
                    >
                      {item.delivery.rate}
                    </div>
                    <div
                      style={{
                        padding: "12px 14px",
                        textAlign: "right",
                        ...styles.amountText,
                      }}
                    >
                      {item.delivery.amount}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}

          {/* Totals */}
          <div style={{ borderTop: "1px solid #dce3ef" }}>
            {/* Total */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 130px",
                borderBottom: "1px solid #eaeff7",
              }}
            >
              <div
                style={{
                  padding: "11px 16px",
                  textAlign: "right",
                  fontSize: 13.5,
                  color: "#4e5470",
                  fontWeight: 500,
                  borderRight: "1px solid #eaeff7",
                }}
              >
                Total
              </div>
              <div
                style={{
                  padding: "11px 14px",
                  textAlign: "right",
                  fontWeight: 600,
                  fontSize: 13.5,
                  color: "#1a1a2e",
                }}
              >
                {totals.total}
              </div>
            </div>

            {/* GST */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 130px",
                borderBottom: "1px solid #eaeff7",
              }}
            >
              <div
                style={{
                  padding: "11px 16px",
                  textAlign: "right",
                  fontSize: 13.5,
                  color: "#4e5470",
                  fontWeight: 500,
                  borderRight: "1px solid #eaeff7",
                }}
              >
                Additional 10% GST
              </div>
              <div
                style={{
                  padding: "11px 14px",
                  textAlign: "right",
                  fontWeight: 600,
                  fontSize: 13.5,
                  color: "#1a1a2e",
                }}
              >
                {totals.gst}
              </div>
            </div>

            {/* Grand Total */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 130px",
                background: "#f0f4fa",
              }}
            >
              <div
                style={{
                  padding: "13px 16px",
                  textAlign: "right",
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#1a1a2e",
                  borderRight: "1px solid #dce3ef",
                }}
              >
                Grand Total
              </div>
              <div
                style={{
                  padding: "13px 14px",
                  textAlign: "right",
                  fontWeight: 800,
                  fontSize: 15,
                  color: "#1a1a2e",
                }}
              >
                {totals.grandTotal}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}