import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { PieChart as LucidePieChart } from 'lucide-react';
import {
  ShieldCheck, Upload, CheckCircle2, AlertTriangle, Play, HelpCircle, Save, Plus, Trash2,
  TrendingUp, BarChart4, DollarSign, ArrowUpRight, FileCheck, FileText, Check, Scan, Camera, MapPin,
  Printer, Package, Clock, Truck, Copy, Edit, RefreshCw, Wallet, ArrowDownRight, Lock, Key, Mail, Inbox, Video, StopCircle, Download,
  MessageSquare, Handshake, Briefcase
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { Product, User, Order, PushNotification, RegionConfig, P2PChatMessage, P2PChatThread } from '../types';
import { Translate } from './Translate';

const REGIONAL_AGENTS: Record<string, {
  name: string;
  logo: string;
  speed: string;
  baseRateRaw: number;
  escrowCertified: boolean;
  features: string[];
}[]> = {
  ZA: [
    { name: "The Courier Guy", logo: "🚚", speed: "1-2 Days", baseRateRaw: 75, escrowCertified: true, features: ["Smart OTP Pins", "Same-day Gauteng"] },
    { name: "Aramex Logistics", logo: "📦", speed: "2-3 Days", baseRateRaw: 99, escrowCertified: true, features: ["Locker Drops", "SMS Alerts"] },
    { name: "PostNet Secure", logo: "🏛️", speed: "2-4 Days", baseRateRaw: 110, escrowCertified: false, features: ["Counter Hand-off", "Physical Proof"] }
  ],
  US: [
    { name: "FedEx SmartEscrow", logo: "📦", speed: "1-2 Days", baseRateRaw: 160, escrowCertified: true, features: ["Dual Signature", "GPS Live Map"] },
    { name: "UPS Ground Secure", logo: "🚚", speed: "2-3 Days", baseRateRaw: 170, escrowCertified: true, features: ["Doorstep Audits", "Carbon Offset"] },
    { name: "USPS Priority Guard", logo: "✉️", speed: "2-4 Days", baseRateRaw: 125, escrowCertified: false, features: ["PO Box Eligible", "Flat Rate Box"] }
  ],
  EU: [
    { name: "DHL EuroLink", logo: "✈️", speed: "1-2 Days", baseRateRaw: 150, escrowCertified: true, features: ["Inter-state Express", "Biometric Signature"] },
    { name: "DPD Local Secure", logo: "🚚", speed: "2-3 Days", baseRateRaw: 130, escrowCertified: true, features: ["1-Hour ETA Tracker", "Easy Return Labels"] },
    { name: "La Poste Post", logo: "✉️", speed: "3-5 Days", baseRateRaw: 90, escrowCertified: false, features: ["Postbox Dropoff", "Economic Tier"] }
  ],
  GB: [
    { name: "Royal Mail Tracked 24", logo: "✉️", speed: "1 Day", baseRateRaw: 115, escrowCertified: true, features: ["Photo Proof", "Letterbox Delivery"] },
    { name: "Evri Escrow Secured", logo: "📦", speed: "2-3 Days", baseRateRaw: 95, escrowCertified: true, features: ["Store Handover Points", "Flexible Redirects"] },
    { name: "ParcelForce Air Priority", logo: "🚚", speed: "1-2 Days", baseRateRaw: 290, escrowCertified: true, features: ["Heavy Cargo Guard", "Multi-Sign-Off"] }
  ],
  JP: [
    { name: "Yamato (Kuroneko)", logo: "🐈‍⬛", speed: "1 Day", baseRateRaw: 80, escrowCertified: true, features: ["Chilled/Cold Chain", "Convenience Store Pick"] },
    { name: "Sagawa Express Hub", logo: "🚚", speed: "1-2 Days", baseRateRaw: 90, escrowCertified: true, features: ["Exact Time Slots", "Digital Waybill"] },
    { name: "Japan Post (Yuu-Pack)", logo: "🇯🇵", speed: "1-3 Days", baseRateRaw: 70, escrowCertified: false, features: ["National Reach", "Symmetric Recipient OTP"] }
  ],
  AU: [
    { name: "Australia Post Express", logo: "🦘", speed: "1-2 Days", baseRateRaw: 145, escrowCertified: true, features: ["Sovereign Network", "Safe Drop Opt-In"] },
    { name: "Sendle Green Courier", logo: "🐨", speed: "2-4 Days", baseRateRaw: 105, escrowCertified: true, features: ["100% Carbon Neutral", "Free Door Pickups"] },
    { name: "StarTrack Priority Air", logo: "✈️", speed: "1-3 Days", baseRateRaw: 175, escrowCertified: true, features: ["Heavy Duty Secure", "Corporate Escrow API"] }
  ],
  CA: [
    { name: "Canada Post Expedited", logo: "🍁", speed: "2-4 Days", baseRateRaw: 135, escrowCertified: true, features: ["National Lockbox Secure", "Signature on Delivery"] },
    { name: "Purolator Cargo Secure", logo: "✈️", speed: "1-2 Days", baseRateRaw: 200, escrowCertified: true, features: ["Early Delivery Pledge", "Emergency Tracking"] },
    { name: "Intelcom Courier", logo: "🚚", speed: "1-2 Days", baseRateRaw: 115, escrowCertified: false, features: ["Direct Photo Receipts", "Automated SMS Updates"] }
  ],
  IN: [
    { name: "Delhivery SmartEscrow", logo: "🚚", speed: "2-3 Days", baseRateRaw: 20, escrowCertified: true, features: ["Biometric Door Delivery", "Cash-on-Escrow System"] },
    { name: "Blue Dart Express Air", logo: "✈️", speed: "1-2 Days", baseRateRaw: 35, escrowCertified: true, features: ["Time-Definite Delivery", "Zero-Dispute Audit"] },
    { name: "Speed Post India", logo: "✉️", speed: "3-5 Days", baseRateRaw: 10, escrowCertified: false, features: ["Extreme Remote Reach", "Government Backed"] }
  ],
  BR: [
    { name: "Correios SEDEX Express", logo: "🚚", speed: "1-2 Days", baseRateRaw: 70, escrowCertified: true, features: ["OTP Safe Handset", "Full Liability Covered"] },
    { name: "Jadlog Logística", logo: "📦", speed: "2-4 Days", baseRateRaw: 55, escrowCertified: true, features: ["Commerce Store Drops", "Weight Clearance Checks"] },
    { name: "Loggi Tecnologia Motos", logo: "🇧🇷", speed: "1 Day", baseRateRaw: 45, escrowCertified: true, features: ["Instant Smart Mapping", "Real-Time GPS Tracking"] }
  ],
  GLOBAL: [
    { name: "DHL Global Secure Air", logo: "🌎", speed: "2-3 Days", baseRateRaw: 360, escrowCertified: true, features: ["Customs Integrated Escrow", "Global Satellite Tracking", "Premium Insurance Included"] },
    { name: "FedEx World Secure Express", logo: "✈️", speed: "3-5 Days", baseRateRaw: 380, escrowCertified: true, features: ["Multi-Leg Audit Trails", "DDP Duties Included", "Dual Lockbox Safeguard"] },
    { name: "UPS Worldwide Saver", logo: "🚚", speed: "2-4 Days", baseRateRaw: 340, escrowCertified: true, features: ["Symmetric Handshakes", "Carbon Neutral Fleet", "Webhook API Payouts"] }
  ]
};

export function getCourierContactInfo(name: string) {
  switch (name) {
    case "The Courier Guy":
      return {
        phone: "+27 (0) 10 120 3000",
        email: "support@thecourierguy.co.za",
        manager: "Thabo Molefe",
        depot: "Pretoria Hub Office, GautengEast",
        hours: "07:30 - 18:00 (Mon-Fri)"
      };
    case "Aramex Logistics":
      return {
        phone: "+27 (0) 11 457 3000",
        email: "za.support@aramex.com",
        manager: "Sarah Jenkins",
        depot: "OR Tambo Corporate Logistics South",
        hours: "08:00 - 17:30 (Mon-Fri)"
      };
    case "PostNet Secure":
      return {
        phone: "+27 (0) 86 176 7863",
        email: "collections@postnet.co.za",
        manager: "Andre de Beer",
        depot: "Brooklyn Mall, Block B Suite",
        hours: "08:00 - 17:00 (Mon-Fri), 08:30 - 13:00 (Sat)"
      };
    case "FedEx SmartEscrow":
      return {
        phone: "+1 (800) 463-3339",
        email: "escrow.verify@fedex.com",
        manager: "Robert Vance",
        depot: "SFO Gateway Sorting Center",
        hours: "24/7 Priority Support Desk"
      };
    case "UPS Ground Secure":
      return {
        phone: "+1 (800) 742-5877",
        email: "secure.ground@ups.com",
        manager: "Emily Watson",
        depot: "Oakland Port Depot A West",
        hours: "06:00 - 22:00 Daily"
      };
    case "USPS Priority Guard":
      return {
        phone: "+1 (800) 275-8777",
        email: "priority.security@usps.gov",
        manager: "John Miller",
        depot: "USPS Main Branch South",
        hours: "08:00 - 18:00 (Mon-Sat)"
      };
    case "DHL EuroLink":
      return {
        phone: "+49 (0) 228 18 20",
        email: "eurolink.support@dhl.com",
        manager: "Dieter Schwarz",
        depot: "Frankfurt Airport Terminal 4 Cargo Hub",
        hours: "24/7 Express Dispatch Desk"
      };
    case "DPD Local Secure":
      return {
        phone: "+44 (0) 121 275 0500",
        email: "dpd.care@dpd.co.uk",
        manager: "Clara Bennett",
        depot: "London East Sorting Yard 11",
        hours: "07:00 - 19:30 Mon-Sat"
      };
    case "La Poste Post":
      return {
        phone: "+33 3631",
        email: "pro.laposte@laposte.fr",
        manager: "Jean-Pierre Laurent",
        depot: "Paris Central Depot",
        hours: "08:00 - 18:00 Mon-Fri"
      };
    case "Royal Mail Tracked 24":
      return {
        phone: "+44 (0) 3457 740 740",
        email: "royalmail.verify@royalmail.com",
        manager: "William Spencer",
        depot: "Heathrow Worldwide Distribution Centre",
        hours: "06:00 - 21:00 (Mon-Sat)"
      };
    case "Evri Escrow Secured":
      return {
        phone: "+44 (0) 330 333 6556",
        email: "seller.escrow@evri.com",
        manager: "Olivia Higgins",
        depot: "Bristol Freight Terminal Depot",
        hours: "08:00 - 18:00 Mon-Fri"
      };
    case "ParcelForce Air Priority":
      return {
        phone: "+44 (0) 344 800 4466",
        email: "air.priority@parcelforce.co.uk",
        manager: "Arthur Pendelton",
        depot: "Coventry National Hub Space A",
        hours: "24/7 International Desk"
      };
    case "Yamato (Kuroneko)":
      return {
        phone: "+81 3-3541-3411",
        email: "kuroneko.global@kuronekoyamato.co.jp",
        manager: "Kenji Takahashi",
        depot: "Tokyo Haneda Logistics Gate",
        hours: "08:00 - 21:00 Daily"
      };
    case "Sagawa Express Hub":
      return {
        phone: "+81 50-3786-0000",
        email: "sagawa.support@sagawa-exp.co.jp",
        manager: "Hiroshi Sato",
        depot: "Osaka Nanko Logistics Base",
        hours: "08:00 - 20:30 Daily"
      };
    case "Japan Post (Yuu-Pack)":
      return {
        phone: "+81 570-046-666",
        email: "yuupack.escrow@japanpost.jp",
        manager: "Yuki Tanaka",
        depot: "Chiyoda Central Mail Vault",
        hours: "08:00 - 19:00 Mon-Sat"
      };
    case "Australia Post Express":
      return {
        phone: "+61 13 76 78",
        email: "auspost.merchant@auspost.com.au",
        manager: "Lachlan Ross",
        depot: "Melbourne Airport Gateway Ground",
        hours: "08:00 - 18:00 Mon-Fri"
      };
    case "Sendle Green Courier":
      return {
        phone: "+61 2 6189 2341",
        email: "carbonneutral@sendle.com",
        manager: "Max Henderson",
        depot: "Sydney Port Botany Circular Hub",
        hours: "09:00 - 17:00 Mon-Fri"
      };
    case "StarTrack Priority Air":
      return {
        phone: "+61 13 23 45",
        email: "startrack.priority@startrack.com.au",
        manager: "David Hughes",
        depot: "Brisbane Airside Cargo Bay 9",
        hours: "24/7 Air Express Division"
      };
    case "Canada Post Expedited":
      return {
        phone: "+1 (866) 607-6301",
        email: "canadapost.escrow@canadapost.ca",
        manager: "Robert Tremblay",
        depot: "Toronto Gateway Postal Facility",
        hours: "07:00 - 19:00 EST Mon-Fri"
      };
    case "Purolator Cargo Secure":
      return {
        phone: "+1 (888) 745-6678",
        email: "cargo.safety@purolator.com",
        manager: "Genevieve Roy",
        depot: "Montreal Dorval Logistics Hub",
        hours: "24/7 Secure Express Operations"
      };
    case "Intelcom Courier":
      return {
        phone: "+1 (844) 370-5096",
        email: "merchant.relations@intelcom.ca",
        manager: "Marc-Andre Cote",
        depot: "Vancouver Delivery Center Wing 4",
        hours: "08:00 - 22:00 Daily"
      };
    case "Delhivery SmartEscrow":
      return {
        phone: "+91 124 671 9500",
        email: "delhivery.secure@delhivery.com",
        manager: "Rajesh Sharma",
        depot: "Gurugram Mega Hub Cluster A",
        hours: "24/7 Merchant Support Desk"
      };
    case "Blue Dart Express Air":
      return {
        phone: "+91 22 2850 8900",
        email: "bluedart.security@bluedart.com",
        manager: "Amit Patel",
        depot: "Mumbai Cargo Terminal Gate 25",
        hours: "08:00 - 22:00 Daily"
      };
    case "Speed Post India":
      return {
        phone: "+91 1800 11 2011",
        email: "speedpost.tracking@indiapost.gov.in",
        manager: "Sanjay Kumar",
        depot: "New Delhi GPO Distribution Hub",
        hours: "09:00 - 18:00 Mon-Sat"
      };
    case "Correios SEDEX Express":
      return {
        phone: "+55 0800 725 0100",
        email: "sedex.escrow@correios.com.br",
        manager: "Lucas Silva",
        depot: "São Paulo Centro de Tratamento Jabaquara",
        hours: "08:00 - 20:00 Mon-Fri, 08:00 - 12:00 Sat"
      };
    case "Jadlog Logística":
      return {
        phone: "+55 (11) 3563-2000",
        email: "atendimento.jadlog@jadlog.com.br",
        manager: "Mariana Costa",
        depot: "Campinas Central de Cargas",
        hours: "08:00 - 18:00 Mon-Fri"
      };
    case "Loggi Tecnologia Motos":
      return {
        phone: "+55 (11) 4003-3162",
        email: "motos.suporte@loggi.com",
        manager: "Pedro Santos",
        depot: "São Paulo Pinheiros Express Hub",
        hours: "24/7 Delivery Despatches"
      };
    case "DHL Global Secure Air":
      return {
        phone: "+1 (800) 225-5345",
        email: "global.escrow@dhl.com",
        manager: "Hans Meyer",
        depot: "Leipzig Worldwide Air Hub, Germany",
        hours: "24/7 Enterprise Dedicated Care"
      };
    case "FedEx World Secure Express":
      return {
        phone: "+1 (800) 463-3339",
        email: "world.secure@fedex.com",
        manager: "Michael Chang",
        depot: "Memphis Global SuperHub, USA",
        hours: "24/7 Elite Client Desk"
      };
    case "UPS Worldwide Saver":
      return {
        phone: "+1 (800) 782-7892",
        email: "worldwide.saver@ups.com",
        manager: "Jessica Alba",
        depot: "Worldport Louisville Hub, Kentucky, USA",
        hours: "24/7 Worldwide Cargo Control"
      };
    default:
      return {
        phone: "0711935789",
        email: "mapstore2026@gmail.com",
        manager: "Standard MapStore Dispatch Coordinator",
        depot: "Local Cooperative Distribution Point",
        hours: "08:00 - 17:00 Mon-Fri"
      };
  }
}

const SELLER_COUNTRIES = [
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦' },
  { code: 'CN', name: 'China', flag: '🇨🇳' },
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'EU', name: 'Germany / European Union', flag: '🇪🇺' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷' }
];

const ALL_SEARCHABLE_COUNTRIES = [
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦' },
  { code: 'CN', name: 'China', flag: '🇨🇳' },
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'EU', name: 'Germany / European Union', flag: '🇪🇺' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱' },
  { code: 'CH', name: 'Switzerland', flag: '🇨🇭' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷' },
  { code: 'RU', name: 'Russia', flag: '🇷🇺' },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬' },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽' },
  { code: 'EG', name: 'Egypt', flag: '🇪🇬' },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪' },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷' },
  { code: 'CO', name: 'Colombia', flag: '🇨🇴' },
  { code: 'TR', name: 'Turkey', flag: '🇹🇷' },
  { code: 'NZ', name: 'New Zealand', flag: '🇳🇿' },
  { code: 'MY', name: 'Malaysia', flag: '🇲🇾' },
  { code: 'PH', name: 'Philippines', flag: '🇵🇭' },
  { code: 'ID', name: 'Indonesia', flag: '🇮🇩' },
  { code: 'VN', name: 'Vietnam', flag: '🇻🇳' },
  { code: 'TH', name: 'Thailand', flag: '🇹🇭' },
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦' },
  { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪' },
  { code: 'IE', name: 'Ireland', flag: '🇮🇪' },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹' },
  { code: 'DK', name: 'Denmark', flag: '🇩🇰' },
  { code: 'FI', name: 'Finland', flag: '🇫🇮' },
  { code: 'NO', name: 'Norway', flag: '🇳🇴' },
  { code: 'SE', name: 'Sweden', flag: '🇸🇪' },
  { code: 'PL', name: 'Poland', flag: '🇵🇱' },
  { code: 'GR', name: 'Greece', flag: '🇬🇷' },
  { code: 'AT', name: 'Austria', flag: '🇦🇹' },
  { code: 'BE', name: 'Belgium', flag: '🇧🇪' },
  { code: 'ZW', name: 'Zimbabwe', flag: '🇿🇼' },
  { code: 'IL', name: 'Israel', flag: '🇮🇱' }
];

interface SellerPortalProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  orders: Order[];
  addOrder?: (order: Order) => void;
  setOrders?: React.Dispatch<React.SetStateAction<Order[]>>;
  addNotification: (noti: Omit<PushNotification, 'id' | 'timestamp' | 'read'>) => void;
  darkMode: boolean;
  onOpenLegal: () => void;
  selectedRegion: RegionConfig;
  t: (key: string) => string;
  onOpenPitchDeck?: () => void;
  onOpenLetterhead?: () => void;
  onOpenBusinessPlan?: () => void;
  onOpenSupplierPitch?: () => void;
  langId?: string;
  p2pChats: P2PChatThread[];
  setP2pChats: React.Dispatch<React.SetStateAction<P2PChatThread[]>>;
}

const CATEGORIES = ['Electronics', 'Handcrafted', 'Local Organic Food'];

// Dynamic scannable shipping barcode
function CustomBarcode({ value }: { value: string }) {
  return (
    <div className="flex items-end justify-center gap-[2px] h-11 bg-white px-3 py-1 mt-1 rounded border border-gray-200" title={`Scannable Reference Barcode: ${value}`}>
      {Array.from({ length: 34 }).map((_, i) => {
        const charCode = value.charCodeAt(i % value.length) || 12;
        const width = (charCode % 3) + 1;
        const visible = charCode % 2 === 0;
        return (
          <div
            key={i}
            className={`h-full ${visible ? 'bg-zinc-950' : 'bg-transparent'}`}
            style={{ width: `${width}px` }}
          />
        );
      })}
    </div>
  );
}

