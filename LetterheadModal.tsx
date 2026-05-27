import React, { useState } from 'react';
import { motion } from 'motion/react';
import { jsPDF } from 'jspdf';
import { 
  X, Download, FileText, MapPin, Mail, Phone, Globe, Edit2, Sparkles, Check, RotateCcw,
  ChevronLeft, ChevronRight, BookOpen, Award, User, Target, ShieldCheck
} from 'lucide-react';

interface LetterheadModalProps {
  onClose: () => void;
}

export default function LetterheadModal({ onClose }: LetterheadModalProps) {
  // Configurable template fields
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [refNo, setRefNo] = useState(`MS-ESC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);
  
  // Custom Selection state
  const [selectedDocType, setSelectedDocType] = useState<'manual' | 'letter'>('manual');
  const [previewPage, setPreviewPage] = useState<1 | 2 | 3>(1);

  // Dynamic Letter properties (for Single page letterhead format)
  const [recipientName, setRecipientName] = useState('Director of Financial Inspection');
  const [recipientCompany, setRecipientCompany] = useState('Gauteng Trade Portal Ltd.');
  const [recipientAddress, setRecipientAddress] = useState('124 Sovereign Way, Pretoria, South Africa (Global Corridor Office)');
  const [subject, setSubject] = useState('COMPLIANCE INDEMNITY & SECURED ESCROW PAYOUT CERTIFICATE - GLOBAL OPERATIONS');
  const [bodyText, setBodyText] = useState(
    `We hereby confirm that MapStore operates under strict global smart-escrow guidelines to protect both buyers and sellers across South Africa and ten international logistics corridors (including China, the United States, United Kingdom, European Union, Japan, Australia, Canada, India, and Brazil).\n\n` +
    `For all listed electronics, handcrafted materials, organic foods, and global commodities, pay-ins are locked in our high-grade double-sign-off vault routing system. Buyers retain a strict 12-hour safe-cancellation window, during which funds can be instantly reversed. Sellers are registered with verified Country of Origin tags, and checkout currency rates adjust dynamically based on regional settings. Sellers are charged a flat 7% platform commission upon successful product clearance, while buyers enjoy zero hidden escrow administrative fees.\n\n` +
    `Please refer all compliance auditing inquiries and ledger verification checks to our official global headquarters in Pretoria, South Africa, or our international server node administration offices. This certification is pre-authorized by MapStore's smart contract ledger guidelines.`
  );
  
  const [signeeName, setSigneeName] = useState('Mapule Kgatla');
  
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [isDownloading, setIsDownloading] = useState(false);
  
  // Corporate Manual content segments
  const MANUAL_PAGES = {
    1: {
      title: "PART I: EXECUTIVE CHARTER & GLOBAL CORRIDORS",
      metaTitle: "FOUNDER & APP CREATOR: MAPULE KGATLA | ESTB. 2026",
      blocks: [
        "MapStore is founded in 2026 by the visionary creator Mapule Kgatla. Built as an eco-certified smart escrow transacting network, our primary directive is securing decentralized multi-party commerce throughout South Africa and internationally. With specialized branch operations spanning South Africa, China, United States, United Kingdom, EU, Japan, Australia, Canada, India, and Brazil, MapStore establishes direct transparency links connecting local and global buyers and sellers worldwide under our trademark promise: 'reaching you'.",
        "Our operational blueprint ensures that funds deposited by buyers are safely locked within highly guarded double-authorization vault structures. Cross-border sellers complete thorough business verification by selecting their primary physical fulfillment country, ensuring compliant customs clearances and standardized dispatch rates.",
        "This Statutory Corporate Document sets out the legal smart-escrow constraints, regional logistics operations, and platform guidelines implemented to safeguard MapStore's global digital marketplace as authorized by Mapule Kgatla's executive roadmap."
      ]
    },
    2: {
      title: "PART II: DEPOSIT COGNIZANCE & CROSS-BORDER ESCROW FRAMEWORK",
      metaTitle: "PLATFORM LIQUIDITY & 7% COMMISSION RECYCLING PROCEDURES",
      blocks: [
        "1. Symmetrical Flow Payout Controls: Payment payloads entered during secure checkout are deposited under the direct locking jurisdiction of MapStore's automated escrow vault. This ensures 100% security for buyers sourcing premium electronics, handcrafted boutique materials, and fresh organic food harvests across timezone barriers.",
        "2. Safe 12-Hour Grace Window: Buyers hold an absolute 12-hour instant-cancellation window during which payments remain in escrow reserve. This protects buyers from timezone discrepancies and misclicks before international couriers take dispatch.",
        "3. Flat 7% Payout Platform Commission: Upon buyer confirmation of delivery, our escrow program transfers 93% of the payment directly to the seller's active wallet balance, with a flat 7% recycled to platform infrastructure. Zero extra hidden fees are charged to the consumer's bank cards, establishing an unrivaled baseline for trustworthy remote commerce."
      ]
    },
    3: {
      title: "PART III: CREATOR VISION & GLOBAL DISPATCH SEARCH STRATEGY",
      metaTitle: "STATUTORY GOVERNANCE & MULTI-COUNTRY ROUTING ROADMAP",
      blocks: [
        "Reflecting on our rapid progress in 2026, MapStore has established a sustainable, secure framework that guarantees checkout integrity for thousands of global buyers. With the inclusion of intelligent query parsing matching terms like 'sellers from china' or 'shoes from US' and specialized search origin flags, we empower remote buyers to filter logistics paths seamlessly. Further, our administrator control dashboard categorizes merchants via dedicated country category tabs with active count tracking.",
        "In the words of our Founder and Creator, Mapule Kgatla: 'Our vision for MapStore is simple and absolute. By placing the protective escrow vault at the very heart of the checkout flow, we allow our motto - reaching you - to become a living promise of trust and quality across every remote community we serve.'",
        "Approved and certified for publication under MapStore Corporate Governance by Founder & Main Creator: Mapule Kgatla (Founded in 2026, Pretoria)."
      ]
    }
  };

  // Reusable PDF Page setup with headers, watermark on every page, and italic slogan at bottom
  const drawPageTemplate = (pdf: jsPDF, pageNum: number, totalPages: number) => {
    // 1. WATERMARK - Draw Large faint 8-petal logo waterline watermark in background
    pdf.setTextColor(242, 248, 246); // faint greenish matching A4 theme
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(38);
    pdf.text("MAPSTORE SECURE", 105, 135, { align: 'center', angle: 25 });
    pdf.setFontSize(14);
    pdf.text("FOUNDED IN 2026 BY MAPULE KGATLA", 105, 143, { align: 'center', angle: 25 });

    // Symmetrical flower star watermark on the background
    const cx = 105;
    const cy = 158;
    pdf.setDrawColor(241, 248, 246);
    pdf.setLineWidth(0.65);
    for (let angle = 0; angle < 360; angle += 45) {
      const rad = (angle * Math.PI) / 180;
      pdf.line(cx, cy, cx + Math.cos(rad) * 13, cy + Math.sin(rad) * 13);
    }
    pdf.setFillColor(255, 255, 255);
    pdf.circle(cx, cy, 3.5, 'FD');

    // 2. HEADER - MapStore Corporate Branding (Top Left)
    const lx = 25;
    const ly = 23;
    pdf.setDrawColor(94, 234, 212); // #5eead4 mint green
    pdf.setLineWidth(1.1);
    for (let angle = 0; angle < 360; angle += 45) {
      const rad = (angle * Math.PI) / 180;
      pdf.line(lx, ly, lx + Math.cos(rad) * 5.2, ly + Math.sin(rad) * 5.2);
    }
    pdf.setFillColor(255, 255, 255);
    pdf.circle(lx, ly, 1.8, 'FD');

    // Brand Title "MapStore"
    pdf.setTextColor(15, 23, 42); // slate-900 (Deep dark gray)
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(21);
    pdf.text("MapStore", 34, 26);

    // Slogan in Header
    pdf.setTextColor(71, 85, 105); // slate-600
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(7.5);
    pdf.text("REACHING YOU", 34, 30.5);

    // 3. HEADER RIGHT - Pretoria, Gauteng, South Africa Address Information
    pdf.setTextColor(51, 65, 85); // slate-700
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8.5);
    pdf.text("MAPSTORE (PTY) LTD", 185, 20, { align: 'right' });
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(7.5);
    pdf.setTextColor(100, 116, 139); // slate-500
    pdf.text("FOUNDER: MAPULE KGATLA (ESTB. 2026)", 185, 23.5, { align: 'right' });
    pdf.text("PRETORIA • GAUTENG • SOUTH AFRICA", 185, 27, { align: 'right' });
    pdf.text("Email: mapstore2026@gmail.com", 185, 30.5, { align: 'right' });

    // 4. WATERLINE RULE - Thick decorative line separating header
    pdf.setDrawColor(16, 185, 129); // Emerald-500 rule
    pdf.setLineWidth(1);
    pdf.line(20, 39, 190, 39);
    
    pdf.setDrawColor(94, 234, 212); // Mint thin secondary rule
    pdf.setLineWidth(0.4);
    pdf.line(20, 41, 190, 41);

    // 5. RUNNING FOOTER - With 'reaching you' Slogan centering on every single page
    pdf.setDrawColor(226, 232, 240); // slate-200
    pdf.setLineWidth(0.5);
    pdf.line(20, 276, 190, 276);

    pdf.setTextColor(148, 163, 184); // slate-400
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(7);
    pdf.text("MAPSTORE (PTY) LTD • CREATED BY MAPULE KGATLA IN 2026", 20, 281.5);
    pdf.setFont('helvetica', 'normal');
    pdf.text("MEMBER OF THE GAUTENG ECONOMIC REGULATION COUNCIL", 20, 285);
    
    // Centered Slogan: "reaching you" in small italic letters at the bottom of every page
    pdf.setTextColor(16, 185, 129); // Emerald-500
    pdf.setFont('helvetica', 'italic');
    pdf.setFontSize(8);
    pdf.text("reaching you", 105, 283.5, { align: 'center' });

    pdf.setTextColor(148, 163, 184);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(7.5);
    pdf.text(`Page ${pageNum} of ${totalPages}`, 190, 281.5, { align: 'right' });
    pdf.text("CONFIDENTIAL OFFICE COMMUNICATION", 190, 285, { align: 'right' });
  };

  // Generate PDF via jsPDF with page-by-page rendering support
  const handleDownloadPDF = () => {
    setIsDownloading(true);
    
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      if (selectedDocType === 'manual') {
        const totalPages = 3;
        
        for (let i = 1; i <= totalPages; i++) {
          if (i > 1) {
            doc.addPage();
          }
          
          // Draw standard page decoration (logo, waterline, centered watermark, bottom slogan)
          drawPageTemplate(doc, i, totalPages);
          
          // Draw page specific content
          const content = MANUAL_PAGES[i as 1 | 2 | 3];
          
          // 1. DATE AND REFERENCING block
          doc.setTextColor(100, 116, 139); // slate-500
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(7.5);
          doc.text(`DATE SEGMENT: ${date}`, 20, 48);
          doc.text(`STATUTORY NO: MS-MAN-2026-CH-${i}`, 190, 48, { align: 'right' });

          // 2. MAIN TITLE OF PAGE
          doc.setTextColor(15, 23, 42); // slate-900
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(11);
          doc.text(content.title, 20, 58);

          doc.setTextColor(16, 185, 129); // Emerald 
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(7.5);
          doc.text(content.metaTitle, 20, 62);

          // Divider under title
          doc.setDrawColor(241, 245, 249);
          doc.setLineWidth(0.3);
          doc.line(20, 65, 190, 65);

          // Render paragraphs
          doc.setTextColor(51, 65, 85); // slate-700
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9.2);

          let currentY = 73;
          content.blocks.forEach((para) => {
            const wrappedText = doc.splitTextToSize(para, 170);
            doc.text(wrappedText, 20, currentY);
            currentY += (wrappedText.length * 5) + 8;
          });

          // Draw signature stamp on Page 3
          if (i === 3) {
            currentY = Math.min(210, currentY);
            doc.setTextColor(15, 23, 42);
            doc.text("Approved & Attested by Creator:", 20, currentY);
            
            // Signature line & Stamp
            doc.setDrawColor(16, 185, 129, 0.4);
            doc.setLineWidth(0.5);
            doc.line(20, currentY + 13, 80, currentY + 13);
            
            doc.setTextColor(16, 185, 129);
            doc.setFont('courier', 'italic');
            doc.setFontSize(8);
            doc.text("MAPULE KGATLA - AUTHORIZED", 21, currentY + 10);
            
            // Text values
            doc.setTextColor(15, 23, 42);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(9.5);
            doc.text("Mapule Kgatla", 20, currentY + 18);
            
            doc.setTextColor(100, 116, 139);
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(8);
            doc.text("Founder & Lead System Creator (Estb. 2026)", 20, currentY + 22);
          }
        }
        
        doc.save(`MapStore_Platform_Corporate_Manual_22_05_2026.pdf`);
      } else {
        // Document generation: Standard Custom Letter (1 Page)
        const totalPages = 1;
        drawPageTemplate(doc, 1, 1);
        
        // DATE & REFERENCE CODES
        doc.setTextColor(100, 116, 139); // slate-500
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.text(`DATE: ${date}`, 20, 48);
        doc.text(`REF NO: ${refNo}`, 190, 48, { align: 'right' });

        // RECIPIENT INFORMATION
        doc.setTextColor(15, 23, 42); // slate-900
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.text("TO:", 20, 58);
        
        doc.setFont('helvetica', 'normal');
        doc.text(recipientName, 20, 62);
        doc.text(recipientCompany, 20, 66);
        doc.setTextColor(100, 116, 139);
        doc.text(recipientAddress, 20, 70);

        // SUBJECT LINE
        doc.setTextColor(15, 23, 42); // slate-900
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10.5);
        const wrappedSubject = doc.splitTextToSize(`SUBJECT: ${subject.toUpperCase()}`, 170);
        doc.text(wrappedSubject, 20, 81);

        // Line under subject
        doc.setDrawColor(226, 232, 240); // slate-200
        doc.setLineWidth(0.3);
        const lineOffset = 81 + (wrappedSubject.length * 5);
        doc.line(20, lineOffset, 190, lineOffset);

        // LETTER BODY TEXT
        doc.setTextColor(51, 65, 85); // slate-700
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9.5);
        
        const startBodyY = lineOffset + 5;
        const paragraphs = bodyText.split('\n\n');
        let currentY = startBodyY;
        
        paragraphs.forEach((pText) => {
          const wrappedParagraph = doc.splitTextToSize(pText, 170);
          doc.text(wrappedParagraph, 20, currentY);
          currentY += (wrappedParagraph.length * 5) + 6; // Dynamic line spacing + gap
        });

        // SIGNATURE BLOCK
        doc.setTextColor(15, 23, 42); // slate-900
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9.5);
        
        if (currentY + 35 > 270) {
          doc.addPage();
          drawPageTemplate(doc, 2, 2);
          currentY = 48;
        }
        
        doc.text("Yours sincerely,", 20, currentY);
        
        // Placeholder signature stamp
        doc.setDrawColor(16, 185, 129, 0.3);
        doc.setLineWidth(0.5);
        doc.line(20, currentY + 12, 75, currentY + 12);
        
        doc.setTextColor(16, 185, 129);
        doc.setFont('courier', 'italic');
        doc.setFontSize(8.5);
        doc.text("MAPULE KGATLA - CREATOR STAMP", 21, currentY + 9);
        
        doc.setTextColor(15, 23, 42);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9.5);
        doc.text(signeeName, 20, currentY + 17);
        
        doc.setTextColor(100, 116, 139);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.text(signeeTitle, 20, currentY + 21);
        doc.text("MapStore South Africa", 20, currentY + 24.5);

        doc.save(`MapStore_Letterhead_Ref_${refNo}.pdf`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleResetDefaults = () => {
    setRecipientName('Director of Financial Inspection');
    setRecipientCompany('Gauteng Trade Portal Ltd.');
    setRecipientAddress('124 Sovereign Way, Pretoria, South Africa (Global Corridor Office)');
    setSubject('COMPLIANCE INDEMNITY & SECURED ESCROW PAYOUT CERTIFICATE - GLOBAL OPERATIONS');
    setBodyText(
      `We hereby confirm that MapStore operates under strict global smart-escrow guidelines to protect both buyers and sellers across South Africa and ten international corridors (including China, the United States, United Kingdom, European Union, Japan, Australia, Canada, India, and Brazil).\n\n` +
      `For all listed electronics, handcrafted materials, organic foods, and global commodities, pay-ins are locked in our high-grade double-sign-off vault routing system. Buyers retain a strict 12-hour safe-cancellation window, during which funds can be instantly reversed. Sellers are registered with verified Country of Origin tags, and checkout currencies adjust dynamically based on regional settings. Sellers are charged a flat 7% platform commission upon successful product clearance, while buyers enjoy zero hidden escrow administrative fees.\n\n` +
      `Please refer all compliance auditing inquiries and ledger verification checks to our official global headquarters in Pretoria, South Africa, or our international server node administration offices. This certification is pre-authorized by MapStore's smart contract ledger guidelines.`
    );
    setSigneeName('Mapule Kgatla');
  };

  return (
    <div className="fixed inset-0 bg-black/84 flex items-center justify-center z-50 p-3 md:p-6 backdrop-blur-xs overflow-y-auto" id="letterhead-modal-overlay">
      <div className="bg-white dark:bg-zinc-950 rounded-3xl w-full max-w-6xl shadow-2xl flex flex-col h-[90vh] md:h-[85vh] border border-gray-150 dark:border-zinc-800 text-gray-800 dark:text-zinc-100 overflow-hidden">
        
        {/* Header toolbar */}
        <div className="flex items-center justify-between px-6 py-4.5 bg-gray-50 dark:bg-zinc-900 border-b border-gray-150 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-xl">
              <FileText className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm md:text-base leading-tight">MapStore printable reports generator</h3>
              <p className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5 uppercase tracking-wider font-mono">
                <MapPin className="w-3 h-3 text-[#5eead4]" /> PRETORIA • COMPLIANCE LEDGERS
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View tabs for mobile devices */}
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
                Preview Sheet
              </button>
            </div>

            <button
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-xs text-white font-black rounded-xl transition-all shadow-sm cursor-pointer"
              title="Download official PDF report"
            >
              <Download className={`w-4 h-4 ${isDownloading ? 'animate-spin' : ''}`} />
              <span>{isDownloading ? 'Rendering PDF...' : 'Download corporate PDF'}</span>
            </button>

            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-3 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-[#f43f5e] dark:text-[#fb7185] border border-rose-550/20 hover:border-rose-500/30 rounded-xl transition-colors text-xs font-extrabold cursor-pointer"
              id="btn-close-letterhead"
              title="Close Panel and return"
            >
              <X className="w-4 h-4" />
              <span>Close Tab</span>
            </button>
          </div>
        </div>

        {/* Modal body Content splitting */}
        <div className="flex-1 flex overflow-hidden min-h-0">
          
          {/* Left Panel: Inputs configuration */}
          <div className={`w-full md:w-5/12 p-6 overflow-y-auto border-r border-gray-150 dark:border-zinc-800 space-y-5 bg-white dark:bg-zinc-950 ${activeTab === 'edit' ? 'block' : 'hidden md:block'}`}>
            
            <div className="space-y-1.5">
              <label className="block text-[10px] font-extrabold uppercase text-gray-400 tracking-wider font-mono">select printable document type</label>
              
              <div className="bg-gray-100 dark:bg-zinc-900 p-1 rounded-2xl flex border border-gray-150 dark:border-zinc-805">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedDocType('manual');
                    setPreviewPage(1);
                  }}
                  className={`flex-1 flex flex-col items-center justify-center p-3 rounded-xl transition-all cursor-pointer ${selectedDocType === 'manual' ? 'bg-emerald-500 text-white font-black shadow-sm' : 'text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white'}`}
                >
                  <BookOpen className="w-4 h-4 mb-1" />
                  <span className="text-xs">Corporate & Platform Manual</span>
                  <span className="text-[8.5px] opacity-85 mt-0.5">3 Pages • Inc. Founder Mapule Kgatla</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    setSelectedDocType('letter');
                  }}
                  className={`flex-1 flex flex-col items-center justify-center p-3 rounded-xl transition-all cursor-pointer ${selectedDocType === 'letter' ? 'bg-emerald-500 text-white font-black shadow-sm' : 'text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white'}`}
                >
                  <FileText className="w-4 h-4 mb-1" />
                  <span className="text-xs">Custom Business Letter</span>
                  <span className="text-[8.5px] opacity-85 mt-0.5">1 Page • Custom Certificate Form</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 pb-1 border-t border-gray-100 dark:border-zinc-850">
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-500 uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5" /> STATUTORY BOUNDARIES
              </div>
              <div className="text-[10px] text-gray-400 font-mono">ESTABLISHED 2026 BY MAPULE KGATLA</div>
            </div>

            {selectedDocType === 'manual' ? (
              <div className="space-y-4">
                <div className="bg-emerald-500/5 border border-emerald-500/10 p-4 rounded-2xl text-xs space-y-3">
                  <div className="flex items-center gap-2 text-emerald-500 font-bold">
                    <Award className="w-4 h-4" />
                    <span>MapStore Corporate Dossier Specs</span>
                  </div>
                  <p className="text-gray-500 dark:text-zinc-300 leading-relaxed text-[11px]">
                    This downloadable multi-page official corporate manual contains complete platform metrics:
                  </p>
                  <ul className="space-y-1.5 list-disc pl-4 text-[11px] text-gray-400">
                    <li><strong className="text-gray-800 dark:text-white">Founder Mapule Kgatla</strong> statutory registration records.</li>
                    <li>Official launching year listed as <strong className="text-gray-800 dark:text-white">founded in 2026</strong>.</li>
                    <li>Symmetrical 8-petal <strong className="text-gray-800 dark:text-white">watermark logo on every page</strong>.</li>
                    <li>Slogan <em className="text-emerald-500 font-bold">"reaching you"</em> styled seamlessly inside decorative running footers of all pages.</li>
                  </ul>
                </div>

                <div className="space-y-3.5">
                  <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono">Dynamic manual settings</span>
                  
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase text-gray-400 mb-1.5 font-mono font-bold">Manual Issue Date</label>
                    <input 
                      type="date" 
                      value={date} 
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-xl focus:outline-hidden focus:border-emerald-500"
                    />
                  </div>

                  <div className="border border-gray-100 dark:border-zinc-850 p-4 rounded-xl space-y-2.5">
                    <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider font-mono">Statutory Authority Credential</span>
                    <div className="flex items-center gap-2 text-xs">
                      <div className="p-1 rounded-md bg-zinc-100 dark:bg-zinc-800"><User className="w-3.5 h-3.5 text-emerald-500" /></div>
                      <div>
                        <div className="font-bold text-gray-800 dark:text-white">Mapule Kgatla</div>
                        <div className="text-[10px] text-gray-400">Founder, Creator & Proprietor</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <div className="p-1 rounded-md bg-zinc-100 dark:bg-zinc-800"><Target className="w-3.5 h-3.5 text-emerald-500" /></div>
                      <div>
                        <div className="font-bold text-gray-800 dark:text-white">Established 2026</div>
                        <div className="text-[10px] text-gray-400">May Year of Launch</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <button
                  onClick={handleResetDefaults}
                  className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-emerald-500 uppercase font-mono tracking-wider transition-colors ml-auto"
                  title="Reset fields to sample compliance guidelines"
                >
                  <RotateCcw className="w-3 h-3" /> Reset Sample Form
                </button>

                {/* Date & Ref */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase text-gray-400 mb-1.5 font-mono">Date Segment</label>
                    <input 
                      type="date" 
                      value={date} 
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-xl focus:outline-hidden focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase text-gray-400 mb-1.5 font-mono">Reference NO Code</label>
                    <input 
                      type="text" 
                      value={refNo} 
                      onChange={(e) => setRefNo(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-xl focus:outline-hidden focus:border-emerald-500 font-mono"
                    />
                  </div>
                </div>

                {/* Recipient info block */}
                <div className="bg-gray-50/55 dark:bg-zinc-900/35 p-4 rounded-2xl border border-gray-100 dark:border-zinc-900 space-y-3.5">
                  <span className="block text-[10px] font-bold text-emerald-500 uppercase tracking-wider font-mono">recipient agency layout</span>
                  
                  <div>
                    <label className="block text-[9px] font-bold text-gray-400 mb-1">Recipient Direct Name/Title</label>
                    <input 
                      type="text" 
                      value={recipientName} 
                      onChange={(e) => setRecipientName(e.target.value)}
                      placeholder="e.g. Director of Financial Audits"
                      className="w-full px-3 py-1.5 text-xs bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-xl focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold text-gray-400 mb-1">Company / Authority Name</label>
                    <input 
                      type="text" 
                      value={recipientCompany} 
                      onChange={(e) => setRecipientCompany(e.target.value)}
                      placeholder="e.g. Pretoria Financial Agency Ltd"
                      className="w-full px-3 py-1.5 text-xs bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-xl focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold text-gray-400 mb-1">Postal / Floor Address Info</label>
                    <input 
                      type="text" 
                      value={recipientAddress} 
                      onChange={(e) => setRecipientAddress(e.target.value)}
                      placeholder="e.g. Pretoria, Gauteng, South Africa"
                      className="w-full px-3 py-1.5 text-xs bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-xl focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Subject heading */}
                <div>
                  <label className="block text-[10px] font-extrabold uppercase text-gray-400 mb-1.5 font-mono">Subject heading (Formal)</label>
                  <textarea 
                    rows={2}
                    value={subject} 
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Subject line of compliance..."
                    className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-xl focus:outline-hidden focus:border-emerald-500 uppercase font-black"
                  />
                </div>

                {/* Core Body text Content */}
                <div>
                  <label className="block text-[10px] font-extrabold uppercase text-gray-400 mb-1.5 font-mono font-bold">Corporate Body Text</label>
                  <textarea 
                    rows={6}
                    value={bodyText} 
                    onChange={(e) => setBodyText(e.target.value)}
                    placeholder="Enter formal letter text here. Use double-newlines for paragraphs."
                    className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-xl focus:outline-hidden focus:border-emerald-500 font-sans leading-relaxed"
                  />
                </div>

                {/* Author Sign-off */}
                <div className="grid grid-cols-2 gap-3 pb-2">
                  <div>
                    <label className="block text-[9px] font-bold uppercase text-gray-400 mb-1">Signee Name</label>
                    <input 
                      type="text" 
                      value={signeeName} 
                      onChange={(e) => setSigneeName(e.target.value)}
                      placeholder="Name of Signee"
                      className="w-full px-3 py-1.5 text-xs bg-gray-50 dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-xl focus:outline-hidden focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold uppercase text-gray-400 mb-1">Designated Title</label>
                    <input 
                      type="text" 
                      value={signeeTitle} 
                      onChange={(e) => setSigneeTitle(e.target.value)}
                      placeholder="Administrative Role Title"
                      className="w-full px-3 py-1.5 text-xs bg-gray-50 dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-xl focus:outline-hidden focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-gray-150 dark:border-zinc-850">
              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 px-4 bg-rose-500/10 hover:bg-rose-500/20 text-[#f43f5e] dark:text-[#fb7185] border border-rose-550/20 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                title="Exit Letterhead and Return to Store"
                id="letterhead-config-page-close-btn"
              >
                <X className="w-4 h-4" />
                <span>Close Letterhead Tab</span>
              </button>
            </div>
          </div>

          {/* Right Panel: High-contrast real A4 layout preview */}
          <div className={`w-full md:w-7/12 p-6 md:p-8 overflow-y-auto bg-gray-100 dark:bg-zinc-900 flex flex-col justify-start items-center gap-4 min-h-0 ${activeTab === 'preview' ? 'block' : 'hidden md:flex'}`}>
            
            {/* Page switcher for Manual pages preview */}
            {selectedDocType === 'manual' && (
              <div className="flex items-center gap-4 bg-white dark:bg-zinc-950 px-4 py-2 rounded-2xl border border-gray-200 dark:border-zinc-855 shadow-xs font-mono font-bold text-xs">
                <button
                  type="button"
                  onClick={() => setPreviewPage((p) => Math.max(1, p - 1) as 1 | 2 | 3)}
                  disabled={previewPage === 1}
                  className="p-1 hover:text-emerald-500 disabled:opacity-30 disabled:hover:text-gray-400 cursor-pointer transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span>PAGE {previewPage} OF 3</span>
                <button
                  type="button"
                  onClick={() => setPreviewPage((p) => Math.min(3, p + 1) as 1 | 2 | 3)}
                  disabled={previewPage === 3}
                  className="p-1 hover:text-emerald-500 disabled:opacity-30 disabled:hover:text-gray-400 cursor-pointer transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            <div className="bg-white text-gray-950 shadow-2xl p-8 md:p-12 w-full max-w-[210mm] aspect-[1/1.414] rounded-sm relative border border-gray-200 select-none overflow-hidden font-sans text-left" id="real-a4-letterhead">
              
              {/* BACKDROPPED fainted watermark logo */}
              <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center opacity-[0.035] select-none scale-90 md:scale-100">
                <svg viewBox="0 0 100 100" className="w-56 h-56 text-[#10b981] animate-spin" style={{ animationDuration: '240s' }}>
                  <g stroke="currentColor" strokeWidth="3">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <line key={i} x1="50" y1="50" x2={50 + 35 * Math.cos((i * 45 * Math.PI) / 180)} y2={50 + 35 * Math.sin((i * 45 * Math.PI) / 180)} />
                    ))}
                    <circle cx="50" cy="50" r="10" className="fill-white" />
                  </g>
                </svg>
                <div className="text-sm font-black tracking-[8px] mt-2 font-mono text-gray-900">MAPSTORE SECURE</div>
                <div className="text-[6.5px] tracking-[3px] font-mono text-gray-900 font-bold uppercase mt-1">FOUNDED IN 2026 BY MAPULE KGATLA</div>
              </div>

              {/* 1. HEADER SECTION */}
              <div className="flex justify-between items-start relative z-10">
                {/* Logo alignment */}
                <div className="flex items-start gap-2">
                  <div className="relative">
                    <span className="font-sans font-black text-2xl tracking-tight text-gray-900">
                      MapStore
                    </span>
                    {/* Symmetrical flower star */}
                    <div className="absolute -top-[5px] -right-[15px] text-emerald-500">
                      <svg viewBox="0 0 100 100" className="w-6 h-6 fill-current">
                        <g transform="translate(50,50)">
                          {Array.from({ length: 8 }).map((_, i) => (
                            <rect key={i} x="-5" y="-30" width="10" height="20" rx="4" transform={`rotate(${i * 45})`} />
                          ))}
                          <circle cx="0" cy="0" r="6" className="fill-white" />
                        </g>
                      </svg>
                    </div>
                    <span className="block text-[8px] font-extrabold tracking-[0.25em] text-gray-400 font-sans uppercase mt-1">
                      Reaching you
                    </span>
                  </div>
                </div>

                {/* Right Address info with Mapule Kgatla and 2026 info */}
                <div className="text-right text-[8px] leading-relaxed text-gray-500 font-sans">
                  <h4 className="font-bold text-gray-800 uppercase tracking-wider">MapStore (Pty) Ltd</h4>
                  <p className="font-bold text-gray-900 font-mono">FOUNDER: MAPULE KGATLA</p>
                  <p className="font-bold text-gray-650 font-mono">ESTABLISHED 2026</p>
                  <p className="text-gray-400">PRETORIA • GAUTENG • SOUTH AFRICA</p>
                  <p className="mt-0.5">Email: mapstore2026@gmail.com</p>
                </div>
              </div>

              {/* 2. THE WATERLINE DECORATIVE ACCENTS */}
              <div className="mt-5 relative">
                <div className="h-[2.5px] bg-emerald-500 w-full rounded-xs"></div>
                <div className="h-[0.7px] bg-emerald-300 w-full mt-0.5"></div>
              </div>

              {/* DYNAMIC TEMPLATE RENDERING ACCORDING TO USER CHOICES */}
              {selectedDocType === 'manual' ? (
                <div className="mt-6 space-y-5 relative z-10">
                  {/* DATE & REF FOR CORPORATE BOOK */}
                  <div className="flex justify-between text-[8px] font-bold text-gray-400 font-mono">
                    <span>DATE SEGMENT: {date}</span>
                    <span>STATUTORY REGISTERED: MS-MAN-2026-CH-{previewPage}</span>
                  </div>

                  {/* TITLE HEADINGS */}
                  <div className="border-b border-gray-100 pb-2">
                    <h3 className="font-black text-[10px] text-gray-900 tracking-wide font-mono leading-tight">
                      {MANUAL_PAGES[previewPage].title}
                    </h3>
                    <p className="text-[7.5px] font-bold text-emerald-500 font-mono uppercase mt-1">
                      {MANUAL_PAGES[previewPage].metaTitle}
                    </p>
                  </div>

                  {/* PARAGRAPHS FROM SELECTED WEEK/PAGE */}
                  <div className="text-[8.5px] leading-relaxed text-gray-600 font-sans space-y-3.5">
                    {MANUAL_PAGES[previewPage].blocks.map((paraBlock, bIdx) => (
                      <p key={`block-${previewPage}-${bIdx}`} className="whitespace-pre-wrap">
                        {paraBlock}
                      </p>
                    ))}
                  </div>

                  {/* Signature on page 3 */}
                  {previewPage === 3 && (
                    <div className="mt-8 text-[8.5px] text-gray-700 leading-normal border-t border-gray-100 pt-3">
                      <p className="text-gray-600">Approved & Attested by Creator:</p>
                      
                      {/* Visual signature seal */}
                      <div className="mt-2.5 relative inline-block border border-emerald-500/20 bg-emerald-50/20 px-3 py-1 rounded-md">
                        <span className="font-mono italic text-emerald-600 font-black text-[7px] tracking-wider block">
                          MAPULE KGATLA - CREATOR SEAL
                        </span>
                      </div>

                      <p className="mt-2.5 font-extrabold text-gray-900">Mapule Kgatla</p>
                      <p className="text-gray-450 text-[7.5px]">Founder & Lead System Creator (Estb. 2026)</p>
                    </div>
                  )}

                </div>
              ) : (
                /* Standard Letter Letterhead view */
                <>
                  {/* 3. DATE AND REF */}
                  <div className="mt-5 flex justify-between text-[8px] font-bold text-gray-400 font-mono relative z-10">
                    <span>DATE: {date}</span>
                    <span>REF NO: {refNo}</span>
                  </div>

                  {/* 4. RECIPIENT INFORMATION */}
                  <div className="mt-6 text-[8.5px] text-gray-700 leading-snug relative z-10">
                    <span className="font-black text-gray-900 block font-mono">TO:</span>
                    <p className="text-gray-900 font-extrabold">{recipientName}</p>
                    <p className="font-medium text-gray-800">{recipientCompany}</p>
                    <p className="text-gray-400 font-sans">{recipientAddress}</p>
                  </div>

                  {/* 5. SUBJECT */}
                  <div className="mt-5 border-b border-gray-100 pb-2 relative z-10">
                    <h4 className="font-black text-[9.5px] text-gray-900 tracking-wide font-mono leading-tight uppercase">
                      SUBJECT: {subject}
                    </h4>
                  </div>

                  {/* 6. BODY CONTENT */}
                  <div className="mt-4 text-[8.5px] leading-relaxed text-gray-600 font-sans space-y-3 relative z-10">
                    {bodyText.split('\n\n').map((para, pIdx) => (
                      <p key={`p-preview-${pIdx}`} className="whitespace-pre-wrap">
                        {para}
                      </p>
                    ))}
                  </div>

                  {/* 7. SIGN-OFF */}
                  <div className="mt-6 text-[8.5px] text-gray-700 leading-normal relative z-10">
                    <p className="text-gray-600">Yours sincerely,</p>
                    
                    {/* Visual signature seal */}
                    <div className="mt-1.5 inline-block border border-emerald-500/10 bg-emerald-50/10 px-2 py-1 rounded-md">
                      <span className="font-mono italic text-emerald-600 font-black text-[6.5px] tracking-wider block">
                        MAPULE KGATLA - CREATOR SEAL
                      </span>
                    </div>

                    <p className="mt-2.5 font-extrabold text-gray-900">{signeeName}</p>
                    <p className="text-gray-500 text-[8px]">{signeeTitle}</p>
                    <p className="text-gray-400 text-[7.5px]">MapStore South Africa</p>
                  </div>
                </>
              )}

              {/* 8. PAPER DECORATIVE RUNNING FOOTER WITH CENTERED SLOGAN IN SMALL ITALIC LETTERS */}
              <div className="absolute bottom-8 left-8 right-8 border-t border-gray-150 pt-3 flex justify-between items-center text-[7px] text-gray-400 font-sans">
                <div>
                  <span className="font-extrabold block text-gray-500 tracking-wider">MAPSTORE (PTY) LTD</span>
                  <span>PRETORIA • GAUTENG • ESTB. 2026 BY MAPULE KGATLA</span>
                </div>
                
                {/* Slogan aligned at the bottom of every single page in small italic letters */}
                <div className="text-emerald-500 font-black italic text-[8px] animate-pulse">
                  reaching you
                </div>

                <div className="text-right">
                  <span className="font-bold text-gray-500 uppercase">Page {selectedDocType === 'manual' ? previewPage : 1} of {selectedDocType === 'manual' ? 3 : 1}</span>
                  <span className="block">OFFICIAL AUDIT MASTER</span>
                </div>
              </div>

            </div>
          </div>
          
        </div>

      </div>
    </div>
  );
}
