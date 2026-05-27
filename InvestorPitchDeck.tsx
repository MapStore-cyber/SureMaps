import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { jsPDF } from 'jspdf';
import { 
  Briefcase, Activity, ShieldCheck, TrendingUp, DollarSign, Target, Users, 
  MapPin, Clock, ArrowLeft, ArrowRight, Play, Maximize2, Sparkles, Download, Layers, FileText, X 
} from 'lucide-react';

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  category: string;
  badge: string;
  bulletPoints: {
    title: string;
    desc: string;
    icon: any;
  }[];
  statNumber?: string;
  statLabel?: string;
  investorAsk?: string;
}

export function InvestorPitchDeck({ onClose }: { onClose: () => void }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides: Slide[] = [
    {
      id: 1,
      category: "Introduction",
      badge: "The Problem & Mission",
      title: "MapStore: Eliminating Global E-Commerce Friction with Cross-Border GIS Escrow",
      subtitle: "Most cross-border peer-to-peer marketplaces suffer from fraudulent cargo transit logs, disputed delivery states, and complex high-fee wire transfers. MapStore introduces direct geo-locked double-sign-off escrow settlements tying transactions to live global dispatch logs.",
      bulletPoints: [
        {
          title: "Our Slogan Directives",
          desc: "'Reaching you' is our living promise, driving high-integrity transactions across Gauteng, Pretoria, London, New York, and Tokyo corridors.",
          icon: ShieldCheck
        },
        {
          title: "Logistic Blind Spots",
          desc: "Traditional checkout flow is disconnected from live dispatch tracking, leading to manual multi-country courier backlogs.",
          icon: MapPin
        },
        {
          title: "Cross-Border Holds Inefficiency",
          desc: "Sellers wait weeks for international bank approvals, choking small boutique dispatchers in developing economies.",
          icon: Clock
        }
      ]
    },
    {
      id: 2,
      category: "The Secret Weapon",
      badge: "The 12h/24h Resolution Protocol",
      title: "Multi-Currency Smart Auto-Escrow & Grace-Period Ledger",
      subtitle: "We align buyer actions with merchant verification across 10 strategic hubs including South Africa, China, United States, United Kingdom, and the EU.",
      statNumber: "10 Hub Regions",
      statLabel: "ZA, CN, US, GB, EU, JP, AU, CA, IN, BR",
      bulletPoints: [
        {
          title: "1. Buyer Cancellation (12hr Grace Period)",
          desc: "Slightly delayed or wrong decisions can be instantly reversed. 12 hours window covers global timezone mismatch seamlessly.",
          icon: Briefcase
        },
        {
          title: "2. Escrow Payout (24-Hour Logistic Lock)",
          desc: "Funds automatically clear and split to Seller and MapStore wallets exactly 24 hours post-delivery, with full currency normalization.",
          icon: DollarSign
        },
        {
          title: "3. Buyer Returns & Regional Hold Window",
          desc: "Buyers hold a strict 12hr return review post-arrival. Selecting 'Dispute' locks multi-corridor escrow immediately.",
          icon: Activity
        }
      ]
    },
    {
      id: 3,
      category: "Market Opportunity",
      badge: "TAM & Target Demographics",
      title: "Targeting the $5.4Trn Global Peer-To-Peer Market",
      subtitle: "Cross-border trading on mobile platforms is growing at a 22.4% CAGR. MapStore targets high-value niche premium goods requiring verified hand-offs and safe escrow.",
      statNumber: "35% Cost Save",
      statLabel: "Compared to standard multi-country trade wires",
      bulletPoints: [
        {
          title: "High-Value Peer Niches",
          desc: "High-end electronics, handcrafted boutique materials, and fresh organic food harvests shipped globally through authorized hubs.",
          icon: Target
        },
        {
          title: "Strategic Corridors",
          desc: "Intelligent parsing matches queries like 'sellers from china' or 'shoes from SA', filtering by exact origin country flag.",
          icon: Sparkles
        }
      ]
    },
    {
      id: 4,
      category: "Business Model",
      badge: "Unified Fee Generation",
      title: "Auto-Secured platform commissions across All corridors",
      subtitle: "MapStore charges a flat 7% platform fee on seller checkout creation. No hidden buyer fees, providing clean cost clarity on-device.",
      statNumber: "7% Fee",
      statLabel: "Billed at checkout creation, released post-delivery",
      bulletPoints: [
        {
          title: "Instant Commission Routing",
          desc: "Calculations are processed on-the-fly and auto-split. Platform fee commissions recycle back to database nodes.",
          icon: TrendingUp
        },
        {
          title: "Regional Owner Filters",
          desc: "Owner dashboard features multi-country categorization tabs (All, ZA, CN, US, etc.) for streamlined merchant audits.",
          icon: DollarSign
        }
      ]
    },
    {
      id: 5,
      category: "Financials & Target Ask",
      badge: "Seed round seeking $1.2M",
      title: "Building the Next Generation Global Trust Ledger",
      subtitle: "Our working prototype fully demonstrates multi-country registration, country-specific products, and currency conversion models.",
      investorAsk: "Investment Proposal",
      statNumber: "$1.2M USD",
      statLabel: "18-Month Runway at 10% Equity",
      bulletPoints: [
        {
          title: "Key Milestones",
          desc: "Deploy cross-border routing APIs, onboarding 1,000 verified boutique sellers in South Africa, China, and the United Kingdom.",
          icon: Users
        },
        {
          title: "Development Allocation",
          desc: "50% Core Engineering, 35% Customer Onboarding Campaigns across global routes, 15% Regulatory & Logistics licensing.",
          icon: Layers
        }
      ]
    }
  ];

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleDownloadDeck = () => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    const totalSlides = slides.length;

    slides.forEach((slide, index) => {
      // 1. Fill page with premium elegant white/light background
      doc.setFillColor(255, 255, 255);
      doc.rect(0, 0, 297, 210, 'F');

      // 2. Draw sophisticated decorative watermark coordinates
      doc.setTextColor(245, 247, 250); // extremely subtle soft gray
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(60);
      doc.text("MAPSTORE", 148, 115, { align: 'center', angle: 15 });
      doc.setFontSize(22);
      doc.text("AUTO-ESCROW PLATFORM TRUST", 148, 128, { align: 'center', angle: 15 });

      // Clean running borderline
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(150, 160, 175);
      doc.text("● MAPSTORE LOGISTIC ESCROW LEDGER -- WATERLINE DECK VALIDATION SECURE", 20, 203);

      // Draw the iconic symmetrical 8-petal MapStore flower symbol as a vector watermark
      const cx = 265;
      const cy = 35;
      doc.setDrawColor(226, 232, 240); // light slate-200 border
      doc.setLineWidth(0.7);
      for (let angle = 0; angle < 360; angle += 45) {
        const rad = (angle * Math.PI) / 180;
        doc.line(cx, cy, cx + Math.cos(rad) * 11, cy + Math.sin(rad) * 11);
      }
      doc.setFillColor(255, 255, 255);
      doc.circle(cx, cy, 3, 'FD');

      // 3. Category & Target Badge
      doc.setFillColor(240, 253, 250); // light mint teal fill
      doc.roundedRect(20, 18, 90, 8, 2, 2, 'F');
      
      doc.setTextColor(13, 148, 136); // teal-600
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.text(`${slide.category.toUpperCase()}  |  ${slide.badge.toUpperCase()}`, 24, 23.5);

      // Top right compact header tracker tag
      doc.setTextColor(100, 116, 139);
      doc.setFontSize(9);
      doc.text("M a p S t o r e", 235, 23);
      doc.setFontSize(6.5);
      doc.text("INVESTOR SEARCHING GAMEPLAN", 235, 27);

      // 4. Slide Title (Lighter and Large fonts)
      doc.setTextColor(15, 23, 42); // slate-900 (very dark/clear text)
      doc.setFontSize(23);
      doc.setFont('helvetica', 'bold');
      const titleLines = doc.splitTextToSize(slide.title, 165);
      doc.text(titleLines, 20, 39);

      // Content alignment helper
      const titleLinesCount = titleLines.length;
      const startContentY = 39 + (titleLinesCount * 9);

      // 5. Short Description / Subtitle
      doc.setTextColor(71, 85, 105); // slate-600
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      const descLines = doc.splitTextToSize(slide.subtitle, 150);
      doc.text(descLines, 20, startContentY);

      // 6. Highlight Bullet Points list
      let bulletY = startContentY + (descLines.length * 5.5) + 8;
      slide.bulletPoints.forEach((point, i) => {
        // Bullet bullet-dot
        doc.setFillColor(16, 185, 129); // emerald green
        doc.circle(21, bulletY - 2.5, 1, 'F');

        // Title
        doc.setTextColor(15, 23, 42); // slate-900
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10.5);
        doc.text(point.title, 25, bulletY);

        // Sub description
        doc.setTextColor(71, 85, 105); // slate-600
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        const pointDescLines = doc.splitTextToSize(point.desc, 140);
        doc.text(pointDescLines, 25, bulletY + 4);

        bulletY += 4 + (pointDescLines.length * 4.2) + 4;
      });

      // 7. Right-hand Interactive Metric Stat Box (Solid background contrasting card layout)
      if (slide.statNumber) {
        doc.setFillColor(248, 250, 252); // slate-50 background card
        doc.setDrawColor(226, 232, 240); // slate-200 border
        doc.setLineWidth(0.5);
        doc.roundedRect(185, startContentY, 92, 85, 5, 5, 'FD');

        // Small Matrix header indicator
        doc.setTextColor(100, 116, 139); // slate-500
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.text("PERFORMANCE MATRIX", 195, startContentY + 12);

        // Giant numeric high-conviction stats
        doc.setTextColor(16, 185, 129); // emerald green
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(28);
        doc.text(slide.statNumber, 195, startContentY + 34);

        // Descriptive label
        doc.setTextColor(15, 23, 42); // slate-900
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        const labelLines = doc.splitTextToSize(slide.statLabel, 72);
        doc.text(labelLines, 195, startContentY + 45);

        // Small watermark tagline in card
        doc.setTextColor(100, 116, 139); // slate-500
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(7.5);
        const disclaimer = "Pre-programmed commission settlements locked inside platform routing protocols.";
        const wrappedDisc = doc.splitTextToSize(disclaimer, 74);
        doc.text(wrappedDisc, 195, startContentY + 68);
      } else {
        // Safe lock secondary placeholder box
        doc.setFillColor(248, 250, 252); // slate-50
        doc.setDrawColor(226, 232, 240);
        doc.setLineWidth(0.5);
        doc.roundedRect(185, startContentY, 92, 85, 5, 5, 'FD');

        doc.setTextColor(13, 148, 136); // teal-600
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9.5);
        doc.text(slide.investorAsk || "MAPSTORE LEDGER", 195, startContentY + 14);

        doc.setTextColor(71, 85, 105);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        const promoText = "Vetted and compiled timing models, letting investors fast-forward transaction lifecycles securely in-app.";
        const wrappedPromo = doc.splitTextToSize(promoText, 74);
        doc.text(wrappedPromo, 195, startContentY + 26);
        
        // Horizontal indicator line
        doc.setDrawColor(226, 232, 240);
        doc.line(195, startContentY + 60, 267, startContentY + 60);

        doc.setTextColor(148, 163, 184);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.text("Interactive Sandbox Simulation v1.4", 195, startContentY + 70);
      }

      // 8. Footer lines & Confidentiality Waterlines
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.6);
      doc.line(20, 195, 277, 195);

      doc.setTextColor(100, 116, 139);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.text("CONFIDENTIAL  |  MAPSTORE SEED PRESENTATION", 20, 201);
      
      doc.setFont('helvetica', 'normal');
      doc.text(`Slide ${slide.id} of ${totalSlides}`, 254, 201);

      if (index < totalSlides - 1) {
        doc.addPage();
      }
    });

    doc.save("MapStore_Investor_Pitch_Presentation.pdf");
  };

  const handleDownloadWordDeck = () => {
    const htmlContent = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8">
        <title>MapStore Investor Pitch & Corporate Charter</title>
        <!--[if gte mso 9]>
        <xml>
          <w:WordDocument>
            <w:View>Print</w:View>
            <w:Zoom>100</w:Zoom>
            <w:DoNotOptimizeForBrowser/>
          </w:WordDocument>
        </xml>
        <![endif]-->
        <style>
          body {
            font-family: 'Segoe UI', Arial, sans-serif;
            color: #1e293b;
            line-height: 1.6;
            margin: 1in;
            background-color: #ffffff;
          }
          .letterhead {
            border-bottom: 3px double #10b981;
            padding-bottom: 12px;
            margin-bottom: 25px;
          }
          .brand-title {
            font-size: 26pt;
            font-weight: bold;
            color: #0f172a;
            margin: 0;
            letter-spacing: -1px;
          }
          .brand-slogan {
            font-size: 10pt;
            font-style: italic;
            color: #10b981;
            font-weight: bold;
            margin-top: 2px;
            text-transform: uppercase;
          }
          .meta-info {
            font-size: 9pt;
            color: #64748b;
            text-align: right;
            margin-top: -45px;
          }
          .doc-title {
            font-size: 18pt;
            font-weight: 800;
            color: #0f172a;
            margin-top: 30px;
            margin-bottom: 8px;
            text-transform: uppercase;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 5px;
          }
          .watermark-banner {
            background-color: #f0fdf4;
            border-left: 4px solid #10b981;
            padding: 12px;
            margin-bottom: 20px;
            font-size: 10pt;
            color: #166534;
            font-weight: bold;
          }
          h2 {
            font-size: 14pt;
            color: #0d9488;
            margin-top: 22px;
            margin-bottom: 10px;
            border-bottom: 1px solid #f1f5f9;
            padding-bottom: 3px;
          }
          p {
            margin-bottom: 12px;
          }
          .bullet-block {
            margin-left: 20px;
            margin-bottom: 15px;
          }
          .bullet-title {
            font-weight: bold;
            color: #0f172a;
          }
          .bullet-desc {
            color: #475569;
          }
          .footer {
            margin-top: 60px;
            border-top: 1px solid #cbd5e1;
            padding-top: 10px;
            font-size: 8pt;
            color: #94a3b8;
            text-align: center;
          }
          .slogan-footer {
            color: #10b981;
            font-style: italic;
            font-weight: bold;
            font-size: 9pt;
            margin-top: 3px;
          }
          .sig-block {
            margin-top: 40px;
            font-size: 10pt;
          }
          .sig-line {
            width: 250px;
            border-top: 1px solid #94a3b8;
            margin-top: 25px;
            padding-top: 5px;
          }
        </style>
      </head>
      <body>
        <!-- Official Letterhead Header -->
        <div class="letterhead">
          <div class="brand-title">MapStore</div>
          <div class="brand-slogan">reaching you</div>
          <div class="meta-info">
            <strong>MAPSTORE (PTY) LTD</strong><br>
            FOUNDER: MAPULE KGATLA (ESTB. 2026)<br>
            PRETORIA • GAUTENG • SOUTH AFRICA<br>
            mapstore2026@gmail.com
          </div>
        </div>

        <div class="watermark-banner">
          ★ OFFICIAL INVESTOR CHARTER & PITCH DECK CONTEXT REPORT DIRECTLY FROM THE ESCROW VAULT PROTOCOL ★
        </div>

        <div class="doc-title">What is MapStore & How it Differs from Traditional Online Marketplaces</div>
        
        <p>
          Founded in <strong>2026</strong> by visionary creator <strong>Mapule Kgatla</strong>, MapStore is a premier, automated cross-border e-commerce escrow platform built with absolute seller-buyer security. Connecting South Africa's robust local hubs with prestigious international markets (including China, the United States, United Kingdom, European Union, Japan, Australia, Canada, India, and Brazil), MapStore introduces automated trust directly into the worldwide checkout sequence under our trademark promise: <em>"reaching you"</em>. While generic digital marketplaces are plagued by transit fraud, payment disputes, and delayed merchant payouts, MapStore coordinates global currencies, decentralized logistics, and multi-region hubs seamlessly.
        </p>
 
        <h2>1. The Problem: The Peer-to-Peer Trust Gap</h2>
        <div class="bullet-block">
          <span class="bullet-title">The Trust Deficit:</span> 
          <span class="bullet-desc">Buyers hesitate to clear payments prior to receiving goods; sellers fear malicious post-delivery card reversals or buyer chargeback loops across international zones.</span>
        </div>
        <div class="bullet-block">
          <span class="bullet-title">Logistic Isolation & Multi-Country Barriers:</span> 
          <span class="bullet-desc">Standard online checkouts operate independently from shipping logs, forcing support agents to manually resolve delivery verification tickets across different custom borders and shipping corridors.</span>
        </div>
        <div class="bullet-block">
          <span class="bullet-title">Unreasonable Payment Delays:</span> 
          <span class="bullet-desc">Sellers on conventional platforms are often subjected to 7 to 14 business-day holds while global banks and administrative desks process international wiring rules.</span>
        </div>
 
        <h2>2. Our Unfair Advantage: The MapStore 12h/24h Resolution Sequence & Global Dispatch Filters</h2>
        <p>
          Unlike legacy marketplaces, MapStore doesn't use subjective manual resolution teams. Instead, our platform uses pre-programmed trust sequencers aligned perfectly to transport logs, enhanced with intelligent regional localization:
        </p>
        <div class="bullet-block">
          <span class="bullet-title font-bold">Phase A - The 12-Hour Grace Period (Buyer Protection):</span> 
          <span class="bullet-desc">Buyers retain a bulletproof 12-hour safe window post-checkout to cancel orders instantly. No manual support queue is required; commission payouts and funds are reverted immediately to cover timezone discrepancies.</span>
        </div>
        <div class="bullet-block">
          <span class="bullet-title font-bold">Phase B - Automated Payout Lock (Seller Protection):</span> 
          <span class="bullet-desc">Once a courier service reports successful logistics tracking or parcel hand-off in any of our 10 official countries (ZA, CN, US, GB, EU, JP, AU, CA, IN, BR), the payment enters a secure 24-hour clearing lock. If no disputes are opened, the system splits and releases funds automatically.</span>
        </div>
        <div class="bullet-block">
          <span class="bullet-title font-bold">Phase C - The 12-Hour Return & Escrow Freeze Window:</span> 
          <span class="bullet-desc">Upon receipt, buyers have up to 12 hours to verify item authenticity. Selecting 'Dispute Return' freezes the escrow amount instantly, preventing payout until both parties resolve delivery criteria.</span>
        </div>
        <div class="bullet-block">
          <span class="bullet-title font-bold">Phase D - Intelligent Global Search Parsing & Country Origin Flags:</span> 
          <span class="bullet-desc">An advanced multi-country query processor instantly matches queries like ‘sellers from china’, ‘shoes from US’, or ‘germany’, immediately sorting results by the seller's verified origin country flag. Buyers can also isolate products via a specialized country drop-down selector.</span>
        </div>
 
        <h2>3. Sustainable Revenue & Commission Scaling with Global Admin Command</h2>
        <p>
          To ensure platform upkeep and growth, a strict flat <strong>7% platform commission fee</strong> is calculated and deducted on all checkout settlements on the merchant side. Our administrative architecture provides unparalleled localized transparency:
        </p>
        <div class="bullet-block">
          <span class="bullet-title font-bold">No Hidden Buyer Costs:</span> 
          <span class="bullet-desc">We keep transactions clean for buyers by billing 0% buyer processing fees. The flat 7% commission is fully settled on the merchant side only when delivery is verified, regardless of the billing currency.</span>
        </div>
        <div class="bullet-block">
          <span class="bullet-title font-bold">Multi-Region Hub Categorizer for Owners:</span> 
          <span class="bullet-desc">The official Pretoria administrative control board sorts enrolled merchant applications through real-time country category tabs with dynamic counter meters, streamlining physical address inspections across international borders.</span>
        </div>
 
        <h2>4. Seed Capital Ask & Growth Target</h2>
        <p>
          We are currently opening a seed capital investment round of <strong>$1.2M USD</strong> (for a 10% equity position) to fund an 18-month strategic development cycle:
        </p>
        <div class="bullet-block">
          <span class="bullet-title font-bold">Capital Allocation Strategy:</span> 
          <span class="bullet-desc">50% Core Engineering & Crypto Ledgers, 35% Customer Onboarding Campaigns across global routes (including EU-SA-CN corridors), 15% Regulatory & Logistics licensing.</span>
        </div>

        <!-- Document Sign-off with Letterhead Authority -->
        <div class="sig-block">
          <p>Approved and verified for distribution under MapStore Board of Directors:</p>
          <div style="font-family: 'Courier New', monospace; font-style: italic; color: #10b981; font-weight: bold;">
            [OFFICIAL DIGITAL SECURE ESCROW SIGNATURE]
          </div>
          <div class="sig-line">
            <strong>Creator & Proprietor: Mapule Kgatla</strong><br>
            Launched: May 2026<br>
            MapStore South Africa Administrative Council
          </div>
        </div>

        <!-- Running Footer -->
        <div class="footer">
          MAPSTORE (PTY) LTD • STATUTORY CORPORATE DOCUMENT • REGISTERED GAUTENG DEP.<br>
          <div class="slogan-footer font-bold italic">reaching you</div>
        </div>
      </body>
      </html>
    `;

    const blob = new Blob(['\\ufeff' + htmlContent], {
      type: 'application/msword;charset=utf-8'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'MapStore_Investor_Pitch_Charter.doc';
    document.body.appendChild(a);
    a.click();
    
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#f8fafc] flex flex-col justify-between p-4 sm:p-6 safe-padding-top safe-padding-bottom text-slate-900 overflow-y-auto">
      {/* Pitch Deck Header Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-emerald-500 text-white font-extrabold rounded-lg text-xs leading-none">
            DECK
          </div>
          <div>
            <h2 className="text-xs font-black uppercase tracking-[4px] text-slate-500">MapStore Pitch Arena</h2>
            <span className="text-[10px] text-slate-400 font-mono">Presenting to Venture Partners</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleDownloadDeck}
            className="flex flex-1 sm:flex-initial items-center justify-center gap-1.5 px-3.5 py-2 bg-[#f0fdf4] hover:bg-[#dcfce7] border border-emerald-200 text-emerald-700 rounded-xl text-[11px] font-black cursor-pointer transition-all active:scale-95"
            title="Download Watermarked MapStore Investor Deck PDF Document"
          >
            <Download className="w-3.5 h-3.5" />
            <span>PDF Deck</span>
          </button>

          <button
            onClick={handleDownloadWordDeck}
            className="flex flex-1 sm:flex-initial items-center justify-center gap-1.5 px-3 py-2 bg-[#f0f9ff] hover:bg-[#e0f2fe] border border-sky-200 text-sky-700 rounded-xl text-[11px] font-black cursor-pointer transition-all active:scale-95"
            title="Download Official MapStore Pitch Word Document Charter"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Word Brief</span>
          </button>
          
          <button
            onClick={onClose}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2 sm:py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-[#f43f5e] dark:text-[#fb7185] border border-rose-550/20 rounded-xl text-[11px] font-black uppercase tracking-wider cursor-pointer transition-colors w-full sm:w-auto"
          >
            <X className="w-3.5 h-3.5" />
            <span>Close Tab</span>
          </button>
        </div>
      </div>

      {/* Slide body with anim presence and watermark logo waterline */}
      <div className="flex-1 my-6 flex flex-col justify-center max-w-5xl mx-auto w-full relative">
        {/* Faint elegant MapStore 8-petal logo waterline watermark */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-0 select-none overflow-hidden">
          <div className="relative flex flex-col items-center justify-center scale-75 md:scale-110 opacity-[0.06] transition-all">
            <svg viewBox="0 0 100 100" className="w-80 h-80 text-emerald-500/10 animate-spin" style={{ animationDuration: '120s' }}>
              <g stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                <line x1="50" y1="20" x2="50" y2="80" stroke="currentColor" />
                <line x1="20" y1="50" x2="80" y2="50" stroke="currentColor" />
                <line x1="29" y1="29" x2="71" y2="71" stroke="currentColor" />
                <line x1="29" y1="71" x2="71" y2="29" stroke="currentColor" />
                <circle cx="50" cy="50" r="8" className="fill-white" stroke="currentColor" />
              </g>
            </svg>
            <div className="text-3xl font-black tracking-[12px] text-slate-300 mt-4 font-mono">
              MAPSTORE
            </div>
            <div className="text-[9px] tracking-[5px] text-emerald-600 mt-2 font-mono uppercase">
              Reaching you • Platform Waterline
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
             key={currentSlide}
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             exit={{ opacity: 0, x: -20 }}
             transition={{ duration: 0.25, ease: 'easeInOut' }}
             className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
          >
            {/* Left Col - Slide info text */}
            <div className="lg:col-span-12 lg:pr-4 space-y-5">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#f0fdf4] text-emerald-700 border border-emerald-100 text-[10px] uppercase font-mono font-black tracking-widest">
                  {slides[currentSlide].category}
                </span>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                  {slides[currentSlide].badge}
                </span>
              </div>

              {/* Lighter, Huge, and elegant Display Fonts */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-extrabold text-slate-900 leading-tight tracking-tight">
                {slides[currentSlide].title}
              </h1>

              <p className="text-base sm:text-lg text-slate-650 leading-relaxed font-sans font-medium text-slate-600">
                {slides[currentSlide].subtitle}
              </p>

              {/* Highlight Bullet Points inside slide */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
                {slides[currentSlide].bulletPoints.map((bp, i) => {
                  const Icon = bp.icon;
                  return (
                    <div key={i} className="flex flex-col gap-3 p-5 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                      <div className="p-2.5 bg-[#f0fdf4] border border-emerald-100 text-emerald-600 rounded-xl shrink-0 w-max">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-base text-slate-900">{bp.title}</h4>
                        <p className="text-[12px] text-slate-500 leading-relaxed mt-1">{bp.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Metric / Stat Highlight Row */}
            <div className="lg:col-span-12 pt-4 flex justify-center">
              {slides[currentSlide].statNumber ? (
                <div className="w-full max-w-2xl bg-white border border-slate-150 p-6 sm:p-8 rounded-3xl text-center shadow-lg shadow-slate-100/80 relative overflow-hidden flex flex-col sm:flex-row gap-6 items-center">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl"></div>
                  <div className="p-4 bg-emerald-50 rounded-full shrink-0">
                    <TrendingUp className="w-8 h-8 text-emerald-600" />
                  </div>
                  <div className="text-left flex-1">
                    <span className="text-[10px] font-mono uppercase tracking-[3px] text-slate-400 block">Performance Matrix</span>
                    <h3 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tighter mt-1">
                      {slides[currentSlide].statNumber}
                    </h3>
                    <p className="text-sm text-slate-600 font-bold mt-1 font-mono">{slides[currentSlide].statLabel}</p>
                  </div>
                  <div className="text-[11px] text-slate-400 italic sm:border-l sm:border-slate-100 sm:pl-6 max-w-xs text-left">
                    Backed by interactive fast-forward simulation protocols inside the active prototype sandbox workspace.
                  </div>
                </div>
              ) : (
                <div className="w-full max-w-2xl bg-white border border-dashed border-slate-300 p-6 sm:p-8 rounded-3xl shadow-sm flex flex-col sm:flex-row gap-6 items-center">
                  <div className="p-4 bg-teal-50 rounded-full shrink-0">
                    <Sparkles className="w-8 h-8 text-teal-600 animate-spin" style={{ animationDuration: '10s' }} />
                  </div>
                  <div className="text-left flex-1">
                    <h4 className="font-black text-base uppercase tracking-widest text-teal-600">{slides[currentSlide].investorAsk || "MapStore Ledger Logic"}</h4>
                    <p className="text-sm text-slate-600 mt-1 font-sans font-medium">
                      Automated 12h cancellation buffers, 24h escrow clearing lockdowns, and 12h resolution cycles protect critical ecosystem value.
                    </p>
                  </div>
                  <div className="w-28 h-1 bg-teal-100 rounded-full overflow-hidden">
                    <div className="h-full bg-teal-500 w-2/3 animate-pulse"></div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slide Navigation Foot-bar with Slide indicators */}
      <div className="border-t border-slate-200 pt-5 max-w-5xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-4 font-sans">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            {slides.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full cursor-pointer transition-all ${
                  idx === currentSlide ? 'w-8 bg-emerald-500' : 'w-2 bg-slate-200 hover:bg-slate-300'
                }`}
                title={`Go to Slide ${s.id}`}
              />
            ))}
          </div>
          <span className="text-[10px] text-slate-400 font-mono font-bold uppercase">
            Slide {currentSlide + 1} of {slides.length}
          </span>
        </div>

        <button
          onClick={onClose}
          type="button"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-[#f43f5e] border border-rose-550/20 rounded-xl text-[10px] font-black uppercase tracking-wider cursor-pointer transition-colors"
          title="Exit Presentation"
        >
          <X className="w-3.5 h-3.5" />
          <span>Close Tab</span>
        </button>

        {/* Action slide navigation arrows */}
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrev}
            className="p-2 sm:p-2.5 bg-white border border-slate-200 hover:border-slate-300 rounded-xl cursor-pointer text-slate-600 hover:text-slate-900 transition-all shadow-sm active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <button
            onClick={handleNext}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-md cursor-pointer font-black text-xs uppercase tracking-wider transition-all active:scale-95"
          >
            <span>Next Slide</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