export default function SellerPortal({
  products,
  setProducts,
  user,
  setUser,
  orders,
  addOrder,
  setOrders,
  addNotification,
  darkMode,
  onOpenLegal,
  selectedRegion,
  t,
  onOpenPitchDeck,
  onOpenLetterhead,
  onOpenBusinessPlan,
  onOpenSupplierPitch,
  langId = 'en',
  p2pChats,
  p2pChats: _p2pChats, // local alias to handle any duplicate mentions gracefully
  setP2pChats
}: SellerPortalProps) {
  // Setup local seller information
  const defaultSellerProfile = {
    storeName: `${user.name} Local Branch`,
    storeAddress: '777 Market St, San Francisco, CA 94103',
    verified: false,
    verificationStatus: 'idle' as const,
    verificationSubmittedAt: undefined,
    idDocumentName: '',
    proofOfAddressName: '',
    agreedToTerms: false,
    rating: 5.0,
    ratingCount: 1,
    prohibitedCheck: false,
    storeCountry: 'ZA'
  };

  const sellerProfile = user.sellerProfile || defaultSellerProfile;

  // Onboarding States
  const [storeNameInput, setStoreNameInput] = useState(sellerProfile.storeName);
  const [storeCountryInput, setStoreCountryInput] = useState(sellerProfile.storeCountry || 'ZA');
  const [storeCountrySearchQuery, setStoreCountrySearchQuery] = useState('');
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [storeAddressInput, setStoreAddressInput] = useState(sellerProfile.storeAddress || '777 Market St, San Francisco, CA 94103');
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  // Active Workspace tab
  const [selectedCourierAgentName, setSelectedCourierAgentName] = useState<string | null>(null);
  const [sellerSubTab, setSellerSubTab] = useState<'overview' | 'orders' | 'inventory' | 'chats'>('overview');
  const [activeMerchantThreadId, setActiveMerchantThreadId] = useState<string | null>(null);
  const [merchantReplyText, setMerchantReplyText] = useState('');
  const [selectedMailId, setSelectedMailId] = useState<string | null>(null);
  
  // Package Label states
  const [selectedOrderForLabel, setSelectedOrderForLabel] = useState<Order | null>(null);
  const [isSimulatingThermalPrint, setIsSimulatingThermalPrint] = useState(false);
  const [thermalPrintStep, setThermalPrintStep] = useState<'idle' | 'printing' | 'completed'>('idle');

  const [idFileName, setIdFileName] = useState('');
  const [addressFileName, setAddressFileName] = useState('');
  const [agreedToToS, setAgreedToToS] = useState(sellerProfile.agreedToTerms);
  const [noProhibitedChecked, setNoProhibitedChecked] = useState(sellerProfile.prohibitedCheck);
  const [isScanningID, setIsScanningID] = useState(false);
  const [idScanProgress, setIdScanProgress] = useState(0);
  const [idScanCompleted, setIdScanCompleted] = useState(false);

  // Listing Management state
  const [showAddForm, setShowAddForm] = useState(false);
  const [showCsvBulkPanel, setShowCsvBulkPanel] = useState(false);
  const [csvPreview, setCsvPreview] = useState<{
    createCount: number;
    updateCount: number;
    rows: any[];
    errors: string[];
  } | null>(null);
  const [isDraggingCsv, setIsDraggingCsv] = useState(false);

  // MERCHANT SEND CHAT MESSAGE
  const sendMerchantReply = (text: string) => {
    if (!activeMerchantThreadId || !text.trim()) return;

    const threadObj = p2pChats.find(t => t.id === activeMerchantThreadId);
    if (!threadObj) return;

    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const replyMsg: P2PChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: threadObj.sellerId,
      senderName: threadObj.sellerName,
      originalText: text.trim(),
      timestamp: timeString
    };

    // Auto-generate translations based on active seller profiles
    if (threadObj.sellerId === 'sell-alpha') {
      replyMsg.detectedLanguage = 'en';
      if (text.toLowerCase().includes('hello') || text.toLowerCase().includes('hi')) {
        replyMsg.translatedText = "您好！很高兴为您服务。";
      } else if (text.toLowerCase().includes('ok') || text.toLowerCase().includes('yes')) {
        replyMsg.translatedText = "好的，没问题。";
      } else {
        replyMsg.translatedText = "谢谢，我们会立即处理这项业务。";
      }
    } else if (threadObj.sellerId === 'sell-beta') {
      replyMsg.detectedLanguage = 'en';
      if (text.toLowerCase().includes('hello') || text.toLowerCase().includes('hi')) {
        replyMsg.translatedText = "Sawubona! Kuyajabulisa ukukusiza.";
      } else {
        replyMsg.translatedText = "Ngiyabonga, sizokwenza lokhu ngokushesha okukhulu.";
      }
    }

    const updatedThread: P2PChatThread = {
      ...threadObj,
      messages: [...threadObj.messages, replyMsg],
      lastMessageText: text.trim(),
      lastMessageTimestamp: timeString,
      unreadByBuyer: true
    };

    setP2pChats(prev => prev.map(t => t.id === activeMerchantThreadId ? updatedThread : t));
    setMerchantReplyText('');

    addNotification({
      title: '💬 Response Dispatched',
      message: `Direct reply successfully dispatched to buyer ${threadObj.buyerName}.`,
      type: 'chat'
    });
  };

  // MERCHANT ACTIONS ON CUSTOM BARTER OFFER (ACCEPTED/DECLINED)
  const handleOfferAction = (threadId: string, msgId: string, action: 'accepted' | 'declined') => {
    const threadObj = p2pChats.find(t => t.id === threadId);
    if (!threadObj) return;

    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setP2pChats(prev => prev.map(t => {
      if (t.id === threadId) {
        const offerPriceVal = t.messages.find(m => m.id === msgId)?.offerPrice || t.productPrice;

        const updatedMsgs = t.messages.map(m => {
          if (m.id === msgId) {
            return { ...m, offerStatus: action };
          }
          return m;
        });

        const responseText = action === 'accepted'
          ? `OFFER ACCEPTED: Price has been locked at ${selectedRegion.currencySymbol}${(offerPriceVal * selectedRegion.exchangeRate).toFixed(2)}. You can now purchase immediately.`
          : `OFFER DECLINED: Merchant was unable to support this price proposal. Please try another offer.`;

        const confirmationMsg: P2PChatMessage = {
          id: `conf-${Date.now()}`,
          senderId: t.sellerId,
          senderName: t.sellerName,
          originalText: responseText,
          timestamp: timeString
        };

        if (action === 'accepted') {
          setProducts(cur => cur.map(p => p.id === t.productId ? { ...p, price: offerPriceVal } : p));
        }

        return {
          ...t,
          messages: [...updatedMsgs, confirmationMsg],
          lastMessageText: responseText,
          lastMessageTimestamp: timeString,
          unreadByBuyer: true
        };
      }
      return t;
    }));

    addNotification({
      title: action === 'accepted' ? '🤝 Offer Approved & Locked' : '❌ Offer Declined',
      message: action === 'accepted'
        ? `You approved ${threadObj.buyerName}'s barter request. Catalog price has dropped.`
        : `Barter request declined.`,
      type: 'system'
    });
  };

  // Wallet & Cashout States
  const [withdrawnAmount, setWithdrawnAmount] = useState<number>(350);
  const [withdrawalHistory, setWithdrawalHistory] = useState([
    {
      id: 'WITH-99812',
      amount: 200,
      date: '2026-05-10 14:15',
      method: 'EFT South African Bank Transfer',
      destination: 'FNB Savings - Acc ending ****5643',
      status: 'Completed'
    },
    {
      id: 'WITH-99432',
      amount: 150,
      date: '2026-05-18 09:44',
      method: 'PayPal Payout Partner',
      destination: 'payments@mapstorebrand.co',
      status: 'Completed'
    }
  ]);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [withdrawInputAmount, setWithdrawInputAmount] = useState('');
  const [withdrawChannel, setWithdrawChannel] = useState('bank');
  const [withdrawAccountDetails, setWithdrawAccountDetails] = useState('');
  const [withdrawOtpGenerated, setWithdrawOtpGenerated] = useState('');
  const [withdrawOtpInput, setWithdrawOtpInput] = useState('');
  const [hasSentWithdrawOtp, setHasSentWithdrawOtp] = useState(false);
  const [chartMetric, setChartMetric] = useState<'sales' | 'profit' | 'orders'>('sales');

  const [newProduct, setNewProduct] = useState({
    title: '',
    description: '',
    price: '',
    category: 'Electronics',
    stock: '10',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400',
    latitude: '30.0', // mapped to Length (cm)
    longitude: '20.0', // mapped to Width (cm)
    height: '15.0', // mapped to Height (cm)
    videoUrl: '', // live proof of works or show video
    verifiedItem: false,
    originRegion: sellerProfile.storeCountry || 'ZA',
    shippedGlobally: true
  });

  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [photoError, setPhotoError] = useState<string | null>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setPhotoError(null);

    const validFiles = (Array.from(files) as File[]).filter(file => file.type.startsWith('image/'));
    if (validFiles.length < files.length) {
      setPhotoError('Only image files are accepted.');
    }

    const currentPhotosCount = uploadedPhotos.length;
    const availableSlots = 6 - currentPhotosCount;
    if (availableSlots <= 0) {
      setPhotoError('Maximum limit of 6 photos reached.');
      return;
    }

    const filesToProcess = validFiles.slice(0, availableSlots);
    if (validFiles.length > availableSlots) {
      setPhotoError(`Limit of 6 photos exceeded. Only the first ${availableSlots} files were added.`);
    }

    filesToProcess.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setUploadedPhotos(prev => {
            const updated = [...prev, event.target!.result as string];
            return updated.slice(0, 6);
          });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeUploadedPhoto = (index: number) => {
    setUploadedPhotos(prev => prev.filter((_, i) => i !== index));
  };

  // Video Recorder state hooks
  const [videoRecorderActive, setVideoRecorderActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordingTimerId, setRecordingTimerId] = useState<any>(null);
  const [cameraPermissionError, setCameraPermissionError] = useState<string | null>(null);

  const startRecordingVideo = async () => {
    try {
      setCameraPermissionError(null);
      const hostStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 480, height: 360, facingMode: 'user' },
        audio: true
      });
      setStream(hostStream);
      
      const options = { mimeType: 'video/webm;codecs=vp8,opus' };
      let rec: MediaRecorder;
      try {
        rec = new MediaRecorder(hostStream, options);
      } catch (e) {
        rec = new MediaRecorder(hostStream);
      }
      
      const chunks: Blob[] = [];
      rec.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunks.push(event.data);
        }
      };
      
      rec.onstop = () => {
        const completedBlob = new Blob(chunks, { type: 'video/webm' });
        const videoURL = URL.createObjectURL(completedBlob);
        setRecordedVideoUrl(videoURL);
        setNewProduct(prev => ({ ...prev, videoUrl: videoURL } as any));
      };
      
      rec.start(1000);
      setMediaRecorder(rec);
      setIsRecording(true);
      setRecordingSeconds(0);
      
      const interval = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
      setRecordingTimerId(interval);
    } catch (err: any) {
      console.error("Camera access failed", err);
      setCameraPermissionError("Could not access camera/microphone. Check frame permissions or click 'Showcase Real Video' below for real product demonstrations.");
    }
  };

  const stopRecordingVideo = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    }
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    if (recordingTimerId) {
      clearInterval(recordingTimerId);
    }
    setIsRecording(false);
    setStream(null);
    setMediaRecorder(null);
  };

  const simulateDemoVideo = () => {
    const realUrls = [
      "https://assets.mixkit.co/videos/preview/mixkit-coffee-maker-making-espresso-coffee-42352-large.mp4",
      "https://assets.mixkit.co/videos/preview/mixkit-unboxing-a-brand-new-smartphone-40453-large.mp4",
      "https://assets.mixkit.co/videos/preview/mixkit-putting-on-black-headphones-40448-large.mp4",
      "https://assets.mixkit.co/videos/preview/mixkit-spinning-a-mechanical-hand-watch-41586-large.mp4"
    ];
    const randUrl = realUrls[Math.floor(Math.random() * realUrls.length)];
    setRecordedVideoUrl(randUrl);
    setNewProduct(prev => ({ ...prev, videoUrl: randUrl } as any));
    addNotification({
      title: '🎥 Showcase Demo Active',
      message: 'A real high-quality demonstration video has been attached to show and demonstrate your product work.',
      type: 'system'
    });
  };

  const clearRecordedVideo = () => {
    if (recordedVideoUrl && recordedVideoUrl.startsWith('blob:')) {
      URL.revokeObjectURL(recordedVideoUrl);
    }
    setRecordedVideoUrl(null);
    setNewProduct(prev => ({ ...prev, videoUrl: '' } as any));
  };

  const downloadAllInvoicesPDF = () => {
    if (sellerOrders.length === 0) {
      addNotification({
        title: '⚠️ Export Unavailable',
        message: 'There are no active orders to process for batch generation.',
        type: 'system'
      });
      return;
    }

    try {
      const doc = new jsPDF();
      
      sellerOrders.forEach((ord, index) => {
        if (index > 0) {
          doc.addPage();
        }

        // Margins & Dimensions
        const margin = 15;
        const pageWidth = 210;
        let y = 20;

        // Subtle elegant border frame
        doc.setDrawColor(226, 232, 240); // slate-200
        doc.setLineWidth(0.3);
        doc.rect(margin - 4, margin - 4, pageWidth - (margin * 2) + 8, 267);

        // 1. Draw MapStore Logo Group
        const logoX = 22;
        const logoY = 22;
        doc.setFillColor(16, 185, 129); // emerald-500
        doc.circle(logoX, logoY, 2.5, 'F');
        for (let i = 0; i < 8; i++) {
          const angle = (i * 45 * Math.PI) / 180;
          const px = logoX + Math.cos(angle) * 5;
          const py = logoY + Math.sin(angle) * 5;
          doc.circle(px, py, 1.3, 'F');
        }

        // Header Text
        doc.setTextColor(15, 23, 42); // dark slate/zinc-900
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        doc.text('MapStore', 35, 21);
        
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(7);
        doc.setTextColor(100, 116, 139); // slate-500
        doc.text('REACHING YOU', 35, 25);

        // Title Right Align
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(13);
        doc.setTextColor(16, 185, 129); // emerald green
        doc.text('SECURE ESCROW INVOICE', 130, 20);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(100, 116, 139);
        doc.text(`Invoice Status: SECURED (ESCROW HOLD)`, 130, 25);

        // Thin separator
        y = 32;
        doc.setDrawColor(226, 232, 240); // slate-200
        doc.line(margin, y, pageWidth - margin, y);

        // 2. Order Metadata Information
        y = 40;
        doc.setFillColor(248, 250, 252); // slate-50
        doc.rect(margin, y, pageWidth - (margin * 2), 16, 'F');
        
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(51, 65, 85); // slate-700
        doc.text(`ORDER NUMBER:`, margin + 4, y + 6);
        doc.setFont('helvetica', 'normal');
        doc.text(ord.id, margin + 38, y + 6);

        doc.setFont('helvetica', 'bold');
        doc.text(`DATE GENERATED:`, margin + 4, y + 11);
        doc.setFont('helvetica', 'normal');
        doc.text(ord.timestamp || new Date().toLocaleString(), margin + 38, y + 11);

        doc.setFont('helvetica', 'bold');
        doc.text(`PAYMENT TYPE:`, 115, y + 6);
        doc.setFont('helvetica', 'normal');
        doc.text((ord.paymentType || '2FA Card Verify').toUpperCase(), 150, y + 6);

        doc.setFont('helvetica', 'bold');
        doc.text(`ESCROW COMPLIANT:`, 115, y + 11);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(16, 185, 129); // Green verification
        doc.text('YES (Platform Guaranteed)', 150, y + 11);

        // 3. Billing Addresses Block
        y = 66;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(15, 23, 42); // slate-900
        doc.text('BILL FROM (SELLER AUTHORIZED STORE)', margin, y);
        doc.text('BILL TO (RECIPIENT)', 115, y);

        const sellerAddr = ord.items[0]?.sellerId === 'sell-alpha' ? '888 Mission St, San Francisco, CA 94103' : ord.items[0]?.sellerId === 'sell-beta' ? '321 Canvas Way, San Francisco, CA 94102' : ord.items[0]?.sellerId === 'sell-gamma' ? '1042 Valencia St, San Francisco, CA 94110' : (storeAddressInput || 'Authorized Vendor Hub');
        const sellerDisplayName = ord.items[0]?.sellerName || sellerProfile.storeName || 'MapStore Partner';

        y = 72;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(51, 65, 85);
        doc.text(sellerDisplayName, margin, y);
        doc.text(ord.shippingAddress.fullName, 115, y);

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(71, 85, 105);
        
        // Multi-line address wraps safely
        const sellerSplit = doc.splitTextToSize(sellerAddr, 75);
        doc.text(sellerSplit, margin, y + 5);

        const buyerFullAddr = `${ord.shippingAddress.streetAddress}, ${ord.shippingAddress.city}, ${ord.shippingAddress.postalCode}`;
        const buyerSplit = doc.splitTextToSize(buyerFullAddr, 75);
        doc.text(buyerSplit, 115, y + 5);

        // Contact detail lines
        const addressLinesCount = Math.max(sellerSplit.length, buyerSplit.length);
        const contactY = y + 5 + (addressLinesCount * 4.5);
        doc.text(`Email: ${user.email}`, margin, contactY);
        doc.text(`Email: ${ord.buyerEmail || 'verified.buyer@mapstore.network'}`, 115, contactY);
        doc.text(`Phone: ${ord.shippingAddress.phone || 'Symmetric PIN Verified'}`, 115, contactY + 4);

        // Line separation
        y = contactY + 12;
        doc.setDrawColor(241, 245, 249);
        doc.line(margin, y, pageWidth - margin, y);

        // 4. Line Items Table Header
        y = y + 6;
        doc.setFillColor(241, 245, 249); // Header background
        doc.rect(margin, y, pageWidth - (margin * 2), 8, 'F');
        
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(51, 65, 85);
        doc.text('ITEM DESCRIPTION', margin + 3, y + 5.5);
        doc.text('QTY', 115, y + 5.5);
        doc.text('UNIT PRICE', 140, y + 5.5);
        doc.text('TOTAL AMOUNT', 170, y + 5.5);

        // Populate Items
        let currentItemY = y + 8;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(15, 23, 42);

        let invoiceSubtotal = 0;

        ord.items.forEach((item) => {
          const itemQty = item.quantity || 1;
          const itemExchangePrice = item.price * selectedRegion.exchangeRate;
          const itemExchangeTotal = itemExchangePrice * itemQty;
          invoiceSubtotal += itemExchangeTotal;

          currentItemY += 2;
          const titleSplit = doc.splitTextToSize(item.productTitle, 90);
          doc.text(titleSplit, margin + 3, currentItemY + 3);
          
          doc.text(String(itemQty), 115, currentItemY + 3);
          doc.text(`${selectedRegion.currencySymbol}${itemExchangePrice.toFixed(2)}`, 140, currentItemY + 3);
          doc.text(`${selectedRegion.currencySymbol}${itemExchangeTotal.toFixed(2)}`, 170, currentItemY + 3);

          const currentLineHeight = titleSplit.length * 4.5;
          currentItemY += currentLineHeight + 2;

          // Thin spacer
          doc.setDrawColor(248, 250, 252);
          doc.line(margin, currentItemY, pageWidth - margin, currentItemY);
        });

        // 5. Total and Escrow Commission summary
        currentItemY += 6;
        const calcCommission = invoiceSubtotal * 0.07;
        const netPayout = invoiceSubtotal - calcCommission;

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.2); // Reduced font size to prevent overlapping
        doc.setTextColor(100, 116, 139);
        doc.text('AGGREGATE AMOUNT:', 110, currentItemY);
        doc.setFont('helvetica', 'semibold');
        doc.setFontSize(8);
        doc.setTextColor(15, 23, 42);
        doc.text(`${selectedRegion.currencySymbol}${invoiceSubtotal.toFixed(2)}`, 172, currentItemY);

        currentItemY += 5;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.2); // Reduced font size to prevent overlapping
        doc.setTextColor(100, 116, 139);
        doc.text('ESCROW PLATFORM COMMISSION (7%):', 110, currentItemY);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(15, 23, 42);
        doc.text(`${selectedRegion.currencySymbol}${calcCommission.toFixed(2)}`, 172, currentItemY);

        currentItemY += 6;
        doc.setFillColor(236, 253, 245); // light green accent block
        doc.rect(108, currentItemY - 4, 87, 8, 'F');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.2); // Reduced font size to prevent overlapping
        doc.setTextColor(6, 95, 70); // deep green
        doc.text('NET RETAINED PAYOUT (93%):', 110, currentItemY + 1.5);
        doc.setFont('helvetica', 'black');
        doc.setFontSize(8.5);
        doc.text(`${selectedRegion.currencySymbol}${netPayout.toFixed(2)}`, 172, currentItemY + 1.5);

        // 6. Symmetrical Escrow Guarantee Footnote Banner
        const footnoteY = 242;
        doc.setFillColor(248, 250, 252);
        doc.rect(margin, footnoteY, pageWidth - (margin * 2), 26, 'F');
        doc.setDrawColor(16, 185, 129); // emerald border left
        doc.setLineWidth(1.5);
        doc.line(margin, footnoteY, margin, footnoteY + 26);
        doc.setLineWidth(0.2); // reset

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(15, 23, 42);
        doc.text('SYMMETRICAL ESCROW TRUST SAFETY ASSURANCE', margin + 4, footnoteY + 6);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(100, 116, 139);
        
        const disclaimerTxt = "This digital invoice constitutes proof of legal escrow custody holding. Under MapStore multi-signature smart assurance protocols, all financial clearances remain securely captured and held in physical/digital ledger reserve vaults. Funds release automatically to the verified seller 24 hours post successful touch-point delivery receipt confirmation unless active dispute claims are reported.";
        const disclaimerSplit = doc.splitTextToSize(disclaimerTxt, 170);
        doc.text(disclaimerSplit, margin + 4, footnoteY + 11);

        // Footer page index
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor(148, 163, 184); // slate-400
        doc.text(`Page ${index + 1} of ${sellerOrders.length}`, pageWidth / 2, 283, { align: 'center' });
      });

      // Save combined pdf stream filename
      const filename = `MapStore_Combined_Fulfillment_Invoices_${Date.now()}.pdf`;
      doc.save(filename);

      addNotification({
        title: '📈 Documents Exported Successfully',
        message: `Batch print sequence complete. Generated ${sellerOrders.length} combined escrow invoices stored inside "${filename}".`,
        type: 'system'
      });
    } catch (err: any) {
      console.error("PDF generation failed", err);
      addNotification({
        title: '❌ Export Error',
        message: 'A critical error occurred while structuring the PDF file. Please try again.',
        type: 'system'
      });
    }
  };

  // Calculate seller financial reports from global checks (7% commission logic)
  const sellerOrders = useMemo(() => {
    return orders.filter((order) =>
      order.items.some((item) => item.sellerId === 'sell-alpha' || item.sellerId === user.id)
    );
  }, [orders, user.id]);

  // Compute real e-mail notifications received by the active seller
  const sellerEmails = useMemo(() => {
    return sellerOrders.map(order => {
      const formattedTotal = `${selectedRegion.currencySymbol}${(order.totalPrice * selectedRegion.exchangeRate).toFixed(2)}`;
      return {
        id: `mail-${order.id}`,
        subject: `📨 [MapStore Escrow Alert] Secure Order Received - #${order.id}`,
        timestamp: order.timestamp,
        from: `no-reply@mapstore.com`,
        to: `${sellerProfile.storeName || 'Custom Store Branch'} <${user.email || 'seller@mapstore.com'}>`,
        body: `Hello ${sellerProfile.storeName || 'Custom Store Branch'},\n\nWe are pleased to inform you that a secure order #${order.id} has been registered successfully. The buyer has cleared secure 2FA payments. 100% of the funds have been captured and are held securely under the MapStore Escrow Guarantee System.\n\n==================================================\nORDER DETAILS SUMMARY:\n==================================================\nOrder Reference: ${order.id}\nBuyer Username: ${order.buyerName} (${order.buyerEmail})\nItems Ordered:\n${order.items.map(it => `  - ${it.productTitle} (x${it.quantity})`).join('\n')}\n\nAggregate Order Value: ${formattedTotal}\nPlatform Commission secured (7%): ${selectedRegion.currencySymbol}${(order.commissionTotal * selectedRegion.exchangeRate).toFixed(2)}\nYour Projected Net Retained Earning (93%): ${selectedRegion.currencySymbol}${((order.totalPrice - order.commissionTotal) * selectedRegion.exchangeRate).toFixed(2)}\n==================================================\n\nSHIPPING & DISPATCH INSTRUCTIONS:\n1. Open your MapStore Seller Workspace.\n2. Tap the "Order Management Hub" tab.\n3. Navigate to Active Fulfillment & Package Dispatches.\n4. Pull up your printable labels sheet to print both fulfillment slips.\n5. Affix the Exterior Packaging Slip securely to the parcel exterior.\n6. Enclose the Buyer Invoice Slip inside the shipment container.\n7. Hand off the package to one of the certified regional courier agents.\n\nIMPORTANT escrow policy safeguards:\nPayout balances will clear and unlock for domestic cashout withdrawals exactly 24 hours after the recipient confirms parcel receipt, provided no active returns dispute has been raised.\n\nThank you for choosing MapStore.\n"Reaching you"\nMapStore Logistics System Automatic daemon\nhttps://mapstore.com`,
        read: false
      };
    });
  }, [sellerOrders, sellerProfile.storeName, user.email, selectedRegion]);

  const financials = useMemo(() => {
    let totalRevenue = 0;
    let totalPlatformCommission = 0;
    let totalNetSellerResult = 0;
    let totalUnitsSold = 0;

    let clearedSellerNetInput = 0;
    let heldSellerNetInput = 0;

    let clearedMapStoreCommission = 0;
    let heldMapStoreCommission = 0;

    // Filter down transactions
    sellerOrders.forEach((o) => {
      // Timing calc
      const deliveryTime = o.deliveredAt ? new Date(o.deliveredAt).getTime() : 0;
      const hoursSinceDelivery = deliveryTime ? (Date.now() - deliveryTime) / (3600 * 1000) : 0;
      
      const isCleared = o.status === 'delivered' && hoursSinceDelivery >= 24 && !o.returnInitiated;
      const isCancelled = o.status === 'cancelled';

      o.items.forEach((item) => {
        if (item.sellerId === 'sell-alpha' || item.sellerId === user.id) {
          const itemRev = item.price * item.quantity;
          totalRevenue += itemRev;
          totalPlatformCommission += item.commissionAmount;
          totalNetSellerResult += item.netSellerAmount;
          totalUnitsSold += item.quantity;

          if (isCancelled) {
            // Cancelled orders are fully refunded to buyer
          } else if (isCleared) {
            clearedSellerNetInput += item.netSellerAmount;
            clearedMapStoreCommission += item.commissionAmount;
          } else {
            heldSellerNetInput += item.netSellerAmount;
            heldMapStoreCommission += item.commissionAmount;
          }
        }
      });
    });

    // If initial load doesn't have orders, add seed sales report indicators
    if (sellerOrders.length === 0) {
      totalRevenue = 1530.00;
      totalPlatformCommission = Number((1530.00 * 0.07).toFixed(2));
      totalNetSellerResult = Number((1530.00 - totalPlatformCommission).toFixed(2));
      totalUnitsSold = 24;
      clearedSellerNetInput = 1422.90;
      clearedMapStoreCommission = 107.10;
    }

    return {
      revenue: totalRevenue,
      commission: totalPlatformCommission,
      net: totalNetSellerResult,
      units: totalUnitsSold,
      clearedSellerNet: clearedSellerNetInput,
      heldSellerNet: heldSellerNetInput,
      clearedMapStore: clearedMapStoreCommission,
      heldMapStore: heldMapStoreCommission
    };
  }, [sellerOrders, user.id]);

  // Recharts Category colors matching our premium branding palette
  const CATEGORY_COLORS: { [key: string]: string } = useMemo(() => ({
    'Electronics': '#6366f1', // Indigo/violet
    'Handcrafted': '#10b981', // Emerald
    'Local Organic Food': '#06b6d4' // Cyan
  }), []);

  const categoryChartData = useMemo(() => {
    const counts: { [key: string]: number } = {};
    // Initialize with 0 to ensure categories are represented
    CATEGORIES.forEach(cat => {
      counts[cat] = 0;
    });

    if (sellerOrders.length === 0) {
      // Premium seed data for the pie chart corresponding to seed financials if no orders exist
      return [
        { name: 'Electronics', value: 650.00 },
        { name: 'Handcrafted', value: 500.00 },
        { name: 'Local Organic Food', value: 380.00 }
      ];
    }

    sellerOrders.forEach(order => {
      order.items.forEach(item => {
        if (item.sellerId === 'sell-alpha' || item.sellerId === user.id) {
          const itemVal = item.price * item.quantity;
          // Find category of matching product
          const prodObj = products.find(p => p.id === item.productId);
          const categoryName = prodObj?.category || 'Handcrafted';
          counts[categoryName] = (counts[categoryName] || 0) + itemVal;
        }
      });
    });

    const results = Object.keys(counts).map(key => ({
      name: key,
      value: Number(counts[key].toFixed(2))
    })).filter(item => item.value > 0);

    if (results.length === 0) {
      return [
        { name: 'Electronics', value: 650.00 },
        { name: 'Handcrafted', value: 500.00 },
        { name: 'Local Organic Food', value: 380.00 }
      ];
    }
    return results;
  }, [sellerOrders, products, user.id]);

  // Compute available wallet balance dynamically (Net earnings minus withdrawals)
  const availableBalance = useMemo(() => {
    return Math.max(0, financials.clearedSellerNet - withdrawnAmount);
  }, [financials.clearedSellerNet, withdrawnAmount]);

  // Chart data calculation
  const chartData = useMemo(() => {
    // 5 baseline historical periods representing continuous growth
    const basePoints = [
      { label: 'Week 1', sales: 250.00, orders: 4, profit: 232.50 },
      { label: 'Week 2', sales: 380.00, orders: 6, profit: 353.40 },
      { label: 'Week 3', sales: 210.00, orders: 3, profit: 195.30 },
      { label: 'Week 4', sales: 490.00, orders: 7, profit: 455.70 },
      { label: 'Week 5', sales: 320.00, orders: 5, profit: 297.60 }
    ];

    // Period 6: live sessions dynamic aggregates
    let liveSales = 0;
    let liveOrdersCount = 0;
    let liveProfit = 0;

    sellerOrders.forEach(order => {
      // Exclude orders that are cancelled
      if (order.status === 'cancelled') return;
      
      const isRelated = order.items.some(item => item.sellerId === 'sell-alpha' || item.sellerId === user.id);
      if (isRelated) {
        liveOrdersCount += 1;
        order.items.forEach(item => {
          if (item.sellerId === 'sell-alpha' || item.sellerId === user.id) {
            liveSales += item.price * item.quantity;
            liveProfit += item.netSellerAmount;
          }
        });
      }
    });

    // Fallback if no real-time transactions recorded yet to ensure beautiful initial state
    if (liveSales === 0) {
      liveSales = 320.00;
      liveOrdersCount = 4;
      liveProfit = 297.60;
    }

    return [
      ...basePoints,
      { label: 'Week 6 (Live)', sales: liveSales, orders: liveOrdersCount, profit: liveProfit }
    ];
  }, [sellerOrders, user.id]);

  const maxChartValue = useMemo(() => {
    const vals = chartData.map(d => {
      if (chartMetric === 'sales') return d.sales;
      if (chartMetric === 'profit') return d.profit;
      return d.orders;
    });
    const maxVal = Math.max(...vals);
    return maxVal > 0 ? maxVal * 1.25 : 100;
  }, [chartData, chartMetric]);

  const mappedPoints = useMemo(() => {
    const paddingLeft = 45;
    const paddingRight = 25;
    const chartHeight = 105; 
    const startY = 130;
    
    return chartData.map((d, idx) => {
      const val = chartMetric === 'sales' ? d.sales : (chartMetric === 'profit' ? d.profit : d.orders);
      const ratio = val / maxChartValue;
      const x = paddingLeft + (idx * (500 - paddingLeft - paddingRight) / (chartData.length - 1));
      const y = startY - (ratio * chartHeight);
      return { x, y, label: d.label, rawValue: val, ...d };
    });
  }, [chartData, chartMetric, maxChartValue]);

  const linePath = useMemo(() => {
    if (mappedPoints.length === 0) return '';
    let d = `M ${mappedPoints[0].x} ${mappedPoints[0].y}`;
    for (let i = 1; i < mappedPoints.length; i++) {
      const p = mappedPoints[i];
      const prev = mappedPoints[i - 1];
      const cp1x = prev.x + 30;
      const cp1y = prev.y;
      const cp2x = p.x - 30;
      const cp2y = p.y;
      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p.x} ${p.y}`;
    }
    return d;
  }, [mappedPoints]);

  const areaPath = useMemo(() => {
    if (mappedPoints.length === 0) return '';
    return `${linePath} L ${mappedPoints[mappedPoints.length - 1].x} 130 L ${mappedPoints[0].x} 130 Z`;
  }, [mappedPoints, linePath]);

  // Seller level filtered inventory
  const sellerInventory = useMemo(() => {
    return products.filter((p) => p.sellerId === 'sell-alpha' || p.sellerId === user.id);
  }, [products, user.id]);

  // Handle identity scan animation
  const startIdScan = () => {
    setIsScanningID(true);
    setIdScanProgress(0);
    const interval = setInterval(() => {
      setIdScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIdScanCompleted(true);
          setIsScanningID(false);
          setIdFileName(`MOCK_SCAN_NATIONAL_ID_${user.name.toUpperCase().replace(/\s+/g, '_')}.PNG`);
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  // Submit secure verification documents for admin audit
  const handleSubmitVerification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToToS || !noProhibitedChecked || !idFileName || !addressFileName) return;

    const updatedProfile = {
      ...sellerProfile,
      storeName: storeNameInput,
      storeAddress: storeAddressInput,
      storeCountry: storeCountryInput,
      verificationStatus: 'submitted' as const,
      verificationSubmittedAt: new Date().toLocaleString(),
      idDocumentName: idFileName,
      proofOfAddressName: addressFileName,
      agreedToTerms: agreedToToS,
      prohibitedCheck: noProhibitedChecked
    };

    setUser((prev) => ({
      ...prev,
      sellerProfile: updatedProfile,
    }));

    addNotification({
      title: 'Verification Request Received',
      message: 'Onboarding packet received. Security review scheduled for completion within 24 hours.',
      type: 'system',
    });
  };

  // PROTOTYPE OVERRIDE: Instant confirmation trigger
  const triggerInstantApprovalOverride = () => {
    const approvedProfile = {
      ...sellerProfile,
      storeName: storeNameInput || 'Mission local Branch',
      storeAddress: storeAddressInput,
      storeCountry: storeCountryInput,
      verified: true,
      verificationStatus: 'approved' as const,
      agreedToTerms: true,
      prohibitedCheck: true
    };

    setUser((prev) => ({
      ...prev,
      sellerProfile: approvedProfile,
    }));

    addNotification({
      title: '✅ Store Approved Instantly',
      message: `${approvedProfile.storeName} has successfully bypassed test verification bounds and can list now!`,
      type: 'system',
    });
  };

  // Wallet Payout and secure OTP validation handlers
  const handleProcessWithdrawal = (e: React.FormEvent) => {
    e.preventDefault();
    const withdrawAmt = Number(withdrawInputAmount);
    if (!withdrawAmt || withdrawAmt <= 0 || withdrawAmt > availableBalance) {
      addNotification({
        title: '⚠️ Cash-Out Failed',
        message: 'Invalid withdrawal amount specified. Please try again.',
        type: 'system'
      });
      return;
    }

    if (hasSentWithdrawOtp && withdrawOtpInput !== withdrawOtpGenerated) {
      addNotification({
        title: '⚠️ Security Error',
        message: 'The secure 2-Factor Authentication PIN code entered is incorrect.',
        type: 'system'
      });
      return;
    }

    // Process valid withdrawal
    setWithdrawnAmount(prev => prev + withdrawAmt);
    
    const newTx = {
      id: `WITH-${Math.floor(10000 + Math.random() * 90000)}`,
      amount: withdrawAmt,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      method: withdrawChannel === 'bank' ? 'EFT South African Bank Transfer' :
              withdrawChannel === 'paypal' ? 'PayPal Payout Partner' :
              withdrawChannel === 'momo' ? 'Mobile Money Phone Transfer' : 'USDT TRC-20 Blockchain Transfer',
      destination: withdrawAccountDetails || 'Local Branch Settlement Account',
      status: 'Completed' as const
    };

    setWithdrawalHistory(prev => [newTx, ...prev]);
    setIsWithdrawModalOpen(false);
    
    // Clear form
    setWithdrawInputAmount('');
    setWithdrawAccountDetails('');
    setWithdrawOtpInput('');
    setWithdrawOtpGenerated('');
    setHasSentWithdrawOtp(false);

    // Format localized display for and add notifications
    const formattedAmount = `${selectedRegion.currencySymbol}${(withdrawAmt * selectedRegion.exchangeRate).toFixed(2)}`;
    addNotification({
      title: '🌐 Cash-Out Dispatched Successfully',
      message: `Your withdrawal of ${formattedAmount} has been processed via ${newTx.method} to: ${newTx.destination}.`,
      type: 'system'
    });
  };

  const handleGenerateAndSendOtp = () => {
    const pin = Math.floor(1000 + Math.random() * 9000).toString();
    setWithdrawOtpGenerated(pin);
    setHasSentWithdrawOtp(true);
    addNotification({
      title: '🔑 Wallet Security Code',
      message: `Your secure cashout authorization PIN is: ${pin}. Enter this to authorize your payout.`,
      type: 'system'
    });
  };

  // Adding new verified listings
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const { title, description, price, stock, imageUrl, category, latitude, longitude, height, videoUrl, verifiedItem, originRegion, shippedGlobally } = newProduct as any;

    if (!title || !description || !price || !stock || !verifiedItem) return;

    const addedItem: Product = {
      id: `prod-${Date.now()}`,
      title,
      description,
      price: Number(price) / selectedRegion.exchangeRate,
      category,
      imageUrl: uploadedPhotos[0] || imageUrl || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400',
      images: uploadedPhotos.length > 0 ? uploadedPhotos : [imageUrl || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400'],
      stock: Number(stock),
      sellerId: user.id,
      sellerName: sellerProfile.storeName || `${user.name} Branch`,
      rating: 5.0,
      ratingCount: 0,
      latitude: Number(latitude),
      longitude: Number(longitude),
      height: Number(height || 15.0),
      videoUrl: videoUrl || '',
      verified: true,
      verifiedAt: new Date().toLocaleString(),
      tags: [category.toLowerCase(), 'verified-item'],
      originRegion,
      shippedGlobally
    };

    setProducts((prev) => [addedItem, ...prev]);
    setShowAddForm(false);
    setNewProduct({
      title: '',
      description: '',
      price: '',
      category: 'Electronics',
      stock: '10',
      imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400',
      latitude: '30.0',
      longitude: '20.0',
      height: '15.0',
      videoUrl: '',
      verifiedItem: false,
      originRegion: sellerProfile.storeCountry || 'ZA',
      shippedGlobally: true
    });

    setUploadedPhotos([]);
    setPhotoError(null);
    setRecordedVideoUrl(null);

    addNotification({
      title: 'New Product Registered',
      message: `${title} is now visible on MapStore and ready for buyer browsing.`,
      type: 'listing',
    });
  };

  const handleDeleteListing = (prodId: string) => {
    setProducts((prev) => prev.filter(p => p.id !== prodId));
    addNotification({
      title: 'Listing Removed',
      message: 'The requested product listing was completely deleted from client caches.',
      type: 'system',
    });
  };

  const parseCSV = (text: string): string[][] => {
    const lines: string[][] = [];
    let row: string[] = [""];
    let inQuotes = false;
    
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      const next = text[i+1];
      
      if (c === '"') {
        if (inQuotes && next === '"') {
          row[row.length - 1] += '"';
          i++; // skip next double quote
        } else {
          inQuotes = !inQuotes;
        }
      } else if (c === ',' && !inQuotes) {
        row.push("");
      } else if ((c === '\r' || c === '\n') && !inQuotes) {
        if (c === '\r' && next === '\n') {
          i++;
        }
        lines.push(row);
        row = [""];
      } else {
        row[row.length - 1] += c;
      }
    }
    if (row.length > 1 || row[0] !== "") {
      lines.push(row);
    }
    return lines;
  };

  const processCSVText = (text: string) => {
    const rawRows = parseCSV(text);
    if (rawRows.length < 2) {
      addNotification({
        title: '⚠️ Invalid CSV File',
        message: 'The uploaded file does not contain enough rows or is empty.',
        type: 'system'
      });
      return;
    }

    const headers = rawRows[0].map(h => h.trim().toLowerCase());
    
    // Find column indexes dynamically
    const idIdx = headers.findIndex(h => h === 'id' || h === 'productid' || h === 'uuid');
    const titleIdx = headers.findIndex(h => h === 'title' || h === 'name' || h === 'productname');
    const descIdx = headers.findIndex(h => h === 'description' || h === 'desc');
    const priceIdx = headers.findIndex(h => h === 'price' || h === 'cost' || h === 'rate');
    const catIdx = headers.findIndex(h => h === 'category' || h === 'cat');
    const stockIdx = headers.findIndex(h => h === 'stock' || h === 'qty' || h === 'quantity' || h === 'count');
    const imageIdx = headers.findIndex(h => h === 'imageurl' || h === 'image' || h === 'img' || h === 'pic');
    const widthIdx = headers.findIndex(h => h === 'width_cm' || h === 'width' || h === 'longitude' || h === 'long');
    const lengthIdx = headers.findIndex(h => h === 'length_cm' || h === 'length' || h === 'latitude' || h === 'lat');
    const heightIdx = headers.findIndex(h => h === 'height_cm' || h === 'height');
    const videoIdx = headers.findIndex(h => h === 'videourl' || h === 'video');
    const globalIdx = headers.findIndex(h => h === 'global_shipping' || h === 'global' || h === 'shippedglobally');

    let createCount = 0;
    let updateCount = 0;
    const parsedRows: any[] = [];
    const errors: string[] = [];

    for (let i = 1; i < rawRows.length; i++) {
      const row = rawRows[i];
      if (row.length === 0 || (row.length === 1 && row[0].trim() === '')) {
        continue; // skip blank rows
      }

      const idVal = idIdx !== -1 && row[idIdx] ? row[idIdx].trim() : '';
      const rawTitle = titleIdx !== -1 && row[titleIdx] ? row[titleIdx].trim() : '';
      const rawDesc = descIdx !== -1 && row[descIdx] ? row[descIdx].trim() : '';
      const rawPrice = priceIdx !== -1 && row[priceIdx] ? row[priceIdx].trim() : '';
      const rawCat = catIdx !== -1 && row[catIdx] ? row[catIdx].trim() : 'Handcrafted';
      const rawStock = stockIdx !== -1 && row[stockIdx] ? row[stockIdx].trim() : '10';
      const rawImg = imageIdx !== -1 && row[imageIdx] ? row[imageIdx].trim() : 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400';
      const rawWidth = widthIdx !== -1 && row[widthIdx] ? row[widthIdx].trim() : '20.0';
      const rawLength = lengthIdx !== -1 && row[lengthIdx] ? row[lengthIdx].trim() : '30.0';
      const rawHeight = heightIdx !== -1 && row[heightIdx] ? row[heightIdx].trim() : '15.0';
      const rawVideo = videoIdx !== -1 && row[videoIdx] ? row[videoIdx].trim() : '';
      const rawGlobal = globalIdx !== -1 && row[globalIdx] ? row[globalIdx].trim().toUpperCase() : 'TRUE';

      const rowNum = i + 1;
      let rowError = '';

      if (!rawTitle) {
        rowError = `Row ${rowNum}: Title is missing.`;
      } else if (!rawDesc) {
        rowError = `Row ${rowNum}: Description is missing.`;
      } else if (!rawPrice || isNaN(Number(rawPrice)) || Number(rawPrice) < 0) {
        rowError = `Row ${rowNum}: Price "${rawPrice}" must be a valid positive number.`;
      } else if (!rawStock || isNaN(Number(rawStock)) || Number(rawStock) < 0) {
        rowError = `Row ${rowNum}: Stock "${rawStock}" must be a valid positive number.`;
      }

      if (rowError) {
        errors.push(rowError);
      }

      const isUpdate = !!idVal && products.some(p => p.id === idVal);
      if (isUpdate) {
        updateCount++;
      } else {
        createCount++;
      }

      const priceLocalVal = Number(rawPrice) || 0;
      const priceUSDVal = priceLocalVal / selectedRegion.exchangeRate;

      parsedRows.push({
        action: isUpdate ? 'update' : 'create',
        id: idVal,
        title: rawTitle,
        description: rawDesc,
        priceLocal: priceLocalVal,
        priceUSD: priceUSDVal,
        category: CATEGORIES.includes(rawCat) ? rawCat : 'Handcrafted',
        stock: parseInt(rawStock, 10) || 0,
        imageUrl: rawImg,
        longitude: Number(rawWidth) || 20.0,
        latitude: Number(rawLength) || 30.0,
        height: Number(rawHeight) || 15.0,
        videoUrl: rawVideo,
        shippedGlobally: rawGlobal === 'TRUE' || rawGlobal === 'YES' || rawGlobal === '1',
        rowNumber: rowNum,
        validationError: rowError || undefined
      });
    }

    setCsvPreview({
      createCount,
      updateCount,
      rows: parsedRows,
      errors
    });
  };

  const handleCommitCSVImport = () => {
    if (!csvPreview || csvPreview.rows.length === 0) return;

    const validRows = csvPreview.rows.filter(r => !r.validationError);
    if (validRows.length === 0) {
      addNotification({
        title: '⚠️ Commit Blocked',
        message: 'All parsed rows have validation errors. Correct them and try again.',
        type: 'system'
      });
      return;
    }

    setProducts((prev) => {
      let updatedList = [...prev];

      validRows.forEach((row) => {
        if (row.action === 'update' && row.id) {
          updatedList = updatedList.map((item) => {
            if (item.id === row.id) {
              return {
                ...item,
                title: row.title,
                description: row.description,
                price: row.priceUSD,
                category: row.category,
                stock: row.stock,
                imageUrl: row.imageUrl,
                longitude: row.longitude,
                latitude: row.latitude,
                height: row.height,
                videoUrl: row.videoUrl,
                shippedGlobally: row.shippedGlobally,
                verified: true,
                verifiedAt: new Date().toLocaleString()
              };
            }
            return item;
          });
        } else {
          const newItem: Product = {
            id: row.id || `prod-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
            title: row.title,
            description: row.description,
            price: row.priceUSD,
            category: row.category,
            imageUrl: row.imageUrl,
            stock: row.stock,
            sellerId: user.id,
            sellerName: sellerProfile.storeName || `${user.name} Branch`,
            rating: 5.0,
            ratingCount: 0,
            latitude: row.latitude,
            longitude: row.longitude,
            height: row.height,
            videoUrl: row.videoUrl,
            verified: true,
            verifiedAt: new Date().toLocaleString(),
            tags: [row.category.toLowerCase(), 'verified-item', 'bulk-uploaded'],
            originRegion: sellerProfile.storeCountry || 'ZA',
            shippedGlobally: row.shippedGlobally
          };
          updatedList.unshift(newItem);
        }
      });

      return updatedList;
    });

    addNotification({
      title: '📈 Bulk Commit Success',
      message: `Successfully processed ${validRows.length} total product commits (Created: ${validRows.filter(r => r.action === 'create').length}, Updated: ${validRows.filter(r => r.action === 'update').length}).`,
      type: 'listing'
    });

    setCsvPreview(null);
    setShowCsvBulkPanel(false);
  };

  const handleExportCatalogCSV = () => {
    const headers = ['id', 'title', 'description', 'price', 'category', 'stock', 'imageUrl', 'width_cm', 'length_cm', 'height_cm', 'videoUrl', 'global_shipping'];
    const rows = sellerInventory.map(item => [
      item.id,
      `"${item.title.replace(/"/g, '""')}"`,
      `"${item.description.replace(/"/g, '""')}"`,
      (item.price * selectedRegion.exchangeRate).toFixed(2),
      item.category,
      item.stock,
      item.imageUrl,
      item.longitude,
      item.latitude,
      item.height || 15,
      item.videoUrl || '',
      item.shippedGlobally ? 'TRUE' : 'FALSE'
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `MapStore_Catalog_${sellerProfile.storeName.replace(/\s+/g, '_')}_Export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addNotification({
      title: '📤 Catalog Exported',
      message: 'Your current product catalog has been successfully downloaded as a CSV file.',
      type: 'system'
    });
  };

  // Mock document selector upload triggers
  const triggerAddressDocMock = () => {
    setAddressFileName(`UTILITIES_BILL_VERIFIED_${Date.now().toString().slice(-4)}.PDF`);
  };

  return (
    <Translate langId={langId}>
      <div className="space-y-6 font-sans" id="seller-portal-root">
      {/* 1. Onboarding & Verification center if not validated and verified */}
      {!sellerProfile.verified ? (
        <div className="bg-white dark:bg-zinc-950 rounded-3xl p-6 border border-gray-100 dark:border-zinc-800 shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-100 dark:border-zinc-900">
            <div>
              <h2 className="text-xl font-extrabold text-[#5eead4] dark:text-[#4ade80] flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 animate-pulse" /> MapStore Seller Verification Hub
              </h2>
              <p className="text-xs text-gray-500 mt-1">Sellers undergo ID scanner checks and address audits within 24 hours.</p>
            </div>
            {/* Direct Admin Bypass for prototype testers */}
            <button
              onClick={triggerInstantApprovalOverride}
              className="bg-emerald-500 hover:bg-emerald-600 font-extrabold text-white text-xs px-4.5 py-2.5 rounded-2xl flex items-center gap-1.5 cursor-pointer shadow-md self-start"
              id="btn-admin-override"
            >
              PROTOTYPE OVERRIDE: Instant Admin Approval
            </button>
          </div>

          {sellerProfile.verificationStatus === 'submitted' ? (
            <div className="p-8 text-center bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-dashed border-gray-200 dark:border-zinc-805 space-y-4">
              <div className="w-14 h-14 bg-amber-50 dark:bg-zinc-950 text-amber-500 rounded-full flex items-center justify-center mx-auto animate-bounce">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">Store Application Under Review</h3>
                <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                  Your ID scanner document and utilities proof are in the queue. Our trust team handles records within 24 hours.
                </p>
                <p className="text-[10px] text-zinc-500 mt-4 italic">
                  Submitted At: {sellerProfile.verificationSubmittedAt}
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmitVerification} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">Store Branch Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mission Organic Corner"
                    value={storeNameInput}
                    onChange={(e) => setStoreNameInput(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-3 text-sm text-gray-800 dark:text-white"
                  />
                </div>
                <div className="relative">
                  {isCountryDropdownOpen && (
                    <div className="fixed inset-0 z-40" onClick={() => setIsCountryDropdownOpen(false)}></div>
                  )}
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">Store Country Location</label>
                  <div className="relative z-50">
                    <input
                      type="text"
                      placeholder="🔍 Search or type country..."
                      value={storeCountrySearchQuery !== '' ? storeCountrySearchQuery : (ALL_SEARCHABLE_COUNTRIES.find(c => c.code === storeCountryInput)?.name || storeCountryInput || '')}
                      onChange={(e) => {
                        const val = e.target.value;
                        setStoreCountrySearchQuery(val);
                        setStoreCountryInput(val); // registers typed custom values as custom entries!
                        setIsCountryDropdownOpen(true);
                      }}
                      onFocus={() => setIsCountryDropdownOpen(true)}
                      className="w-full bg-zinc-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-3 text-xs text-gray-850 dark:text-zinc-200 font-bold focus:outline-hidden"
                    />
                    {isCountryDropdownOpen && (
                      <div className="absolute left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl shadow-lg z-50 divide-y divide-gray-100 dark:divide-zinc-900">
                        {(() => {
                          const query = (storeCountrySearchQuery || '').toLowerCase().trim();
                          const matches = ALL_SEARCHABLE_COUNTRIES.filter(c => 
                            c.name.toLowerCase().includes(query) || 
                            c.code.toLowerCase().includes(query)
                          );
                          
                          return (
                            <>
                              {matches.map((c) => (
                                <div
                                  key={c.code}
                                  onClick={() => {
                                    setStoreCountryInput(c.code);
                                    setStoreCountrySearchQuery(c.name);
                                    setIsCountryDropdownOpen(false);
                                  }}
                                  className="p-2 text-xs hover:bg-zinc-100 dark:hover:bg-zinc-900 cursor-pointer text-left text-gray-800 dark:text-zinc-200 font-sans font-bold flex items-center gap-2"
                                >
                                  <span>{c.flag}</span>
                                  <span>{c.name} ({c.code})</span>
                                </div>
                              ))}
                              
                              {query.length > 0 && !matches.some(c => c.name.toLowerCase() === query) && (
                                <div
                                  onClick={() => {
                                    setStoreCountryInput(storeCountrySearchQuery);
                                    setIsCountryDropdownOpen(false);
                                  }}
                                  className="p-2 text-xs hover:bg-zinc-100 dark:hover:bg-zinc-900 cursor-pointer text-left text-emerald-500 font-sans font-bold flex items-center gap-2"
                                >
                                  <span>🌐</span>
                                  <span>Use Custom: "{storeCountrySearchQuery}"</span>
                                </div>
                              )}
                            </>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                  <span className="text-[9px] text-zinc-400 block mt-1">Select a listed country, search, or type any custom country name.</span>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">Store Fulfillment Address</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 777 Market St, San Francisco, CA"
                    value={storeAddressInput}
                    onChange={(e) => setStoreAddressInput(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-3 text-sm text-gray-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">Registered Owner Email</label>
                  <input
                    type="text"
                    disabled
                    value={user.email}
                    className="w-full bg-zinc-100 dark:bg-zinc-900 opacity-60 rounded-xl p-3 text-sm font-mono"
                  />
                </div>
              </div>

              {/* ID Scanner Section simulating webcam scanner */}
              <div className="bg-zinc-50 dark:bg-zinc-900 p-5 rounded-2xl border border-gray-150 dark:border-zinc-800 space-y-4">
                <div className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white pb-3 border-b border-gray-100 dark:border-zinc-800">
                  <Scan className="w-5 h-5 text-emerald-400" />
                  <h4>Step 1: Identity Scanner Calibration</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                  <div className="h-40 bg-black rounded-xl border border-[#5eead4]/30 relative overflow-hidden flex flex-col items-center justify-center text-center">
                    {isScanningID ? (
                      <div className="absolute inset-0 bg-[#5eead4]/10 flex flex-col items-center justify-center space-y-2">
                        <Camera className="w-8 h-8 text-emerald-400 animate-pulse" />
                        <span className="text-[10px] text-emerald-400 font-mono">CALIBRATING: {idScanProgress}%</span>
                        <div className="w-4/5 h-1 bg-zinc-800 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-400 transition-all" style={{ width: `${idScanProgress}%` }}></div>
                        </div>
                      </div>
                    ) : idScanCompleted ? (
                      <div className="text-center space-y-2">
                        <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                        <span className="text-[10px] text-emerald-500 font-mono uppercase font-bold tracking-widest block">ID Scanner Lock Secured</span>
                      </div>
                    ) : (
                      <div className="text-center space-y-1 p-3">
                        <Camera className="w-7 h-7 text-zinc-500 mx-auto" />
                        <p className="text-[11px] text-gray-400 font-semibold">Webcam Viewfinder</p>
                        <p className="text-[9px] text-zinc-500">Hold your passport or state-id card steady inside the frame coordinates.</p>
                      </div>
                    )}
                    {/* Viewfinder brackets overlay */}
                    <div className="absolute inset-4 border border-dashed border-emerald-400/40 rounded-lg pointer-events-none"></div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-xs text-gray-500 leading-relaxed">
                      Our automated ledger processes security scanner images to cross-reference matching records instantaneously within 24 hours.
                    </p>
                    <button
                      type="button"
                      onClick={startIdScan}
                      disabled={isScanningID}
                      className="w-full bg-[#121214] hover:bg-black text-white text-xs font-bold py-2.5 rounded-xl cursor-pointer transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Scan className="w-4 h-4" /> {idScanCompleted ? "Recalibrate Scanner" : "Trigger Live OCR ID Scan"}
                    </button>
                    {idFileName && (
                      <div className="text-[10px] font-mono bg-emerald-50 dark:bg-zinc-950 p-2 rounded-lg border border-emerald-100 dark:border-emerald-900 inline-block text-emerald-600">
                        📁 Scanned File: {idFileName}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Step 2: Proof of Address File picker */}
              <div className="bg-zinc-50 dark:bg-zinc-900 p-5 rounded-2xl border border-gray-150 dark:border-zinc-800 space-y-4">
                <div className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white pb-3 border-b border-gray-100 dark:border-zinc-850">
                  <Upload className="w-5 h-5 text-emerald-400" />
                  <h4>Step 2: Proof of Address upload</h4>
                </div>

                <div className="flex flex-col items-center justify-center p-6 bg-white dark:bg-zinc-950 border border-dashed border-gray-200 dark:border-zinc-800 rounded-xl text-center">
                  <Upload className="w-8 h-8 text-gray-400 mb-2 animate-bounce" />
                  <p className="text-xs text-gray-500 font-medium mb-1">Select / Drag mock Utility Bill or Bank Statement</p>
                  <p className="text-[10px] text-zinc-400 pb-4">Valid documents clearly detailing owner name and matching store coordinates.</p>

                  <button
                    type="button"
                    onClick={triggerAddressDocMock}
                    className="bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 text-gray-700 dark:text-zinc-200 text-[10px] font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    Select Mock PDF Document
                  </button>

                  {addressFileName && (
                    <div className="mt-3 text-[10px] font-mono bg-emerald-50 dark:bg-zinc-900 p-2 rounded-lg text-emerald-600 border border-emerald-100 dark:border-zinc-800">
                      📄 Loaded: {addressFileName}
                    </div>
                  )}
                </div>
              </div>

              {/* Verification platform Policies Agreement checks */}
              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-2.5">
                  <input
                    type="checkbox"
                    id="chk-prohibited"
                    checked={noProhibitedChecked}
                    onChange={(e) => setNoProhibitedChecked(e.target.checked)}
                    className="mt-1 accent-emerald-500 h-4 w-4 cursor-pointer"
                  />
                  <label htmlFor="chk-prohibited" className="text-xs text-gray-600 dark:text-zinc-300 leading-relaxed cursor-pointer selection:bg-emerald-500">
                    I verify and agree that my listed products will not contain <strong>Prohibited Items</strong> (vaping, weapons, drugs, or pirated goods) as detailed under general platform bylaws.
                  </label>
                </div>
                <div className="flex items-start gap-2.5">
                  <input
                    type="checkbox"
                    id="chk-termsofservice"
                    checked={agreedToToS}
                    onChange={(e) => setAgreedToToS(e.target.checked)}
                    className="mt-1 accent-emerald-500 h-4 w-4 cursor-pointer"
                  />
                  <label htmlFor="chk-termsofservice" className="text-xs text-gray-600 dark:text-zinc-300 leading-relaxed cursor-pointer selection:bg-emerald-500">
                    I agree to the MapStore <button type="button" onClick={onOpenLegal} className="text-emerald-500 underline font-bold hover:text-emerald-400">Terms of Service</button> and authorize that MapStore collects a flat <strong>7% commission</strong> upon product sales.
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={!agreedToToS || !noProhibitedChecked || !idFileName || !addressFileName}
                className="w-full bg-emerald-505 bg-emerald-500 hover:bg-emerald-600 disabled:bg-zinc-100 disabled:text-zinc-400 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-2xl text-xs transition-colors cursor-pointer text-center"
              >
                Submit Documents for Review (24-Hour Wait)
              </button>
            </form>
          )}
        </div>
      ) : (
        /* Verified Sellers dashboard interface */
        <div className="space-y-6" id="seller-dashboard-panel">
          {/* Sub-tab Navigation Swapper */}
          <div className="flex border-b border-gray-100 dark:border-zinc-800 pb-px overflow-x-auto gap-1">
            <button
              onClick={() => setSellerSubTab('overview')}
              className={`pb-3 px-4 text-xs font-bold font-sans transition-all shrink-0 cursor-pointer relative ${
                sellerSubTab === 'overview'
                  ? 'text-emerald-500 border-b-2 border-emerald-500'
                  : 'text-gray-400 hover:text-gray-650 dark:hover:text-zinc-200'
              }`}
            >
              📊 Performance Overview
            </button>
            <button
              onClick={() => setSellerSubTab('orders')}
              className={`pb-3 px-4 text-xs font-bold font-sans transition-all shrink-0 cursor-pointer relative ${
                sellerSubTab === 'orders'
                  ? 'text-emerald-500 border-b-2 border-emerald-500'
                  : 'text-gray-400 hover:text-gray-650 dark:hover:text-zinc-200'
              }`}
              id="tab-order-management"
            >
              📦 Order Management Hub
              {sellerOrders.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 bg-emerald-500 text-white dark:text-black rounded-full text-[9px] font-mono font-bold">
                  {sellerOrders.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setSellerSubTab('inventory')}
              className={`pb-3 px-4 text-xs font-bold font-sans transition-all shrink-0 cursor-pointer relative ${
                sellerSubTab === 'inventory'
                  ? 'text-emerald-500 border-b-2 border-emerald-500'
                  : 'text-gray-400 hover:text-gray-650 dark:hover:text-zinc-200'
              }`}
            >
              🏷️ Inventory & Listings
            </button>
            <button
              onClick={() => setSellerSubTab('chats')}
              className={`pb-3 px-4 text-xs font-bold font-sans transition-all shrink-0 cursor-pointer relative ${
                sellerSubTab === 'chats'
                  ? 'text-emerald-500 border-b-2 border-emerald-500'
                  : 'text-gray-400 hover:text-gray-650 dark:hover:text-zinc-200'
              }`}
            >
              💬 Negotiations & Barters
              {p2pChats.some(thread => thread.messages[thread.messages.length - 1]?.senderId !== user.id) && (
                <span className="ml-1 px-1.5 py-0.5 bg-red-450 text-white rounded-full text-[9px] font-bold animate-pulse">
                  NEW
                </span>
              )}
            </button>
          </div>

          {/* 1. OVERVIEW SCREEN COMPOSANTS */}
          {sellerSubTab === 'overview' && (
            <>
              {/* Dashboard Hub Analytics banners */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-4 sm:p-5 rounded-2xl shadow-xs">
              <div className="flex justify-between items-start mb-2">
                <div className="text-zinc-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider">Gross Sales</div>
                <div className="p-1 sm:p-1.5 bg-emerald-50 dark:bg-zinc-950 text-emerald-500 rounded-lg">
                  <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
              </div>
              <div className="text-base sm:text-2xl font-extrabold text-gray-900 dark:text-white">{selectedRegion.currencySymbol}{(financials.revenue * selectedRegion.exchangeRate).toFixed(2)}</div>
              <span className="text-[9px] sm:text-[10px] text-gray-450 mt-1 block">Account gross revenue</span>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-4 sm:p-5 rounded-2xl shadow-xs">
              <div className="flex justify-between items-start mb-2">
                <div className="text-zinc-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider">Platform Fee (7%)</div>
                <div className="p-1 sm:p-1.5 bg-rose-50 dark:bg-zinc-950 text-rose-500 rounded-lg">
                  <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
              </div>
              <div className="text-base sm:text-2xl font-extrabold text-rose-500">-{selectedRegion.currencySymbol}{(financials.commission * selectedRegion.exchangeRate).toFixed(2)}</div>
              <span className="text-[9px] sm:text-[10px] text-gray-450 mt-1 block">Platform commission accounted</span>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-4 sm:p-5 rounded-2xl shadow-xs border-l-2 border-l-cyan-400">
              <div className="flex justify-between items-start mb-2">
                <div className="text-cyan-550 text-cyan-500 text-[10px] sm:text-xs font-bold uppercase tracking-wider">All-Time Net (93%)</div>
                <div className="p-1 sm:p-1.5 bg-cyan-50 dark:bg-zinc-950 text-cyan-500 rounded-lg">
                  <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
              </div>
              <div className="text-base sm:text-2xl font-extrabold text-gray-900 dark:text-white">{selectedRegion.currencySymbol}{(financials.net * selectedRegion.exchangeRate).toFixed(2)}</div>
              <span className="text-[9px] sm:text-[10px] text-gray-450 mt-1 block">Accumulated net payout earnings</span>
            </div>

            <div className="bg-white dark:bg-zinc-900 border-l-2 border-l-emerald-500 border border-gray-100 dark:border-zinc-800 p-4 sm:p-5 rounded-2xl shadow-md flex flex-col justify-between relative group overflow-hidden border-l-emerald-500">
              <div>
                <div className="flex justify-between items-start mb-1.5">
                  <div className="text-emerald-500 text-[9px] sm:text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1">
                    <Wallet className="w-3.5 h-3.5" /> MapStore Wallet Balance
                  </div>
                  <span className="text-[8px] sm:text-[9px] bg-emerald-500/15 text-emerald-500 py-0.5 px-1.5 rounded-full font-mono font-extrabold uppercase animate-pulse">
                    Withdrawable
                  </span>
                </div>
                <div className="text-base sm:text-2xl font-black text-emerald-500">
                  {selectedRegion.currencySymbol}{(availableBalance * selectedRegion.exchangeRate).toFixed(2)}
                </div>
                <span className="text-[9px] sm:text-[10px] text-zinc-400 block mt-0.5">Available cash ready for transfer</span>
              </div>
              <button
                onClick={() => {
                  setWithdrawInputAmount(availableBalance.toFixed(2));
                  setIsWithdrawModalOpen(true);
                }}
                disabled={availableBalance <= 0}
                className="mt-2.5 sm:mt-3.5 w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-zinc-100 dark:disabled:bg-zinc-950 disabled:text-zinc-400 dark:disabled:text-zinc-600 text-white text-[9px] sm:text-[10.5px] font-extrabold py-1.5 sm:py-2 px-2 sm:px-3 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer select-none"
              >
                <ArrowDownRight className="w-4 h-4" /> Cash Out
              </button>
            </div>
          </div>

          {/* Real-time Escrow Hold and MapStore Wallet Clearances Audit Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-zinc-50 dark:bg-zinc-955 p-5 rounded-3xl border border-gray-150 dark:border-zinc-850">
            {/* Seller Account Ledger */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
                  <Wallet className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-gray-900 dark:text-zinc-100 font-sans">Seller Merchant Wallet Payouts</h4>
                  <span className="text-[10px] text-zinc-500 block">Deducted platform fee: 7% included</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-white dark:bg-zinc-900 p-3 rounded-2xl border border-gray-100 dark:border-zinc-800">
                <div>
                  <span className="text-[9px] uppercase font-bold text-zinc-400 block mb-0.5">Cleared Net Balance</span>
                  <p className="text-lg font-black text-emerald-500">
                    {selectedRegion.currencySymbol}{((financials.clearedSellerNet) * selectedRegion.exchangeRate).toFixed(2)}
                  </p>
                  <span className="text-[8px] text-zinc-500 block mt-0.5 leading-snug">Delivered &gt; 24h. Unlocked for withdrawal.</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-zinc-450 block mb-0.5 font-sans">Escrow Hold Balance</span>
                  <p className="text-lg font-black text-blue-500 font-sans">
                    {selectedRegion.currencySymbol}{(financials.heldSellerNet * selectedRegion.exchangeRate).toFixed(2)}
                  </p>
                  <span className="text-[8px] text-zinc-500 block mt-0.5 leading-snug font-sans font-medium">Pre-delivery, &lt; 24h post-delivery, or disputed return.</span>
                </div>
              </div>
              <p className="text-[10.5px] text-zinc-500 dark:text-zinc-400 leading-relaxed font-sans mt-1">
                🛡️ Funds from physical parcel dispatches reflect ready for cash-out withdrawal <strong>exactly 24 hours after delivery confirmation</strong>, provided the buyer does not initiate a dispute within their <strong>12-hour return grace period</strong>.
              </p>
            </div>

            {/* Platform / MapStore Ledger */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-cyan-500/10 text-cyan-400 rounded-xl">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-gray-900 dark:text-zinc-100 font-sans">MapStore Platform Wallet Ledger</h4>
                  <span className="text-[10px] text-zinc-500 block font-sans">Flat 7% auto-secured commissions ledger</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-white dark:bg-zinc-900 p-3 rounded-2xl border border-gray-100 dark:border-zinc-800 font-sans">
                <div>
                  <span className="text-[9px] uppercase font-bold text-zinc-400 block mb-0.5 font-sans">Cleared Platform Commission</span>
                  <p className="text-lg font-black text-[#5eead4] dark:text-[#4ade80]">
                    {selectedRegion.currencySymbol}{(financials.clearedMapStore * selectedRegion.exchangeRate).toFixed(2)}
                  </p>
                  <span className="text-[8px] text-zinc-500 block mt-0.5 leading-snug font-sans">Secured platform commission revenue.</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-zinc-400 block mb-0.5">Held Commission</span>
                  <p className="text-lg font-black text-amber-500">
                    {selectedRegion.currencySymbol}{(financials.heldMapStore * selectedRegion.exchangeRate).toFixed(2)}
                  </p>
                  <span className="text-[8px] text-zinc-500 block mt-0.5 leading-snug font-sans">Commission on escrow hold en-route.</span>
                </div>
              </div>
              <p className="text-[10.5px] text-zinc-500 dark:text-zinc-400 leading-relaxed font-sans mt-1 font-sans">
                🌿 Platform commissions are automatically deducted into the central MapStore secure wallet. They clear <strong>24 hours after successful parcel arrivals</strong>. If a return is initiated, values remain on hold!
              </p>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Graphical Analytics Charts depicting Sales, Orders, and Profit progress reports */}
            <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-6 rounded-3xl shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-gray-100 dark:border-zinc-800/60">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                    <BarChart4 className="w-4.5 h-4.5 text-emerald-400 animate-pulse" /> Seller Performance & Progress Ledger
                  </h3>
                  <p className="text-[10px] text-gray-400 mt-0.5">Click on any visual tab to project historical metrics onto the real-time interactive graph</p>
                </div>

                <div className="flex items-center gap-1 text-[9px] font-mono uppercase bg-emerald-500/10 text-emerald-500 px-2.5 py-1 rounded-xl font-bold self-start sm:self-auto">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  <span>Live Payout Tracking Active</span>
                </div>
              </div>

              {/* Metric Switcher Cards / Interactive Tabs */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {/* Sales Switcher */}
                <button
                  type="button"
                  onClick={() => setChartMetric('sales')}
                  className={`p-3 sm:p-4 rounded-2xl text-left transition-all duration-350 border cursor-pointer ${
                    chartMetric === 'sales'
                      ? 'bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border-emerald-500/45 dark:border-emerald-500/50 shadow-xs'
                      : 'bg-zinc-50 dark:bg-zinc-950 border-gray-100 dark:border-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-850'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[8px] sm:text-[10px] font-bold text-gray-405 dark:text-gray-400 uppercase tracking-tight sm:tracking-widest font-mono truncate">Gross Sales</span>
                    <div className={`p-0.5 sm:p-1 rounded-lg ${chartMetric === 'sales' ? 'bg-emerald-500 text-white' : 'bg-gray-200 dark:bg-zinc-800 text-gray-500'} shrink-0`}>
                      <DollarSign className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    </div>
                  </div>
                  <div className="text-xs sm:text-lg font-black text-gray-900 dark:text-white mt-1">
                    {selectedRegion.currencySymbol}{(financials.revenue * selectedRegion.exchangeRate).toFixed(2)}
                  </div>
                  <div className="text-[7.5px] sm:text-[9px] text-gray-400 mt-1 flex flex-wrap items-center gap-0.5 sm:gap-1 leading-tight">
                    <span className="text-emerald-500 font-extrabold">↑ 12.4%</span> <span className="hidden xs:inline">vs previous</span>
                  </div>
                </button>

                {/* Profit Switcher */}
                <button
                  type="button"
                  onClick={() => setChartMetric('profit')}
                  className={`p-3 sm:p-4 rounded-2xl text-left transition-all duration-350 border cursor-pointer ${
                    chartMetric === 'profit'
                      ? 'bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 border-cyan-500/45 dark:border-cyan-500/50 shadow-xs'
                      : 'bg-zinc-50 dark:bg-zinc-950 border-gray-100 dark:border-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-850'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[8px] sm:text-[10px] font-bold text-gray-405 dark:text-gray-400 uppercase tracking-tight sm:tracking-widest font-mono truncate">Net Profit</span>
                    <div className={`p-0.5 sm:p-1 rounded-lg ${chartMetric === 'profit' ? 'bg-cyan-500 text-white' : 'bg-gray-200 dark:bg-zinc-800 text-gray-500'} shrink-0`}>
                      <TrendingUp className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    </div>
                  </div>
                  <div className="text-xs sm:text-lg font-black text-cyan-500 dark:text-cyan-400 mt-1">
                    {selectedRegion.currencySymbol}{(financials.net * selectedRegion.exchangeRate).toFixed(2)}
                  </div>
                  <div className="text-[7.5px] sm:text-[9px] text-gray-400 mt-1 flex flex-wrap items-center gap-0.5 sm:gap-1 leading-tight">
                    <span className="text-cyan-500 font-extrabold">-7% Fee</span> <span className="hidden xs:inline">deducted</span>
                  </div>
                </button>

                {/* Orders Switcher */}
                <button
                  type="button"
                  onClick={() => setChartMetric('orders')}
                  className={`p-3 sm:p-4 rounded-2xl text-left transition-all duration-350 border cursor-pointer ${
                    chartMetric === 'orders'
                      ? 'bg-gradient-to-br from-purple-500/10 to-indigo-500/5 border-indigo-500/40 dark:border-indigo-500/50 shadow-xs'
                      : 'bg-zinc-50 dark:bg-zinc-950 border-gray-100 dark:border-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-850'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[8px] sm:text-[10px] font-bold text-gray-405 dark:text-gray-400 uppercase tracking-tight sm:tracking-widest font-mono truncate">Orders</span>
                    <div className={`p-0.5 sm:p-1 rounded-lg ${chartMetric === 'orders' ? 'bg-indigo-500 text-white' : 'bg-gray-200 dark:bg-zinc-800 text-gray-500'} shrink-0`}>
                      <Package className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    </div>
                  </div>
                  <div className="text-xs sm:text-lg font-black text-indigo-500 dark:text-indigo-400 mt-1">
                    {sellerOrders.length || 8} Pcs
                  </div>
                  <div className="text-[7.5px] sm:text-[9px] text-gray-400 mt-1 flex flex-wrap items-center gap-0.5 sm:gap-1 leading-tight">
                    <span className="text-indigo-500 font-extrabold">{financials.units} Components</span> <span className="hidden xs:inline">sold</span>
                  </div>
                </button>
              </div>

              {/* Premium custom inline-SVG chart with responsive grid */}
              <div className="bg-zinc-50 dark:bg-zinc-950/20 p-4 rounded-2xl border border-gray-100 dark:border-zinc-850">
                <div className="w-full h-44 relative flex items-end">
                  {/* background grids */}
                  <div className="absolute inset-0 flex flex-col justify-between opacity-[0.22] pointer-events-none mb-6">
                    <div className="border-b border-gray-200 dark:border-zinc-800 w-full h-0"></div>
                    <div className="border-b border-gray-200 dark:border-zinc-800 w-full h-0"></div>
                    <div className="border-b border-gray-200 dark:border-zinc-800 w-full h-0"></div>
                    <div className="border-b border-gray-200 dark:border-zinc-800 w-full h-0"></div>
                  </div>

                  {/* Animated SVG line plot & Bar graph */}
                  <svg viewBox="0 0 500 150" className="w-full h-full overflow-visible z-10" id="performance-chart-canvas">
                    <defs>
                      <linearGradient id="chart-grad-sales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.45" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                      </linearGradient>
                      <linearGradient id="chart-grad-profit" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.45" />
                        <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
                      </linearGradient>
                      <linearGradient id="bar-gradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#4f46e5" />
                      </linearGradient>
                    </defs>

                    {/* Draw grid lines for weeks */}
                    {mappedPoints.map((p, pIdx) => (
                      <line
                        key={`grid-v-${pIdx}`}
                        x1={p.x}
                        y1={15}
                        x2={p.x}
                        y2={130}
                        stroke="currentColor"
                        strokeWidth="0.5"
                        className="text-gray-250 dark:text-zinc-800 opacity-20"
                        strokeDasharray="4 4"
                      />
                    ))}

                    {/* Render Chart Content */}
                    {chartMetric === 'orders' ? (
                      mappedPoints.map((p, idx) => (
                        <g key={`bar-${idx}`} className="group/bar cursor-pointer">
                          {/* Hover backing zone */}
                          <rect
                            x={p.x - 14}
                            y={15}
                            width={28}
                            height={115}
                            className="fill-transparent hover:fill-zinc-400/5 dark:hover:fill-zinc-800/10 transition-colors"
                            rx={3}
                          />
                          {/* Core column item */}
                          <rect
                            x={p.x - 7}
                            y={Math.min(130, p.y)}
                            width={14}
                            height={Math.max(4, 130 - p.y)}
                            rx={4}
                            fill="url(#bar-gradient)"
                            className="transition-all duration-350 origin-bottom hover:brightness-110"
                          />
                          {/* Top coordinate ball */}
                          <circle
                            cx={p.x}
                            cy={p.y}
                            r={3}
                            className="fill-indigo-300 stroke-indigo-600 stroke-1"
                          />
                          {/* Tooltip text */}
                          <text
                            x={p.x}
                            y={Math.max(12, p.y - 6)}
                            textAnchor="middle"
                            className="text-[9px] font-black fill-indigo-500 font-mono transition-transform group-hover/bar:scale-110"
                          >
                            {p.rawValue}
                          </text>
                        </g>
                      ))
                    ) : (
                      <>
                        <path
                          d={areaPath}
                          fill={chartMetric === 'profit' ? 'url(#chart-grad-profit)' : 'url(#chart-grad-sales)'}
                          className="transition-all duration-500"
                        />
                        <path
                          d={linePath}
                          fill="none"
                          stroke={chartMetric === 'profit' ? '#06b6d4' : '#10b981'}
                          strokeWidth="3.2"
                          strokeLinecap="round"
                          className="transition-all duration-500"
                        />
                        {/* Interactive Point Node items */}
                        {mappedPoints.map((p, idx) => (
                          <g key={`point-${idx}`} className="group/pt cursor-pointer">
                            <circle
                              cx={p.x}
                              cy={p.y}
                              r="8"
                              className="fill-transparent group-hover/pt:fill-emerald-500/10 transition-all"
                            />
                            <circle
                              cx={p.x}
                              cy={p.y}
                              r="4"
                              fill={chartMetric === 'profit' ? '#06b6d4' : '#10b981'}
                              className="stroke-white dark:stroke-zinc-900 stroke-2 hover:scale-125 transition-transform"
                            />
                            {/* Point Tooltip */}
                            <g className="opacity-0 group-hover/pt:opacity-100 transition-opacity pointer-events-none">
                              <rect
                                x={p.x - 45}
                                y={p.y - 28}
                                width={90}
                                height={18}
                                rx={5}
                                className="fill-zinc-900 border border-zinc-800 dark:border-neutral-700"
                              />
                              <text
                                x={p.x}
                                y={p.y - 16}
                                textAnchor="middle"
                                className="text-[8px] font-black fill-white font-mono"
                              >
                                {selectedRegion.currencySymbol}{(p.rawValue * selectedRegion.exchangeRate).toFixed(2)}
                              </text>
                            </g>
                          </g>
                        ))}
                      </>
                    )}
                  </svg>

                  {/* Floated state indicator */}
                  <div className="absolute top-2 right-2 bg-zinc-900/90 text-[8.5px] text-zinc-300 py-1 px-2.5 rounded-lg border border-zinc-800 font-mono">
                    {chartMetric === 'sales' && '💎 Viewing Gross Receipts'}
                    {chartMetric === 'profit' && '🛡️ Viewing Net Profits (93%)'}
                    {chartMetric === 'orders' && '📦 Viewing Dispatch Volumes'}
                  </div>
                </div>

                {/* Weekly interval indices bottom-row label tags */}
                <div className="flex justify-between text-[9px] text-gray-400 font-mono tracking-wider pt-2 border-t border-gray-100 dark:border-zinc-850/40">
                  {mappedPoints.map((pt, pIdx) => (
                    <span key={`lbl-${pIdx}`} className="font-bold">{pt.label}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Category Sales Distribution Pie Chart Card */}
            <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-6 rounded-3xl shadow-xs flex flex-col justify-between min-h-[420px]" id="seller-category-distribution-card">
              <div className="pb-3 border-b border-gray-100 dark:border-zinc-800/60">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1.5 font-sans">
                  <LucidePieChart className="w-4.5 h-4.5 text-emerald-400 animate-pulse" /> Category Distribution
                </h3>
                <p className="text-[10px] text-gray-400 mt-0.5 font-sans">Sales allocation across key product divisions</p>
              </div>

              {/* Pie Chart Display Area with Responsive Container */}
              <div className="flex-1 w-full flex items-center justify-center min-h-[190px]" id="recharts-piechart-container">
                <ResponsiveContainer width="100%" height={210}>
                  <PieChart>
                    <Pie
                      data={categoryChartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={75}
                      paddingAngle={4}
                      label={false}
                    >
                      {categoryChartData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={CATEGORY_COLORS[entry.name] || '#94a3b8'} 
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          const formattedVal = `${selectedRegion.currencySymbol}${(data.value * selectedRegion.exchangeRate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                          return (
                            <div className="bg-zinc-900 border border-zinc-850 text-white rounded-xl p-2.5 text-xs shadow-md font-mono">
                              <p className="font-bold text-gray-300 font-sans">{data.name}</p>
                              <p className="text-[#5eead4] mt-0.5">{formattedVal}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legend with Details and Visual Highlights */}
              <div className="space-y-2 pt-3 border-t border-gray-100 dark:border-zinc-800/50" id="piechart-custom-legend">
                {categoryChartData.map((entry, index) => {
                  const color = CATEGORY_COLORS[entry.name] || '#94a3b8';
                  const percentage = (
                    (entry.value / categoryChartData.reduce((acc, curr) => acc + curr.value, 0)) * 100
                  ).toFixed(1);
                  return (
                    <div key={`legend-${index}`} className="flex items-center justify-between text-[11px] font-sans">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                        <span className="text-gray-700 dark:text-zinc-300 font-medium">{entry.name}</span>
                      </div>
                      <div className="flex items-center gap-2 font-mono">
                        <span className="text-gray-950 dark:text-zinc-100 font-extrabold text-xs">
                          {selectedRegion.currencySymbol}{(entry.value * selectedRegion.exchangeRate).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </span>
                        <span className="text-gray-400 text-[10px]">({percentage}%)</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}

          {/* 2. ORDERS MANAGEMENT ACTIVE WORKSPACE */}
          {sellerSubTab === 'orders' && (
            <div className="space-y-6">
              {/* Real Mail Inbox Header and Component */}
              <div className="bg-white dark:bg-zinc-900 border border-gray-105 dark:border-zinc-805 p-6 rounded-3xl shadow-xs space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-gray-50 dark:border-zinc-950">
                  <div>
                    <h3 className="font-extrabold text-xs uppercase tracking-widest text-[#5eead4] dark:text-[#4ade80] font-sans flex items-center gap-1.5">
                      <Mail className="w-4.5 h-4.5" /> Secure Store Mailroom
                    </h3>
                    <p className="text-[10px] text-zinc-400 mt-0.5">Automated platform notifications received instantly upon checkout.</p>
                  </div>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2.5 py-0.5 rounded-full font-mono uppercase font-fold font-bold animate-pulse">
                    {sellerEmails.length} messages
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[350px]">
                  {/* Emails List */}
                  <div className="md:col-span-1 border border-gray-100 dark:border-zinc-800 rounded-2xl overflow-y-auto divide-y divide-gray-150 dark:divide-zinc-850 h-full bg-zinc-50 dark:bg-zinc-950/40">
                    {sellerEmails.map((email) => {
                      const isSelected = selectedMailId === email.id;
                      return (
                        <div
                          key={email.id}
                          onClick={() => setSelectedMailId(email.id)}
                          className={`p-3 cursor-pointer text-left transition-colors relative hover:bg-zinc-150 dark:hover:bg-zinc-900/60 ${
                            isSelected ? 'bg-white dark:bg-zinc-900 border-l-4 border-emerald-500 shadow-xs' : ''
                          }`}
                        >
                          <div className="flex justify-between items-start mb-0.5 text-[9px] text-zinc-400">
                            <span className="font-mono truncate max-w-[120px]">{email.from}</span>
                            <span className="font-mono">{email.timestamp}</span>
                          </div>
                          <p className="text-[11px] font-bold text-gray-950 dark:text-zinc-150 truncate">{email.subject}</p>
                          <p className="text-[10px] text-gray-400 truncate mt-0.5 leading-snug">{email.body.substring(80, 140)}...</p>
                        </div>
                      );
                    })}
                    
                    {sellerEmails.length === 0 && (
                      <div className="p-8 text-center text-zinc-400 flex flex-col items-center justify-center h-full">
                        <Mail className="w-6 h-6 mb-2 text-zinc-300 dark:text-zinc-700" />
                        <p className="text-[11px] font-bold">Mailbox is empty</p>
                        <p className="text-[9px] text-zinc-500 pt-0.5">Automated platform dispatches appear here in real-time upon order checkout.</p>
                      </div>
                    )}
                  </div>

                  {/* Email Display Viewer */}
                  <div className="md:col-span-2 border border-gray-100 dark:border-zinc-800 rounded-2xl p-4 bg-white dark:bg-zinc-950 flex flex-col h-full relative overflow-y-auto">
                    {selectedMailId ? (
                      (() => {
                        const currentMail = sellerEmails.find(m => m.id === selectedMailId);
                        if (!currentMail) return <div className="text-xs text-zinc-400 m-auto">Email not found</div>;
                        return (
                          <div className="space-y-3 text-left font-mono text-[10px] leading-relaxed select-all">
                            <div className="border-b border-gray-100 dark:border-zinc-800 pb-2.5 space-y-1">
                              <div className="font-sans font-extrabold text-[12px] text-gray-950 dark:text-white leading-tight">{currentMail.subject}</div>
                              <div className="text-zinc-450 text-zinc-400"><strong>From:</strong> <span className="text-zinc-700 dark:text-zinc-300">{currentMail.from}</span></div>
                              <div className="text-zinc-450 text-zinc-400"><strong>To:</strong> <span className="text-zinc-700 dark:text-zinc-300">{currentMail.to}</span></div>
                              <div className="text-zinc-450 text-zinc-400"><strong>Date:</strong> {currentMail.timestamp}</div>
                            </div>
                            <div className="whitespace-pre-wrap text-gray-750 dark:text-zinc-300 font-mono leading-relaxed pt-2 selection:bg-emerald-500/25">
                              {currentMail.body}
                            </div>
                          </div>
                        );
                      })()
                    ) : (
                      <div className="m-auto text-center space-y-1.5">
                        <Inbox className="w-8 h-8 text-zinc-200 dark:text-zinc-800 mx-auto animate-pulse" />
                        <p className="text-xs text-zinc-400 font-bold">No Email Selected</p>
                        <p className="text-[10px] text-zinc-550 dark:text-zinc-500 max-w-xs leading-normal">Select an incoming shop email notification from the left pane to view secure transaction codes and fulfillment instructions.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 1.5 Seller Physical Logistics & Fulfillment Settings */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 space-y-6">
              <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-805 p-5 rounded-3xl shadow-xs space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-zinc-800">
                  <h4 className="text-xs uppercase font-extrabold tracking-widest text-[#5eead4] dark:text-[#4ade80] flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" /> Warehouse Logistics
                  </h4>
                  <button
                    onClick={() => setIsEditingAddress(!isEditingAddress)}
                    className="text-[10px] font-bold text-emerald-500 hover:text-emerald-400 uppercase flex items-center gap-1 cursor-pointer"
                  >
                    <Edit className="w-3" /> {isEditingAddress ? "Cancel" : "Modify"}
                  </button>
                </div>

                {isEditingAddress ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] uppercase font-semibold text-gray-400 mb-1">Store Physical Location Address</label>
                      <textarea
                        rows={2}
                        value={storeAddressInput}
                        onChange={(e) => setStoreAddressInput(e.target.value)}
                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl p-2.5 text-xs text-gray-800 dark:text-white"
                        placeholder="Enter street, suite, city, state, zip"
                      />
                    </div>
                    <button
                      onClick={() => {
                        const updatedProfile = {
                          ...sellerProfile,
                          storeAddress: storeAddressInput,
                        };
                        setUser((prev) => ({
                          ...prev,
                          sellerProfile: updatedProfile,
                        }));
                        setIsEditingAddress(false);
                        addNotification({
                          title: '🏠 Logistics Address Saved',
                          message: `Physical parcel origin updated: ${storeAddressInput}`,
                          type: 'system'
                        });
                      }}
                      className="w-full bg-[#3de39e] hover:bg-emerald-500 text-black font-extrabold py-2 rounded-xl text-[10px] uppercase cursor-pointer"
                    >
                      Save Logistics Coordinates
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="text-xs text-gray-800 dark:text-zinc-200">
                      <span className="font-bold text-zinc-400 block text-[10px] uppercase">Registered Store Name</span>
                      <p className="font-bold text-sm mt-0.5">{sellerProfile.storeName}</p>
                    </div>
                    <div className="text-xs text-gray-800 dark:text-zinc-200 pt-1">
                      <span className="font-bold text-zinc-400 block text-[10px] uppercase">Fulfillment Return-To Address</span>
                      <p className="mt-0.5 max-w-sm text-gray-600 dark:text-zinc-300 font-mono text-[11px] leading-relaxed">
                        {sellerProfile.storeAddress || "777 Market St, San Francisco, CA 94103"}
                      </p>
                    </div>
                    <div className="text-[10px] text-zinc-400 italic bg-zinc-50 dark:bg-zinc-950 p-2 rounded-xl border border-gray-150 dark:border-zinc-850">
                      This origin physical address will be compiled on all outer package-label slips.
                    </div>
                  </div>
                )}
              </div>

              {/* Regional Shipping Agent Suggestions */}
              <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-5 rounded-3xl shadow-xs space-y-4">
                <div className="flex justify-between items-start pb-2.5 border-b border-gray-50 dark:border-zinc-950">
                  <div>
                    <h4 className="text-xs uppercase font-extrabold tracking-widest text-[#5eead4] dark:text-[#4ade80] flex items-center gap-1.5">
                      <Truck className="w-4 h-4" /> Regional Courier Agents
                    </h4>
                    <p className="text-[9px] text-zinc-400 mt-0.5 font-medium">Available logistics dispatches for {selectedRegion.name}</p>
                  </div>
                  <span className="text-sm font-sans" title={selectedRegion.name}>{selectedRegion.flag}</span>
                </div>

                <div className="space-y-3">
                  {(REGIONAL_AGENTS[selectedRegion.id] || REGIONAL_AGENTS['GLOBAL']).map((agent, aIdx) => {
                    const isSelected = selectedCourierAgentName === agent.name;
                    const contact = getCourierContactInfo(agent.name);
                    return (
                      <div 
                        key={aIdx} 
                        onClick={() => setSelectedCourierAgentName(isSelected ? null : agent.name)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer select-none group relative ${
                          isSelected 
                            ? 'bg-emerald-50/20 dark:bg-emerald-950/20 border-emerald-500 shadow-sm' 
                            : 'bg-zinc-50 dark:bg-zinc-950/40 border-gray-150 dark:border-zinc-850/60 hover:border-emerald-500/30'
                        }`}
                        id={`courier-agent-${aIdx}`}
                      >
                        <div className="flex items-start gap-2.5">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm border shrink-0 shadow-xs transition-all ${
                            isSelected 
                              ? 'bg-emerald-500 text-white border-emerald-400' 
                              : 'bg-white dark:bg-zinc-900 border-gray-100 dark:border-zinc-805 text-gray-800'
                          }`}>
                            {agent.logo}
                          </div>
                          <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex items-center justify-between gap-1 flex-wrap">
                              <span className="text-xs font-bold text-gray-900 dark:text-white truncate">{agent.name}</span>
                              <div className="flex items-center gap-1.5">
                                {agent.escrowCertified && (
                                  <span className="text-[8px] font-black bg-emerald-500/10 text-emerald-500 px-1.5 py-0.2 rounded-sm uppercase tracking-wider border border-emerald-500/10 shrink-0">
                                    Escrow Sync
                                  </span>
                                )}
                                <span className={`text-[8.5px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded shrink-0 transition-colors ${
                                  isSelected ? 'bg-emerald-500 text-zinc-950' : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500'
                                }`}>
                                  {isSelected ? "Contact Active" : "Click to Contact"}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between text-[9px] text-zinc-400 font-mono">
                              <span>🕒 {agent.speed}</span>
                              <span>Est: <strong className="text-gray-950 dark:text-zinc-200">{selectedRegion.currencySymbol}{(agent.baseRateRaw * selectedRegion.exchangeRate).toFixed(2)}</strong></span>
                            </div>
                            <div className="flex flex-wrap gap-1 pt-1">
                              {agent.features.map((feat, fIdx) => (
                                <span key={fIdx} className="text-[8px] bg-white dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 px-1.5 py-0.5 rounded border border-gray-150 dark:border-zinc-850">
                                  {feat}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        {/* Slide-down / fade-in Contact Information Block */}
                        <AnimatePresence>
                          {isSelected && (
                            <motion.div 
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-3.5 pt-3.5 border-t border-dashed border-emerald-500/20 space-y-2.5 text-[11px] leading-relaxed block overflow-hidden"
                              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking links or details inside
                            >
                              <div className="bg-emerald-500/5 dark:bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/10 space-y-2">
                                <div className="flex items-center justify-between text-xs font-black text-gray-900 dark:text-white pb-1 border-b border-emerald-500/10 uppercase tracking-widest font-mono">
                                  <span>📞 Immediate Agent helpline</span>
                                  <span className="text-[9px] text-emerald-500">Live Connect</span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                                  <div className="space-y-0.5">
                                    <span className="text-[9px] text-zinc-400 block uppercase font-mono">Support Phone</span>
                                    {contact.phone === '0711935789' && user.email !== 'mapstore2026@gmail.com' ? (
                                      <div className="font-extrabold text-amber-500 flex items-center gap-1 font-mono text-xs select-none" title="This is a secure private number">
                                        <span>🔒 071 *** 5789 (Private)</span>
                                      </div>
                                    ) : (
                                      <a 
                                        href={`tel:${contact.phone.replace(/[^0-9+]/g, '')}`} 
                                        className="font-black text-emerald-600 dark:text-[#5eead4] hover:underline flex items-center gap-1 cursor-pointer font-mono text-xs"
                                      >
                                        <span>{contact.phone}</span>
                                      </a>
                                    )}
                                  </div>
                                  <div className="space-y-0.5">
                                    <span className="text-[9px] text-zinc-400 block uppercase font-mono font-bold">Operations Email</span>
                                    <a 
                                      href={`mailto:${contact.email}`} 
                                      className="font-bold text-emerald-600 dark:text-[#5eead4] hover:underline truncate block cursor-pointer font-mono"
                                      title={contact.email}
                                    >
                                      {contact.email}
                                    </a>
                                  </div>
                                </div>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-emerald-500/5 text-[11px]">
                                  <div className="space-y-0.5">
                                    <span className="text-[9px] text-zinc-400 block uppercase font-mono">Direct Desk Officer</span>
                                    <span className="font-extrabold text-gray-800 dark:text-zinc-200">{contact.manager}</span>
                                  </div>
                                  <div className="space-y-0.5">
                                    <span className="text-[9px] text-zinc-400 block uppercase font-mono">Receiving Depot Office</span>
                                    <span className="font-semibold text-gray-700 dark:text-zinc-300 line-clamp-1" title={contact.depot}>{contact.depot}</span>
                                  </div>
                                </div>

                                <div className="pt-1.5 flex items-center justify-between text-[10px] text-zinc-400 border-t border-emerald-500/5">
                                  <div className="flex items-center gap-1">
                                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-450 bg-emerald-500 animate-pulse"></span>
                                    <span>Operating Clock: <strong>{contact.hours}</strong></span>
                                  </div>
                                  <button 
                                    type="button"
                                    onClick={() => {
                                      navigator.clipboard.writeText(`Phone: ${contact.phone}\nEmail: ${contact.email}\nManager: ${contact.manager}`);
                                    }}
                                    className="text-[9px] uppercase font-black bg-emerald-500 text-zinc-950 px-1.5 py-0.5 rounded cursor-pointer active:scale-95 transition-all select-none"
                                  >
                                    Copy Details
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>

                <div className="text-[10px] text-zinc-400 italic bg-amber-500/5 dark:bg-amber-500/2 border border-amber-500/10 p-2.5 rounded-xl flex items-start gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">
                    <strong>Smart Escrow Integration:</strong> Recommended carriers communicate directly with our platform APIs. When a successful delivery scan status updates, the corresponding held transacting payout shifts automatically into your withdrawable balance in 24 hours.
                  </span>
                </div>
              </div>
            </div>

            {/* Packaging and Fulfillment standard Center */}
            <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-6 rounded-3xl shadow-xs md:col-span-2 space-y-4">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 pb-2.5 border-b border-gray-50 dark:border-zinc-950">
                <div>
                  <h3 className="font-extrabold text-sm text-gray-900 dark:text-white font-sans flex items-center gap-1.5">
                    <Package className="w-5 h-5 text-[#5eead4]" /> Active Fulfillment & Package Dispatches
                  </h3>
                  <p className="text-[11px] text-gray-400 mt-0.5">Generate unique order numbers and print packaging labels to paste exteriorly.</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={downloadAllInvoicesPDF}
                    className="bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/30 dark:hover:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50 text-[10px] font-extrabold px-3.5 py-1.5 rounded-xl cursor-pointer flex items-center gap-1.5 transition-all shadow-xs"
                    title="Generate unified invoice PDF of all active orders"
                  >
                    <Download className="w-3.5 h-3.5" /> Batch Download PDF
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const demoOrderId = `ORD-${Math.floor(Math.random() * 90000) + 10000}`;
                      const demoOrder: Order = {
                        id: demoOrderId,
                        buyerEmail: 'jane.buyer@gmail.com',
                        buyerName: 'Jane Buyer',
                        items: [
                          {
                            productId: 'prod-1',
                            productTitle: 'Precision Brew Espresso Machine',
                            price: 349.99,
                            quantity: 1,
                            sellerId: user.id || 'sell-alpha',
                            sellerName: sellerProfile.storeName || 'Custom Local Branch',
                            commissionAmount: Number((349.99 * 0.07).toFixed(2)),
                            netSellerAmount: Number((349.99 * 0.93).toFixed(2))
                          }
                        ],
                        totalPrice: 349.99,
                        commissionTotal: Number((349.99 * 0.07).toFixed(2)),
                        status: 'pending',
                        paymentType: 'card',
                        shippingAddress: {
                          fullName: 'Jane Doe',
                          streetAddress: '155 Harrison St, Apt 4C',
                          city: 'San Francisco',
                          postalCode: '94105',
                          phone: '+1 (555) 321-7654'
                        },
                        timestamp: new Date().toLocaleString(),
                        trackingSteps: [
                          { status: 'pending', label: 'Order Registered', description: 'Payment holds verified securely.', active: true, date: new Date().toLocaleTimeString() },
                          { status: 'payment_secured', label: 'Security Processing Cleared', description: 'AES-256 ledger block added.', active: false, date: 'TBD' },
                          { status: 'processing', label: 'Seller Fulfillment Dispatch', description: 'Awaiting package label assembly.', active: false, date: 'TBD' },
                          { status: 'shipped', label: 'Carrier En Route', description: 'Parcel scanned at logistics post.', active: false, date: 'TBD' },
                          { status: 'out_for_delivery', label: 'Last Mile Dispatch', description: 'Mobile transporter active nearby.', active: false, date: 'TBD' },
                          { status: 'delivered', label: 'Delivery Receipt Confirmed', description: 'Destination arrived safely.', active: false, date: 'TBD' }
                        ]
                      };
                      if (addOrder) {
                        addOrder(demoOrder);
                      } else if (setOrders) {
                        setOrders(prev => [demoOrder, ...prev]);
                      }
                      addNotification({
                        title: '📦 New Test Order Placed',
                        message: `A test order #${demoOrderId} ready for fulfillment print standard.`,
                        type: 'order'
                      });
                    }}
                    className="bg-zinc-150 hover:bg-zinc-200 dark:bg-zinc-950 dark:hover:bg-black text-gray-800 dark:text-zinc-300 border border-gray-200 dark:border-zinc-805 text-[10px] font-bold px-3 py-1.5 rounded-xl cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Inject Test Order
                  </button>
                </div>
              </div>

              <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
                {sellerOrders.map((ord) => {
                  const sAddress = ord.items[0]?.sellerId === 'sell-alpha' ? '888 Mission St, San Francisco, CA 94103' : ord.items[0]?.sellerId === 'sell-beta' ? '321 Canvas Way, San Francisco, CA 94102' : ord.items[0]?.sellerId === 'sell-gamma' ? '1042 Valencia St, San Francisco, CA 94110' : (storeAddressInput);
                  const sName = ord.items[0]?.sellerName || sellerProfile.storeName;
                  return (
                    <div
                      key={ord.id}
                      className="p-4 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-gray-150 dark:border-zinc-805 space-y-3 font-sans transition-all relative overflow-hidden"
                    >
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 pb-2 border-b border-gray-100 dark:border-zinc-900">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-md">
                            {ord.id}
                          </span>
                          <span className="text-[9px] text-zinc-400 font-medium">{ord.timestamp}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-gray-400 font-bold uppercase">Status:</span>
                          {ord.status === 'cancelled' || ord.status === 'return_initiated' ? (
                            <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider ${
                              ord.status === 'cancelled' ? 'bg-rose-500/10 text-rose-500' : 'bg-amber-500/10 text-amber-500 animate-pulse'
                            }`}>
                              {ord.status === 'cancelled' ? '❌ Cancelled / Refunded' : '🔄 Dispute Return Hold'}
                            </span>
                          ) : (
                            <select
                              value={ord.status}
                              onChange={(e) => {
                                if (setOrders) {
                                  setOrders(prev => prev.map(o => {
                                    if (o.id !== ord.id) return o;
                                    const nextStat = e.target.value as Order['status'];
                                    const steps = o.trackingSteps.map(step => {
                                      if (step.status === nextStat) {
                                        return { ...step, active: true, date: new Date().toLocaleTimeString() };
                                      }
                                      return step;
                                    });
                                    return { 
                                      ...o, 
                                      status: nextStat, 
                                      trackingSteps: steps,
                                      deliveredAt: nextStat === 'delivered' ? new Date().toISOString() : o.deliveredAt
                                    };
                                  }));
                                  addNotification({
                                    title: `📦 Order #${ord.id} Route Update`,
                                    message: `Verification logistics updated transit status: ${e.target.value.toUpperCase()}`,
                                    type: 'order',
                                    orderId: ord.id
                                  });
                                }
                              }}
                              className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg p-1 text-[10.5px] font-bold text-amber-500 focus:outline-hidden"
                            >
                              <option value="pending">Pending</option>
                              <option value="payment_secured">Secured</option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="out_for_delivery">Out For Delivery</option>
                              <option value="delivered">Delivered</option>
                            </select>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div className="space-y-1">
                          <span className="text-[9px] uppercase font-extrabold tracking-wider text-gray-400 block">Sender Return Address</span>
                          <p className="font-bold text-gray-900 dark:text-white text-[11px] leading-tight">{sName}</p>
                          <p className="text-gray-500 dark:text-zinc-300 font-mono text-[10px] leading-tight">{sAddress}</p>
                        </div>

                        <div className="space-y-1">
                          <span className="text-[9px] uppercase font-extrabold tracking-wider text-gray-400 block">Recipient Package Destination</span>
                          <p className="font-bold text-gray-900 dark:text-white text-[11px] leading-tight">{ord.shippingAddress.fullName}</p>
                          <p className="text-gray-500 dark:text-zinc-300 font-mono text-[10px] leading-tight">
                            {ord.shippingAddress.streetAddress}, {ord.shippingAddress.city}, {ord.shippingAddress.postalCode}
                          </p>
                          <p className="text-[9px] text-zinc-400 font-semibold uppercase">{ord.shippingAddress.phone}</p>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-gray-100 dark:border-zinc-90 w-full flex flex-col sm:flex-row items-center justify-between gap-2.5">
                        <div className="text-[10px] text-zinc-400">
                          Items to pack: <span className="font-bold text-gray-800 dark:text-zinc-300">{ord.items.map(i => `${i.productTitle} (x${i.quantity})`).join(', ')}</span>
                        </div>

                        <button
                          onClick={() => {
                            setSelectedOrderForLabel(ord);
                            setIsSimulatingThermalPrint(false);
                            setThermalPrintStep('idle');
                          }}
                          className="bg-zinc-900 hover:bg-black text-white dark:bg-zinc-800 dark:hover:bg-zinc-700 text-[10px] font-bold px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 cursor-pointer self-stretch sm:self-auto justify-center"
                        >
                          <Printer className="w-3.5 h-3.5" /> Print Physical Sticker Label
                        </button>
                      </div>
                    </div>
                  );
                })}

                {sellerOrders.length === 0 && (
                  <div className="text-center p-8 bg-zinc-50 dark:bg-zinc-950 border border-dashed border-gray-150 dark:border-zinc-805 rounded-2xl">
                    <Clock className="w-8 h-8 text-gray-300 mx-auto mb-2 animate-pulse" />
                    <p className="text-xs text-gray-400 font-medium">No order requests received yet on this store segment.</p>
                    <p className="text-[10px] text-zinc-500 mt-1">Check out items via buyer portal or tap "Inject Test Order" to assemble labels.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          </div>
          )}

          <AnimatePresence>
            {selectedOrderForLabel && (
              <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4 font-sans">
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  className="bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-6 rounded-3xl max-w-lg w-full shadow-2xl space-y-5"
                >
                  <div className="flex justify-between items-center border-b border-gray-200 dark:border-zinc-800 pb-2">
                    <h3 className="font-extrabold text-sm text-gray-900 dark:text-white flex items-center gap-1.5">
                      <Printer className="w-4.5 h-4.5 text-emerald-400" /> Professional Labelling Suite
                    </h3>
                    <button
                      onClick={() => setSelectedOrderForLabel(null)}
                      className="text-gray-400 hover:text-red-500 text-xs font-bold uppercase p-1 cursor-pointer"
                    >
                      Close Sticker
                    </button>
                  </div>

                  {/* 1. Thermal Direct sticker printer casing real */}
                  <div className="h-[460px] bg-zinc-950 rounded-2xl relative border border-zinc-800 p-4 overflow-hidden flex flex-col items-center justify-start shadow-inner">
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[8px] tracking-widest text-[#5eead4] font-mono font-bold animate-pulse z-10">
                      ⚡ THERMAL STRIKE ACTIVE
                    </div>

                    {thermalPrintStep === 'printing' ? (
                      <div className="text-center space-y-2 my-auto">
                        <RefreshCw className="w-8 h-8 text-[#5eead4] mx-auto animate-spin" />
                        <span className="text-[10px] text-zinc-300 font-mono tracking-widest uppercase block">Heat Transfer Process active...</span>
                      </div>
                    ) : thermalPrintStep === 'completed' ? (
                      /* Animated printed receipt sliding out */
                      <motion.div
                        initial={{ y: -80, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="w-full text-zinc-950 flex flex-col gap-4 font-mono select-all selection:bg-yellow-250 cursor-grab h-full overflow-y-auto pr-1 scrollbar-thin pt-6 pb-2"
                        style={{ fontFamily: 'monospace' }}
                      >
                        {/* PAPER 1: BUYER INSIDE SLIP */}
                        <div className="bg-white p-3.5 border border-dashed border-gray-400 shadow-md rounded-lg w-full text-[9px] space-y-2">
                          <div className="flex justify-between items-start border-b border-dotted border-zinc-900 pb-1.5">
                            <div className="text-left flex items-center gap-1.5 pb-1">
                              <div className="text-emerald-500 flex-shrink-0">
                                <svg viewBox="0 0 100 100" className="w-4 h-4 fill-current">
                                  <g transform="translate(50,50)">
                                    {Array.from({ length: 8 }).map((_, i) => (
                                      <rect
                                        key={i}
                                        x="-6"
                                        y="-35"
                                        width="12"
                                        height="26"
                                        rx="6"
                                        transform={`rotate(${i * 45})`}
                                      />
                                    ))}
                                    <circle cx="0" cy="0" r="8" className="text-zinc-950 fill-white" />
                                  </g>
                                </svg>
                              </div>
                              <div>
                                <span className="font-extrabold text-[11px] text-zinc-950 block tracking-tighter leading-none">MapStore</span>
                                <span className="text-[6.5px] text-zinc-500 italic uppercase block tracking-tight leading-none mt-0.5">Reaching you</span>
                              </div>
                            </div>
                            <div className="text-right font-black text-[7.5px] text-zinc-700 uppercase leading-tight">
                              📄 BUYER INVOICE SLIP
                              <span className="block text-[6px] text-zinc-400 font-bold mt-0.5">[PLACE INSIDE PACKAGE]</span>
                            </div>
                          </div>
                          <div className="flex justify-between font-bold text-[8px] text-zinc-700">
                            <span>Ref: {selectedOrderForLabel.id}</span>
                            <span>Date: {new Date().toLocaleDateString()}</span>
                          </div>
                          <div className="py-1 border-t border-b border-dotted border-zinc-400 space-y-1 my-1">
                            {selectedOrderForLabel.items.map((it, idx) => (
                              <div key={idx} className="flex justify-between text-zinc-800">
                                <span className="truncate max-w-[150px]">{it.productTitle} (x{it.quantity})</span>
                                <span className="font-bold">{selectedRegion.currencySymbol}{(it.price * selectedRegion.exchangeRate * it.quantity).toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                          <div className="flex justify-between font-bold text-[9px] text-zinc-950">
                            <span>GRAND TOTAL:</span>
                            <span>{selectedRegion.currencySymbol}{(selectedOrderForLabel.totalPrice * selectedRegion.exchangeRate).toFixed(2)}</span>
                          </div>
                          <div className="text-center text-[7.5px] text-zinc-500 italic pt-1 border-t border-dotted border-zinc-300">
                            Thank you for shopping on MapStore!
                          </div>
                        </div>

                        {/* LINE CUT SPLITTER */}
                        <div className="flex justify-between items-center text-[7px] text-zinc-400 font-bold border-t border-dashed border-zinc-700 pt-1 border-b border-dashed border-zinc-700 pb-1">
                          <span>✂️ CUT ALONG DOTS</span>
                          <span>✂️ EXTRUDE SLIPS</span>
                        </div>

                        {/* PAPER 2: OUTSIDE PACKAGING SLIP */}
                        <div className="bg-white p-3.5 border border-dashed border-gray-400 shadow-md rounded-lg w-full text-[9px] space-y-2">
                          <div className="flex justify-between items-start border-b border-dotted border-zinc-900 pb-1.5">
                            <div className="text-left flex items-center gap-1.5 pb-1">
                              <div className="text-emerald-500 flex-shrink-0">
                                <svg viewBox="0 0 100 100" className="w-4 h-4 fill-current">
                                  <g transform="translate(50,50)">
                                    {Array.from({ length: 8 }).map((_, i) => (
                                      <rect
                                        key={i}
                                        x="-6"
                                        y="-35"
                                        width="12"
                                        height="26"
                                        rx="6"
                                        transform={`rotate(${i * 45})`}
                                      />
                                    ))}
                                    <circle cx="0" cy="0" r="8" className="text-zinc-950 fill-white" />
                                  </g>
                                </svg>
                              </div>
                              <div>
                                <span className="font-extrabold text-[11px] text-zinc-950 block tracking-tighter leading-none">MapStore</span>
                                <span className="text-[6.5px] text-zinc-500 italic uppercase block tracking-tight leading-none mt-0.5">Reaching you</span>
                              </div>
                            </div>
                            <div className="text-right font-black text-[7.5px] text-zinc-700 uppercase leading-tight">
                              🏷️ SHIPPING LABEL
                              <span className="block text-[6px] text-zinc-400 font-bold mt-0.5">[PASTE OUTSIDE ON PACKAGE]</span>
                            </div>
                          </div>
                          <div className="text-[10px] font-black text-center py-1 bg-zinc-100 rounded tracking-wider border border-zinc-200">
                            ORDER ID: {selectedOrderForLabel.id}
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-[7.5px] leading-tight pt-1">
                            <div className="border-r border-dashed border-zinc-300 pr-1">
                              <span className="font-black block text-[6.5px] uppercase text-zinc-450 mb-0.5">SENDER (SELLER):</span>
                              <span className="font-bold block text-zinc-800">{selectedOrderForLabel.items[0]?.sellerName || sellerProfile.storeName}</span>
                              <span className="text-zinc-600 block leading-snug">{selectedOrderForLabel.items[0]?.sellerId === 'sell-alpha' ? '888 Mission St, San Francisco, CA' : selectedOrderForLabel.items[0]?.sellerId === 'sell-beta' ? '321 Canvas Way, San Francisco, CA' : selectedOrderForLabel.items[0]?.sellerId === 'sell-gamma' ? '1042 Valencia St, San Francisco, CA' : (storeAddressInput)}</span>
                            </div>
                            <div className="pl-1">
                              <span className="font-black block text-[6.5px] uppercase text-zinc-455 mb-0.5">RECIPIENT (BUYER):</span>
                              <span className="font-bold block text-zinc-800">{selectedOrderForLabel.shippingAddress.fullName}</span>
                              <span className="text-zinc-650 block leading-snug">{selectedOrderForLabel.shippingAddress.streetAddress}, {selectedOrderForLabel.shippingAddress.city}, {selectedOrderForLabel.shippingAddress.postalCode}</span>
                              <span className="font-extrabold block text-zinc-700 mt-1">Phone: {selectedOrderForLabel.shippingAddress.phone}</span>
                            </div>
                          </div>
                          <div className="py-1 border-t border-dotted border-zinc-400 text-center flex flex-col items-center">
                            <CustomBarcode value={selectedOrderForLabel.id} />
                            <span className="text-[8px] tracking-[4px] font-black mt-1">{selectedOrderForLabel.id}</span>
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <div className="text-center space-y-2 text-zinc-400 my-auto">
                        <Printer className="w-10 h-10 mx-auto animate-bounce text-zinc-500" />
                        <p className="text-xs font-semibold">Sticker Tray Empty</p>
                        <p className="text-[10px] max-w-[200px] text-zinc-500">Awaiting direct inside/outside print allocation stream calibration.</p>
                      </div>
                    )}

                    {/* Printer horizontal cutter aperture graphics */}
                    <div className="absolute top-[15%] left-0 right-0 h-1 bg-black border-y border-zinc-800 pointer-events-none z-10"></div>
                  </div>

                  {/* Options actions panel */}
                  <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                    <button
                      onClick={() => {
                        setThermalPrintStep('printing');
                        setTimeout(() => {
                          setThermalPrintStep('completed');
                          addNotification({
                            title: '🖨️ Dual Fulfillment Slips Generation',
                            message: `Direct thermo heat for Order ${selectedOrderForLabel.id} completed. Pasting outer label and interior invoice ready!`,
                            type: 'system'
                          });
                        }, 2200);
                      }}
                      className="bg-emerald-500 hover:bg-emerald-600 font-bold py-3 px-4 text-white rounded-xl text-center cursor-pointer flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-transform"
                    >
                      <Printer className="w-4 h-4" /> Simulate Sticker Print
                    </button>

                    <button
                      onClick={() => {
                        // Open native browser print preview styled receipt containing BOTH forms
                        const printWin = window.open('', '', 'width=600,height=800');
                        if (printWin) {
                          const sAddress = selectedOrderForLabel.items[0]?.sellerId === 'sell-alpha' ? '888 Mission St, San Francisco, CA 94103' : selectedOrderForLabel.items[0]?.sellerId === 'sell-beta' ? '321 Canvas Way, San Francisco, CA 94102' : selectedOrderForLabel.items[0]?.sellerId === 'sell-gamma' ? '1042 Valencia St, San Francisco, CA 94110' : (storeAddressInput);
                          const sName = selectedOrderForLabel.items[0]?.sellerName || sellerProfile.storeName;
                          printWin.document.write(`
                            <html>
                              <head>
                                <title>MapStore Full Fulfillment Labels: ${selectedOrderForLabel.id}</title>
                                <style>
                                  body { font-family: monospace; display: flex; justify-content: center; align-items: center; padding: 25px; margin: 0; background: #ffffff; }
                                  .container { width: 380px; display: flex; flex-direction: column; gap: 20px; }
                                  .ticket { border: 3px dashed black; padding: 20px; text-align: left; background: #ffffff; }
                                  .header { text-align: center; border-bottom: 2px dashed black; padding-bottom: 10px; margin-bottom: 15px; }
                                  .title { font-weight: bold; font-size: 15px; text-transform: uppercase; }
                                  .instruction { font-weight: bold; font-size: 10px; background: #000000; color: #ffffff; padding: 4px; text-align: center; margin-top: 5px; border-radius: 4px; text-transform: uppercase; }
                                  .section { border-bottom: 1px dashed black; padding-bottom: 10px; margin-bottom: 15px; font-size: 11px; }
                                  .bold { font-weight: bold; }
                                  .row { display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px; }
                                  .barcode-box { text-align: center; margin-top: 15px; }
                                  .barcode { font-size: 24px; font-weight: bold; letter-spacing: 5px; }
                                  .cut-line { text-align: center; font-size: 9px; color: #555555; font-weight: bold; margin: 10px 0; border: 1px dotted #ccc; padding: 4px; }
                                </style>
                              </head>
                              <body>
                                <div class="container">
                                  <!-- BUYER SLIP -->
                                  <div class="ticket">
                                    <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px dashed black; padding-bottom: 8px; margin-bottom: 12px;">
                                      <div style="display: flex; align-items: center; gap: 6px; text-align: left;">
                                        <div style="color: #10b981; width: 20px; height: 20px;">
                                          <svg viewBox="0 0 100 100" style="width: 100%; height: 100%; fill: currentColor;">
                                            <g transform="translate(50,50)">
                                              <rect x="-6" y="-35" width="12" height="26" rx="6" transform="rotate(0)" />
                                              <rect x="-6" y="-35" width="12" height="26" rx="6" transform="rotate(45)" />
                                              <rect x="-6" y="-35" width="12" height="26" rx="6" transform="rotate(90)" />
                                              <rect x="-6" y="-35" width="12" height="26" rx="6" transform="rotate(135)" />
                                              <rect x="-6" y="-35" width="12" height="26" rx="6" transform="rotate(180)" />
                                              <rect x="-6" y="-35" width="12" height="26" rx="6" transform="rotate(225)" />
                                              <rect x="-6" y="-35" width="12" height="26" rx="6" transform="rotate(270)" />
                                              <rect x="-6" y="-35" width="12" height="26" rx="6" transform="rotate(315)" />
                                              <circle cx="0" cy="0" r="8" fill="white" />
                                            </g>
                                          </svg>
                                        </div>
                                        <div>
                                          <div style="font-size: 15px; font-weight: 900; font-family: sans-serif; letter-spacing: -0.5px; line-height: 1;">MapStore</div>
                                          <div style="font-size: 8px; font-style: italic; color: #555; text-transform: uppercase; margin-top: 2px; line-height: 1;">Reaching you</div>
                                        </div>
                                      </div>
                                      <div style="text-align: right;">
                                        <div style="font-size: 11px; font-weight: bold; background: black; color: white; padding: 2px 6px; border-radius: 4px; text-transform: uppercase;">INVOICE SLIP</div>
                                        <div style="font-size: 8px; color: #666; font-style: italic; margin-top: 2px;">Put Inside Package</div>
                                      </div>
                                    </div>
                                    <div style="font-size: 10px; margin-bottom: 10px; font-weight: bold;">Ref Order #: ${selectedOrderForLabel.id} | Date: ${new Date().toLocaleDateString()}</div>
                                    <div class="section">
                                      <div class="bold">BUYER CUSTOMER:</div>
                                      <div>Name: ${selectedOrderForLabel.buyerName}</div>
                                      <div>Email: ${selectedOrderForLabel.buyerEmail}</div>
                                    </div>
                                    <div class="section">
                                      <div class="bold" style="margin-bottom: 6px;">ORDERED ITEMS:</div>
                                      ${selectedOrderForLabel.items.map(it => `
                                        <div class="row">
                                          <span>${it.productTitle} (x${it.quantity})</span>
                                          <span class="bold">${selectedRegion.currencySymbol}${(it.price * selectedRegion.exchangeRate * it.quantity).toFixed(2)}</span>
                                        </div>
                                      `).join('')}
                                    </div>
                                    <div class="row" style="font-size: 12px; font-weight: bold; margin-top: 10px; border-top: 1px dotted black; padding-top: 5px;">
                                      <span>GRAND TOTAL:</span>
                                      <span>${selectedRegion.currencySymbol}${(selectedOrderForLabel.totalPrice * selectedRegion.exchangeRate).toFixed(2)}</span>
                                    </div>
                                    <div style="text-align: center; font-size: 9px; margin-top: 20px; font-style: italic;">
                                      Thank you for shopping on MapStore!
                                    </div>
                                  </div>

                                  <div class="cut-line">✂️ CUT ALONG DOTTED LINE TO EXTRUDE SLIPS ✂️</div>

                                  <!-- WRITING SLIP -->
                                  <div class="ticket">
                                    <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px dashed black; padding-bottom: 8px; margin-bottom: 12px;">
                                      <div style="display: flex; align-items: center; gap: 6px; text-align: left;">
                                        <div style="color: #10b981; width: 20px; height: 20px;">
                                          <svg viewBox="0 0 100 100" style="width: 100%; height: 100%; fill: currentColor;">
                                            <g transform="translate(50,50)">
                                              <rect x="-6" y="-35" width="12" height="26" rx="6" transform="rotate(0)" />
                                              <rect x="-6" y="-35" width="12" height="26" rx="6" transform="rotate(45)" />
                                              <rect x="-6" y="-35" width="12" height="26" rx="6" transform="rotate(90)" />
                                              <rect x="-6" y="-35" width="12" height="26" rx="6" transform="rotate(135)" />
                                              <rect x="-6" y="-35" width="12" height="26" rx="6" transform="rotate(180)" />
                                              <rect x="-6" y="-35" width="12" height="26" rx="6" transform="rotate(225)" />
                                              <rect x="-6" y="-35" width="12" height="26" rx="6" transform="rotate(270)" />
                                              <rect x="-6" y="-35" width="12" height="26" rx="6" transform="rotate(315)" />
                                              <circle cx="0" cy="0" r="8" fill="white" />
                                            </g>
                                          </svg>
                                        </div>
                                        <div>
                                          <div style="font-size: 15px; font-weight: 900; font-family: sans-serif; letter-spacing: -0.5px; line-height: 1;">MapStore</div>
                                          <div style="font-size: 8px; font-style: italic; color: #555; text-transform: uppercase; margin-top: 2px; line-height: 1;">Reaching you</div>
                                        </div>
                                      </div>
                                      <div style="text-align: right;">
                                        <div style="font-size: 11px; font-weight: bold; background: black; color: white; padding: 2px 6px; border-radius: 4px; text-transform: uppercase;">SHIPPING SLIP</div>
                                        <div style="font-size: 8px; color: #666; font-style: italic; margin-top: 2px;">Paste Outside Package</div>
                                      </div>
                                    </div>
                                    <div style="font-size: 10px; margin-bottom: 10px; font-weight: bold;">Ref Order ID: ${selectedOrderForLabel.id}</div>
                                    <div class="section">
                                      <div class="bold">SENDER (SELLER):</div>
                                      <div>${sName}</div>
                                      <div>${sAddress}</div>
                                    </div>
                                    <div class="section">
                                      <div class="bold">TO (RECIPIENT BUYER DESTINATION):</div>
                                      <div>${selectedOrderForLabel.shippingAddress.fullName}</div>
                                      <div>${selectedOrderForLabel.shippingAddress.streetAddress}</div>
                                      <div>${selectedOrderForLabel.shippingAddress.city}, ${selectedOrderForLabel.shippingAddress.postalCode}</div>
                                      <div class="bold" style="margin-top: 4px;">Phone: ${selectedOrderForLabel.shippingAddress.phone}</div>
                                    </div>
                                    <div class="barcode-box">
                                      <div class="barcode">|||| | ||||| | ||| |</div>
                                      <div style="font-size: 12px; font-weight: bold; margin-top: 4px; letter-spacing: 2px;">${selectedOrderForLabel.id}</div>
                                    </div>
                                    <div style="text-align: center; font-size: 7px; color: #555555; margin-top: 15px; border-top: 1px dashed black; padding-top: 10px;">
                                      SECURE LOGISTICS SLIP - SCAN AT DEPARTURE & ROUTING HUB
                                    </div>
                                  </div>
                                </div>
                                <script>
                                  window.onload = function() { window.print(); window.close(); }
                                </script>
                              </body>
                            </html>
                          `);
                          printWin.document.close();
                        } else {
                          // Fallback warning info alert
                          alert("A window pop-up has been blocked. We highly recommend using the real print animation directly!");
                        }
                      }}
                      className="bg-zinc-805 bg-zinc-800 hover:bg-zinc-700 text-white font-extrabold py-3 px-4 rounded-xl text-center cursor-pointer flex items-center justify-center gap-1.5 border border-zinc-705 shadow"
                    >
                      <Printer className="w-4 h-4" /> Real Print Slip
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
 
          <AnimatePresence>
            {isWithdrawModalOpen && (
              <div className="fixed inset-0 bg-black/75 backdrop-blur-xs z-50 flex items-center justify-center p-4 font-sans">
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  className="bg-white dark:bg-zinc-950 border border-gray-100 dark:border-zinc-800 p-6 rounded-3xl max-w-md w-full shadow-2xl space-y-4"
                >
                  <div className="flex justify-between items-center border-b border-gray-100 dark:border-zinc-900 pb-2.5">
                    <div className="flex items-center gap-2">
                      <Wallet className="w-5 h-5 text-emerald-400" />
                      <div>
                        <h3 className="font-extrabold text-sm text-gray-950 dark:text-white font-sans">Secure Cash-Out Portal</h3>
                        <p className="text-[10px] text-zinc-400">Withdraw merchant funds instantly</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setIsWithdrawModalOpen(false);
                        setHasSentWithdrawOtp(false);
                      }}
                      className="text-gray-400 hover:text-red-500 font-bold text-xs uppercase p-1.5 cursor-pointer font-sans"
                    >
                      Close Window
                    </button>
                  </div>

                  {/* Active available balance banner */}
                  <div className="p-3 bg-zinc-50 dark:bg-zinc-900/60 rounded-2xl border border-gray-100 dark:border-zinc-850 flex items-center justify-between text-xs">
                    <span className="text-zinc-400 font-medium">Available Payout Net:</span>
                    <span className="font-black text-emerald-500 font-mono text-sm">
                      {selectedRegion.currencySymbol}{(availableBalance * selectedRegion.exchangeRate).toFixed(2)}
                    </span>
                  </div>

                  <form onSubmit={handleProcessWithdrawal} className="space-y-4 font-sans text-left">
                    {/* Amount Input */}
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1.5">
                        Withdraw Amount ({selectedRegion.currencySymbol})
                      </label>
                      <div className="relative rounded-xl shadow-xs">
                        <input
                          type="number"
                          step="any"
                          required
                          value={withdrawInputAmount}
                          onChange={(e) => setWithdrawInputAmount(e.target.value)}
                          max={(availableBalance * selectedRegion.exchangeRate).toFixed(2)}
                          min="1"
                          className="w-full bg-zinc-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl p-2.5 text-xs text-gray-850 dark:text-zinc-150 font-bold"
                          placeholder={`Max ${(availableBalance * selectedRegion.exchangeRate).toFixed(2)}`}
                        />
                      </div>
                      <span className="text-[10px] text-zinc-400 block mt-1 italic font-mono text-left">
                        Base deduction rate: R{(Number(withdrawInputAmount) / selectedRegion.exchangeRate || 0).toFixed(2)}
                      </span>
                    </div>

                    {/* Settlement Method Selector */}
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1.5">
                        Select Settlement Channel
                      </label>
                      <select
                        value={withdrawChannel}
                        onChange={(e) => {
                          setWithdrawChannel(e.target.value);
                          setWithdrawAccountDetails('');
                        }}
                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-gray-155 dark:border-zinc-855 rounded-xl p-2 text-xs text-gray-850 dark:text-zinc-150"
                      >
                        <option value="bank">🇿🇦 EFT South African Bank Wire</option>
                        <option value="paypal">🌐 PayPal Registered Brand payout</option>
                        <option value="momo">📱 Recipient Mobile Money / eWallet</option>
                        <option value="crypto">🔒 Tether USD (USDT-TRC20) Secure blockchain</option>
                      </select>
                    </div>

                    {/* Payout accounts destination fields */}
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1.5">
                        {withdrawChannel === 'bank' && "EFT Settlement Bank & Account Details"}
                        {withdrawChannel === 'paypal' && "PayPal Registered Payout Email Address"}
                        {withdrawChannel === 'momo' && "Recipient Mobile Money Cell Number"}
                        {withdrawChannel === 'crypto' && "USDT-TRC20 Private Wallet Coordinate Address"}
                      </label>
                      <textarea
                        required
                        rows={2}
                        value={withdrawAccountDetails}
                        onChange={(e) => setWithdrawAccountDetails(e.target.value)}
                        className="w-full bg-zinc-50 dark:bg-zinc-955 border border-gray-250 dark:border-zinc-805 rounded-xl p-2.5 text-xs text-gray-850 dark:text-zinc-200 font-mono"
                        placeholder={
                          withdrawChannel === 'bank' ? "Bank Name (FNB/Standard Bank/Capitec, etc.),\nBranch Code,\nAccount Holder,\nAccount Number" :
                          withdrawChannel === 'paypal' ? "e.g., payouts@mapstoremerchant.co" :
                          withdrawChannel === 'momo' ? "e.g., Mobile Phone +27 82 123 4567" : "e.g., TWM8eE7YfT9b2KsmZ8D..."
                        }
                      />
                    </div>

                    {/* Safe Authentication with real OTP */}
                    <div className="pt-2.5 border-t border-gray-100 dark:border-zinc-900">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] uppercase font-extrabold tracking-wider text-zinc-400 block">2-Factor Authentication Secure Verification</span>
                      </div>

                      {!hasSentWithdrawOtp ? (
                        <button
                          type="button"
                          onClick={handleGenerateAndSendOtp}
                          className="w-full bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-850 text-gray-800 dark:text-zinc-200 text-[10px] font-extrabold py-2 px-3 rounded-xl transition-all border border-gray-150 dark:border-zinc-800 flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                        >
                          <Key className="w-3.5 h-3.5 text-amber-500" /> Send Secure 2FA Cash-Out PIN
                        </button>
                      ) : (
                        <div className="space-y-2">
                          <div className="text-[10px] text-amber-600 dark:text-amber-500 font-bold bg-amber-500/10 p-2 rounded-xl border border-amber-500/20 leading-tight">
                            🔑 Secure Authorization Code sent to SMS inbox! Enter the code shown in your notifications tray to proceed.
                          </div>
                          <div className="flex gap-2.5">
                            <input
                              type="text"
                              maxLength={4}
                              required
                              value={withdrawOtpInput}
                              onChange={(e) => setWithdrawOtpInput(e.target.value)}
                              placeholder="PIN"
                              className="w-1/2 bg-zinc-50 dark:bg-zinc-955 border border-gray-200 dark:border-zinc-800 rounded-xl p-2 text-center text-xs font-mono font-bold text-gray-900 dark:text-white tracking-[6px]"
                            />
                            <button
                              type="button"
                              onClick={handleGenerateAndSendOtp}
                              className="w-1/2 bg-transparent text-[9.5px] font-bold text-zinc-400 hover:text-emerald-500 border border-gray-200 dark:border-zinc-800 rounded-xl cursor-pointer"
                            >
                              Resend OTP PIN
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Dispatch Button */}
                    <button
                      type="submit"
                      disabled={!hasSentWithdrawOtp || !withdrawOtpInput || Number(withdrawInputAmount) <= 0 || (Number(withdrawInputAmount) / selectedRegion.exchangeRate > availableBalance)}
                      className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-zinc-100 dark:disabled:bg-zinc-900 disabled:text-zinc-400 dark:disabled:text-zinc-650 text-white font-black py-3 rounded-xl text-xs transition-colors cursor-pointer text-center mt-3 flex items-center justify-center gap-1.5 shadow-md font-sans uppercase"
                    >
                      <Lock className="w-4 h-4 text-white" /> Complete Verification & Out
                    </button>
                  </form>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* MapStore Seller Wallet History Ledger and SafeGuard Guidelines */}
          {sellerSubTab === 'overview' && (
            <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-6 rounded-3xl shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-50 dark:border-zinc-950">
              <div>
                <h3 className="font-extrabold text-sm text-gray-900 dark:text-white font-sans flex items-center gap-1.5">
                  <Wallet className="w-4.5 h-4.5 text-emerald-400" /> MapStore Wallet & Payout History
                </h3>
                <p className="text-[11px] text-gray-450 mt-0.5">Track, audit, and withdraw funds with complete security logs.</p>
              </div>
              <button
                onClick={() => {
                  setWithdrawInputAmount(availableBalance.toFixed(2));
                  setIsWithdrawModalOpen(true);
                }}
                disabled={availableBalance <= 0}
                className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-zinc-100 dark:disabled:bg-zinc-950 disabled:text-zinc-400 dark:disabled:text-zinc-650 font-bold text-white text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer transition-all self-start sm:self-auto shadow-xs animate-pulse"
              >
                <ArrowDownRight className="w-4 h-4" /> {t('withdraw_funds')}
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Side Ledger List */}
              <div className="lg:col-span-2 space-y-3">
                <span className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-gray-405 block">Payout History Ledger Transcript</span>
                {withdrawalHistory.length > 0 ? (
                  <div className="overflow-x-auto border border-gray-100 dark:border-zinc-850 rounded-2xl">
                    <table className="w-full text-left text-xs text-gray-550 dark:text-zinc-400 border-collapse">
                      <thead>
                        <tr className="bg-zinc-50 dark:bg-zinc-950 border-b border-gray-100 dark:border-zinc-850 text-[10px] font-mono uppercase font-bold text-gray-400">
                          <th className="p-3 text-left">Transaction ID</th>
                          <th className="p-3 text-left">Date / Timestamp</th>
                          <th className="p-3 text-left">Payout Method & Destination</th>
                          <th className="p-3 text-right">Amount Out</th>
                          <th className="p-3 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-zinc-850">
                        {withdrawalHistory.map((w, index) => (
                          <tr key={index} className="hover:bg-zinc-50 dark:hover:bg-zinc-955 transition-colors font-sans">
                            <td className="p-3 font-mono font-bold text-gray-900 dark:text-zinc-300">{w.id}</td>
                            <td className="p-3 text-zinc-400 text-[10px] font-mono">{w.date}</td>
                            <td className="p-3">
                              <span className="font-bold text-gray-800 dark:text-zinc-150 block text-[11px]">{w.method}</span>
                              <span className="text-[10px] text-zinc-400 font-mono block leading-tight">{w.destination}</span>
                            </td>
                            <td className="p-3 text-right font-black text-rose-500 text-[11.5px]">
                              -{selectedRegion.currencySymbol}{(w.amount * selectedRegion.exchangeRate).toFixed(2)}
                            </td>
                            <td className="p-3 text-right">
                              <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-500 text-[9.5px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                                ✓ {w.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-10 bg-zinc-50 dark:bg-zinc-950 border border-dashed border-gray-200 dark:border-zinc-800 rounded-3xl">
                    <Wallet className="w-8 h-8 text-zinc-300 dark:text-zinc-700 mx-auto mb-2 animate-bounce" />
                    <p className="text-xs text-zinc-400 font-bold">No payouts initiated yet.</p>
                    <p className="text-[10px] text-zinc-500 mt-1">Acquire and settle platform sells to withdraw funds to your bank.</p>
                  </div>
                )}
              </div>

              {/* Right Side SafeGuard Policy Details */}
              <div className="bg-zinc-50 dark:bg-zinc-950 border border-gray-150 dark:border-zinc-850 p-5 rounded-3xl flex flex-col justify-between space-y-4">
                <div className="space-y-3.5">
                  <span className="text-[10px] font-mono tracking-widest uppercase font-extrabold text-[#5eead4] dark:text-[#4ade80]">MapStore Wallet SafeGuard</span>
                  <div className="space-y-3 text-xs text-gray-650 dark:text-zinc-305 leading-relaxed font-sans">
                    <div>
                      <strong className="block text-gray-900 dark:text-zinc-200 mb-0.5">When can I withdraw?</strong>
                      <span>Withdrawals can be executed instantly at any time as soon as secure funds settle in your merchant ledger wallet.</span>
                    </div>
                    <div>
                      <strong className="block text-gray-900 dark:text-zinc-200 mb-0.5">What is the processing time?</strong>
                      <span>All domestic EFT wire requests clear within 2-4 business hours. PayPal and mobile money e-wallet cash transfers dispatch instantly.</span>
                    </div>
                    <div>
                      <strong className="block text-gray-900 dark:text-zinc-200 mb-0.5">How are platform commissions handled?</strong>
                      <span>MapStore automatically deducts a secure and flat 7% commission fees per sale, allowing you to withdraw 93% with zero hidden fees!</span>
                    </div>
                  </div>
                </div>
                <div className="pt-3 border-t border-dashed border-gray-200 dark:border-zinc-855 flex items-center gap-2 text-[10px] text-zinc-400 leading-tight">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>AES-256 Wallet Ledger encryption guarantees secure global settlements.</span>
                </div>
              </div>
            </div>
          </div>
          )}

          {/* 2. Products List and inventory controls */}
          {sellerSubTab === 'inventory' && (
            <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-6 rounded-3xl shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-3 border-b border-gray-50 dark:border-zinc-950 animate-fade-in">
                <div>
                  <h3 className="font-extrabold text-sm text-gray-900 dark:text-white font-sans flex items-center gap-1.5">
                    Listings & Product Inventory
                  </h3>
                  <p className="text-[11px] text-gray-405 mt-0.5 animate-pulse">Manage and add products verified for platforms coordinates.</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCsvBulkPanel(!showCsvBulkPanel);
                      setShowAddForm(false);
                    }}
                    className={`font-semibold text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer border shadow-xs relative transition-all ${
                      showCsvBulkPanel 
                        ? 'bg-zinc-800 hover:bg-zinc-900 text-white dark:bg-zinc-200 dark:text-black dark:hover:bg-white border-zinc-700' 
                        : 'bg-emerald-50 hover:bg-emerald-100/90 text-emerald-700 border-emerald-300 dark:bg-emerald-950/25 dark:text-emerald-405 dark:border-emerald-800/60 ring-2 ring-emerald-500/10'
                    }`}
                    id="btn-bulk-csv-manager"
                  >
                    <FileText className="w-4 h-4 text-emerald-500" />
                    <span>{showCsvBulkPanel ? "Close Bulk CSV" : "Bulk CSV Manager"}</span>
                    <span className="flex h-1.5 w-1.5 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-450 bg-emerald-405 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      setShowAddForm(!showAddForm);
                      setShowCsvBulkPanel(false);
                    }}
                    className="bg-emerald-500 hover:bg-emerald-600 font-bold text-white text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-1 cursor-pointer transition-transform"
                    id="btn-add-product"
                  >
                    <Plus className="w-4 h-4" /> {showAddForm ? "Close Form" : "List New Product"}
                  </button>
                </div>
              </div>

              {/* Premium Onboarding Callout Banner for Bulk Actions */}
              {!showCsvBulkPanel && (
                <div 
                  onClick={() => {
                    setShowCsvBulkPanel(true);
                    setShowAddForm(false);
                  }}
                  className="bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/25 dark:border-emerald-500/10 p-4.5 rounded-2xl flex items-center justify-between gap-4 cursor-pointer hover:bg-emerald-500/[0.12] transition-all group duration-300 animate-fade-in"
                  id="bulk-csv-direct-promo-banner"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="p-3 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-xl group-hover:scale-105 transition-transform shrink-0">
                      <FileText className="w-6 h-6 text-emerald-500 dark:text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-2 flex-wrap">
                        ⚡ Power Tool: Bulk CSV Catalog Manager
                        <span className="text-[8.5px] tracking-normal bg-emerald-505 bg-emerald-500 text-zinc-950 px-1.5 py-0.5 rounded-md font-extrabold uppercase animate-pulse">
                          Highly Recommended
                        </span>
                      </h4>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                        Have multiple products or pricing changes? Drag and drop spreadsheet templates to instantly sync, update, or create hundreds of listings.
                      </p>
                    </div>
                  </div>
                  <div className="shrink-0 flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-extrabold group-hover:translate-x-1 transition-transform">
                    Open Engine ➔
                  </div>
                </div>
              )}

            {/* Bulk CSV Manager Panel */}
            <AnimatePresence>
              {showCsvBulkPanel && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="bg-zinc-50 dark:bg-zinc-950 p-5 rounded-2xl border border-gray-150 dark:border-zinc-850 space-y-4 overflow-hidden"
                  id="panel-bulk-csv"
                >
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="space-y-1">
                      <h4 className="font-bold text-xs text-gray-900 dark:text-white uppercase tracking-wider">Bulk CSV Product Management</h4>
                      <p className="text-[11px] text-zinc-400">
                        Upload a CSV spreadsheet to add new products in bulk or update existing ones by specifying their <code className="font-mono text-emerald-500">id</code>.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleExportCatalogCSV}
                        className="bg-zinc-150 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-750 text-gray-700 dark:text-zinc-200 text-[10px] font-bold px-3 py-1.5 rounded-xl cursor-pointer flex items-center gap-1 transition-all"
                        id="btn-export-catalog-csv"
                      >
                        <Download className="w-3.5 h-3.5 text-emerald-500" /> Export Catalog CSV
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const headers = 'id,title,description,price,category,stock,imageUrl,width_cm,length_cm,height_cm,videoUrl,global_shipping';
                          const sampleRow = ',Specimen Leather Backpack,"Authentic water-resistant carryall with premium hardware and laptop compartments.",890.00,Handcrafted,15,https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400,32.0,15.5,45.0,,TRUE';
                          const blob = new Blob([[headers, sampleRow].join('\n')], { type: 'text/csv' });
                          const url = URL.createObjectURL(blob);
                          const link = document.createElement("a");
                          link.href = url;
                          link.download = "mapstore_bulk_template.csv";
                          link.click();
                        }}
                        className="bg-zinc-150 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-750 text-gray-700 dark:text-zinc-200 text-[10px] font-bold px-3 py-1.5 rounded-xl cursor-pointer flex items-center gap-1 transition-all"
                        id="btn-download-template"
                      >
                        <FileText className="w-3.5 h-3.5 text-blue-500" /> Template.csv
                      </button>
                    </div>
                  </div>

                  {/* Drag-and-drop workspace */}
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDraggingCsv(true);
                    }}
                    onDragLeave={() => setIsDraggingCsv(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDraggingCsv(false);
                      const file = e.dataTransfer.files?.[0];
                      if (file && (file.type === 'text/csv' || file.name.endsWith('.csv'))) {
                        const reader = new FileReader();
                        reader.onload = (evt) => {
                          if (evt.target?.result) {
                            processCSVText(evt.target.result as string);
                          }
                        };
                        reader.readAsText(file);
                      } else {
                        addNotification({
                          title: '⚠️ File Rejected',
                          message: 'Please drop a valid .csv file.',
                          type: 'system'
                        });
                      }
                    }}
                    className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-colors ${
                      isDraggingCsv 
                        ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/10' 
                        : 'border-zinc-300 dark:border-zinc-850 hover:border-zinc-400 dark:hover:border-zinc-750'
                    }`}
                    onClick={() => document.getElementById('csv-file-selector')?.click()}
                  >
                    <Upload className="w-8 h-8 text-zinc-400 mx-auto mb-2 animate-bounce" />
                    <p className="text-xs font-bold text-gray-700 dark:text-zinc-300">
                      Drag & Drop your product CSV file here, or <span className="text-emerald-505 text-emerald-500 underline">browse computer</span>
                    </p>
                    <p className="text-[10px] text-zinc-400 mt-1">Supports bulk creation & updates matching existing IDs</p>
                    <input
                      id="csv-file-selector"
                      type="file"
                      accept=".csv"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (evt) => {
                            if (evt.target?.result) {
                              processCSVText(evt.target.result as string);
                            }
                          };
                          reader.readAsText(file);
                        }
                      }}
                    />
                  </div>

                  {/* Preview of Parsed Rows */}
                  {csvPreview && (
                    <div className="bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-855 rounded-xl p-4.5 space-y-3.5">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 pb-2.5 border-b border-gray-50 dark:border-zinc-950">
                        <div>
                          <h5 className="font-extrabold text-xs text-gray-900 dark:text-white uppercase">Spreadsheet Import Preview</h5>
                          <div className="flex gap-2.5 mt-1 text-[10px] font-semibold text-zinc-450">
                            <span className="flex items-center gap-1">
                              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                              Create: {csvPreview.createCount} Items
                            </span>
                            <span className="flex items-center gap-1">
                              <span className="w-2 h-2 rounded-full bg-blue-500 inline-block"></span>
                              Update: {csvPreview.updateCount} Listings
                            </span>
                            {csvPreview.errors.length > 0 && (
                              <span className="flex items-center gap-1 text-rose-500">
                                <AlertTriangle className="w-3.5 h-3.5" />
                                Errors: {csvPreview.errors.length} Row(s)
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setCsvPreview(null)}
                            className="bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-750 text-gray-700 dark:text-zinc-250 text-[10px] font-bold px-3 py-1.5 rounded-lg cursor-pointer"
                          >
                            Clear Sheet
                          </button>
                          <button
                            type="button"
                            onClick={handleCommitCSVImport}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-extrabold px-3.5 py-1.5 rounded-lg cursor-pointer transition-all shadow-xs"
                          >
                            Commit Commits ({csvPreview.rows.filter(r => !r.validationError).length} valid rows)
                          </button>
                        </div>
                      </div>

                      {/* Display CSV errors alert box if any exist */}
                      {csvPreview.errors.length > 0 && (
                        <div className="bg-rose-50 dark:bg-rose-950/20 border-l-4 border-rose-500 text-rose-700 dark:text-rose-350 p-3 rounded-r-xl space-y-1 text-[10.5px]">
                          <strong className="block text-xs">Correction Suggestions Needed:</strong>
                          <ul className="list-disc leading-relaxed pl-4 space-y-0.5">
                            {csvPreview.errors.slice(0, 4).map((err, i) => (
                              <li key={i}>{err}</li>
                            ))}
                            {csvPreview.errors.length > 4 && (
                              <li className="font-bold underline">And {csvPreview.errors.length - 4} more validation bugs...</li>
                            )}
                          </ul>
                        </div>
                      )}

                      {/* Parsed lists container table */}
                      <div className="overflow-x-auto max-h-[220px]">
                        <table className="col-span-full w-full text-left text-[10.5px]">
                          <thead className="bg-zinc-50 dark:bg-zinc-950/60 font-bold text-zinc-400 border-b border-gray-150 dark:border-zinc-850">
                            <tr>
                              <th className="p-2">Line</th>
                              <th className="p-2">Action</th>
                              <th className="p-2">ID</th>
                              <th className="p-2">Product Title</th>
                              <th className="p-2">Price (Local)</th>
                              <th className="p-2">Category</th>
                              <th className="p-2">Stock</th>
                              <th className="p-2 text-right">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50 dark:divide-zinc-900">
                            {csvPreview.rows.map((row, idx) => (
                              <tr key={idx} className={`hover:bg-zinc-50/55 dark:hover:bg-zinc-900/30 ${row.validationError ? 'bg-rose-50/30 dark:bg-rose-950/5' : ''}`}>
                                <td className="p-2 font-mono text-zinc-450">{row.rowNumber}</td>
                                <td className="p-2">
                                  <span className={`px-1.5 py-0.5 font-bold uppercase text-[8px] rounded ${
                                    row.action === 'create' ? 'bg-emerald-500/15 text-emerald-500' : 'bg-blue-500/15 text-blue-500'
                                  }`}>
                                    {row.action}
                                  </span>
                                </td>
                                <td className="p-2 font-mono text-zinc-500 text-[9px]">{row.id || 'NEW'}</td>
                                <td className="p-2 font-bold text-gray-805 dark:text-zinc-200">{row.title || 'Untitled'}</td>
                                <td className="p-2 font-semibold">
                                  {selectedRegion.currencySymbol}{row.priceLocal.toFixed(2)}
                                  <span className="text-[8.5px] text-zinc-400 font-normal"> ({selectedRegion.currencyCode})</span>
                                </td>
                                <td className="p-2 text-zinc-450">{row.category}</td>
                                <td className="p-2 font-mono">{row.stock} pcs</td>
                                <td className="p-2 text-right">
                                  {row.validationError ? (
                                    <span className="text-rose-500 font-extrabold flex items-center justify-end gap-1" title={row.validationError}>
                                      <AlertTriangle className="w-3 h-3" /> Error
                                    </span>
                                  ) : (
                                    <span className="text-emerald-505 text-emerald-500 font-bold flex items-center justify-end gap-1">
                                      <Check className="w-3 h-3" /> Ready
                                    </span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Add product form */}
            <AnimatePresence>
              {showAddForm && (
                <motion.form
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  onSubmit={handleAddProduct}
                  className="bg-zinc-50 dark:bg-zinc-950 p-5 rounded-2xl border border-gray-150 dark:border-zinc-850 space-y-4 overflow-hidden"
                  id="form-add-product"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1.5">Product Title</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Handmade Leather Messenger Bag"
                        value={newProduct.title}
                        onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                        className="w-full bg-white dark:bg-zinc-900 border border-gray-250 dark:border-zinc-800 rounded-xl p-2.5 text-xs text-gray-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1.5">Category</label>
                      <select
                        value={newProduct.category}
                        onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                        className="w-full bg-white dark:bg-zinc-900 border border-gray-250 dark:border-zinc-800 rounded-xl p-2.5 text-xs text-gray-800 dark:text-white focus:outline-hidden"
                      >
                        {CATEGORIES.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1.5">Selling Price ({selectedRegion.currencySymbol})</label>
                      <input
                        type="number"
                        required
                        min="1"
                        step="0.01"
                        placeholder="35.00"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                        className="w-full bg-white dark:bg-zinc-900 border border-gray-250 dark:border-zinc-800 rounded-xl p-2.5 text-xs text-gray-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1.5">Initial Stock</label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={newProduct.stock}
                        onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                        className="w-full bg-white dark:bg-zinc-900 border border-gray-250 dark:border-zinc-800 rounded-xl p-2.5 text-xs text-gray-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1.5">📐 Length (cm)</label>
                      <input
                        type="number"
                        step="0.1"
                        required
                        value={newProduct.latitude}
                        onChange={(e) => setNewProduct({ ...newProduct, latitude: e.target.value })}
                        className="w-full bg-white dark:bg-zinc-900 border border-gray-250 dark:border-zinc-800 rounded-xl p-2.5 text-xs text-gray-800 dark:text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1.5">📐 Width (cm)</label>
                      <input
                        type="number"
                        step="0.1"
                        required
                        value={newProduct.longitude}
                        onChange={(e) => setNewProduct({ ...newProduct, longitude: e.target.value })}
                        className="w-full bg-white dark:bg-zinc-900 border border-gray-250 dark:border-zinc-800 rounded-xl p-2.5 text-xs text-gray-800 dark:text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1.5">📐 Height (cm)</label>
                      <input
                        type="number"
                        step="0.1"
                        required
                        value={(newProduct as any).height || ''}
                        onChange={(e) => setNewProduct({ ...newProduct, height: e.target.value })}
                        className="w-full bg-white dark:bg-zinc-900 border border-gray-250 dark:border-zinc-800 rounded-xl p-2.5 text-xs text-gray-800 dark:text-white font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-zinc-100/50 dark:bg-zinc-900/60 p-3.5 rounded-2xl border border-gray-150 dark:border-zinc-850">
                    <div>
                      <label className="block text-[10px] uppercase font-extrabold text-[#5eead4] dark:text-[#4ade80] mb-1.5">🌍 Origin Warehousing Jurisdiction</label>
                      <select
                        value={newProduct.originRegion}
                        onChange={(e) => setNewProduct({ ...newProduct, originRegion: e.target.value })}
                        className="w-full bg-white dark:bg-zinc-950 border border-gray-250 dark:border-zinc-800 rounded-xl p-2.5 text-xs text-gray-800 dark:text-zinc-200 font-bold focus:outline-hidden"
                      >
                        <option value="ZA">🇿🇦 South Africa (ZAR)</option>
                        <option value="CN">🇨🇳 China (CNY)</option>
                        <option value="US">🇺🇸 United States (USD)</option>
                        <option value="EU">🇪🇺 European Union (EUR)</option>
                        <option value="GB">🇬🇧 United Kingdom (GBP)</option>
                        <option value="JP">🇯🇵 Japan (JPY)</option>
                        <option value="AU">🇦🇺 Australia (AUD)</option>
                        <option value="CA">🇨🇦 Canada (CAD)</option>
                        <option value="IN">🇮🇳 India (INR)</option>
                        <option value="BR">🇧🇷 Brazil (BRL)</option>
                      </select>
                      <span className="text-[10px] text-gray-400 block mt-1">Sets primary dispatch currency & closest regional hub.</span>
                    </div>

                    <div className="flex flex-col justify-center">
                      <label className="block text-[10px] uppercase font-extrabold text-[#5eead4] dark:text-[#4ade80] mb-1.5">✈️ Transit Range</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="opt-global-shipping"
                          checked={newProduct.shippedGlobally}
                          onChange={(e) => setNewProduct({ ...newProduct, shippedGlobally: e.target.checked })}
                          className="accent-emerald-500 h-4 w-4 cursor-pointer"
                        />
                        <label htmlFor="opt-global-shipping" className="text-xs text-gray-700 dark:text-zinc-350 font-medium cursor-pointer select-none">
                          Authorize Global Courier Corridor
                        </label>
                      </div>
                      <span className="text-[10px] text-gray-400 block mt-1">Allows buyers in any jurisdiction to request transit clearings.</span>
                    </div>
                  </div>

                  {/* Custom Multi-Photo Upload From Device */}
                  <div className="bg-zinc-50 dark:bg-zinc-950 p-4 border border-gray-150 dark:border-zinc-855 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="block text-[11px] uppercase font-extrabold text-[#5eead4] dark:text-[#4ade80]">📷 Product Photos Upload</span>
                        <span className="text-[10px] text-gray-400 block mt-0.5">Upload high-res photos from your device (limit of 6).</span>
                      </div>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${uploadedPhotos.length === 6 ? 'bg-amber-100 text-amber-700' : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400'}`}>
                        {uploadedPhotos.length} / 6
                      </span>
                    </div>

                    {photoError && (
                      <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 text-[10px] text-rose-555 dark:text-rose-400 font-bold rounded-lg leading-tight">
                        ⚠️ {photoError}
                      </div>
                    )}

                    {/* Drag & click dropzone style box */}
                    <div 
                      onClick={() => document.getElementById('device-photos-input')?.click()}
                      className="border-2 border-dashed border-gray-200 dark:border-zinc-800 hover:border-emerald-400 dark:hover:border-emerald-600 rounded-xl p-4 text-center cursor-pointer transition-colors bg-white dark:bg-zinc-905 flex flex-col items-center justify-center gap-1"
                    >
                      <Upload className="w-6 h-6 text-gray-400 dark:text-zinc-500" />
                      <span className="text-xs font-bold text-gray-700 dark:text-zinc-350">Click to Select Photos</span>
                      <span className="text-[9px] text-gray-400">Supports JPEG, PNG (Max 6 total)</span>
                      
                      <input 
                        type="file" 
                        multiple 
                        accept="image/*" 
                        className="hidden" 
                        id="device-photos-input" 
                        onChange={handlePhotoUpload} 
                        disabled={uploadedPhotos.length >= 6}
                      />
                    </div>

                    {/* Grid displaying up to 6 uploaded photos */}
                    {uploadedPhotos.length > 0 && (
                      <div className="grid grid-cols-6 gap-2 pt-1" id="uploaded-thumbnails-deck">
                        {uploadedPhotos.map((photo, index) => (
                          <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-150 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center">
                            <img src={photo} alt={`Upload ${index + 1}`} className="w-full h-full object-cover" />
                            {index === 0 && (
                              <span className="absolute bottom-0 inset-x-0 bg-emerald-500 text-white text-[7px] font-black uppercase text-center py-0.5 tracking-wider">
                                Cover
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeUploadedPhoto(index);
                              }}
                              className="absolute top-0.5 right-0.5 p-0.5 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition-colors cursor-pointer"
                              title="Delete Photo"
                            >
                              <style>{`button { cursor: pointer; }`}</style>
                              <Trash2 className="w-2.5 h-2.5" />
                            </button>
                            <span className="absolute top-0.5 left-0.5 bg-black/60 text-white text-[7px] font-mono font-bold px-1 rounded">
                              #{index + 1}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Form URL Option as Fallback */}
                    <div className="pt-2 border-t border-gray-150 dark:border-zinc-900">
                      <label className="block text-[9px] uppercase font-bold text-gray-400 mb-1">Or paste fallback imageUrl directly</label>
                      <input
                        type="text"
                        placeholder="Image URL (e.g., live link if you do not have files)"
                        value={newProduct.imageUrl}
                        onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                        className="w-full bg-white dark:bg-zinc-900 border border-gray-255 dark:border-zinc-850 rounded-lg p-2 text-[10px] text-gray-800 dark:text-white font-mono"
                      />
                    </div>
                  </div>

                  {/* 📷 Live Video Demonstration Showcase Recorder */}
                  <div className="bg-zinc-100/70 dark:bg-zinc-900/40 p-4 border border-gray-200 dark:border-zinc-800 rounded-2xl space-y-3.5">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                          <Video className="w-4 h-4 text-emerald-500/60 animate-pulse" /> Live Demonstration Video (Optional)
                        </h4>
                        <p className="text-[10px] text-gray-450 mt-1">
                          Optional: Record or upload a live video demonstration showing how the product works. You can skip this step freely.
                        </p>
                      </div>
                      {newProduct.videoUrl ? (
                        <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide">
                          ✓ Video Attached
                        </span>
                      ) : (
                        <span className="bg-zinc-200 dark:bg-zinc-800 text-zinc-400 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide">
                          No Video Added
                        </span>
                      )}
                    </div>

                    {/* Camera Control Panel */}
                    <div className="space-y-3">
                      {cameraPermissionError && (
                        <div className="p-3 bg-red-500/15 border border-red-500/30 text-[10.5px] text-red-600 dark:text-red-400 font-sans font-bold leading-relaxed rounded-xl flex items-start gap-2">
                          <span>⚠️</span>
                          <p>{cameraPermissionError}</p>
                        </div>
                      )}

                      {/* Video Stream Preview OR Playback Screen */}
                      {stream ? (
                        <div className="relative aspect-video max-h-56 mx-auto rounded-xl bg-black overflow-hidden border border-zinc-850 shadow-inner flex items-center justify-center">
                          <video
                            ref={(el) => {
                              if (el && stream) {
                                el.srcObject = stream;
                              }
                            }}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-full object-cover"
                          />
                          {isRecording && (
                            <span className="absolute top-3 left-3 flex items-center gap-1.5 bg-rose-600 border border-rose-500 text-white font-mono px-2.5 py-1 rounded-full text-[9px] uppercase font-bold tracking-widest animate-pulse z-50">
                              <span className="w-2.5 h-2.5 rounded-full bg-white block animate-ping"></span>
                              REC {Math.floor(recordingSeconds / 60)}:{(recordingSeconds % 60).toString().padStart(2, '0')}
                            </span>
                          )}
                        </div>
                      ) : recordedVideoUrl ? (
                        <div className="space-y-2">
                          <label className="block text-[10px] uppercase font-bold text-[#5eead4]">Preview Video Demonstration</label>
                          <video
                            src={recordedVideoUrl}
                            controls
                            className="w-full aspect-video max-h-56 mx-auto rounded-xl border border-zinc-800 bg-black shadow-lg"
                          />
                        </div>
                      ) : null}

                      {/* Buttons Action Core Trigger */}
                      <div className="flex flex-wrap items-center gap-2.5">
                        {/* Recording operations */}
                        {!stream && !recordedVideoUrl && (
                          <button
                            type="button"
                            onClick={startRecordingVideo}
                            className="flex-1 min-w-[140px] bg-sky-550 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Camera className="w-4 h-4 text-emerald-400" /> Use Webcam to Record Live
                          </button>
                        )}

                        {isRecording && (
                          <button
                            type="button"
                            onClick={stopRecordingVideo}
                            className="flex-1 bg-rose-600 hover:bg-rose-700 font-bold text-white py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <StopCircle className="w-4 h-4" /> Stop Recording
                          </button>
                        )}

                        {/* If recorded URL exists */}
                        {recordedVideoUrl && !isRecording && (
                          <>
                            <button
                              type="button"
                              onClick={clearRecordedVideo}
                              className="bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-750 text-gray-800 dark:text-zinc-200 font-bold py-2 px-3.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-rose-500" /> Delete Recording
                            </button>
                            <button
                              type="button"
                              onClick={startRecordingVideo}
                              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-3.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <RefreshCw className="w-3.5 h-3.5" /> Re-record Live Video
                            </button>
                          </>
                        )}

                        {/* Bypass Simulation Trigger */}
                        {!isRecording && (
                          <button
                            type="button"
                            onClick={simulateDemoVideo}
                            className="flex-1 min-w-[160px] bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-extrabold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                          >
                            <Plus className="w-4 h-4 text-emerald-500" /> Showcase Real Video
                          </button>
                        )}
                      </div>
                      <span className="text-[9px] text-zinc-400 block italic leading-tight">
                        Note: Live demonstration captures using custom camera API can be previewed before publishing.
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1.5">Product Description (Accurate Details)</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Describe high-quality material details, dimensions, and local distribution features clearly..."
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                      className="w-full bg-white dark:bg-zinc-900 border border-gray-250 dark:border-zinc-800 rounded-xl p-2.5 text-xs text-gray-800 dark:text-white focus:outline-hidden"
                    />
                  </div>

                  <div className="flex items-center gap-2.5 p-3.5 bg-zinc-100 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl">
                    <input
                      type="checkbox"
                      required
                      id="opt-verify"
                      checked={newProduct.verifiedItem}
                      onChange={(e) => setNewProduct({ ...newProduct, verifiedItem: e.target.checked })}
                      className="accent-emerald-500 h-4.5 w-4.5 cursor-pointer"
                    />
                    <label htmlFor="opt-verify" className="text-xs text-gray-650 cursor-pointer text-gray-700 dark:text-zinc-300 select-none">
                      I guarantee this description is completely accurate and verify that it adheres to all platform representation policies.
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={!newProduct.verifiedItem}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-zinc-100 disabled:text-zinc-400 text-white font-bold py-3 rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    Confirm accurate details and submit listing
                  </button>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Inventory table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-500 dark:text-zinc-400">
                <thead className="bg-zinc-50 dark:bg-zinc-950 uppercase text-[10px] text-zinc-400 font-bold border-b border-gray-100 dark:border-zinc-900">
                  <tr>
                    <th className="p-3">Product Name</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Scope Corridor</th>
                    <th className="p-3">Price</th>
                    <th className="p-3">Current Stock</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-zinc-900 leading-relaxed font-sans">
                  {sellerInventory.map((item) => (
                    <tr key={item.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/40 transition-colors">
                      <td className="p-3 flex items-center gap-3">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-lg object-cover border border-gray-100 dark:border-zinc-800"
                        />
                        <div className="overflow-hidden">
                          <span className="font-bold text-gray-900 dark:text-white block truncate max-w-[200px]">{item.title}</span>
                          <span className="text-[9px] text-zinc-400 block font-mono">{item.id}</span>
                        </div>
                      </td>
                      <td className="p-3">{item.category}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs" title={`Warehoused in ${item.originRegion || 'South Africa'}`}>
                            {item.originRegion === 'US' ? '🇺🇸' : item.originRegion === 'ZA' ? '🇿🇦' : item.originRegion === 'GB' ? '🇬🇧' : item.originRegion === 'JP' ? '🇯🇵' : item.originRegion === 'EU' ? '🇪🇺' : item.originRegion === 'AU' ? '🇦🇺' : item.originRegion === 'CA' ? '🇨🇦' : item.originRegion === 'IN' ? '🇮🇳' : item.originRegion === 'BR' ? '🇧🇷' : '🇿🇦'}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${item.shippedGlobally ? 'bg-emerald-500/15 text-emerald-400' : 'bg-zinc-150 text-zinc-500'}`}>
                            {item.shippedGlobally ? '🌍 Global' : '📍 Local'}
                          </span>
                        </div>
                      </td>
                      <td className="p-3 font-mono font-semibold text-gray-950 dark:text-white">{selectedRegion.currencySymbol}{(item.price * selectedRegion.exchangeRate).toFixed(2)}</td>
                      <td className="p-3 font-semibold">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono">{item.stock} in stock</span>
                          {item.stock < 5 && (
                            <span className="text-amber-500 dark:text-amber-400 bg-amber-500/10 dark:bg-amber-500/20 px-1.5 py-0.5 rounded text-[10px] font-sans font-extrabold flex items-center gap-1 animate-pulse" title="Low stock warning! Less than 5 units left.">
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                              <span>Low Stock</span>
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleDeleteListing(item.id)}
                          className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}

                  {sellerInventory.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-zinc-400 font-medium">
                        No listings in stock. Tap "List New Product" to configure items.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          )}

          {/* 3. Negotiations, client chats and barter decisions */}
          {sellerSubTab === 'chats' && (
            <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-805 p-6 rounded-3xl shadow-xs space-y-6 animate-fade-in" id="seller-chats-workspace">
              <div>
                <h3 className="font-extrabold text-sm text-gray-900 dark:text-white font-sans flex items-center gap-1.5">
                  💬 Secure Haggle & Negotiation Corridors
                </h3>
                <p className="text-[11px] text-gray-400 mt-0.5">Approve target barter price proposals using dual-locked smart contracts.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 min-h-[500px]">
                {/* Threads Left Sidebar */}
                <div className="md:col-span-4 border-r border-gray-100 dark:border-zinc-800 pr-0 md:pr-4 space-y-3 max-h-[600px] overflow-y-auto">
                  {p2pChats.length === 0 ? (
                    <div className="py-12 text-center text-gray-400">
                      <MessageSquare className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                      <span className="text-xs">No active negotiations.</span>
                    </div>
                  ) : (
                    p2pChats.map((thread) => {
                      const isActive = activeMerchantThreadId === thread.id;
                      const hasUnread = thread.messages[thread.messages.length - 1]?.senderId !== user.id;
                      return (
                        <div
                          key={thread.id}
                          onClick={() => {
                            setActiveMerchantThreadId(thread.id);
                          }}
                          className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex gap-3 items-start relative ${
                            isActive
                              ? 'bg-emerald-500/5 border-emerald-500/30'
                              : 'bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-950/40 dark:hover:bg-zinc-850 border-gray-100  dark:border-zinc-850'
                          }`}
                        >
                          {thread.productImageUrl && (
                            <img
                              src={thread.productImageUrl}
                              alt={thread.productTitle}
                              className="w-10 h-10 rounded-lg object-cover shrink-0 border border-gray-100 dark:border-zinc-800"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center mb-0.5">
                              <span className="text-[10px] uppercase font-bold text-gray-400 block truncate">
                                👥 {thread.buyerName}
                              </span>
                              <span className="text-[8px] text-gray-450 font-mono">
                                {thread.lastMessageTimestamp}
                              </span>
                            </div>
                            <h4 className="text-xs font-bold text-gray-800 dark:text-zinc-200 truncate">
                              {thread.productTitle}
                            </h4>
                            <p className="text-[10px] text-gray-550 dark:text-zinc-400 truncate mt-1 italic">
                              {thread.lastMessageText}
                            </p>
                          </div>
                          {hasUnread && (
                            <span className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                          )}
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Live Thread Console Pane */}
                <div className="md:col-span-8 flex flex-col bg-zinc-50 dark:bg-zinc-955/35 border border-gray-100 dark:border-zinc-850 rounded-2xl h-[550px] overflow-hidden">
                  {activeMerchantThreadId ? (
                    (() => {
                      const thread = p2pChats.find(t => t.id === activeMerchantThreadId);
                      if (!thread) return null;
                      return (
                        <>
                          {/* Thread Title Header */}
                          <div className="p-4 bg-white dark:bg-zinc-900 border-b border-gray-100 dark:border-zinc-855 flex items-center justify-between gap-3">
                            <div>
                              <h4 className="text-xs text-gray-450 uppercase font-mono">Connected Buyer Channel</h4>
                              <h2 className="text-sm font-extrabold text-gray-900 dark:text-white">
                                👤 {thread.buyerName}
                              </h2>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] bg-emerald-500/10 text-emerald-500 font-bold px-2 py-1 rounded-md border border-emerald-500/20">
                                Active Core: ZA-Symmetric
                              </span>
                            </div>
                          </div>

                          {/* Product Reference Information */}
                          <div className="p-3 bg-zinc-100/60 dark:bg-zinc-950/80 border-b border-gray-100 dark:border-zinc-850 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                              {thread.productImageUrl && (
                                <img
                                  src={thread.productImageUrl}
                                  alt={thread.productTitle}
                                  className="w-8 h-8 rounded-md object-cover border border-gray-150"
                                />
                              )}
                              <div>
                                <h4 className="text-xs font-bold text-gray-700 dark:text-zinc-300 truncate max-w-[200px]">
                                  {thread.productTitle}
                                </h4>
                                <span className="text-[9px] font-mono text-gray-400 block font-semibold leading-white">
                                  Catalog Base MSRP: {selectedRegion.currencySymbol}{(thread.productPrice * selectedRegion.exchangeRate).toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Chat messages stream */}
                          <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {thread.messages.map((msg) => {
                              const isMerchant = msg.senderId === thread.sellerId;
                              return (
                                <div
                                  key={msg.id}
                                  className={`flex flex-col max-w-[85%] ${
                                    isMerchant ? 'ml-auto items-end' : 'mr-auto items-start'
                                  }`}
                                >
                                  <div className="flex items-center gap-1.5 mb-0.5">
                                    <span className="text-[9px] font-bold text-gray-450">
                                      {msg.senderName}
                                    </span>
                                    <span className="text-[8px] text-gray-400 font-mono">
                                      {msg.timestamp}
                                    </span>
                                  </div>

                                  <div
                                    className={`p-3 rounded-2xl text-xs space-y-2 ${
                                      isMerchant
                                        ? 'bg-emerald-500 text-zinc-950 font-medium rounded-tr-none'
                                        : 'bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-100 border border-gray-100 dark:border-zinc-800 rounded-tl-none'
                                    }`}
                                  >
                                    {/* Offer price attachment with manual approvals */}
                                    {msg.isOffer && (
                                      <div className={`p-3 rounded-xl border text-center flex flex-col items-center ${
                                        isMerchant ? 'bg-emerald-600/20 border-emerald-500/30' : 'bg-amber-500/10 border-amber-500/20 text-gray-900 dark:text-white'
                                      }`}>
                                        <Handshake className="w-5 h-5 text-amber-500 mb-0.5" />
                                        <span className="text-[9px] uppercase tracking-wide font-extrabold text-amber-500">
                                          Barter Contract Price Offered
                                        </span>
                                        <span className="text-base font-black text-emerald-500 antialiased mt-1">
                                          {selectedRegion.currencySymbol}{(msg.offerPrice! * selectedRegion.exchangeRate).toFixed(2)}
                                        </span>

                                        <div className="mt-2.5">
                                          {msg.offerStatus === 'pending' ? (
                                            <div className="space-y-2">
                                              <p className="text-[9px] leading-tight text-gray-450">
                                                Agree to this price? Approving instantly modifies catalog MSRP to lock this deal.
                                              </p>
                                              <div className="flex items-center gap-2 justify-center">
                                                <button
                                                  onClick={() => handleOfferAction(thread.id, msg.id, 'accepted')}
                                                  className="bg-emerald-500 hover:bg-emerald-600 font-bold text-zinc-950 px-3 py-1 text-[9px] uppercase rounded-md cursor-pointer transition-colors"
                                                >
                                                  ✅ Accept Offer
                                                </button>
                                                <button
                                                  onClick={() => handleOfferAction(thread.id, msg.id, 'declined')}
                                                  className="bg-rose-500 hover:bg-rose-600 font-bold text-white px-3 py-1 text-[9px] uppercase rounded-md cursor-pointer transition-colors"
                                                >
                                                  ❌ Decline
                                                </button>
                                              </div>
                                            </div>
                                          ) : msg.offerStatus === 'accepted' ? (
                                            <span className="px-2 py-0.5 bg-emerald-500 text-white font-black text-[9px] rounded-md">
                                              🔒 CONTRACT ACCEPTED & LOCKED
                                            </span>
                                          ) : (
                                            <span className="px-2 py-0.5 bg-red-500 text-white font-bold text-[9px] rounded-md">
                                              ❌ PROPOSAL DECLINED
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    )}

                                    <p className="leading-relaxed whitespace-pre-line">{msg.originalText}</p>

                                    {/* Real-time Translation Panel */}
                                    {msg.translatedText && (
                                      <div className="mt-2 pt-1.5 border-t border-dotted border-zinc-200 dark:border-zinc-750 text-gray-550 dark:text-zinc-400">
                                        <span className="text-[8px] uppercase tracking-wider block font-bold text-amber-500">
                                          🌐 Auto Trade-Corridor Trans ({msg.detectedLanguage?.toUpperCase()}):
                                        </span>
                                        <p className="italic text-[10px] mt-0.5 font-medium leading-relaxed">{msg.translatedText}</p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* Input Bar */}
                          <div className="p-3 bg-white dark:bg-zinc-900 border-t border-gray-100 dark:border-zinc-850 flex gap-2">
                            <input
                              type="text"
                              placeholder="Type official trade reply..."
                              value={merchantReplyText}
                              onChange={(e) => setMerchantReplyText(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') sendMerchantReply(merchantReplyText);
                              }}
                              className="flex-1 bg-zinc-50 dark:bg-zinc-950 border border-gray-150 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs text-gray-900 dark:text-white focus:outline-hidden"
                            />
                            <button
                              onClick={() => sendMerchantReply(merchantReplyText)}
                              disabled={!merchantReplyText.trim()}
                              className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-zinc-100 disabled:dark:bg-zinc-800 disabled:text-gray-400 text-zinc-950 font-extrabold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer"
                            >
                              Reply
                            </button>
                          </div>
                        </>
                      );
                    })()
                  ) : (
                    <div className="m-auto text-center py-12 text-gray-405">
                      <MessageSquare className="w-12 h-12 mx-auto mb-3 text-emerald-500/20 animate-pulse" />
                      <h4 className="text-xs font-bold text-gray-500">No active thread selected</h4>
                      <p className="text-[10px] text-gray-400 max-w-xs mt-1">Select an active customer trade corridor from the left pane to connect live communication.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
    </Translate>
  );
}
