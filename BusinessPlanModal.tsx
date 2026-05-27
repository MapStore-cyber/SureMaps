import React, { useState } from 'react';
import { motion } from 'motion/react';
import { jsPDF } from 'jspdf';
import { 
  X, Download, FileText, Sparkles, TrendingUp, DollarSign, Target, ShieldCheck, 
  MapPin, Clock, Award, Users, ChevronRight, CheckCircle2 
} from 'lucide-react';

interface BusinessPlanModalProps {
  onClose: () => void;
}

export default function BusinessPlanModal({ onClose }: BusinessPlanModalProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const businessPlanSections = [
    {
      id: "exec-summary",
      title: "1. Executive Summary",
      subtitle: "Securing the Future of Global Escrow & Local Commerce",
      content: `MapStore (Pty) Ltd is a groundbreaking global peer-to-peer and decentralized e-commerce ecosystem designed from the ground up to solve the critical "trust bottleneck" of both local and international digital trade. Founded in 2026 by visionary creator Mapule Kgatla, MapStore acts as an automated, geo-locked smart-escrow clearing house bridging the gap between local verified merchants and modern global consumers.`,
      highlights: [
        { label: "Founder & App Creator", value: "Mapule Kgatla" },
        { label: "Founded", value: "May 2026 in Pretoria, South Africa (Global Expansion 2026)" },
        { label: "Core Promise", value: "\"reaching you\" through guaranteed worldwide automated security" },
        { label: "Target Verticals", value: "Premium Electronics, Handcrafted Artifacts, Organic Harvests, Global Commodities" }
      ]
    },
    {
      id: "market-opportunity",
      title: "2. The Market Opportunity",
      subtitle: "Solving the Digital Commerce Trust Deficit Globally",
      content: `In the rapid evolution of digital trade across South Africa (Gauteng, Western Cape, KwaZulu-Natal) and internationally, e-commerce faces severe trust friction. International buyers hesitate to authorize pre-delivery card clearances due to global shipping risks, while local merchants remain vulnerable to chargeback loops and delayed settlement cycles. MapStore establishes immediate structural harmony.`,
      bullets: [
        "Anti-Fraud Escrow: Zero funds are released to merchants on checkout; payments remain locked in the secure global clearing pool.",
        "12-Hour Grace Period: Buyers worldwide sustain a friction-free 12-hour safe window to cancel any transaction instantly for a full refund.",
        "Symmetrical Settlement: Merchants receive payout inside their secure balance exactly 24 hours after delivery is physically cleared, verified globally."
      ]
    },
    {
      id: "business-model",
      title: "3. Business & Monetization Model",
      subtitle: "Sustainable Growth through Shared Value",
      content: `To foster absolute local organic trade, MapStore eliminates all consumer-side checkout entry costs. We run a highly transparent, fully integrated commission recycle plan that ensures platform sustainability while boosting merchant margins.`,
      highlights: [
        { label: "Buyer Fee", value: "0% (No administrative or processing card fees)" },
        { label: "Merchant Commission", value: "Flat 7% of settled sales upon perfect parcel handoff" },
        { label: "Escrow Vault Policy", value: "Double-sign-off verification safeguards with decentralized backup ledgers" },
        { label: "Regional Footprint", value: "Automated routing through Gauteng, Pretoria standard hub coordinates" }
      ]
    },
    {
      id: "operations-tech",
      title: "4. Operations & Cryptographic Trust Platform",
      subtitle: "Gauteng Infrastructure and Pretoria Node Architecture",
      content: `Operations are automated natively via React, tracking parcel transit, GPS location metrics, and ledger logs. The platform implements sovereign biometrics and administrative gates to preserve the absolute sanctity of all local escrows.`,
      bullets: [
        "Pretoria Security Vault: Primary administrative overrides are fingerprint-gated to prevent remote hijacking.",
        "Founder Overrides: Immediate recognition of authorized founder Mapule Kgatla's email ensures instant administrative recovery.",
        "Sovereign Ledgers: Continuous real-time backups track cash-out bank settlement transcripts and instant payouts."
      ]
    },
    {
      id: "financial-projections",
      title: "5. Financial Projections & Scale Strategy",
      subtitle: "Capturing a High-Yield Niche In South Africa",
      content: `By specializing in highly sensitive, high-value local categories such as Soweto handcrafted artisan wares, Pretoria fresh organic produce, and Johannesburg tech accessories, MapStore is positioned to capture a highly loyal market segment.`,
      highlights: [
        { label: "Year 1 Target GMV", value: "R15,000,000 (Fifteen Million South African Rand)" },
        { label: "Platform Net Yield (7%)", value: "R1,050,000 (Fully recycled for server nodes and delivery partnerships)" },
        { label: "Projected Merch Pool", value: "1,500+ Certified localized suppliers across Gauteng" },
        { label: "Average Order Value", value: "R850.00 with secure escrow locking" }
      ]
    }
  ];

  const handleDownloadPDF = () => {
    setIsDownloading(true);

    try {
      // Create landscape or portrait PDF. Let's make portrait page of A4 size because it matches business plan format perfectly.
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pagesCount = 3;

      for (let page = 1; page <= pagesCount; page++) {
        // --- 1. Draw solid styling base ---
        doc.setFillColor(255, 255, 255);
        doc.rect(0, 0, 210, 297, 'F');

        // Draw an elegant double border frame on outer margin
        doc.setDrawColor(226, 232, 240); // slate-200
        doc.setLineWidth(0.4);
        doc.rect(8, 8, 194, 281);
        doc.rect(9.5, 9.5, 191, 278);

        // --- 2. THE CHOSEN WATERMARK (CRITICAL USER REQUIREMENT) ---
        // Subtle diagonal "MAPSTORE" watermark across the back
        doc.setTextColor(243, 244, 246); // extremely soft gray-100
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(54);
        doc.text("MAPSTORE (PTY) LTD", 105, 110, { align: 'center', angle: -30 });
        doc.setFontSize(26);
        doc.text("CONFIDENTIAL BUSINESS PLAN", 105, 130, { align: 'center', angle: -30 });
        doc.text("FOUNDED MAY 2026", 105, 146, { align: 'center', angle: -30 });

        // Slogan watermark at the bottom center of the page draft
        doc.setTextColor(240, 253, 250); // extremely subtle teal tint
        doc.setFontSize(100);
        doc.text("reaching you", 105, 215, { align: 'center', angle: -10 });

        // --- 3. Page Header ---
        doc.setTextColor(71, 85, 105); // slate-600
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.text("MAPSTORE OFFICIAL STATUTORY DOSSIER", 15, 16);
        doc.setFont('helvetica', 'normal');
        doc.text("CONFIDENTIAL & PROPRIETARY", 145, 16);
        
        doc.setDrawColor(241, 245, 249); // slate-100
        doc.setLineWidth(0.8);
        doc.line(15, 18, 195, 18);

        // --- 4. Page Specific Contents ---
        if (page === 1) {
          // COVER PAGE / FIRST SECTION
          // Giant Logo Icon Vector
          const cx = 105;
          const cy = 45;
          doc.setDrawColor(16, 185, 129); // emerald-500
          doc.setLineWidth(1);
          // 8 petal coordinate lines
          for (let angle = 0; angle < 360; angle += 45) {
            const rad = (angle * Math.PI) / 180;
            doc.line(cx, cy, cx + Math.cos(rad) * 14, cy + Math.sin(rad) * 14);
          }
          doc.setFillColor(255, 255, 255);
          doc.circle(cx, cy, 4, 'FD');

          doc.setTextColor(15, 23, 42); // slate-900
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(28);
          doc.text("MAPSTORE", 105, 75, { align: "center" });
          
          doc.setFontSize(13);
          doc.setTextColor(16, 185, 129); // emerald-500
          doc.text("Sovereign Smart Escrow Local Commerce Network", 105, 82, { align: "center" });

          doc.setDrawColor(16, 185, 129);
          doc.setLineWidth(1.5);
          doc.line(75, 88, 135, 88);

          doc.setTextColor(100, 116, 139); // slate-500
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(10);
          doc.text("STRATEGIC BUSINESS OPERATIONS MANUAL", 105, 96, { align: "center" });
          doc.text("PRETORIA HEADQUARTERS • SECURED GAUTENG VAULT SYSTEM", 105, 102, { align: "center" });

          // Executive Summary Block
          doc.setFillColor(248, 250, 252); // slate-50 card
          doc.setDrawColor(226, 232, 240); // slate-200
          doc.setLineWidth(0.5);
          doc.roundedRect(15, 115, 180, 110, 4, 4, 'FD');

          doc.setTextColor(15, 23, 42);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(12);
          doc.text("1. EXECUTIVE SUMMARY", 22, 126);

          doc.setTextColor(16, 185, 129);
          doc.setFont('helvetica', 'italic');
          doc.setFontSize(9.5);
          doc.text("Securing the Future of Global Escrow & Local Commerce", 22, 131);

          doc.setTextColor(71, 85, 105);
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9.5);
          const execText = `MapStore (Pty) Ltd is a groundbreaking global peer-to-peer and decentralized e-commerce ecosystem designed from the ground up to solve the critical "trust bottleneck" of both local and international digital trade. Founded in 2026 by visionary creator Mapule Kgatla, MapStore acts as an automated, geo-locked smart-escrow clearing house bridging the gap between local verified merchants and modern global consumers.`;
          const wrappedExec = doc.splitTextToSize(execText, 166);
          doc.text(wrappedExec, 22, 139);

          // Highlights table
          let startY = 168;
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(15, 23, 42);
          doc.text("FOUNDING AND TARGET CONTEXT", 22, startY);
          
          doc.setDrawColor(241, 245, 249);
          doc.line(22, startY + 2, 188, startY + 2);

          const tableRows = [
            ["Founder & App Creator", "Mapule Kgatla"],
            ["HQ & Launch Date", "Founded May 2026 in Pretoria, South Africa"],
            ["Platform Promise", "\"reaching you\" via automated financial guarantees"],
            ["Target Niches", "Premium Electronics, Handcrafted Artifacts, Organic Foods"]
          ];

          let rowY = startY + 8;
          tableRows.forEach(row => {
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(100, 116, 139);
            doc.setFontSize(8.5);
            doc.text(row[0], 22, rowY);

            doc.setFont('helvetica', 'normal');
            doc.setTextColor(15, 23, 42);
            doc.text(row[1], 75, rowY);

            rowY += 6.5;
          });

          // Confidential footprint
          doc.setTextColor(148, 163, 184);
          doc.setFont('helvetica', 'italic');
          doc.setFontSize(8);
          doc.text("Authorization ID Ref: MS-MAPULE-2026-BPX", 105, 260, { align: "center" });

        } else if (page === 2) {
          // PAGE 2: MARKET OPPORTUNITY & BUSINESS MODEL
          doc.setTextColor(15, 23, 42);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(14);
          doc.text("2. THE MARKET OPPORTUNITY & VALUE SYSTEM", 15, 30);

          doc.setFont('helvetica', 'normal');
          doc.setTextColor(71, 85, 105);
          doc.setFontSize(9.5);
          const p2SubText = `In the rapid evolution of South African e-commerce across Gauteng, Western Cape, and KwaZulu-Natal, digital marketplaces face severe friction. Buyers are hesitant to authorize pre-delivery card clearances due to parcel intercept risks, while sellers suffer from high chargeback loops and card-reversal scams.`;
          const wrappedP2Sub = doc.splitTextToSize(p2SubText, 180);
          doc.text(wrappedP2Sub, 15, 37);

          // Three Pillars Card Blueprint
          doc.setFillColor(248, 250, 252);
          doc.roundedRect(15, 55, 180, 52, 3, 3, 'FD');

          doc.setFont('helvetica', 'bold');
          doc.setTextColor(16, 185, 129);
          doc.setFontSize(10.5);
          doc.text("THE TRIPLE-LOCK SECURITY ARCHITECTURE", 20, 64);
          
          doc.setDrawColor(241, 245, 249);
          doc.line(20, 67, 188, 67);

          const pillars = [
            ["Anti-Fraud Escrow:", "Zero funds released up-front; lock payload securely inside our vault."],
            ["12-Hour Grace Period:", "Buyers hold a absolute 12-hour safe window to cancel instantly."],
            ["Symmetrical Settlement:", "Ready for safe cash-out exactly 24 hours after delivery confirmation."]
          ];

          let pilY = 74;
          pillars.forEach(pil => {
            doc.setFillColor(16, 185, 129);
            doc.circle(22, pilY - 2.5, 1, 'F');
            
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(15, 23, 42);
            doc.setFontSize(9);
            doc.text(pil[0], 26, pilY);

            doc.setFont('helvetica', 'normal');
            doc.setTextColor(71, 85, 105);
            doc.text(pil[1], 62, pilY);

            pilY += 7.5;
          });

          // Section 3: Business Model
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(14);
          doc.setTextColor(15, 23, 42);
          doc.text("3. MONETIZATION & FEASIBILITY ANALYSIS", 15, 122);

          doc.setFont('helvetica', 'normal');
          doc.setTextColor(71, 85, 105);
          doc.setFontSize(9.5);
          const bizText = `To foster absolute local organic trade, MapStore eliminates all consumer-side checkout entry costs. We run a highly transparent, fully integrated commission recycle plan that ensures platform sustainability while boosting merchant margins.`;
          const wrappedBiz = doc.splitTextToSize(bizText, 180);
          doc.text(wrappedBiz, 15, 129);

          // Revenue highlights grid
          const gridItems = [
            { t: "BUYER FEE STRUCTURE", d: "0% Flat Admin Fees (Zero consumer friction)" },
            { t: "MERCHANT ECO-COMMISSION", d: "7% on verified, completed transactions" },
            { t: "SETTLEMENT REVENUE FLUSH", d: "93% net payout directly paid out to local seller wallet" },
            { t: "REGIONAL FOCUS AREAS", d: "Pretoria HQ, Gauteng, Soweto, JHB high-density nodes" }
          ];

          let gridY = 146;
          gridItems.forEach((item, index) => {
            const rx = (index % 2 === 0) ? 15 : 108;
            const ry = gridY + (Math.floor(index / 2) * 26);

            doc.setFillColor(248, 250, 252);
            doc.setDrawColor(241, 245, 249);
            doc.roundedRect(rx, ry, 87, 20, 2, 2, 'FD');

            doc.setFont('helvetica', 'bold');
            doc.setTextColor(16, 185, 129);
            doc.setFontSize(8);
            doc.text(item.t, rx + 5, ry + 6);

            doc.setFont('helvetica', 'normal');
            doc.setTextColor(71, 85, 105);
            doc.setFontSize(8.5);
            const wrappedItemD = doc.splitTextToSize(item.d, 77);
            doc.text(wrappedItemD, rx + 5, ry + 12);
          });

          // Additional description info
          doc.setFont('helvetica', 'italic');
          doc.setTextColor(100, 116, 139);
          doc.setFontSize(9);
          const p2FooterText = `MapStore commission yield model protects micro-enterprise cashflow, rendering it 60% cheaper than traditional physical security escrows or attorney-managed holding pools across South Africa.`;
          doc.text(doc.splitTextToSize(p2FooterText, 178), 15, 212);

        } else if (page === 3) {
          // PAGE 3: TECHNOLOGY, OPERATIONS & PROJECTIONS
          doc.setTextColor(15, 23, 42);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(14);
          doc.text("4. TECHNOLOGY CONTROLS & SECURITY VAULT", 15, 30);

          doc.setFont('helvetica', 'normal');
          doc.setTextColor(71, 85, 105);
          doc.setFontSize(9.5);
          const techText = `Operations are automated natively, tracking parcel transit, GPS location metrics, and ledger logs. The platform implements sovereign biometrics and administrative gates to preserve the absolute sanctity of all local escrows.`;
          const wrappedTechText = doc.splitTextToSize(techText, 180);
          doc.text(wrappedTechText, 15, 37);

          // Technology bullets
          const bulletsTech = [
            "High-Grade Pretoria Node: Physical server locations gate sensitive administrative access controls.",
            "Biometric Scan Calibration: High-precision ridge map verification locks access to local payouts.",
            "Cryptographic Passkey Overrides: Fallback physical master code overrides allow founder rescue instantly."
          ];

          let bulY = 54;
          bulletsTech.forEach(b => {
            doc.setFillColor(16, 185, 129);
            doc.circle(18, bulY - 2.5, 1, 'F');
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9);
            doc.setTextColor(71, 85, 105);
            doc.text(doc.splitTextToSize(b, 172), 22, bulY);
            bulY += 10;
          });

          // Section 5: Projections & Scale Strategy
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(14);
          doc.setTextColor(15, 23, 42);
          doc.text("5. FINANCIAL PROJECTIONS & SCALING STRATEGY", 15, 96);

          doc.setFont('helvetica', 'normal');
          doc.setTextColor(71, 85, 105);
          doc.setFontSize(9.5);
          const finText = `By specializing in South Africa's high-demand hubs, MapStore targets low-risk, high-velocity regional categories with clear, scalable milestones:`;
          doc.text(finText, 15, 103);

          // Projections scorecard table
          doc.setFillColor(248, 250, 252);
          doc.roundedRect(15, 110, 180, 55, 3, 3, 'FD');

          const tableData = [
            ["Financial KPI Metric", "Twelve-Month Target Goal", "Strategic Milestones"],
            ["Projected Gross GMV", "R15,000,000 (Fifteen Million)", "Capture 0.8% of Southern Africa niche craft trade"],
            ["Net Platform Yield (7%)", "R1,050,000 (Recycled Funds)", "Maintain hosting networks & delivery routing nodes"],
            ["Certified Local Suppliers", "1,500+ Active Merchants", "Launch Pretoria Central and Jozi bento grids"],
            ["Average Escrow Locked", "R850.00 average payload amount", "100% guarantee under Pretoria Vault protocol"]
          ];

          let tabY = 118;
          tableData.forEach((row, rIdx) => {
            if (rIdx === 0) {
              doc.setFont('helvetica', 'bold');
              doc.setTextColor(16, 185, 129);
              doc.setFontSize(9);
            } else {
              doc.setFont('helvetica', 'normal');
              doc.setTextColor(71, 85, 105);
              doc.setFontSize(8.5);
            }

            doc.text(row[0], 20, tabY);
            doc.text(row[1], 68, tabY);
            doc.text(row[2], 120, tabY);

            // Draw thin divider line
            doc.setDrawColor(241, 245, 249);
            doc.line(18, tabY + 2.5, 192, tabY + 2.5);

            tabY += 8.5;
          });

          // Signature Block
          doc.setTextColor(15, 23, 42);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(11);
          doc.text("APPROVED & SIGNED BY:", 15, 185);

          doc.setFont('helvetica', 'italic');
          doc.setFontSize(14);
          doc.setTextColor(16, 185, 129);
          doc.text("Mapule Kgatla", 15, 198); // Signature representation

          doc.setDrawColor(71, 85, 105);
          doc.setLineWidth(0.6);
          doc.line(15, 201, 75, 201);

          doc.setFont('helvetica', 'bold');
          doc.setTextColor(71, 85, 105);
          doc.setFontSize(9);
          doc.text("MAPULE KGATLA", 15, 206);
          
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(8);
          doc.text("Platform Founder & Chief Architect (MapStore 2026)", 15, 210);

          // Slogan signature
          doc.setTextColor(16, 185, 129);
          doc.setFont('helvetica', 'italic');
          doc.setFontSize(10);
          doc.text("\"reaching you\"", 15, 219);
        }

        // --- 5. Page Footer ---
        doc.setDrawColor(241, 245, 249);
        doc.setLineWidth(0.8);
        doc.line(15, 276, 195, 276);

        doc.setTextColor(148, 163, 184); // slate-400
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.text("MAPSTORE INTELLECTUAL ASSETS DEPT • PRETORIA DIVISION", 15, 281);
        doc.setFont('helvetica', 'normal');
        doc.text(`Page ${page} of ${pagesCount}  |  V1.28-2026`, 155, 281);

        if (page < pagesCount) {
          doc.addPage();
        }
      }

      // Save documents locally
      doc.save("MapStore_Official_Business_Plan_Confidential.pdf");
    } catch (err) {
      console.error("Failed to generate PDF charter document", err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950/70 backdrop-blur-md flex items-center justify-center p-4" id="business-plan-modal-overlay">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 30 }}
        className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
      >
        {/* Header Section */}
        <div className="p-6 border-b border-gray-100 dark:border-zinc-850 flex items-center justify-between bg-zinc-50 dark:bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 text-emerald-500 rounded-2xl">
              <FileText className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded-md font-mono">
                  May 2026 Charter
                </span>
                <span className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 flex items-center gap-1 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Pretoria HQ Authorized
                </span>
              </div>
              <h2 className="text-lg font-extrabold text-[#111827] dark:text-white leading-tight mt-0.5">
                MapStore Official Strategic Business Plan
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              type="button"
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 active:scale-95 disabled:opacity-50 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-all cursor-pointer shadow-md shadow-emerald-500/10"
              title="Download full business plan document with built-in watermarks"
            >
              <Download className="w-4 h-4" />
              <span>{isDownloading ? "Formulating Contract..." : "Download Plan PDF"}</span>
            </button>
            <button
              onClick={onClose}
              type="button"
              className="flex items-center gap-1.5 px-3 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-[#f43f5e] dark:text-[#fb7185] border border-rose-550/20 hover:border-rose-500/30 rounded-xl transition-colors text-xs font-extrabold cursor-pointer"
              title="Close panel and Return"
            >
              <X className="w-4 h-4" />
              <span>Close Tab</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 dark:text-zinc-300 font-sans">
          
          {/* Watermark Notice Banner background */}
          <div className="bg-emerald-500/5 border border-emerald-500/20 p-4 rounded-2xl flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-emerald-500 shrink-0" />
            <div className="text-xs text-emerald-800 dark:text-emerald-300 leading-relaxed font-semibold">
              <strong className="font-extrabold text-emerald-600 dark:text-emerald-400">PDF Watermark Active:</strong> Every page of the downloadable statutory document contains high-fidelity <strong>"MAPSTORE (PTY) LTD"</strong> and <strong>"reaching you"</strong> background waterline watermarks verified for venture capital presentation audits.
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Main Scrollable Plan Part */}
            <div className="lg:col-span-8 space-y-8">
              {businessPlanSections.map((sec) => (
                <div key={sec.id} className="space-y-3.5 border-b border-gray-100 dark:border-zinc-900 pb-6 last:border-0 last:pb-0">
                  <div className="space-y-1">
                    <h3 className="text-base font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                      <span className="w-1.5 h-6 bg-emerald-500 rounded-full inline-block"></span>
                      {sec.title}
                    </h3>
                    <p className="text-xs font-black uppercase tracking-wider text-emerald-500 font-mono pl-3.5">
                      {sec.subtitle}
                    </p>
                  </div>
                  
                  <p className="text-xs text-gray-600 dark:text-zinc-400 leading-relaxed pl-3.5">
                    {sec.content}
                  </p>

                  {sec.highlights && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pl-3.5 pt-1">
                      {sec.highlights.map((item, idx) => (
                        <div key={idx} className="bg-slate-50 dark:bg-zinc-900/40 p-3 rounded-xl border border-gray-100 dark:border-zinc-850">
                          <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider font-mono">{item.label}</span>
                          <span className="block text-xs font-bold text-gray-800 dark:text-zinc-200 mt-1">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {sec.bullets && (
                    <ul className="space-y-2.5 pl-3.5 pt-1">
                      {sec.bullets.map((b, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs text-gray-600 dark:text-zinc-400">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>

            {/* Right Summary Sidebar Dashboard */}
            <div className="lg:col-span-4 space-y-6">
              {/* Executive Seal Card */}
              <div className="bg-zinc-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-850 p-5 rounded-3xl text-center space-y-4">
                <div className="inline-flex p-3 bg-white dark:bg-zinc-950 text-emerald-500 rounded-2xl shadow-xs border border-gray-100 dark:border-zinc-850">
                  <Award className="w-8 h-8 text-emerald-500 animate-spin" style={{ animationDuration: '8s' }} />
                </div>
                <div className="space-y-1">
                  <h4 className="font-extrabold text-sm text-gray-900 dark:text-white">MapStore Founder Seal</h4>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold font-mono">Statutory Approved 2026</p>
                </div>
                <p className="text-[11px] text-gray-500 dark:text-zinc-400 leading-relaxed">
                  Authorized under official corporate contract templates by founder <strong>Mapule Kgatla</strong>. Handed off through localized nodes.
                </p>
                <div className="pt-2 border-t border-gray-200 dark:border-zinc-800">
                  <span className="block font-mono text-xs text-emerald-500 font-black">"reaching you"</span>
                </div>
              </div>

              {/* Quick Actions / Download Checklist cards */}
              <div className="border border-gray-150 dark:border-zinc-850 p-5 rounded-3xl space-y-4 bg-white dark:bg-zinc-950">
                <h4 className="font-extrabold text-xs text-gray-900 dark:text-white uppercase tracking-wider">Plan Specifications</h4>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[11px] font-semibold">
                    <span className="text-gray-400">Format:</span>
                    <span className="text-gray-800 dark:text-zinc-200 font-mono font-bold">Standard PDF / A4 Portrait</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-semibold">
                    <span className="text-gray-400">Security Layer:</span>
                    <span className="text-gray-800 dark:text-zinc-200 font-mono font-bold">Digital Pattern Overlap</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-semibold">
                    <span className="text-gray-400">Pages:</span>
                    <span className="text-gray-800 dark:text-zinc-200 font-mono font-bold">3 Full Pages</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-semibold">
                    <span className="text-gray-400">Target Launch Currency:</span>
                    <span className="text-gray-800 dark:text-zinc-200 font-mono font-bold">ZAR (South African Rand)</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-150 dark:border-zinc-800 space-y-2">
                  <button
                    onClick={handleDownloadPDF}
                    disabled={isDownloading}
                    type="button"
                    className="w-full flex items-center justify-center gap-1.5 bg-zinc-900 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-100 text-white dark:text-zinc-900 font-extrabold py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Plan Charter</span>
                  </button>
                  <button
                    onClick={onClose}
                    type="button"
                    className="w-full flex items-center justify-center gap-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-[#f43f5e] dark:text-[#fb7185] border border-rose-550/20 rounded-xl py-2.5 font-bold text-xs transition-all cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Close Business Plan Tab</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Footer info bars */}
        <div className="px-6 py-4 bg-zinc-50 dark:bg-zinc-900 border-t border-gray-150 dark:border-zinc-850 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-gray-400 font-mono">
          <span>MAPSTORE (PTY) LTD SECURE SYSTEM INTELLECTUAL PROPERTY</span>
          <span>PUBLISHED MAY 2026 • GAUTENG DEPT CONTROL NO: 02</span>
        </div>
      </motion.div>
    </div>
  );
}
