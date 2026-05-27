import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { jsPDF } from 'jspdf';
import { 
  X, Download, FileText, Sparkles, TrendingUp, DollarSign, Target, ShieldCheck, 
  MapPin, Clock, Award, Users, ChevronRight, CheckCircle2, ChevronLeft, 
  Briefcase, BarChart3, ShieldAlert, Truck, Send, Phone, Mail
} from 'lucide-react';

interface SupplierRecruitmentPitchModalProps {
  onClose: () => void;
}

export default function SupplierRecruitmentPitchModal({ onClose }: SupplierRecruitmentPitchModalProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [previewPage, setPreviewPage] = useState<1 | 2 | 3>(1);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');

  // Interactive configurations for customizable pitch report
  const [targetIndustry, setTargetIndustry] = useState('Consumer Electronics & Artisan Boutiques');
  const [platformCommission, setPlatformCommission] = useState('7% Net Flat');
  const [withdrawalUnlockHours, setWithdrawalUnlockHours] = useState('24 Hours');
  const [customWelcomeGreeting, setCustomWelcomeGreeting] = useState(
    "To our global network of verified suppliers and growers: MapStore is engineered to eliminate the trust deficit in digital retail. By utilizing robust holding vault architectures, we make sure you receive 100% of your earnings with no delays, chargebacks, or complex credit terms."
  );
  
  const pitchSections = [
    {
      id: "platform-intro",
      title: "1. The Merchant Value Proposition",
      subtitle: "Why Sell on MapStore in 2026",
      content: `MapStore (Pty) Ltd was established in 2026 by vision-driven Creator and Founder Mapule Kgatla. We offer global verified craft producers, tech manufacturers, and agricultural suppliers an elite, zero-subscription peer-to-peer e-commerce channel. Backed by our automated cross-border smart escrow network, we connect you directly to multi-nation buyers across 10 official trade corridors including ZA, CN, US, GB, EU, JP, AU, CA, IN, and BR under our unified slogan: "reaching you".`,
      highlights: [
        { label: "R0 Platform Sign Up", value: "No listing costs or monthly storage retainer fees" },
        { label: "Flat Commission Track", value: "Keep 93% of gross orders (7% platform contribution)" },
        { label: "Live Escrow Settlement", value: "Direct ledger verification removes billing fatigue" },
        { label: "Logistics Routing", value: "Integrated, multi-regional certified freight lines" }
      ]
    },
    {
      id: "escrow-trust",
      title: "2. The Smart Escrow Symmetrical Guarantee",
      subtitle: "Eliminating Payment Fraud & Cash-out Delays",
      content: `Unlike conventional e-commerce channels where suppliers are exposed to fraudulent chargebacks or manual interbank loops, MapStore deploys a symmetric transactional vault lock. Buyers clear secure 3DS card payments, which are held securely on-platform before shipping dispatch tags are scanned.`,
      bullets: [
        "Escrow Lock Protection: Money is captured upfront before your fulfillment center prints a single label.",
        "Secure Payout Clears: Balance instantly unlocks for domestic cash-out after the recipient confirms parcel receipt.",
        "12-Hour Safety Buffer: Automatic buyer cancellations are only permitted prior to courier hand-off to secure dispatch."
      ]
    },
    {
      id: "shipping-engine",
      title: "3. Interactive Upfront Cargo Calculator",
      subtitle: "Dynamic Weight & Size Freight Quoting",
      content: `MapStore removes manual courier communication. As verified during catalog setup, you input your product length, width, and height. Our modern client-side checkout dynamically calculates upfront shipping quotes to the buyer using the assigned courier's regional base rate and structural volumetric calculations.`,
      highlights: [
        { label: "IATA Dimensional Standard", value: "Length x Width x Height / 5000 index volumetric check" },
        { label: "Upfront Buyer Quote", value: "No surprises or retro-active billing adjustments" },
        { label: "Optimized Regional Carriers", value: "Pre-integrated with leading courier networks like Aramex & DHL" },
        { label: "Automated Labeling Sheet", value: "Print compliance outer-slips directly from the seller center" }
      ]
    },
    {
      id: "how-to-start",
      title: "4. Rapid 4-Step Merchant Onboarding",
      subtitle: "Go Live and Accept Secure Escrow Orders",
      content: `Getting listed on MapStore takes less than 5 minutes. Our simple workflow allows you to transition your entire warehouse inventory utilizing our prominent new Bulk CSV Spreadsheet tool.`,
      bullets: [
        "Step 1: Set Up Storefront profile settings & primary dispatch country origin.",
        "Step 2: Sync listings instantly by dropping your inventory file in the Bulk CSV manager.",
        "Step 3: Track customer inquiries and provide live customer support in real time.",
        "Step 4: Dispatch items, print package slips, and withdraw cash seamlessly."
      ]
    },
    {
      id: "creator-statement",
      title: "5. Message from Our Founder & Creator",
      subtitle: "Mapule Kgatla's Vision for Sustaining Digital Value",
      content: `As MapStore drives retail safety forward across 2026, we remain dedicated to our primary core promise: "reaching you". Our system makes e-commerce simple, symmetric, and entirely worry-free for both localized makers and international distributors.`,
      highlights: [
        { label: "Creator & Architect", value: "Mapule Kgatla" },
        { label: "Establishment Era", value: "Founded May 2026" },
        { label: "HQ Coordinates", value: "Pretoria, Gauteng, South Africa" },
        { label: "Corporate Motto", value: "\"reaching you\"" }
      ]
    }
  ];

  // Draw Page Template helper to maintain extreme brand consistency with existing report styles
  const drawPageTemplate = (pdf: jsPDF, pageNum: number, totalPages: number) => {
    // 1. Watermark 8-petal bloom in background
    pdf.setTextColor(242, 248, 246); 
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(36);
    pdf.text("MAPSTORE SUPPLIER SUCCESS", 105, 135, { align: 'center', angle: -25 });
    pdf.setFontSize(14);
    pdf.text("SELLER ONBOARDING PITCH 2026", 105, 143, { align: 'center', angle: -25 });

    const cx = 105;
    const cy = 158;
    pdf.setDrawColor(241, 248, 246);
    pdf.setLineWidth(0.6);
    for (let angle = 0; angle < 360; angle += 45) {
      const rad = (angle * Math.PI) / 180;
      pdf.line(cx, cy, cx + Math.cos(rad) * 12, cy + Math.sin(rad) * 12);
    }
    pdf.setFillColor(255, 255, 255);
    pdf.circle(cx, cy, 3, 'FD');

    // 2. Header Block Left
    const lx = 25;
    const ly = 23;
    pdf.setDrawColor(16, 185, 129); // emerald-500
    pdf.setLineWidth(1);
    for (let angle = 0; angle < 360; angle += 45) {
      const rad = (angle * Math.PI) / 180;
      pdf.line(lx, ly, lx + Math.cos(rad) * 5, ly + Math.sin(rad) * 5);
    }
    pdf.setFillColor(255, 255, 255);
    pdf.circle(lx, ly, 1.8, 'FD');

    // Brand Label
    pdf.setTextColor(15, 23, 42); 
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(20);
    pdf.text("MapStore", 34, 26);

    pdf.setTextColor(71, 85, 105); 
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(7);
    pdf.text("REACHING YOU", 34, 30);

    // 3. Header Block Right
    pdf.setTextColor(51, 65, 85); 
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8);
    pdf.text("MAPSTORE INCOMING PARTNER PITCH", 185, 19, { align: 'right' });
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(7);
    pdf.setTextColor(100, 116, 139); 
    pdf.text("FOUNDER: MAPULE KGATLA (ESTB. 2026)", 185, 22.5, { align: 'right' });
    pdf.text("PRETORIA • GAUTENG • SOUTH AFRICA", 185, 26, { align: 'right' });
    pdf.text("Email: mapstore2026@gmail.com", 185, 29.5, { align: 'right' });

    // 4. Double Separating line
    pdf.setDrawColor(16, 185, 129); 
    pdf.setLineWidth(0.85);
    pdf.line(20, 34, 190, 34);
    
    pdf.setDrawColor(94, 234, 212); 
    pdf.setLineWidth(0.35);
    pdf.line(20, 35.5, 190, 35.5);

    // 5. Running Footer
    pdf.setDrawColor(226, 232, 240); 
    pdf.setLineWidth(0.5);
    pdf.line(20, 276, 190, 276);

    pdf.setTextColor(148, 163, 184); 
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(6.5);
    pdf.text("MAPSTORE CO-OPERATIVE PLATFORM • ESTABLISHED BY MAPULE KGATLA IN 2026", 20, 281);
    
    pdf.setTextColor(16, 185, 129); 
    pdf.setFont('helvetica', 'italic');
    pdf.setFontSize(8);
    pdf.text("reaching you", 105, 282, { align: 'center' });

    pdf.setTextColor(148, 163, 184);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(7);
    pdf.text(`Page ${pageNum} of ${totalPages}`, 190, 281, { align: 'right' });
    pdf.text("CONFIDENTIAL PARTNERSHIP PROSPECTUS", 190, 284.5, { align: 'right' });
  };

  const handleDownloadPDF = () => {
    setIsDownloading(true);
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const totalPages = 3;

      for (let i = 1; i <= totalPages; i++) {
        if (i > 1) {
          doc.addPage();
        }

        // Draw standard page header, watermark, slogan footer
        drawPageTemplate(doc, i, totalPages);

        if (i === 1) {
          // PAGE 1: COVER PAGE & VALUE BLUEPRINT
          doc.setTextColor(100, 116, 139);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(8);
          doc.text(`CONFIDENTIAL PROSPECTUS REGISTRATION: MS-SUPP-PITCH-2026`, 20, 44);

          // Big bold display header
          doc.setTextColor(15, 23, 42); 
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(16);
          doc.text("MAPSTORE SUPPLIER & GROWER ONBOARDING BLUEPRINT", 20, 54);

          doc.setTextColor(16, 185, 129); 
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(9);
          doc.text("GLOBAL MULTI-CHANNEL SMART ESCROW TRANSACTION NETWORKING", 20, 59.5);

          // Divider
          doc.setDrawColor(241, 245, 249);
          doc.setLineWidth(0.3);
          doc.line(20, 63, 190, 63);

          // Main intro paragraph
          doc.setTextColor(51, 65, 85);
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9.5);
          const wrappedWelcome = doc.splitTextToSize(customWelcomeGreeting, 170);
          doc.text(wrappedWelcome, 20, 71);

          let currentY = 71 + (wrappedWelcome.length * 5.2) + 8;

          // Render Section 1: Intro
          const s1 = pitchSections[0];
          doc.setTextColor(15, 23, 42);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(11);
          doc.text(s1.title, 20, currentY);

          doc.setTextColor(16, 185, 129);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(8);
          doc.text(s1.subtitle, 20, currentY + 4);

          doc.setTextColor(51, 65, 85);
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9);
          const wrappedC1 = doc.splitTextToSize(s1.content, 170);
          doc.text(wrappedC1, 20, currentY + 10);
          currentY += 10 + (wrappedC1.length * 4.8) + 6;

          // Highlights visual block (cards grid simulation in PDF)
          if (s1.highlights) {
            s1.highlights.forEach((h, hIdx) => {
              doc.setFillColor(248, 250, 252);
              doc.roundedRect(20, currentY, 170, 7.5, 1, 1, 'F');
              
              doc.setTextColor(15, 23, 42);
              doc.setFont('helvetica', 'bold');
              doc.setFontSize(8);
              doc.text(`   •  ${h.label}:`, 21, currentY + 5);

              doc.setTextColor(16, 185, 129);
              doc.setFont('helvetica', 'bold');
              doc.text(h.value, 84, currentY + 5);

              currentY += 9;
            });
          }

        } else if (i === 2) {
          // PAGE 2: SECURE ESCROW POLICY & CARGO QUOTE ADVANTAGES
          let currentY = 44;

          // Render Section 2: Smart Escrow
          const s2 = pitchSections[1];
          doc.setTextColor(15, 23, 42);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(11);
          doc.text(s2.title, 20, currentY);

          doc.setTextColor(16, 185, 129);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(8);
          doc.text(s2.subtitle, 20, currentY + 4);

          doc.setTextColor(51, 65, 85);
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9);
          const wrappedC2 = doc.splitTextToSize(s2.content, 170);
          doc.text(wrappedC2, 20, currentY + 10);
          currentY += 10 + (wrappedC2.length * 4.8) + 6;

          // Bullets
          if (s2.bullets) {
            s2.bullets.forEach((bullet) => {
              doc.setFillColor(248, 250, 252);
              doc.roundedRect(20, currentY, 170, 9, 1, 1, 'F');

              doc.setTextColor(16, 185, 129);
              doc.setFont('helvetica', 'bold');
              doc.setFontSize(8.5);
              doc.text("   ✓  ", 21, currentY + 6);

              doc.setTextColor(51, 65, 85);
              doc.setFont('helvetica', 'normal');
              doc.setFontSize(8);
              const wrappedBulletText = doc.splitTextToSize(bullet, 155);
              doc.text(wrappedBulletText, 32, currentY + 5.5);

              currentY += 11;
            });
          }

          currentY += 4;

          // Render Section 3: Upfront Cargo Calculation Engine details
          const s3 = pitchSections[2];
          doc.setTextColor(15, 23, 42);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(11);
          doc.text(s3.title, 20, currentY);

          doc.setTextColor(16, 185, 129);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(8);
          doc.text(s3.subtitle, 20, currentY + 4);

          doc.setTextColor(51, 65, 85);
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9);
          const wrappedC3 = doc.splitTextToSize(s3.content, 170);
          doc.text(wrappedC3, 20, currentY + 10);
          currentY += 10 + (wrappedC3.length * 4.8) + 6;

          if (s3.highlights) {
            s3.highlights.forEach((h) => {
              doc.setFillColor(248, 250, 252);
              doc.roundedRect(20, currentY, 170, 7.5, 1, 1, 'F');
              
              doc.setTextColor(15, 23, 42);
              doc.setFont('helvetica', 'bold');
              doc.setFontSize(8);
              doc.text(`   •  ${h.label}:`, 21, currentY + 5);

              doc.setTextColor(16, 185, 129);
              doc.setFont('helvetica', 'bold');
              doc.text(h.value, 84, currentY + 5);

              currentY += 9;
            });
          }

          // Pre-Certified Regional Courier Operations & Carrier Desks
          currentY += 2;
          doc.setTextColor(15, 23, 42);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(9.5);
          doc.text("⚡ PRE-CERTIFIED REGIONAL COURIER OPERATIONS & CARRIER DESKS", 20, currentY);

          doc.setTextColor(100, 116, 139);
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(7.2);
          doc.text("Direct immediate lines for verified merchants to handoff or coordinate secure smart escrow package dispatches:", 20, currentY + 3.5);
          currentY += 7.5;

          const couriers = [
            { name: "The Courier Guy (ZA)", phone: "+27 10 120 3000", email: "support@thecourierguy.co.za", manager: "Thabo Molefe" },
            { name: "Aramex Logistics (ZA)", phone: "+27 11 457 3000", email: "za.support@aramex.com", manager: "Sarah Jenkins" },
            { name: "DHL EuroLink (Global)", phone: "+49 228 18 20", email: "eurolink.support@dhl.com", manager: "Dieter Schwarz" },
            { name: "FedEx SmartEscrow (US)", phone: "+1 800 463 3339", email: "escrow.verify@fedex.com", manager: "Robert Vance" }
          ];

          couriers.forEach((c, idx) => {
            const col = idx % 2;
            const r = Math.floor(idx / 2);
            const x = col === 0 ? 20 : 106;
            const y = currentY + (r * 15.5);

            doc.setFillColor(248, 250, 252);
            doc.setDrawColor(16, 185, 129);
            doc.setLineWidth(0.25);
            doc.roundedRect(x, y, 84, 13.5, 1.2, 1.2, 'FD');

            doc.setTextColor(15, 23, 42);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(7.5);
            doc.text(c.name, x + 3.5, y + 3.8);

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(6.2);
            doc.setTextColor(71, 85, 105);
            doc.text(`Phone: ${c.phone} | Officer: ${c.manager}`, x + 3.5, y + 7.2);
            doc.text(`Email: ${c.email}`, x + 3.5, y + 10.5);
          });

        } else if (i === 3) {
          // PAGE 3: ONBOARDING & SIGNATURE ATTESTATION BY MAPULE KGATLA
          let currentY = 44;

          // Render Section 4: 4-Step Roadmap
          const s4 = pitchSections[3];
          doc.setTextColor(15, 23, 42);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(11);
          doc.text(s4.title, 20, currentY);

          doc.setTextColor(16, 185, 129);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(8);
          doc.text(s4.subtitle, 20, currentY + 4);

          doc.setTextColor(51, 65, 85);
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9);
          const wrappedC4 = doc.splitTextToSize(s4.content, 170);
          doc.text(wrappedC4, 20, currentY + 10);
          currentY += 10 + (wrappedC4.length * 4.8) + 6;

          if (s4.bullets) {
            s4.bullets.forEach((bullet) => {
              doc.setFillColor(248, 250, 252);
              doc.roundedRect(20, currentY, 170, 8, 1, 1, 'F');

              doc.setTextColor(16, 185, 129);
              doc.setFont('helvetica', 'bold');
              doc.setFontSize(8.5);
              doc.text("   ➔  ", 21, currentY + 5.5);

              doc.setTextColor(51, 65, 85);
              doc.setFont('helvetica', 'bold');
              doc.setFontSize(8);
              doc.text(bullet, 32, currentY + 5);

              currentY += 10;
            });
          }

          currentY += 6;

          // Message section
          const s5 = pitchSections[4];
          doc.setTextColor(15, 23, 42);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(11);
          doc.text(s5.title, 20, currentY);

          doc.setTextColor(16, 185, 129);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(8);
          doc.text(s5.subtitle, 20, currentY + 4);

          doc.setTextColor(51, 65, 85);
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(8.5);
          const wrappedC5 = doc.splitTextToSize(s5.content, 170);
          doc.text(wrappedC5, 20, currentY + 9);
          currentY += 9 + (wrappedC5.length * 4.8) + 8;

          // Sign-off signature box
          doc.setTextColor(15, 23, 42);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(8.5);
          doc.text("Attested & Sealed for Global Recruitment:", 20, currentY);
          
          doc.setDrawColor(16, 185, 129, 0.45);
          doc.setLineWidth(0.5);
          doc.line(20, currentY + 12, 80, currentY + 12);
          
          doc.setTextColor(16, 185, 129);
          doc.setFont('courier', 'italic');
          doc.setFontSize(8);
          doc.text("MAPULE KGATLA - CREATOR STAMP", 21, currentY + 9);
          
          doc.setTextColor(15, 23, 42);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(9);
          doc.text("Mapule Kgatla", 20, currentY + 17);
          
          doc.setTextColor(100, 116, 139);
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(7.5);
          doc.text("Founder & Lead System Creator (Estb. 2026)", 20, currentY + 21);
          doc.text("HQ Pretoria, Gauteng Province, South Africa", 20, currentY + 24.5);
        }
      }

      doc.save(`MapStore_Supplier_Recruitment_Blueprint_2026.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-zinc-950/85 flex items-center justify-center z-50 p-3 md:p-6 backdrop-blur-xs overflow-y-auto" id="pitch-modal-overlay">
      <div className="bg-white dark:bg-zinc-950 rounded-3xl w-full max-w-6xl h-[90vh] md:h-[85vh] border border-gray-150 dark:border-zinc-800 text-gray-800 dark:text-zinc-100 flex flex-col overflow-hidden shadow-2xl">
        
        {/* Header toolbar */}
        <div className="flex items-center justify-between px-6 py-4 bg-gray-50 dark:bg-zinc-900 border-b border-gray-150 dark:border-zinc-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 text-emerald-500 rounded-xl">
              <Briefcase className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm md:text-base leading-tight">MapStore Supplier Recruitment Prospectus</h3>
              <p className="text-[10px] text-gray-400 flex items-center gap-1.5 mt-0.5 uppercase tracking-wider font-mono">
                <MapPin className="w-3 h-3 text-[#5eead4]" /> PRETORIA • PARTNERSHIP DIVISION • ESTB. 2026
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Mobile layout view switcher tabs */}
            <div className="flex bg-gray-200 dark:bg-zinc-800 p-1 rounded-xl md:hidden">
              <button 
                onClick={() => setActiveTab('edit')} 
                className={`px-3 py-1 text-xs font-bold rounded-lg ${activeTab === 'edit' ? 'bg-emerald-500 text-white' : 'text-gray-500 dark:text-zinc-400'}`}
              >
                Configure
              </button>
              <button 
                onClick={() => setActiveTab('preview')} 
                className={`px-3 py-1 text-xs font-bold rounded-lg ${activeTab === 'preview' ? 'bg-emerald-500 text-white' : 'text-gray-500 dark:text-zinc-400'}`}
              >
                A4 Draft
              </button>
            </div>

            <button
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-xs text-zinc-950 font-black rounded-xl transition-all shadow-sm cursor-pointer border border-emerald-400/40 select-none uppercase tracking-wider"
              title="Download compiled PDF pitch"
              id="pitch-download-pdf-btn"
            >
              <Download className={`w-4 h-4 ${isDownloading ? 'animate-spin' : ''}`} />
              <span>{isDownloading ? 'Structuring PDF...' : 'Download Pitch PDF'}</span>
            </button>

            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-3 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-[#f43f5e] dark:text-[#fb7185] border border-rose-550/20 hover:border-rose-500/30 rounded-xl transition-colors text-xs font-extrabold cursor-pointer"
              title="Close panel and Return"
              id="pitch-close-modal-btn"
            >
              <X className="w-4 h-4" />
              <span>Close Tab</span>
            </button>
          </div>
        </div>

        {/* Content splitter */}
        <div className="flex-1 flex overflow-hidden min-h-0">
          
          {/* Left panel: Config Editor */}
          <div className={`w-full md:w-5/12 p-6 overflow-y-auto border-r border-gray-150 dark:border-zinc-805 bg-white dark:bg-zinc-950 space-y-5 ${activeTab === 'edit' ? 'block' : 'hidden md:block'}`}>
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-black text-emerald-505 text-emerald-500 tracking-wider">Prospectus Dynamic Fields</span>
              <h4 className="text-gray-900 dark:text-white font-extrabold text-xs">Onboard Sourcing customizers</h4>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                Adjust key strategic metrics in real-time below! The generated PDF document compiles parameters with secure escrow policies, dimensional quoting rules, and creator endorsements automatically.
              </p>
            </div>

            <div className="space-y-4 pt-3 border-t border-gray-100 dark:border-zinc-850">
              <div>
                <label className="block text-[10px] font-extrabold uppercase text-gray-405 dark:text-zinc-400 mb-1.5 font-mono">Core Platform Focus Industry</label>
                <input 
                  type="text"
                  value={targetIndustry}
                  onChange={(e) => setTargetIndustry(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-xl focus:outline-hidden focus:border-emerald-500 text-gray-900 dark:text-white font-semibold"
                  placeholder="e.g. Handmade Crafts, High-end electronics"
                />
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[10px] font-extrabold uppercase text-gray-405 dark:text-zinc-400 mb-1.5 font-mono">Platform Commission</label>
                  <input 
                    type="text"
                    value={platformCommission}
                    onChange={(e) => setPlatformCommission(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-xl focus:outline-hidden focus:border-emerald-500 text-gray-900 dark:text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold uppercase text-gray-405 dark:text-zinc-400 mb-1.5 font-mono">Fulfillment Clear Lock</label>
                  <input 
                    type="text"
                    value={withdrawalUnlockHours}
                    onChange={(e) => setWithdrawalUnlockHours(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-xl focus:outline-hidden focus:border-emerald-500 text-gray-900 dark:text-white font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-extrabold uppercase text-gray-405 dark:text-zinc-400 mb-1.5 font-mono">Custom Greeting Message</label>
                <textarea 
                  rows={4}
                  value={customWelcomeGreeting}
                  onChange={(e) => setCustomWelcomeGreeting(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-xl focus:outline-hidden focus:border-emerald-500 text-gray-900 dark:text-white leading-relaxed"
                />
              </div>
            </div>

            {/* Strategic recruitment pillars */}
            <div className="bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/15 p-4 rounded-2xl text-xs space-y-3 pt-3">
              <span className="font-extrabold text-[#10b981] flex items-center gap-1.5 text-[11px] uppercase tracking-wide">
                <ShieldCheck className="w-4 h-4" /> Dynamic Escrow Protocol Advantages
              </span>
              <ul className="space-y-2 text-[10.5px] text-gray-500 dark:text-zinc-300">
                <li className="flex items-start gap-1">
                  <span className="text-emerald-500 font-bold shrink-0">✓</span>
                  <span><strong>Zero Payout Chargeback Risk:</strong> Payments pre-verified utilizing modern 3DS systems before order registrations occur.</span>
                </li>
                <li className="flex items-start gap-1">
                  <span className="text-emerald-500 font-bold shrink-0">✓</span>
                  <span><strong>Volumetric Logistics Transparency:</strong> Volumetric billing formulas prevent custom declaration penalties or logistics disputes.</span>
                </li>
                <li className="flex items-start gap-1">
                  <span className="text-emerald-500 font-bold shrink-0">✓</span>
                  <span><strong>Founder Verified Credential:</strong> Backed by Creator <strong>Mapule Kgatla</strong> to ensure sustainable recycled 7% platform commissions.</span>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-gray-150 dark:border-zinc-850">
              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 px-4 bg-rose-500/10 hover:bg-rose-500/20 text-[#f43f5e] dark:text-[#fb7185] border border-rose-550/20 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                title="Exit Pitch and Return to Store"
                id="pitch-config-page-close-btn"
              >
                <X className="w-4 h-4" />
                <span>Close Pitch Tab</span>
              </button>
            </div>
          </div>

          {/* Right panel: Live Real A4 layout page preview */}
          <div className={`w-full md:w-7/12 p-6 md:p-8 overflow-y-auto bg-gray-150 dark:bg-zinc-900/60 flex flex-col justify-start items-center gap-4 min-h-0 ${activeTab === 'preview' ? 'block' : 'hidden md:flex'}`}>
            
            {/* Page switcher tool */}
            <div className="flex items-center gap-3 bg-white dark:bg-zinc-950 px-4 py-2 rounded-2xl border border-gray-200 dark:border-zinc-855 shadow-xs font-mono font-black text-xs shrink-0 select-none text-gray-600 dark:text-white">
              <button
                type="button"
                onClick={() => setPreviewPage((page) => Math.max(1, page - 1) as 1 | 2 | 3)}
                disabled={previewPage === 1}
                className="p-1 hover:text-emerald-500 disabled:opacity-30 disabled:hover:text-gray-400 cursor-pointer transition-colors"
              >
                <ChevronLeft className="w-4.5 h-4.5" />
              </button>
              <span>DRAFT SUMMARY PAGE {previewPage} OF 3</span>
              <button
                type="button"
                onClick={() => setPreviewPage((page) => Math.min(3, page + 1) as 1 | 2 | 3)}
                disabled={previewPage === 3}
                className="p-1 hover:text-emerald-500 disabled:opacity-30 disabled:hover:text-gray-400 cursor-pointer transition-colors"
              >
                <ChevronRight className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Real A4 Container Sheet */}
            <div className="bg-white text-gray-950 shadow-2xl p-8 md:p-11 w-full max-w-[210mm] aspect-[1/1.414] rounded-sm relative border border-gray-200 select-none overflow-hidden text-left" id="supp-pitch-a4-canvas">
              
              {/* Back fainted diagonal Watermark */}
              <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center opacity-[0.035] select-none scale-90 md:scale-100">
                <svg viewBox="0 0 100 100" className="w-56 h-56 text-[#10b981] animate-spin" style={{ animationDuration: '300s' }}>
                  <g stroke="currentColor" strokeWidth="2.5">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <line key={i} x1="50" y1="50" x2={50 + 35 * Math.cos((i * 45 * Math.PI) / 180)} y2={50 + 35 * Math.sin((i * 45 * Math.PI) / 180)} />
                    ))}
                    <circle cx="50" cy="50" r="10" className="fill-white" />
                  </g>
                </svg>
                <div className="text-sm font-black tracking-[8px] mt-2 font-mono text-gray-900">MAPSTORE SECURE</div>
                <div className="text-[6.5px] tracking-[3px] font-mono text-gray-900 font-bold uppercase mt-1">FOUNDED IN 2026 BY MAPULE KGATLA</div>
              </div>

              {/* 1. Page template header */}
              <div className="flex justify-between items-start relative z-10 border-b-2 border-emerald-500 pb-1.5">
                <div>
                  <span className="font-sans font-black text-xl tracking-tight text-gray-950">
                    MapStore
                  </span>
                  <span className="block text-[7.5px] font-black tracking-[0.25em] text-gray-400 font-sans uppercase mt-0.5">
                    Reaching you
                  </span>
                </div>

                <div className="text-right text-[7.5px] leading-relaxed text-gray-500 font-sans">
                  <h4 className="font-bold text-gray-800 uppercase tracking-wider">MapStore Partnership Division</h4>
                  <p className="font-bold text-gray-900 font-mono">SYSTEM CREATOR: MAPULE KGATLA</p>
                  <p className="font-bold text-gray-450 font-mono text-[7px]">ESTABLISHED STATE: 2026 • PRETORIA HQ</p>
                </div>
              </div>

              {/* Render dynamic page content preview */}
              {previewPage === 1 && (
                <div className="mt-5 space-y-4 relative z-10 text-[8.5px]">
                  <span className="text-gray-400 font-mono font-bold block text-[7.5px]">CONFIDENTIAL MERCHANT DEVELOPMENT PROSPECTUS: MS-SUPP-PITCH-2026-P1</span>
                  
                  <div>
                    <h3 className="font-black text-gray-950 text-xs uppercase leading-tight font-sans tracking-wide">
                      MAPSTORE SUPPLIER & GROWER ONBOARDING BLUEPRINT
                    </h3>
                    <p className="text-emerald-500 font-mono font-bold text-[7.5px] mt-0.5">
                      GLOBAL SMART ESCROW RETAIL CHANNELS • MULTI-COUNTRY CORRIDOR SYSTEM
                    </p>
                  </div>

                  <p className="text-gray-600 bg-zinc-50 p-2.5 rounded-lg border border-gray-100 leading-relaxed max-h-[80px] overflow-hidden">
                    "{customWelcomeGreeting}"
                  </p>

                  <div className="border-t border-gray-100 pt-3 space-y-3">
                    <h4 className="font-black text-gray-900 text-[9px] uppercase font-mono tracking-wider">
                      {pitchSections[0].title}
                    </h4>
                    <p className="text-gray-650 leading-relaxed font-sans">
                      {pitchSections[0].content}
                    </p>
                    <div className="grid grid-cols-1 gap-1">
                      {pitchSections[0].highlights?.map((h, i) => (
                        <div key={i} className="flex justify-between items-center py-1 border-b border-gray-50 px-1 font-mono text-[7.5px]">
                          <span className="text-gray-400 font-bold">{h.label}</span>
                          <span className="text-emerald-500 font-bold">{h.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {previewPage === 2 && (
                <div className="mt-5 space-y-4 relative z-10 text-[8.5px]">
                  <span className="text-gray-400 font-mono font-bold block text-[7.5px]">SECURE ESCROW MATURATION POLICIES / TRANSPARENT FREIGHT METRICS</span>

                  <div className="space-y-2.5">
                    <h4 className="font-black text-gray-900 text-[9px] uppercase font-mono tracking-wider">
                      {pitchSections[1].title}
                    </h4>
                    <p className="text-gray-650 leading-relaxed">
                      {pitchSections[1].content}
                    </p>
                    <div className="space-y-1">
                      {pitchSections[1].bullets?.map((b, i) => (
                        <div key={i} className="flex gap-1.5 p-1.5 bg-gray-50 rounded text-gray-600">
                          <span className="text-emerald-500 font-boldshrink-0">✓</span>
                          <span>{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-3 space-y-2.5">
                    <h4 className="font-black text-gray-900 text-[9px] uppercase font-mono tracking-wider">
                      {pitchSections[2].title}
                    </h4>
                    <p className="text-gray-650 leading-relaxed">
                      {pitchSections[2].content}
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {pitchSections[2].highlights?.slice(0, 2).map((h, i) => (
                        <div key={i} className="p-1.5 bg-emerald-50/20 border border-emerald-500/10 rounded">
                          <strong className="block text-gray-800 text-[7px] uppercase font-mono">{h.label}</strong>
                          <span className="text-emerald-600 font-bold text-[7.5px] mt-0.5 block">{h.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-3 space-y-2">
                    <div className="flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5 text-emerald-500" />
                      <h4 className="font-black text-gray-900 text-[8.5px] uppercase font-mono tracking-wider">
                        ⚡ Certified Courier Desks & Direct Helplines
                      </h4>
                    </div>
                    <p className="text-gray-500 text-[7.5px] leading-relaxed">
                      Verified suppliers connect directly to these authorized logistical partners for dispatch verification and instant smart escrow processing:
                    </p>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      {[
                        { name: "The Courier Guy (ZA)", phone: "+27 10 120 3000", email: "support@thecourierguy.co.za", manager: "Thabo Molefe" },
                        { name: "Aramex Logistics (ZA)", phone: "+27 11 457 3000", email: "za.support@aramex.com", manager: "Sarah Jenkins" },
                        { name: "DHL EuroLink (Global)", phone: "+49 228 18 20", email: "eurolink.support@dhl.com", manager: "Dieter Schwarz" },
                        { name: "FedEx SmartEscrow (US)", phone: "+1 800 463 3339", email: "escrow.verify@fedex.com", manager: "Robert Vance" }
                      ].map((c, i) => (
                        <div key={i} className="p-1.5 bg-zinc-50 border border-emerald-500/15 rounded-lg space-y-0.5">
                          <div className="flex justify-between items-center">
                            <strong className="text-gray-900 text-[7px] font-bold font-mono">{c.name}</strong>
                            <span className="text-[6px] text-emerald-600 font-bold uppercase tracking-wider font-mono">Active Line</span>
                          </div>
                          <div className="text-[6.5px] text-gray-500">
                            <span className="mt-0.5 block">📞 Phone: <span className="font-mono text-gray-700">{c.phone}</span></span>
                            <span className="block truncate">✉️ Email: <span className="text-emerald-600 font-mono">{c.email}</span></span>
                            <span className="block mt-0.5 font-sans">Manager Desk: <strong className="text-gray-800">{c.manager}</strong></span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {previewPage === 3 && (
                <div className="mt-5 space-y-3 relative z-10 text-[8.5px] flex flex-col h-[75%] justify-between">
                  <div className="space-y-3">
                    <span className="text-gray-400 font-mono font-bold block text-[7.5px]">STEP ROADMAPS & CORE PLATFORM SYSTEM CREATOR PLEDGE</span>

                    <div className="space-y-2">
                      <h4 className="font-black text-gray-900 text-[9px] uppercase font-mono tracking-wider">
                        {pitchSections[3].title}
                      </h4>
                      <p className="text-gray-650 leading-relaxed">
                        {pitchSections[3].content}
                      </p>
                      <div className="grid grid-cols-1 gap-1">
                        {pitchSections[3].bullets?.map((b, i) => (
                          <div key={i} className="flex gap-1.5 py-1 px-1.5 bg-zinc-50 border border-gray-50 rounded font-bold text-gray-700 font-mono text-[7.5px]">
                            <span className="text-emerald-500">➔</span>
                            <span>{b}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-gray-100 pt-2.5 space-y-1.5">
                      <h4 className="font-black text-gray-900 text-[9px] uppercase font-mono tracking-wider">
                        {pitchSections[4].title}
                      </h4>
                      <p className="text-gray-600 leading-relaxed text-[8px]">
                        {pitchSections[4].content}
                      </p>
                    </div>
                  </div>

                  {/* Attestation sign-off visual */}
                  <div className="border-t border-gray-150 pt-2 text-[8px] text-gray-600 leading-normal">
                    <p className="font-semibold text-gray-500">Certified & Authorized seal under executive guidance:</p>
                    
                    <div className="mt-1 inline-block border border-emerald-500/10 bg-emerald-50/15 px-2.5 py-0.5 rounded font-mono font-black italic text-emerald-600 text-[7px]">
                      MAPULE KGATLA - CREATOR SEAL • VALIDATED
                    </div>

                    <p className="mt-2 font-black text-gray-950 text-[8.5px]">Mapule Kgatla</p>
                    <p className="text-gray-400 text-[7.5px]">Founder & Prime Architect (Founded May 2026, Gauteng)</p>
                  </div>
                </div>
              )}

              {/* Running slogan footer on preview */}
              <div className="absolute bottom-5 left-8 right-8 text-[7px] border-t border-gray-100 pt-3 flex justify-between items-center text-gray-400 font-mono">
                <span>CONFIDENTIAL ONBOARDING PROSPECTUS</span>
                <span className="text-emerald-500 font-serif italic text-xs capitalize">reaching you</span>
                <span>Page {previewPage} of 3</span>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
