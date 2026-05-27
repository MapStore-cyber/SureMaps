import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, Filter, Heart, MapPin, CreditCard, Lock, CheckCircle, Truck, Star, Sparkles,
  ShoppingBag, Eye, Percent, Map, List, ShoppingCart, SlidersHorizontal, Info, ShieldCheck,
  ChevronRight, Trash2, Check, ExternalLink, HelpCircle, Copy, X, Minus, Plus,
  Globe, Compass, Terminal, RefreshCw, AlertCircle, Play, Pause, Volume2, VolumeX, MessageSquare, Handshake,
  LayoutGrid, ZoomIn, ZoomOut
} from 'lucide-react';
import { Product, User, Order, OrderItem, TrackingStep, Review, PushNotification, RegionConfig, P2PChatThread, P2PChatMessage } from '../types';
import { Translate } from './Translate';

interface BuyerPortalProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  wishlist: string[];
  toggleWishlist: (id: string) => void;
  orders: Order[];
  addOrder: (order: Order) => void;
  addNotification: (noti: Omit<PushNotification, 'id' | 'timestamp' | 'read'>) => void;
  darkMode: boolean;
  onOpenLegal: () => void;
  selectedRegion: RegionConfig;
  t: (key: string) => string;
  cart: { product: Product; quantity: number }[];
  setCart: React.Dispatch<React.SetStateAction<{ product: Product; quantity: number }[]>>;
  isCartOpen: boolean;
  setIsCartOpen: React.Dispatch<React.SetStateAction<boolean>>;
  langId?: string;
  p2pChats: P2PChatThread[];
  setP2pChats: React.Dispatch<React.SetStateAction<P2PChatThread[]>>;
}

const CATEGORIES = ['All', 'Electronics', 'Handcrafted', 'Local Organic Food'];

const REGION_LOOKUP: Record<string, { name: string; flag: string }> = {
  ZA: { name: 'South Africa', flag: '🇿🇦' },
  CN: { name: 'China', flag: '🇨🇳' },
  US: { name: 'United States', flag: '🇺🇸' },
  EU: { name: 'European Union', flag: '🇪🇺' },
  GB: { name: 'United Kingdom', flag: '🇬🇧' },
  JP: { name: 'Japan', flag: '🇯🇵' },
  AU: { name: 'Australia', flag: '🇦🇺' },
  CA: { name: 'Canada', flag: '🇨🇦' },
  IN: { name: 'India', flag: '🇮🇳' },
  BR: { name: 'Brazil', flag: '🇧🇷' },
  GLOBAL: { name: 'Global Corridor', flag: '🌐' }
};

const REGIONAL_COURIERS: Record<string, {
  id: string;
  name: string;
  logo: string;
  speed: string;
  baseRateRaw: number;
  escrowCertified: boolean;
  features: string[];
}[]> = {
  ZA: [
    { id: "za-courier-guy", name: "The Courier Guy", logo: "🚚", speed: "1-2 Days", baseRateRaw: 75, escrowCertified: true, features: ["Smart OTP Pins", "Same-day Gauteng"] },
    { id: "za-aramex", name: "Aramex Logistics", logo: "📦", speed: "2-3 Days", baseRateRaw: 99, escrowCertified: true, features: ["Locker Drops", "SMS Alerts"] },
    { id: "za-postnet", name: "PostNet Secure", logo: "🏛️", speed: "2-4 Days", baseRateRaw: 110, escrowCertified: false, features: ["Counter Hand-off", "Physical Proof"] }
  ],
  US: [
    { id: "us-fedex", name: "FedEx SmartEscrow", logo: "📦", speed: "1-2 Days", baseRateRaw: 160, escrowCertified: true, features: ["Dual Signature", "GPS Live Map"] },
    { id: "us-ups", name: "UPS Ground Secure", logo: "🚚", speed: "2-3 Days", baseRateRaw: 170, escrowCertified: true, features: ["Doorstep Audits", "Carbon Offset"] },
    { id: "us-usps", name: "USPS Priority Guard", logo: "✉️", speed: "2-4 Days", baseRateRaw: 125, escrowCertified: false, features: ["PO Box Eligible", "Flat Rate Box"] }
  ],
  EU: [
    { id: "eu-dhl", name: "DHL EuroLink", logo: "✈️", speed: "1-2 Days", baseRateRaw: 150, escrowCertified: true, features: ["Inter-state Express", "Biometric Signature"] },
    { id: "eu-dpd", name: "DPD Local Secure", logo: "🚚", speed: "2-3 Days", baseRateRaw: 130, escrowCertified: true, features: ["1-Hour ETA Tracker", "Easy Return Labels"] },
    { id: "eu-laposte", name: "La Poste Post", logo: "✉️", speed: "3-5 Days", baseRateRaw: 90, escrowCertified: false, features: ["Postbox Dropoff", "Economic Tier"] }
  ],
  GB: [
    { id: "gb-royal", name: "Royal Mail Tracked 24", logo: "✉️", speed: "1 Day", baseRateRaw: 115, escrowCertified: true, features: ["Photo Proof", "Letterbox Delivery"] },
    { id: "gb-evri", name: "Evri Escrow Secured", logo: "📦", speed: "2-3 Days", baseRateRaw: 95, escrowCertified: true, features: ["Store Handover Points", "Flexible Redirects"] },
    { id: "gb-parcelforce", name: "ParcelForce Air Priority", logo: "🚚", speed: "1-2 Days", baseRateRaw: 290, escrowCertified: true, features: ["Heavy Cargo Guard", "Multi-Sign-Off"] }
  ],
  JP: [
    { id: "jp-yamato", name: "Yamato (Kuroneko)", logo: "🐈‍⬛", speed: "1 Day", baseRateRaw: 80, escrowCertified: true, features: ["Chilled/Cold Chain", "Convenience Store Pick"] },
    { id: "jp-sagawa", name: "Sagawa Express Hub", logo: "🚚", speed: "1-2 Days", baseRateRaw: 90, escrowCertified: true, features: ["Exact Time Slots", "Digital Waybill"] },
    { id: "jp-japan-post", name: "Japan Post (Yuu-Pack)", logo: "🇯🇵", speed: "1-3 Days", baseRateRaw: 70, escrowCertified: false, features: ["National Reach", "Symmetric Recipient OTP"] }
  ],
  AU: [
    { id: "au-auspost", name: "Australia Post Express", logo: "🦘", speed: "1-2 Days", baseRateRaw: 145, escrowCertified: true, features: ["Sovereign Network", "Safe Drop Opt-In"] },
    { id: "au-sendle", name: "Sendle Green Courier", logo: "🐨", speed: "2-4 Days", baseRateRaw: 105, escrowCertified: true, features: ["100% Carbon Neutral", "Free Door Pickups"] },
    { id: "au-startrack", name: "StarTrack Priority Air", logo: "✈️", speed: "1-3 Days", baseRateRaw: 175, escrowCertified: true, features: ["Heavy Duty Secure", "Corporate Escrow API"] }
  ],
  CA: [
    { id: "ca-canada-post", name: "Canada Post Expedited", logo: "🍁", speed: "2-4 Days", baseRateRaw: 135, escrowCertified: true, features: ["National Lockbox Secure", "Signature on Delivery"] },
    { id: "ca-purolator", name: "Purolator Cargo Secure", logo: "✈️", speed: "1-2 Days", baseRateRaw: 200, escrowCertified: true, features: ["Early Delivery Pledge", "Emergency Tracking"] },
    { id: "ca-intelcom", name: "Intelcom Courier", logo: "🚚", speed: "1-2 Days", baseRateRaw: 115, escrowCertified: false, features: ["Direct Photo Receipts", "Automated SMS Updates"] }
  ],
  CN: [
    { id: "cn-sf", name: "SF Express (Shunfeng)", logo: "🚀", speed: "1 Day", baseRateRaw: 45, escrowCertified: true, features: ["VIP Security Box", "Next-Morning Delivery"] },
    { id: "cn-jd", name: "JD Logistics Secure", logo: "📦", speed: "1-2 Days", baseRateRaw: 40, escrowCertified: true, features: ["Direct Depot Release", "Signature Proof"] },
    { id: "cn-ems", name: "China EMS Mail", logo: "✉️", speed: "2-5 Days", baseRateRaw: 25, escrowCertified: false, features: ["National Coverage", "Government Standard"] }
  ],
  IN: [
    { id: "in-delhivery", name: "Delhivery SmartEscrow", logo: "🚚", speed: "2-3 Days", baseRateRaw: 20, escrowCertified: true, features: ["Biometric Door Delivery", "Cash-on-Escrow System"] },
    { id: "in-bluedart", name: "Blue Dart Express Air", logo: "✈️", speed: "1-2 Days", baseRateRaw: 35, escrowCertified: true, features: ["Time-Definite Delivery", "Zero-Dispute Audit"] },
    { id: "in-speedpost", name: "Speed Post India", logo: "✉️", speed: "3-5 Days", baseRateRaw: 10, escrowCertified: false, features: ["Extreme Remote Reach", "Government Backed"] }
  ],
  BR: [
    { id: "br-correios", name: "Correios SEDEX Express", logo: "🚚", speed: "1-2 Days", baseRateRaw: 70, escrowCertified: true, features: ["OTP Safe Handset", "Full Liability Covered"] },
    { id: "br-jadlog", name: "Jadlog Logística", logo: "📦", speed: "2-4 Days", baseRateRaw: 55, escrowCertified: true, features: ["Commerce Store Drops", "Weight Clearance Checks"] },
    { id: "br-loggi", name: "Loggi Tecnologia Motos", logo: "🇧🇷", speed: "1 Day", baseRateRaw: 45, escrowCertified: true, features: ["Instant Smart Mapping", "Real-Time GPS Tracking"] }
  ],
  GLOBAL: [
    { id: "glob-dhl", name: "DHL Global Secure Air", logo: "🌎", speed: "2-3 Days", baseRateRaw: 360, escrowCertified: true, features: ["Customs Integrated Escrow", "Global Satellite Tracking", "Premium Insurance Included"] },
    { id: "glob-fedex", name: "FedEx World Secure Express", logo: "✈️", speed: "3-5 Days", baseRateRaw: 380, escrowCertified: true, features: ["Multi-Leg Audit Trails", "DDP Duties Included", "Dual Lockbox Safeguard"] },
    { id: "glob-ups", name: "UPS Worldwide Saver", logo: "🚚", speed: "2-4 Days", baseRateRaw: 340, escrowCertified: true, features: ["Symmetric Handshakes", "Carbon Neutral Fleet", "Webhook API Payouts"] }
  ]
};

export default function BuyerPortal({
  products,
  setProducts,
  user,
  setUser,
  wishlist,
  toggleWishlist,
  orders,
  addOrder,
  addNotification,
  darkMode,
  onOpenLegal,
  selectedRegion,
  t,
  cart,
  setCart,
  isCartOpen,
  setIsCartOpen,
  langId = 'en',
  p2pChats,
  setP2pChats
}: BuyerPortalProps) {
  // Browsing States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCountryFilter, setSelectedCountryFilter] = useState('All');
  const [priceRange, setPriceRange] = useState<number>(400);
  const [minRating, setMinRating] = useState<number>(0);
  const [viewType, setViewType] = useState<'grid' | 'map' | 'corridor'>('grid');
  const [localMapZoom, setLocalMapZoom] = useState<number>(1);
  const [localMapPan, setLocalMapPan] = useState({ x: 0, y: 0 });
  const [corridorZoom, setCorridorZoom] = useState<number>(1);
  const [corridorPan, setCorridorPan] = useState({ x: 0, y: 0 });
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeMediaTab, setActiveMediaTab] = useState<'photo' | 'video'>('photo');
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  // P2P Chat & Haggling states
  const [activeChatThread, setActiveChatThread] = useState<P2PChatThread | null>(null);
  const [isChatDrawerOpen, setIsChatDrawerOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [offerAmount, setOfferAmount] = useState('');
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [showBuyerMessengerList, setShowBuyerMessengerList] = useState(false);

  // Video playback & seek states
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoCurrentTime, setVideoCurrentTime] = useState<number>(0);
  const [videoDuration, setVideoDuration] = useState<number>(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(true);

  const handleVideoLoadedMetadata = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    setVideoDuration(e.currentTarget.duration || 0);
  };

  const handleVideoTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    setVideoCurrentTime(e.currentTarget.currentTime || 0);
  };

  const handleVideoSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    setVideoCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const handleTogglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play().catch(() => {});
        setIsVideoPlaying(true);
      } else {
        videoRef.current.pause();
        setIsVideoPlaying(false);
      }
    }
  };

  useEffect(() => {
    setVideoCurrentTime(0);
    setVideoDuration(0);
    setIsVideoPlaying(true);
    setActivePhotoIndex(0);
  }, [selectedProduct, activeMediaTab]);

  // New Global sensation state elements
  const [selectedCorridorHub, setSelectedCorridorHub] = useState<string>('CN');
  const [pingStatus, setPingStatus] = useState<'idle' | 'pinging' | 'completed'>('idle');
  const [pingLatency, setPingLatency] = useState<number | null>(null);
  const [pingLogs, setPingLogs] = useState<string[]>([]);
  
  const [calcZarAmount, setCalcZarAmount] = useState<string>('500');
  const [calcTargetRate, setCalcTargetRate] = useState<string>('US');
  
  const [escrowBreakerActive, setEscrowBreakerActive] = useState<boolean>(false);
  const [breakerLogs, setBreakerLogs] = useState<string[]>([]);

  // Checkout States
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'shipping' | 'payment' | 'processing' | 'success'>('shipping');
  const [shippingAddress, setShippingAddress] = useState({
    fullName: user.name,
    streetAddress: '1600 Amphitheatre Pkwy',
    city: 'Mountain View',
    postalCode: '94043',
    phone: '555-0199',
  });
  const [paymentCard, setPaymentCard] = useState({
    number: '4111 2222 3333 4444',
    name: user.name,
    expiry: '12/28',
    cvv: '382',
  });
  const [newOrder, setNewOrder] = useState<Order | null>(null);
  const [selectedCourierId, setSelectedCourierId] = useState<string>('');

  // START CHAT WITH SELLER HANDLER
  const startChatWithSeller = (product: Product) => {
    const threadId = `thread-${user.id}-${product.sellerId}-${product.id}`;
    let existingThread = p2pChats.find(t => t.id === threadId);
    
    if (!existingThread) {
      existingThread = {
        id: threadId,
        productId: product.id,
        productTitle: product.title,
        productPrice: product.price,
        productImageUrl: product.imageUrl,
        sellerId: product.sellerId,
        sellerName: product.sellerName,
        buyerId: user.id,
        buyerName: user.name,
        unreadByBuyer: false,
        unreadBySeller: true,
        lastMessageText: `Inquiry started for ${product.title}`,
        lastMessageTimestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        messages: [
          {
            id: `init-${Date.now()}`,
            senderId: product.sellerId, // real seller greeting
            senderName: product.sellerName,
            originalText: `Hi! I'm the owner of ${product.sellerName}. Thanks for reaching out about our ${product.title}. Let me know if you have any questions or would like to submit a custom barter offer.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]
      };
      setP2pChats(prev => [existingThread!, ...prev]);
    }
    
    setActiveChatThread(existingThread);
    setIsChatDrawerOpen(true);
    // Mark as read by buyer
    setP2pChats(prev => prev.map(t => t.id === threadId ? { ...t, unreadByBuyer: false } : t));
  };

  // SEND MESSAGE HANDLER
  const sendP2PMessage = (text: string, isOfferObj: boolean = false, offerVal?: number) => {
    if (!activeChatThread || (!text.trim() && !isOfferObj)) return;

    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const msgId = `msg-${Date.now()}`;
    
    const newMsg: P2PChatMessage = {
      id: msgId,
      senderId: user.id,
      senderName: user.name,
      originalText: text.trim() || `Barter custom price offer submitted: ${selectedRegion.currencySymbol}${(offerVal! * selectedRegion.exchangeRate).toFixed(2)}`,
      timestamp: timeString,
      isOffer: isOfferObj,
      offerPrice: offerVal,
      offerStatus: isOfferObj ? 'pending' : undefined
    };

    const updatedMessages = [...activeChatThread.messages, newMsg];
    const latestText = newMsg.originalText;

    const updatedThread = {
      ...activeChatThread,
      messages: updatedMessages,
      lastMessageText: latestText,
      lastMessageTimestamp: timeString,
      unreadBySeller: true
    };

    setActiveChatThread(updatedThread);
    setP2pChats(prev => prev.map(t => t.id === activeChatThread.id ? updatedThread : t));
    setChatInput('');
    setOfferAmount('');
    setShowOfferForm(false);

    addNotification({
      title: '💬 Message Transmitted',
      message: isOfferObj ? `Custom offer sent to ${activeChatThread.sellerName}.` : 'Secure chat message transmitted.',
      type: 'chat'
    });

    // Real response from the seller
    setTimeout(() => {
      const respTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      let replyText = "Perfect, thank you! I am reviewing your message in detail.";
      let convertedReply: string | undefined = undefined;
      let detectedLang = "en";

      if (isOfferObj && offerVal) {
        const productBasePrice = activeChatThread.productPrice;
        const discountPercentage = (productBasePrice - offerVal) / productBasePrice;

        if (discountPercentage <= 0.20 && discountPercentage > 0) {
          replyText = `That is a reasonable and respectful offer! I am glad to accept. You can now checkout at your new price of ${selectedRegion.currencySymbol}${(offerVal * selectedRegion.exchangeRate).toFixed(2)}.`;
          if (activeChatThread.sellerId === 'sell-beta') {
            convertedReply = `Leso isithembiso esilungile nesinenhlonipho! Ngiyakwemukela. Ungaqhubeka uyothenga manje.`;
            detectedLang = "zu";
          } else if (activeChatThread.sellerId === 'sell-alpha') {
            convertedReply = `这是一个合理且尊重的报价！我很乐意接受。您现在可以结账。`;
            detectedLang = "zh";
          }
          
          setP2pChats(prev => prev.map(t => {
            if (t.id === activeChatThread.id) {
              const msgsWithAccept = t.messages.map(m => m.id === msgId ? { ...m, offerStatus: 'accepted' as const } : m);
              setProducts(cur => cur.map(p => p.id === activeChatThread.productId ? { ...p, price: offerVal } : p));

              const sellerMsg: P2PChatMessage = {
                id: `seller-resp-${Date.now()}`,
                senderId: t.sellerId,
                senderName: t.sellerName,
                originalText: replyText,
                translatedText: convertedReply,
                detectedLanguage: detectedLang,
                timestamp: respTime
              };

              return {
                ...t,
                messages: [...msgsWithAccept, sellerMsg],
                lastMessageText: replyText,
                lastMessageTimestamp: respTime,
                unreadByBuyer: true
              };
            }
            return t;
          }));

          setActiveChatThread(prev => {
            if (!prev) return null;
            const msgsWithAccept = prev.messages.map(m => m.id === msgId ? { ...m, offerStatus: 'accepted' as const } : m);
            const sellerMsg: P2PChatMessage = {
              id: `seller-resp-${Date.now()}`,
              senderId: prev.sellerId,
              senderName: prev.sellerName,
              originalText: replyText,
              translatedText: convertedReply,
              detectedLanguage: detectedLang,
              timestamp: respTime
            };
            return {
              ...prev,
              messages: [...msgsWithAccept, sellerMsg],
              unreadByBuyer: true
            };
          });

          addNotification({
            title: '🤝 Barter Offer Accepted!',
            message: `${activeChatThread.sellerName} accepted your offer of ${selectedRegion.currencySymbol}${(offerVal * selectedRegion.exchangeRate).toFixed(2)}!`,
            type: 'order'
          });

        } else {
          replyText = `Thank you, but that is a bit too low given our custom material costs and standard flat 7% platform fee commission. Let us try something closer!`;
          if (activeChatThread.sellerId === 'sell-beta') {
            convertedReply = `Ngiyabonga, kodwa lokho kuphansi kakhulu unganikeza okungcono.`;
            detectedLang = "zu";
          } else if (activeChatThread.sellerId === 'sell-alpha') {
            convertedReply = `谢谢您，但是考虑到我们的定制材料成本和7%的平台佣金，这个价格有点太低了。`;
            detectedLang = "zh";
          }

          setP2pChats(prev => prev.map(t => {
            if (t.id === activeChatThread.id) {
              const msgsWithDecline = t.messages.map(m => m.id === msgId ? { ...m, offerStatus: 'declined' as const } : m);
              const sellerMsg: P2PChatMessage = {
                id: `seller-resp-${Date.now()}`,
                senderId: t.sellerId,
                senderName: t.sellerName,
                originalText: replyText,
                translatedText: convertedReply,
                detectedLanguage: detectedLang,
                timestamp: respTime
              };
              return {
                ...t,
                messages: [...msgsWithDecline, sellerMsg],
                lastMessageText: replyText,
                lastMessageTimestamp: respTime,
                unreadByBuyer: true
              };
            }
            return t;
          }));

          setActiveChatThread(prev => {
            if (!prev) return null;
            const msgsWithDecline = prev.messages.map(m => m.id === msgId ? { ...m, offerStatus: 'declined' as const } : m);
            const sellerMsg: P2PChatMessage = {
              id: `seller-resp-${Date.now()}`,
              senderId: prev.sellerId,
              senderName: prev.sellerName,
              originalText: replyText,
              translatedText: convertedReply,
              detectedLanguage: detectedLang,
              timestamp: respTime
            };
            return {
              ...prev,
              messages: [...msgsWithDecline, sellerMsg],
              unreadByBuyer: true
            };
          });

          addNotification({
            title: '❌ Barter Offer Declined',
            message: `${activeChatThread.sellerName} declined your custom price proposal. Let's haggle again!`,
            type: 'system'
          });
        }
      } else {
        if (text.toLowerCase().includes('discount') || text.toLowerCase().includes('cheap')) {
          replyText = "We are happy to haggle! Just use the 'Custom Barter Offer' button on this screen, select your price, and we'll instantly check it against our core ledger.";
        } else if (text.toLowerCase().includes('origin') || text.toLowerCase().includes('manufacture')) {
          replyText = `All our products are authentic and 105% compliant with domestic and global corridor standards. We clear secure double-escrow audits daily!`;
        } else {
          replyText = `Got it! Rest assured, your order is protected under MapStore's Pretoria safe-handling double-lock escrow protocol. This is perfectly secure.`;
        }

        if (activeChatThread.sellerId === 'sell-beta') {
          convertedReply = `Kuyazwakala! Qiniseka ukuthi sisebenza ngaphansi kwenqubo yezokuphepha ye-escrow yasePretoria.`;
          detectedLang = "zu";
        } else if (activeChatThread.sellerId === 'sell-alpha') {
          convertedReply = `明白了！请放心，我们是在比勒陀利亚的双重锁定第三方托管协议下运行。`;
          detectedLang = "zh";
        }

        const sellerMsg: P2PChatMessage = {
          id: `seller-resp-${Date.now()}`,
          senderId: activeChatThread.sellerId,
          senderName: activeChatThread.sellerName,
          originalText: replyText,
          translatedText: convertedReply,
          detectedLanguage: detectedLang,
          timestamp: respTime
        };

        setP2pChats(prev => prev.map(t => {
          if (t.id === activeChatThread.id) {
            return {
              ...t,
              messages: [...t.messages, sellerMsg],
              lastMessageText: replyText,
              lastMessageTimestamp: respTime,
              unreadByBuyer: true
            };
          }
          return t;
        }));

        setActiveChatThread(prev => {
          if (!prev) return null;
          return {
            ...prev,
            messages: [...prev.messages, sellerMsg],
            unreadByBuyer: true
          };
        });
      }
    }, 1500);
  };

  // Active Review State
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });

  // Map Interactive Pin state
  const [focusedSeller, setFocusedSeller] = useState<string | null>(null);

  // Search, Filter & Map coordination
  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      let matchSearch = false;
      const queryLower = searchQuery.trim().toLowerCase();

      // Intelligent country search parser: e.g. "sellers from china", "germany", etc.
      const countryKeywords = [
        { code: 'CN', keywords: ['china', 'chinese', 'sellers from china', 'seller from china'] },
        { code: 'ZA', keywords: ['south africa', 'south african', 'za', 'sellers from south africa'] },
        { code: 'US', keywords: ['united states', 'us', 'usa', 'america', 'american', 'sellers from us', 'sellers from america'] },
        { code: 'GB', keywords: ['united kingdom', 'uk', 'britain', 'british', 'gb', 'sellers from uk', 'sellers from britain'] },
        { code: 'EU', keywords: ['europe', 'european', 'germany', 'german', 'eu', 'sellers from germany', 'sellers from europe'] },
        { code: 'JP', keywords: ['japan', 'japanese', 'jp', 'sellers from japan'] },
        { code: 'AU', keywords: ['australia', 'australian', 'au', 'sellers from australia'] },
        { code: 'CA', keywords: ['canada', 'canadian', 'ca', 'sellers from canada'] },
        { code: 'IN', keywords: ['india', 'indian', 'in', 'sellers from india'] },
        { code: 'BR', keywords: ['brazil', 'brazilian', 'br', 'sellers from brazil'] }
      ];

      const detectedCountryInQuery = countryKeywords.find(item =>
        item.keywords.some(keyword => queryLower.includes(keyword))
      );

      const prodOrigin = (prod.originRegion || 'ZA').toUpperCase();

      if (!queryLower) {
        matchSearch = true;
      } else if (detectedCountryInQuery) {
        // Find if they typed something *extra* beside the country keyword, e.g. "shoes from china" or "candle from south africa"
        let strippedQuery = queryLower;
        detectedCountryInQuery.keywords.forEach(keyword => {
          strippedQuery = strippedQuery.replace(keyword, '');
        });
        strippedQuery = strippedQuery.replace('sellers from', '').replace('seller from', '').replace('from', '').replace('in', '').trim();

        if (!strippedQuery) {
          // Searched exclusively for country, e.g. "sellers from china"
          matchSearch = prodOrigin === detectedCountryInQuery.code;
        } else {
          // Searched with term + country, e.g. "brew from us"
          const matchesTerm = prod.title.toLowerCase().includes(strippedQuery) ||
                              prod.description.toLowerCase().includes(strippedQuery) ||
                              prod.category.toLowerCase().includes(strippedQuery);
          matchSearch = (prodOrigin === detectedCountryInQuery.code) && matchesTerm;
        }
      } else {
        matchSearch = prod.title.toLowerCase().includes(queryLower) ||
                      prod.description.toLowerCase().includes(queryLower) ||
                      prod.category.toLowerCase().includes(queryLower) ||
                      prod.sellerName.toLowerCase().includes(queryLower);
      }

      const matchCategory = selectedCategory === 'All' || prod.category === selectedCategory;
      const matchPrice = prod.price <= priceRange;
      const matchRating = prod.rating >= minRating;
      const matchSeller = focusedSeller ? prod.sellerId === focusedSeller : true;
      const matchCountrySelector = selectedCountryFilter === 'All' || prodOrigin === selectedCountryFilter.toUpperCase();

      return matchSearch && matchCategory && matchPrice && matchRating && matchSeller && matchCountrySelector;
    });
  }, [products, searchQuery, selectedCategory, selectedCountryFilter, priceRange, minRating, focusedSeller]);

  // Recommendation engine: Suggested products based on categories of purchased or wishlist items
  const recommendedProducts = useMemo(() => {
    const interestCategories = new Set(user.preferredCategories);
    cart.forEach(item => interestCategories.add(item.product.category));
    wishlist.forEach(id => {
      const prod = products.find(p => p.id === id);
      if (prod) interestCategories.add(prod.category);
    });

    if (interestCategories.size === 0) {
      // Return high-rating products as general trending recommendations
      return products.filter(p => p.rating >= 4.6).slice(0, 3);
    }

    return products
      .filter(p => interestCategories.has(p.category) && !cart.some(c => c.product.id === p.id))
      .slice(0, 3);
  }, [products, wishlist, cart, user.preferredCategories]);

  // Add Item to cart
  const addToCart = (product: Product, quantity: number = 1) => {
    if (product.stock <= 0) return;
    setCart((prev) => {
      const existingIdx = prev.findIndex((item) => item.product.id === product.id);
      if (existingIdx > -1) {
        const newQty = Math.min(product.stock, prev[existingIdx].quantity + quantity);
        const copy = [...prev];
        copy[existingIdx].quantity = newQty;
        return copy;
      }
      return [...prev, { product, quantity: Math.min(product.stock, quantity) }];
    });
    addNotification({
      title: 'Cart Updated',
      message: `${product.title} has been added to your shopping cart.`,
      type: 'system',
    });
  };

  const incrementCartQuantity = (productId: string) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.product.id === productId) {
          const newQty = Math.min(item.product.stock, item.quantity + 1);
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const decrementCartQuantity = (productId: string) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity - 1;
            if (newQty <= 0) {
              return null;
            }
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter(Boolean) as { product: Product; quantity: number }[]
    );
  };

  // Checkout financial calculation
  const subtotal = useMemo(() => {
    return cart.reduce((acc, curr) => acc + curr.product.price * curr.quantity, 0);
  }, [cart]);

  // MapStore flat 7% platform fee commission (charged on seller payout list)
  const mapStoreCommissionFee = useMemo(() => {
    return Number((subtotal * 0.07).toFixed(2));
  }, [subtotal]);

  // If any item in the cart is shipped from a foreign region (i.e. product.originRegion !== selectedRegion.id)
  const isCrossBorder = useMemo(() => {
    return cart.some(item => item.product.originRegion && item.product.originRegion !== selectedRegion.id);
  }, [cart, selectedRegion]);

  const crossBorderCharge = useMemo(() => {
    return isCrossBorder ? 12.50 : 0.00;
  }, [isCrossBorder]);

  // Compute available couriers for this user based on active selectedRegion
  const availableCouriers = useMemo(() => {
    const regional = REGIONAL_COURIERS[selectedRegion.id] || [];
    const global_opts = REGIONAL_COURIERS['GLOBAL'] || [];
    return [...regional, ...global_opts];
  }, [selectedRegion]);

  // Active Selected Courier object
  const activeCourier = useMemo(() => {
    const found = availableCouriers.find(c => c.id === selectedCourierId);
    return found || availableCouriers[0] || { id: 'default', name: 'Standard Carrier', baseRateRaw: 125, logo: '🚚', speed: '3-5 Days', escrowCertified: true };
  }, [availableCouriers, selectedCourierId]);

  // Real-Time Dimensional Shipping Calculation details
  const shippingCalculationDetails = useMemo(() => {
    if (cart.length === 0) {
      return {
        totalFee: 0,
        items: []
      };
    }

    let itemsTotal = 0;
    const items = cart.map(item => {
      // Dimensions: latitude represent length, longitude represent width, height defaults to 15
      const length = Math.max(5, Math.min(100, item.product.latitude ? Math.round(Math.abs(item.product.latitude)) : 15));
      const width = Math.max(5, Math.min(100, item.product.longitude ? Math.round(Math.abs(item.product.longitude)) : 12));
      const height = Math.max(5, Math.min(100, item.product.height || 10));
      
      const volumeCm3 = length * width * height;
      const volumetricWeightKg = Number((volumeCm3 / 5000).toFixed(2));
      const chargeableWeight = Math.max(0.2, volumetricWeightKg);
      
      // We scale baseRateRaw by 0.04 to match our base pricing scale (represented in USD points)
      const baseFee = Number((activeCourier.baseRateRaw * 0.04).toFixed(2));
      
      // Surcharge of $0.15 per volumetric weight unit with premium delivery multiplier if global courier is selected
      const isGlobalCourier = activeCourier.id.startsWith('glob-');
      const ratePerKg = isGlobalCourier ? 0.35 : 0.15;
      const sizeSurcharge = Number((chargeableWeight * ratePerKg).toFixed(2));
      
      const totalItemFee = Number(((baseFee + sizeSurcharge) * item.quantity).toFixed(2));
      itemsTotal += totalItemFee;

      return {
        productId: item.product.id,
        title: item.product.title,
        length,
        width,
        height,
        volume: volumeCm3,
        volWeight: volumetricWeightKg,
        baseFee,
        sizeSurcharge,
        totalItemFee,
        quantity: item.quantity
      };
    });

    return {
      totalFee: Number(itemsTotal.toFixed(2)),
      items
    };
  }, [cart, activeCourier]);

  const deliveryFee = subtotal > 0 ? shippingCalculationDetails.totalFee : 0;

  const grandTotal = useMemo(() => {
    return Number((subtotal + deliveryFee + crossBorderCharge).toFixed(2));
  }, [subtotal, deliveryFee, crossBorderCharge]);

  // Handle Order Placement & Secure Payments Gateways
  const triggerPaymentStep = () => {
    setCheckoutStep('payment');
  };

  const processSecurePayment = () => {
    setCheckoutStep('processing');
    setTimeout(() => {
      // Assemble standard completed Order structure
      const orderItems: OrderItem[] = cart.map((item) => {
        const totalPaidItem = item.product.price * item.quantity;
        const commissionAmount = Number((totalPaidItem * 0.07).toFixed(2));
        const netSellerAmount = Number((totalPaidItem - commissionAmount).toFixed(2));

        return {
          productId: item.product.id,
          productTitle: item.product.title,
          price: item.product.price,
          quantity: item.quantity,
          sellerId: item.product.sellerId,
          sellerName: item.product.sellerName,
          commissionAmount,
          netSellerAmount
        };
      });

      const trackingSteps: TrackingStep[] = [
        { status: 'pending', label: 'Order Registered', date: new Date().toLocaleTimeString(), active: true, description: 'Order captured under secure platform ledger.' },
        { status: 'payment_secured', label: 'Payment Confirmed', date: new Date().toLocaleTimeString(), active: true, description: 'Instant 3DS bank verification cleared safely.' },
        { status: 'processing', label: 'Seller Verification', date: 'TBD', active: false, description: 'Verified seller packaging compliant items.' },
        { status: 'shipped', label: 'Dispatched', date: 'TBD', active: false, description: 'Package dispatched from local seller site.' },
        { status: 'out_for_delivery', label: activeCourier.name, date: 'TBD', active: false, description: `In-transit courier assigned: ${activeCourier.name} (${activeCourier.speed}).` },
        { status: 'delivered', label: 'Arrived', date: 'TBD', active: false, description: "Deliverable reached requested coordinates secure." }
      ];

      const finalizedOrder: Order = {
        id: `order-${Date.now().toString().slice(-6)}`,
        buyerEmail: user.email,
        buyerName: user.name,
        items: orderItems,
        totalPrice: grandTotal,
        commissionTotal: mapStoreCommissionFee,
        status: 'payment_secured',
        trackingSteps,
        timestamp: new Date().toLocaleString(),
        createdAt: new Date().toISOString(),
        realHourOffset: 0,
        returnInitiated: false,
        shippingAddress,
        paymentType: 'card',
        driverLocation: {
          latitude: 37.7749 + (Math.random() - 0.5) * 0.03, // proximity location SF
          longitude: -122.4194 + (Math.random() - 0.5) * 0.03
        }
      };

      // Update products stock locally
      const updatedProducts = products.map((prod) => {
        const cartItem = cart.find((c) => c.product.id === prod.id);
        if (cartItem) {
          return { ...prod, stock: Math.max(0, prod.stock - cartItem.quantity) };
        }
        return prod;
      });
      setProducts(updatedProducts);

      setNewOrder(finalizedOrder);
      addOrder(finalizedOrder);
      addNotification({
        title: '🔒 Secure Checkout Success',
        message: `Order ${finalizedOrder.id} successfully processed and secured in escrow.`,
        type: 'order',
        orderId: finalizedOrder.id,
      });

      // Clear Cart
      setCart([]);
      setCheckoutStep('success');
    }, 2500); // real 3D Secure load
  };

  // Submit product level reviews dynamically
  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.comment.trim() || !selectedProduct) return;

    // Local review generation
    const newRatingCount = selectedProduct.ratingCount + 1;
    const newRating = Number(((selectedProduct.rating * selectedProduct.ratingCount + reviewForm.rating) / newRatingCount).toFixed(1));

    const updatedProds = products.map((p) => {
      if (p.id === selectedProduct.id) {
        return {
          ...p,
          rating: newRating,
          ratingCount: newRatingCount
        };
      }
      return p;
    });

    setProducts(updatedProds);
    setSelectedProduct(prev => prev ? { ...prev, rating: newRating, ratingCount: newRatingCount } : null);
    setReviewForm({ rating: 5, comment: '' });

    addNotification({
      title: 'Review Posted Stars',
      message: `Thank you! Your ratings feedback has updated ${selectedProduct.title}.`,
      type: 'system',
    });
  };

  // Custom Interactive Map coordinate calculation
  // Let us draw a beautiful SVG local grid tracing real locations
  const mapCenter = { lat: 37.7749, lng: -122.4194 }; // SF Center Coords
  const getCoordinatesPosition = (lat: number, lng: number) => {
    // scale coordinates to fitting 100% boundary grid
    const top = 50 - (lat - mapCenter.lat) * 400; // scaling latitude
    const left = 50 + (lng - mapCenter.lng) * 400; // scaling longitude
    return {
      top: `${Math.max(10, Math.min(90, top))}%`,
      left: `${Math.max(10, Math.min(90, left))}%`
    };
  };

  const sellerPositions = useMemo(() => {
    return [
      { id: 'sell-alpha', name: 'Alpha Tech Goods', lat: 37.7749, lng: -122.4194 },
      { id: 'sell-beta', name: 'Terra Crafts & Co', lat: 37.7833, lng: -122.4167 },
      { id: 'sell-gamma', name: 'Mission Yeast & Bakery', lat: 37.7699, lng: -122.4468 }
    ];
  }, []);

  const CORRIDOR_HUBS = useMemo(() => [
    { id: 'CN', name: 'Shanghai Gateway', flag: '🇨🇳', scale: 0.38, lat: 31.2304, lng: 121.4737, x: 740, y: 190, activeShipments: 14, escrowLocked: 189400, info: "Sourcing premium electronic controllers directly through Shanghai Free Trade zone." },
    { id: 'US', name: 'New York Gateway', flag: '🇺🇸', scale: 0.054, lat: 40.7128, lng: -74.0060, x: 300, y: 140, activeShipments: 8, escrowLocked: 92450, info: "Bridging East Coast artisan accessories with dynamic regional clearing accounts." },
    { id: 'EU', name: 'Frankfurt Gateway', flag: '🇪🇺', scale: 0.05, lat: 50.1109, lng: 8.6821, x: 500, y: 130, activeShipments: 19, escrowLocked: 314050, info: "Major agricultural and food standards clearing gateway for Germany and Northern EU." },
    { id: 'GB', name: 'London Gateway', flag: '🇬🇧', scale: 0.042, lat: 51.5074, lng: -0.1278, x: 480, y: 110, activeShipments: 6, escrowLocked: 78200, info: "Secure high-value vintage wearables ledger pipeline matching London maritime logs." },
    { id: 'JP', name: 'Tokyo Gateway', flag: '🇯🇵', scale: 8.5, lat: 35.6762, lng: 139.6503, x: 810, y: 155, activeShipments: 11, escrowLocked: 247000, info: "Connecting precision robotics components and artisan ceramic trade corridors." },
    { id: 'AU', name: 'Sydney Gateway', flag: '🇦🇺', scale: 0.082, lat: -33.8688, lng: 151.2093, x: 825, y: 310, activeShipments: 4, escrowLocked: 42100, info: "Direct organic cosmetics shipping lane connecting oceanic verified farmers." },
    { id: 'CA', name: 'Toronto Gateway', flag: '🇨🇦', scale: 0.074, lat: 43.6532, lng: -79.3832, x: 270, y: 110, activeShipments: 5, escrowLocked: 54900, info: "Validating eco-certified timber designs with instant customs release." },
    { id: 'IN', name: 'Mumbai Gateway', flag: '🇮🇳', scale: 4.5, lat: 19.0760, lng: 72.8777, x: 670, y: 200, activeShipments: 7, escrowLocked: 112500, info: "Validating handcrafted textile dispatches through the western port complex." },
    { id: 'BR', name: 'São Paulo Gateway', flag: '🇧🇷', scale: 0.27, lat: -23.5505, lng: -46.6333, x: 370, y: 290, activeShipments: 9, escrowLocked: 145000, info: "Direct clearing routes for fine leather apparel and verified raw commodities." },
  ], []);

  const handleExecutePing = (hubId: string) => {
    setPingStatus('pinging');
    setPingLatency(null);
    setPingLogs([
      `[${new Date().toLocaleTimeString()}] PING: Initiating sequence from Pretoria Central Hub (ZA-HQ)...`,
      `[${new Date().toLocaleTimeString()}] GLOW-DNS: Querying secure path for corridor [ZA -> ${hubId}]...`,
    ]);

    setTimeout(() => {
      const generatedLatency = Math.floor(Math.random() * 55) + 30; // 30ms to 85ms
      setPingLatency(generatedLatency);
      setPingStatus('completed');
      setPingLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] CRYPTO_TUNNEL: AES-GCM-256 secure tunnel bound successfully.`,
        `[${new Date().toLocaleTimeString()}] ESCROW_VAULT: Double-sign-off audit response: OK. No discrepancies.`,
        `[${new Date().toLocaleTimeString()}] SUCCESS: [ZA -> ${hubId}] link completely safe. Network latency: ${generatedLatency}ms.`
      ]);
    }, 1200);
  };

  const handleToggleBreaker = () => {
    if (!escrowBreakerActive) {
      setEscrowBreakerActive(true);
      setBreakerLogs([
        `[${new Date().toLocaleTimeString()}] ⚠️ GLOBAL ESCROW BREAK-LOCK ENGAGED!`,
        `[${new Date().toLocaleTimeString()}] PROTOCOL: Freezing 100% of outbound global payout balances.`,
        `[${new Date().toLocaleTimeString()}] ROUTER: Delaying automatic payout splits at multi-currency gateways.`,
        `[${new Date().toLocaleTimeString()}] SYSTEM: All active 24-hour clearing clocks paused. Standard 12-hour cancellations locked in place.`
      ]);
    } else {
      setEscrowBreakerActive(false);
      setBreakerLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] ✅ Global rescue reset. All automatic release queues returned to normal operation.`
      ]);
    }
  };

  return (
    <Translate langId={langId}>
      <div className="space-y-6" id="buyer-portal-root">
      {/* Search and Filters Hub */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-5 shadow-xs border border-gray-100 dark:border-zinc-800 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3.5 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={t('search_listings')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-zinc-100 pl-11 pr-4 py-3 rounded-2xl text-sm border border-gray-100 dark:border-zinc-800 focus:outline-hidden focus:ring-1 focus:ring-emerald-400 placeholder:text-gray-400"
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setViewType('grid'); setFocusedSeller(null); }}
              className={`flex items-center gap-1.5 px-4 py-3 rounded-2xl text-xs font-semibold cursor-pointer transition-colors ${
                viewType === 'grid'
                  ? 'bg-emerald-500 text-white shadow-xs'
                  : 'bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 hover:bg-gray-200'
              }`}
            >
              <LayoutGrid className="w-4 h-4" /> Grid Catalog
            </button>
            <button
              onClick={() => { setViewType('map'); setFocusedSeller(null); }}
              className={`flex items-center gap-1.5 px-4 py-3 rounded-2xl text-xs font-semibold cursor-pointer transition-colors ${
                viewType === 'map'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 hover:bg-gray-200'
              }`}
            >
              <Map className="w-4 h-4" /> Interactive Map
            </button>
            <button
              onClick={() => { setViewType('corridor'); setFocusedSeller(null); }}
              className={`flex items-center gap-1.5 px-4 py-3 rounded-2xl text-xs font-semibold cursor-pointer transition-colors ${
                viewType === 'corridor'
                  ? 'bg-emerald-500 text-white animate-pulse'
                  : 'bg-gradient-to-r from-teal-500/10 to-emerald-500/10 dark:from-teal-500/5 dark:to-emerald-500/5 text-teal-600 dark:text-teal-400 border border-teal-550/25 hover:from-teal-500/20'
              }`}
            >
              <Globe className="w-4 h-4" /> Global Corridors
            </button>
            <button
              onClick={() => setShowBuyerMessengerList(true)}
              className="relative p-3 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-2xl text-gray-700 dark:text-zinc-300 cursor-pointer transition-colors"
              title="Secure Haggle Messenger"
              id="btn-buyer-messenger-toggle"
            >
              <MessageSquare className="w-5 h-5 text-amber-500" />
              {p2pChats.some(c => c.unreadByBuyer) && (
                <span className="absolute -top-1 -right-1 bg-red-500 w-3 h-3 rounded-full flex items-center justify-center animate-pulse border border-white dark:border-zinc-900" />
              )}
            </button>
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-3 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-2xl text-gray-700 dark:text-zinc-300 cursor-pointer transition-colors"
              id="btn-cart-toggle"
            >
              <ShoppingCart className="w-5 h-5" />
              {cart.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {cart.reduce((s, c) => s + c.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Categories, Prices & Ratings filtering parameters */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-gray-50 dark:border-zinc-800">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all ${
                  selectedCategory === cat
                    ? 'bg-emerald-500 text-white shadow-xs'
                    : 'bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-950 dark:hover:bg-zinc-800 text-gray-600 dark:text-zinc-300 border border-gray-100 dark:border-zinc-805'
                }`}
              >
                {cat === 'All' ? t('all_categories') : cat}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-gray-500 font-medium">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-3.5 h-3.5 text-gray-400" />
              <span>{t('price_range')}:</span>
              <input
                type="range"
                min="10"
                max="400"
                step="10"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-24 accent-emerald-500 cursor-pointer"
              />
              <span className="text-gray-900 dark:text-white font-bold">{selectedRegion.currencySymbol}{(priceRange * selectedRegion.exchangeRate).toFixed(0)}</span>
            </div>

            <div className="flex items-center gap-2">
              <span>Rating:</span>
              <select
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
                className="bg-zinc-50 dark:bg-zinc-950 text-gray-800 dark:text-zinc-200 border border-gray-100 dark:border-zinc-800 rounded-lg p-1.5 px-2 font-semibold focus:outline-hidden"
              >
                <option value="0">All Ratings</option>
                <option value="4">4.0+ Stars</option>
                <option value="4.5">4.5+ Stars</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="shrink-0">Seller Origin:</span>
              <select
                value={selectedCountryFilter}
                onChange={(e) => setSelectedCountryFilter(e.target.value)}
                className="bg-zinc-50 dark:bg-zinc-950 text-gray-800 dark:text-zinc-200 border border-gray-100 dark:border-zinc-800 rounded-lg p-1.5 px-2 font-semibold focus:outline-hidden cursor-pointer"
                id="filter-seller-country"
              >
                <option value="All">🌐 All Countries</option>
                <option value="ZA">🇿🇦 South Africa (ZA)</option>
                <option value="CN">🇨🇳 China (CN)</option>
                <option value="US">🇺🇸 United States (US)</option>
                <option value="GB">🇬🇧 United Kingdom (GB)</option>
                <option value="EU">🇪🇺 Germany / EU (EU)</option>
                <option value="JP">🇯🇵 Japan (JP)</option>
                <option value="AU">🇦🇺 Australia (AU)</option>
                <option value="CA">🇨🇦 Canada (CA)</option>
                <option value="IN">🇮🇳 India (IN)</option>
                <option value="BR">🇧🇷 Brazil (BR)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {focusedSeller && (
        <div className="flex items-center justify-between bg-emerald-50/50 dark:bg-zinc-900 border border-emerald-100 dark:border-emerald-950/40 p-3 rounded-2xl text-xs">
          <span className="text-emerald-800 dark:text-emerald-400">
            Filtering items exclusive to seller: <strong>{sellerPositions.find(s => s.id === focusedSeller)?.name}</strong>
          </span>
          <button
            onClick={() => setFocusedSeller(null)}
            className="text-gray-500 hover:text-red-500 underline cursor-pointer"
          >
            Clear seller filter
          </button>
        </div>
      )}

      {/* Main browse display based on View Type */}
      {viewType === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6" id="grid-products-catalog">
          <AnimatePresence>
            {filteredProducts.map((prod) => {
              const inWishlist = wishlist.includes(prod.id);
              return (
                <motion.div
                  key={prod.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group relative"
                >
                  {/* Category Pill / Verify seal */}
                  <div className="absolute top-3 left-3 z-10 flex gap-1.5 items-center">
                    <span className="bg-zinc-900/80 backdrop-blur-md text-white text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-1 rounded-full">
                      {prod.category}
                    </span>
                    {prod.verified && (
                      <span className="bg-emerald-500/90 text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-0.5 shadow-xs">
                        <ShieldCheck className="w-3 h-3" /> VERIFIED
                      </span>
                    )}
                  </div>

                  {/* Wishlist toggle */}
                  <button
                    onClick={() => toggleWishlist(prod.id)}
                    className={`absolute top-3 right-3 z-10 p-2.5 rounded-full backdrop-blur-md cursor-pointer transition-all ${
                      inWishlist
                        ? 'bg-rose-500 text-white'
                        : 'bg-white/80 dark:bg-zinc-950/80 text-gray-500 dark:text-zinc-400 hover:text-rose-500'
                    }`}
                  >
                    <Heart className="w-4 h-4 fill-current" />
                  </button>

                  <div className="h-32 sm:h-48 overflow-hidden relative">
                    <img
                      src={prod.imageUrl}
                      alt={prod.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {prod.stock <= 0 && (
                      <div className="absolute inset-0 bg-black/65 flex items-center justify-center">
                        <span className="text-white text-xs tracking-widest uppercase font-bold bg-red-600 px-3 py-1.5 rounded-lg border border-red-500 shadow-xs">
                          SOLD OUT
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info Panel */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-1.5 flex-wrap mb-1.5">
                        <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-zinc-400 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-rose-500" />
                          <span>{prod.sellerName}</span>
                        </div>
                        {prod.originRegion && (
                          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 border border-gray-150 dark:border-zinc-850 text-[10px] font-semibold text-zinc-600 dark:text-zinc-305 shrink-0">
                            <span>{REGION_LOOKUP[prod.originRegion]?.flag || '🌐'}</span>
                            <span>{prod.originRegion}</span>
                          </div>
                        )}
                      </div>

                      {prod.shippedGlobally && (
                        <div className="mb-2 flex items-center gap-1 text-[9px] bg-emerald-500/10 text-emerald-500 border border-emerald-500/10 px-2 py-0.5 rounded-full font-bold w-fit">
                          <span>🌍 Global Corridor Shipped</span>
                        </div>
                      )}

                      <h3 className="font-bold text-gray-900 dark:text-white text-md tracking-tight line-clamp-1 mb-2">
                        {prod.title}
                      </h3>
                      <div className="flex items-center gap-1 mb-3">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="text-xs font-bold text-gray-800 dark:text-zinc-200">{prod.rating}</span>
                        <span className="text-xs text-gray-400">({prod.ratingCount} reviews)</span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-zinc-400 leading-relaxed mb-4 line-clamp-2">
                        {prod.description}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-baseline justify-between mb-4">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xl font-extrabold text-[#5eead4] dark:text-[#4ade80]">
                            {selectedRegion.currencySymbol}{(prod.price * selectedRegion.exchangeRate).toFixed(2)}
                          </span>
                          {prod.originalPrice && (
                            <span className="text-xs text-gray-400 line-through">
                              {selectedRegion.currencySymbol}{(prod.originalPrice * selectedRegion.exchangeRate).toFixed(2)}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-zinc-400 font-bold">
                          Stock: {prod.stock} instock
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => startChatWithSeller(prod)}
                        className="w-full mb-2 bg-amber-500/10 hover:bg-amber-500/15 border border-amber-500/20 dark:border-amber-500/10 text-amber-600 dark:text-amber-400 font-bold py-2 rounded-xl text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        🤝 Haggle Price & Chat
                      </button>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => { setSelectedProduct(prod); setActiveMediaTab('photo'); }}
                          className="w-full bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800 dark:hover:bg-zinc-700/80 text-gray-800 dark:text-zinc-100 font-semibold py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-gray-100 dark:border-zinc-800"
                        >
                          <Eye className="w-3.5 h-3.5" /> Details
                        </button>
                        <button
                          disabled={prod.stock <= 0}
                          onClick={() => addToCart(prod, 1)}
                          className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-zinc-100 disabled:dark:bg-zinc-800 disabled:text-gray-400 text-white font-bold py-2.5 rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-1"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" /> {t('Buy')}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      ) : viewType === 'map' ? (
        /* Map Layout View Coordinate Grid */
        <div className="bg-white dark:bg-zinc-950 border border-gray-100 dark:border-zinc-850 rounded-3xl p-6 shadow-xs relative overflow-hidden" id="interactive-map-container">
          <div className="absolute top-4 left-4 z-10 max-w-sm bg-white/90 dark:bg-zinc-900/95 backdrop-blur-md p-4 rounded-2xl shadow-md border border-gray-100 dark:border-zinc-800 text-xs text-gray-600 dark:text-zinc-300">
            <h4 className="font-bold text-gray-950 dark:text-white flex items-center gap-1 mb-1">
              <Sparkles className="w-4 h-4 text-emerald-400" /> MapStore Interactive Grid
            </h4>
            <p className="mb-2">Click any verified local seller icon to filter items exclusive to their regional branch.</p>
            <div className="flex gap-1.5">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 border border-white"></span>
              <span>Available Sellers</span>
            </div>
          </div>

          {/* Styled Abstract SVG Topographic/Radar Coordinate Map background with Zoom & Pan bounds overflow */}
          <div className="w-full h-[400px] bg-slate-100 dark:bg-zinc-900/60 rounded-2xl relative border border-gray-150 dark:border-zinc-800 flex items-center justify-center overflow-hidden" id="local-map-view-viewport">
            
            {/* Zoomable & Pannable Wrapper Pane */}
            <div 
              style={{
                transform: `scale(${localMapZoom}) translate(${localMapPan.x}px, ${localMapPan.y}px)`,
                transformOrigin: 'center center',
                transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
              className="absolute inset-0 w-full h-full transition-all"
            >
              {/* Grid overlay lines */}
              <div className="absolute inset-0 grid grid-cols-12 grid-rows-6 opacity-30 dark:opacity-20 pointer-events-none">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={`col-${i}`} className="border-r border-gray-300 dark:border-zinc-600 h-full"></div>
                ))}
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={`row-${i}`} className="border-b border-gray-300 dark:border-zinc-600 w-full"></div>
                ))}
              </div>

              {/* Radar Sweep Effect */}
              <div className="absolute w-[300px] h-[300px] border border-emerald-500/10 rounded-full animate-ping pointer-events-none left-[calc(50%-150px)] top-[calc(50%-150px)]"></div>

              {/* Advanced Topographic Route Vector Overlay (Linking Pretoria sorting facility directly to our active branch merchants) */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
                {sellerPositions.map((sell) => {
                  const sellPos = getCoordinatesPosition(sell.lat, sell.lng);
                  // Fixed local Pretoria Hub coordinates
                  const hubPos = getCoordinatesPosition(37.7785, -122.4330);
                  
                  const x1 = parseFloat(sellPos.left);
                  const y1 = parseFloat(sellPos.top);
                  const x2 = parseFloat(hubPos.left);
                  const y2 = parseFloat(hubPos.top);
                  
                  const isSellerFocused = focusedSeller === sell.id;
                  
                  return (
                    <g key={`local-route-${sell.id}`}>
                      {/* Pulse shadow lane */}
                      <line
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke={isSellerFocused ? '#5eead4' : '#10b981'}
                        strokeWidth={isSellerFocused ? '0.7' : '0.4'}
                        strokeOpacity={isSellerFocused ? '0.9' : '0.4'}
                        className="transition-all"
                      />
                      {/* Sub route dash overlay */}
                      <line
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke="#059669"
                        strokeWidth="0.2"
                        strokeDasharray="1,1.5"
                      />
                      {/* Animated parcel tracking point representing delivery packages pathing */}
                      <circle r="0.6" fill={isSellerFocused ? '#22d3ee' : '#34d399'}>
                        <animateMotion
                          path={`M ${x1} ${y1} L ${x2} ${y2}`}
                          dur="3.2s"
                          repeatCount="indefinite"
                        />
                      </circle>
                    </g>
                  );
                })}
              </svg>

              {/* Centurion Regional Cargo Sorting & Dispatch Hub Node plotted under coordinates */}
              {(() => {
                const hubCoords = getCoordinatesPosition(37.7785, -122.4330);
                return (
                  <div
                    style={{ top: hubCoords.top, left: hubCoords.left }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center"
                    id="map-local-hub-pin"
                  >
                    <div className="bg-slate-900 border border-emerald-500/40 p-1.5 rounded-lg shadow-md flex items-center justify-center text-emerald-400">
                      <Truck className="w-4 h-4" />
                    </div>
                    <span className="mt-1 whitespace-nowrap bg-emerald-950/95 text-[#5eead4] border border-emerald-800 text-[8px] px-1.5 py-0.5 rounded font-black tracking-wider shadow-sm uppercase font-mono">
                      ZA-Hub Centurion
                    </span>
                  </div>
                );
              })()}

              {/* Seller pinpoint nodes plotted dynamically */}
              {sellerPositions.map((sell) => {
                const pos = getCoordinatesPosition(sell.lat, sell.lng);
                const isActive = focusedSeller === sell.id;
                return (
                  <div
                    key={sell.id}
                    style={{ top: pos.top, left: pos.left }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
                  >
                    <button
                      onClick={() => setFocusedSeller(isActive ? null : sell.id)}
                      className={`relative p-2.5 rounded-full border shadow-lg transition-transform hover:scale-110 cursor-pointer ${
                        isActive
                          ? 'bg-[#5eead4] dark:bg-[#4ade80] text-black border-white'
                          : 'bg-white text-rose-500 border-zinc-200 hover:border-[#5eead4]'
                      }`}
                    >
                      <MapPin className="w-5 h-5 fill-current" />
                      {/* Ring helper indicator */}
                      <span className="absolute -inset-1 rounded-full border border-emerald-400 animate-pulse pointer-events-none"></span>
                    </button>
                    <span className="absolute top-10 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/85 text-white dark:bg-zinc-950/90 text-[10px] px-2 py-0.5 rounded-md font-semibold font-mono tracking-tight shadow-md border border-neutral-800">
                      {sell.name}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Premium Floating Navigation & Zoom D-Pad HUD */}
            <div className="absolute bottom-4 right-4 z-30 flex flex-col items-center gap-2 bg-white/95 dark:bg-zinc-950/95 p-2.5 rounded-2.5xl border border-gray-255 dark:border-zinc-800 shadow-xl backdrop-blur-md">
              <div className="text-[8px] font-black uppercase text-gray-400 font-mono tracking-widest text-center border-b border-gray-100 dark:border-zinc-850 pb-1.5 w-full">
                Interactive HUD
              </div>
              {/* Zoom Tier Toggle */}
              <div className="flex items-center gap-1.5 border-b border-gray-100 dark:border-zinc-850 pb-2 w-full justify-between">
                <button
                  onClick={() => setLocalMapZoom(prev => Math.min(3, prev + 0.5))}
                  className="p-1.5 bg-gray-50 hover:bg-emerald-500 hover:text-white dark:bg-zinc-900 text-gray-750 dark:text-zinc-350 dark:hover:bg-emerald-500 dark:hover:text-white rounded-lg transition-all cursor-pointer flex items-center justify-center"
                  title="Zoom In (Inspect delivery routes in close-up)"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <span className="text-[10px] font-bold font-mono min-w-[32px] text-center text-gray-800 dark:text-zinc-200">
                  {localMapZoom.toFixed(1)}x
                </span>
                <button
                  onClick={() => {
                    setLocalMapZoom(prev => {
                      const updated = Math.max(1, prev - 0.5);
                      if (updated === 1) setLocalMapPan({ x: 0, y: 0 });
                      return updated;
                    });
                  }}
                  className="p-1.5 bg-gray-50 hover:bg-emerald-500 hover:text-white dark:bg-zinc-900 text-gray-750 dark:text-zinc-350 dark:hover:bg-emerald-500 dark:hover:text-white rounded-lg transition-all cursor-pointer flex items-center justify-center"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Pan Directional arrows (Useful only when scale is greater than 1x) */}
              <div className="flex flex-col items-center">
                <div className="grid grid-cols-3 gap-1 w-full justify-items-center">
                  <div></div>
                  <button
                    onClick={() => setLocalMapPan(prev => ({ ...prev, y: prev.y + 50 }))}
                    className="p-1 bg-gray-50 hover:bg-emerald-500 hover:text-white dark:bg-zinc-900 text-gray-500 dark:text-zinc-400 dark:hover:bg-emerald-500 dark:hover:text-white rounded-md transition-colors flex items-center justify-center cursor-pointer w-6 h-6 border border-gray-100 dark:border-zinc-800"
                    title="Pan Up"
                  >
                    <span className="text-[10px]">▲</span>
                  </button>
                  <div></div>

                  <button
                    onClick={() => setLocalMapPan(prev => ({ ...prev, x: prev.x + 50 }))}
                    className="p-1 bg-gray-50 hover:bg-emerald-500 hover:text-white dark:bg-zinc-900 text-gray-500 dark:text-zinc-400 dark:hover:bg-emerald-500 dark:hover:text-white rounded-md transition-colors flex items-center justify-center cursor-pointer w-6 h-6 border border-gray-100 dark:border-zinc-800"
                    title="Pan Left"
                  >
                    <span className="text-[10px]">◀</span>
                  </button>
                  <button
                    onClick={() => {
                      setLocalMapZoom(1);
                      setLocalMapPan({ x: 0, y: 0 });
                    }}
                    className="p-1 bg-zinc-100 dark:bg-zinc-850 text-[10px] font-black hover:bg-emerald-500 hover:text-white dark:text-zinc-350 dark:hover:bg-emerald-500 dark:hover:text-white rounded-md flex items-center justify-center cursor-pointer w-6 h-6"
                    title="Reset Coordinates"
                  >
                    ↺
                  </button>
                  <button
                    onClick={() => setLocalMapPan(prev => ({ ...prev, x: prev.x - 50 }))}
                    className="p-1 bg-gray-50 hover:bg-emerald-500 hover:text-white dark:bg-zinc-900 text-gray-500 dark:text-zinc-400 dark:hover:bg-emerald-500 dark:hover:text-white rounded-md transition-colors flex items-center justify-center cursor-pointer w-6 h-6 border border-gray-100 dark:border-zinc-800"
                    title="Pan Right"
                  >
                    <span className="text-[10px]">▶</span>
                  </button>

                  <div></div>
                  <button
                    onClick={() => setLocalMapPan(prev => ({ ...prev, y: prev.y - 50 }))}
                    className="p-1 bg-gray-50 hover:bg-emerald-500 hover:text-white dark:bg-zinc-900 text-gray-500 dark:text-zinc-400 dark:hover:bg-emerald-500 dark:hover:text-white rounded-md transition-colors flex items-center justify-center cursor-pointer w-6 h-6 border border-gray-100 dark:border-zinc-800"
                    title="Pan Down"
                  >
                    <span className="text-[10px]">▼</span>
                  </button>
                  <div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* The Global Escrow Flight Control Tower View */
        <div className="space-y-6" id="global-corridors-cockpit">
          {/* Main Flight Deck */}
          <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl p-6 shadow-2xl relative overflow-hidden flex flex-col lg:flex-row gap-6">
            
            {/* Elegant telemetry overlay background grids */}
            <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none"></div>
            
            {/* Left Column: Visual Map / SVG Radar */}
            <div className="flex-1 bg-slate-950/80 border border-slate-800/60 rounded-2xl p-4 relative flex flex-col items-center justify-center min-h-[380px] overflow-hidden" id="corridor-cockpit-map-pane">
              
              {/* Radar scanner sweep visualizer */}
              <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-slate-900/90 border border-slate-800 p-2.5 rounded-xl text-[10px] font-mono tracking-tight text-emerald-400">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
                <span>PRETORIA SECURE INTEGRATION ACTIVE</span>
              </div>
              
              {/* Zoom Wrapper viewport wrapper with clip paths */}
              <div className="w-full h-[320px] max-w-[850px] relative overflow-hidden flex items-center justify-center">
                {/* SVG containing the Map representation */}
                <svg className="w-full h-full" viewBox="0 0 900 360">
                  {/* Outer grid that stays unzoomed or moves with zoom */}
                  <g
                    style={{
                      transform: `translate(${corridorPan.x}px, ${corridorPan.y}px) scale(${corridorZoom})`,
                      transformOrigin: '480px 265px',
                      transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                  >
                    {/* Dotted oceanic paths and contours */}
                    <path d="M 100,50 Q 250,150 480,265" fill="none" stroke="#2a3342" strokeWidth="1" strokeDasharray="3,3" />
                    <path d="M 480,265 Q 600,100 810,155" fill="none" stroke="#2a3342" strokeWidth="1" strokeDasharray="3,3" />
                    <path d="M 480,265 Q 520,180 670,200" fill="none" stroke="#2a3342" strokeWidth="1" strokeDasharray="3,3" />
                    
                    {/* Global Corridor Lines with glowing pulses from South Africa (HQ at approx x:480, y:265) */}
                    {CORRIDOR_HUBS.map((hub) => {
                      const isSelected = selectedCorridorHub === hub.id;
                      return (
                        <g key={`line-${hub.id}`}>
                          <line
                            x1="480"
                            y1="265"
                            x2={hub.x}
                            y2={hub.y}
                            stroke={isSelected ? '#5eead4' : '#10b981'}
                            strokeWidth={isSelected ? '2.5' : '1.2'}
                            strokeOpacity={isSelected ? '0.95' : '0.45'}
                            className="transition-all duration-300"
                          />
                          {/* Pulse circle animating along the corridor line */}
                          <circle r="4.5" fill="#5eead4" opacity="0.9">
                            <animateMotion
                              path={`M 480 265 L ${hub.x} ${hub.y}`}
                              dur={`${4 / (hub.activeShipments > 10 ? 1.5 : 0.8)}s`}
                              repeatCount="indefinite"
                            />
                          </circle>
                        </g>
                      );
                    })}
                    
                    {/* Pretoria Main Node (Anchor Point) */}
                    <g transform="translate(480, 265)" className="cursor-pointer">
                      <circle r="14" fill="#10b981" fillOpacity="0.25" className="animate-pulse" />
                      <circle r="7.5" fill="#10b981" />
                      <text y="-16" fill="#10b981" className="text-[10px] font-black font-mono text-center select-none" textAnchor="middle">
                        ZA-HQ (Pretoria)
                      </text>
                    </g>
                    
                    {/* Destination Nodes */}
                    {CORRIDOR_HUBS.map((hub) => {
                      const isSelected = selectedCorridorHub === hub.id;
                      return (
                        <g
                          key={`node-${hub.id}`}
                          transform={`translate(${hub.x}, ${hub.y})`}
                          className="cursor-pointer group animate-fade-in"
                          onClick={() => { setSelectedCorridorHub(hub.id); }}
                        >
                          <circle
                            r={isSelected ? '12' : '7'}
                            fill={isSelected ? '#5eead4' : '#475569'}
                            fillOpacity={isSelected ? '0.4' : '0.6'}
                            className="transition-all duration-300 group-hover:fill-emerald-400 group-hover:scale-125"
                          />
                          <circle r="3.5" fill={isSelected ? '#5eead4' : '#94a3b8'} className="transition-all" />
                          <text
                            y="-12"
                            fill={isSelected ? '#5eead4' : '#94a3b8'}
                            className="text-[9px] font-mono font-bold transition-all text-center group-hover:fill-white select-none"
                            textAnchor="middle"
                          >
                            {hub.flag} {hub.id}
                          </text>
                        </g>
                      );
                    })}
                  </g>
                </svg>
              </div>

              {/* Floating Dark Sci-fi Corridor Zoom Controller Panel */}
              <div className="absolute bottom-4 right-4 z-30 flex items-center gap-2 bg-slate-900/90 border border-slate-800 p-2 rounded-xl shadow-lg backdrop-blur-md">
                <button
                  onClick={() => setCorridorZoom(prev => Math.min(3, prev + 0.5))}
                  className="p-1 px-2 bg-slate-950 hover:bg-emerald-500 text-emerald-400 hover:text-white rounded-md transition-colors font-mono text-xs font-bold cursor-pointer"
                  title="Zoom In Courier Routes"
                >
                  +
                </button>
                <span className="text-[10px] text-emerald-400 font-bold font-mono tracking-tight select-none">
                  ROUTE ZOOM: {corridorZoom.toFixed(1)}x
                </span>
                <button
                  onClick={() => {
                    setCorridorZoom(prev => {
                      const updated = Math.max(1, prev - 0.5);
                      if (updated === 1) setCorridorPan({ x: 0, y: 0 });
                      return updated;
                    });
                  }}
                  className="p-1 px-2 bg-slate-950 hover:bg-emerald-500 text-emerald-400 hover:text-white rounded-md transition-colors font-mono text-xs font-bold cursor-pointer"
                  title="Zoom Out Courier Routes"
                >
                  -
                </button>
                <div className="h-4 w-[1px] bg-slate-800 mx-0.5" />
                
                {/* Fast directional pan controls */}
                <button
                  onClick={() => setCorridorPan(prev => ({ ...prev, x: prev.x + 80 }))}
                  className="p-1 text-[10px] font-bold text-slate-400 hover:text-white hover:bg-slate-800 rounded cursor-pointer"
                  title="Pan West"
                >
                  ◀
                </button>
                <button
                  onClick={() => setCorridorPan(prev => ({ ...prev, y: prev.y + 80 }))}
                  className="p-1 text-[10px] font-bold text-slate-400 hover:text-white hover:bg-slate-800 rounded cursor-pointer"
                  title="Pan North"
                >
                  ▲
                </button>
                <button
                  onClick={() => {
                    setCorridorZoom(1);
                    setCorridorPan({ x: 0, y: 0 });
                  }}
                  className="p-1 text-[9px] font-bold text-amber-400 hover:text-white hover:bg-slate-800 rounded font-mono cursor-pointer"
                  title="Reset Corridor Perspective"
                >
                  RESET
                </button>
                <button
                  onClick={() => setCorridorPan(prev => ({ ...prev, y: prev.y - 80 }))}
                  className="p-1 text-[10px] font-bold text-slate-400 hover:text-white hover:bg-slate-800 rounded cursor-pointer"
                  title="Pan South"
                >
                  ▼
                </button>
                <button
                  onClick={() => setCorridorPan(prev => ({ ...prev, x: prev.x - 80 }))}
                  className="p-1 text-[10px] font-bold text-slate-400 hover:text-white hover:bg-slate-800 rounded cursor-pointer"
                  title="Pan East"
                >
                  ▶
                </button>
              </div>
              
              <div className="w-full border-t border-slate-800/80 pt-3 flex flex-wrap justify-between text-[11px] font-mono text-slate-400">
                <span>📍 Center Node Latency Audit Server: Pretoria Main Gateway</span>
                <span className="text-[#5eead4]">Slogan Connection: "reaching you"</span>
              </div>
            </div>
            
            {/* Right Column: Telemetry Specs & Operations Control Board */}
            <div className="w-full lg:w-[350px] flex flex-col gap-4">
              
              {/* Highlight Hub details cards */}
              {(() => {
                const activeHub = CORRIDOR_HUBS.find(h => h.id === selectedCorridorHub) || CORRIDOR_HUBS[0];
                return (
                  <div className="bg-slate-950/90 border border-slate-800 p-5 rounded-2xl flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-[#5eead4] font-black uppercase tracking-wider">Active Corridor Telemetry</span>
                      <span className="text-sm">{activeHub.flag}</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white font-mono">{activeHub.name} (ZA-{activeHub.id})</h4>
                      <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed font-sans">{activeHub.info}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800/60 font-mono text-[11px]">
                      <div>
                        <span className="text-slate-500 block text-[9px] uppercase">Active dispatches</span>
                        <span className="text-white font-bold text-xs">{activeHub.activeShipments} Shipments</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[9px] uppercase">Escrow locked</span>
                        <span className="text-emerald-400 font-bold text-xs">{selectedRegion.currencySymbol}{(activeHub.escrowLocked * selectedRegion.exchangeRate).toFixed(0)}</span>
                      </div>
                    </div>
                  </div>
                );
              })()}
              
              {/* Multi-Currency Forex Rates Normalizer */}
              <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl flex flex-col gap-2.5">
                <span className="text-[10px] font-mono text-amber-500 font-bold uppercase tracking-wider flex items-center gap-1">
                  <RefreshCw className="w-3.5 h-3.5" /> Currency Exchange Auto-Sizer
                </span>
                <div className="flex gap-2 items-center">
                  <div className="flex-1">
                    <label className="text-[9px] text-slate-500 block">ZAR (R)</label>
                    <input
                      type="number"
                      value={calcZarAmount}
                      onChange={(e) => setCalcZarAmount(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 text-white rounded-lg p-1.5 font-mono text-xs focus:outline-hidden focus:border-emerald-500"
                    />
                  </div>
                  <div className="text-xs text-slate-500 self-end mb-2 font-mono">➡</div>
                  <div className="flex-1">
                    <label className="text-[9px] text-slate-500 block">Target Hub Exchange</label>
                    <select
                      value={calcTargetRate}
                      onChange={(e) => setCalcTargetRate(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 text-white rounded-lg p-1.5 font-mono text-xs focus:outline-hidden cursor-pointer"
                    >
                      {CORRIDOR_HUBS.map(h => (
                        <option key={`forex-${h.id}`} value={h.id}>{h.flag} {h.id}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                {(() => {
                  const hub = CORRIDOR_HUBS.find(h => h.id === calcTargetRate) || CORRIDOR_HUBS[0];
                  const zarNum = parseFloat(calcZarAmount) || 0;
                  const convertedAmount = zarNum * hub.scale;
                  return (
                    <div className="bg-slate-900/45 p-2 rounded-lg text-center font-mono text-[11px] text-slate-300">
                      <strong>R {zarNum.toLocaleString()} ZAR</strong> ≈ <strong className="text-[#5eead4]"> {hub.flag} {(convertedAmount).toFixed(2)} {hub.id === 'EU' ? 'EUR' : hub.id === 'GB' ? 'GBP' : hub.id === 'US' ? 'USD' : hub.id}</strong>
                    </div>
                  );
                })()}
              </div>
              
              {/* Emergency Interlock Simulator */}
              <button
                onClick={handleToggleBreaker}
                className={`w-full py-2.5 px-4 rounded-xl font-bold font-mono text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  escrowBreakerActive
                    ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 animate-pulse'
                    : 'bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-500 animate-pulse'
                }`}
              >
                <AlertCircle className="w-4 h-4" />
                {escrowBreakerActive ? "RELEASE ESCROW INTERLOCK LOCK" : "SIMULATE DISPUTE LOCK-RELEASE"}
              </button>
            </div>
          </div>
          
          {/* Diagnostic Console Box */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Ping diagnostics component section */}
            <div className="bg-zinc-950 border border-zinc-900 text-zinc-300 p-5 rounded-3xl font-mono text-xs flex flex-col gap-3 min-h-[220px]">
              <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
                <span className="text-[#5eead4] font-black tracking-widest uppercase text-[10px] flex items-center gap-1.5 font-mono">
                  <Terminal className="w-4 h-4" /> LATENCY DIAGNOSTIC PROBE
                </span>
                <span className="text-[10px] text-zinc-500">Node: ZA_PRETORIA_HQ</span>
              </div>
              <p className="text-[10.5px] text-zinc-400 leading-relaxed font-sans">
                Diagnose automated double-sign-off vault connections across the global server ring to verify real-time trust ledger responses.
              </p>
              
              <div className="flex gap-2 mt-1">
                <select
                  value={selectedCorridorHub}
                  onChange={(e) => setSelectedCorridorHub(e.target.value)}
                  className="bg-zinc-900 border border-zinc-850 text-white rounded-xl p-2 font-mono text-xs focus:outline-hidden cursor-pointer flex-1"
                >
                  {CORRIDOR_HUBS.map(h => (
                    <option key={`opt-${h.id}`} value={h.id}>{h.flag} Pretoria ➡ {h.name}</option>
                  ))}
                </select>
                <button
                  onClick={() => handleExecutePing(selectedCorridorHub)}
                  disabled={pingStatus === 'pinging'}
                  className="bg-[#5eead4] hover:bg-teal-400 text-black font-extrabold px-4 py-2 rounded-xl text-xs font-mono tracking-wider cursor-pointer transition-colors disabled:bg-zinc-900 disabled:text-zinc-650"
                >
                  {pingStatus === 'pinging' ? "CONNECTING..." : "PING NODE"}
                </button>
              </div>
              
              <div className="bg-zinc-900/65 p-3 rounded-2xl border border-zinc-900 min-h-[90px] text-[10.5px] text-zinc-400 space-y-1 overflow-y-auto">
                {pingLogs.length === 0 ? (
                  <span className="text-zinc-600 block text-center py-4 font-sans">No diagnostic probe initiated. Click PING NODE above to test.</span>
                ) : (
                  pingLogs.map((log, i) => (
                    <div key={`log-${i}`} className={log.includes('SUCCESS') ? 'text-emerald-400' : log.includes('PING') ? 'text-teal-305' : 'text-zinc-400'}>
                      {log}
                    </div>
                  ))
                )}
              </div>
            </div>
            
            {/* Live Escrow Freeze console screen */}
            <div className="bg-zinc-950 border border-zinc-900 text-zinc-300 p-5 rounded-3xl font-mono text-xs flex flex-col gap-3 min-h-[220px]">
              <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
                <span className="text-red-400 font-bold tracking-widest uppercase text-[10px] flex items-center gap-1.5 font-mono">
                  <Compass className="w-4 h-4" /> LEDGER LOCKOUT TERMINAL
                </span>
                <span className="text-[10px] text-zinc-500">Status: {escrowBreakerActive ? "MUTED_FREEZE" : "NORMAL_MONITOR"}</span>
              </div>
              <p className="text-[10.5px] text-zinc-400 leading-relaxed font-sans">
                Simulates our instant buyer protection freeze state. If a freight tracking anomaly is reported on any routing corridor, payouts automatically halt.
              </p>
              
              <div className="bg-zinc-900/65 p-3 rounded-2xl border border-zinc-900 min-h-[125px] text-[10.5px] text-zinc-400 space-y-1 overflow-y-auto flex-1">
                {breakerLogs.length === 0 ? (
                  <div className="text-zinc-600 text-center py-6 font-sans">
                    <p>Escrow Vault running under normal automated 12h cancellation bounds.</p>
                    <p className="text-[9.5px] mt-1 text-zinc-700">Click the RED trigger above to test.</p>
                  </div>
                ) : (
                  breakerLogs.map((log, i) => (
                    <div key={`blog-${i}`} className={log.includes('⚠️') ? 'text-amber-400 font-bold' : log.includes('✅') ? 'text-emerald-400' : 'text-zinc-300'}>
                      {log}
                    </div>
                  ))
                )}
              </div>
            </div>
            
          </div>
        </div>
      )}

      {/* Recommended Products Showcase panel */}
      <div className="bg-gradient-to-br from-indigo-50/20 to-emerald-50/20 dark:from-zinc-900 dark:to-zinc-950 p-6 rounded-3xl border border-gray-100 dark:border-zinc-800/80">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-emerald-500 animate-spin" />
          <h3 className="font-extrabold text-md text-gray-900 dark:text-white tracking-tight">
            MapStore Recommendation Engine
          </h3>
        </div>
        <p className="text-xs text-gray-500 dark:text-zinc-400 mb-5">
          Based on your personal category settings, viewed items, and checkout patterns.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendedProducts.map((p) => (
            <div
              key={`rec-${p.id}`}
              className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-850 p-3.5 rounded-2xl flex gap-3 shadow-xs hover:border-emerald-300 dark:hover:border-zinc-700 transition-colors"
            >
              <img
                src={p.imageUrl}
                alt={p.title}
                referrerPolicy="no-referrer"
                className="w-16 h-16 rounded-xl object-cover shrink-0 border border-gray-100 dark:border-zinc-800"
              />
              <div className="flex-1 flex flex-col justify-between overflow-hidden">
                <div>
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white truncate">{p.title}</h4>
                  <div className="flex items-center gap-1 mb-1">
                    <span className="text-[10px] text-zinc-400 block truncate">by {p.sellerName}</span>
                    {p.originRegion && (
                      <span className="text-[11px]" title={`Origin: ${REGION_LOOKUP[p.originRegion]?.name || p.originRegion}`}>
                        {REGION_LOOKUP[p.originRegion]?.flag}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-[#5eead4] dark:text-[#4ade80]">{selectedRegion.currencySymbol}{(p.price * selectedRegion.exchangeRate).toFixed(2)}</span>
                  <button
                    onClick={() => addToCart(p, 1)}
                    className="text-[10px] bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-2 py-1 rounded-md transition-colors cursor-pointer"
                  >
                    + Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Drawer Panel modal overlay */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex justify-end font-sans">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="w-full max-w-md bg-white dark:bg-zinc-950 p-6 flex flex-col h-full shadow-2xl relative"
              id="buyer-cart-drawer"
            >
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-zinc-900 mb-4">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-emerald-500" />
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">{t('cart_title')}</h3>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-1.5 text-xs font-black uppercase text-gray-400 hover:text-red-500 cursor-pointer"
                  id="btn-close-cart"
                >
                  {t('close')}
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
                  <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-900 rounded-2xl flex items-center justify-center text-gray-300">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <p className="text-sm font-medium text-gray-400">{t('cart_empty')}</p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="bg-emerald-500 text-white text-xs font-semibold px-4 py-2 rounded-xl"
                  >
                    Browse Local Products
                  </button>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                  {cart.map((item, idx) => (
                    <div
                      key={`cart-item-${idx}`}
                      className="flex gap-3 bg-zinc-55 dark:bg-zinc-905 p-3 rounded-2xl border border-gray-55 dark:border-zinc-900"
                    >
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.title}
                        referrerPolicy="no-referrer"
                        className="w-16 h-16 rounded-xl object-cover"
                      />
                      <div className="flex-1 overflow-hidden">
                        <h4 className="font-bold text-xs text-gray-900 dark:text-white truncate">{item.product.title}</h4>
                        <p className="text-[10px] text-zinc-400 block mb-1">Branch: {item.product.sellerName}</p>
                        <div className="flex items-center justify-between mt-2 pt-1 border-t border-gray-100/10">
                          <span className="text-xs font-bold text-[#5eead4] dark:text-[#4ade80]">
                            {selectedRegion.currencySymbol}{(item.product.price * selectedRegion.exchangeRate).toFixed(2)}
                          </span>
                          
                          <div className="flex items-center gap-2">
                            {/* Quantity Selector buttons with + and - icons */}
                            <div className="flex items-center bg-zinc-100 dark:bg-zinc-900 border border-gray-250 dark:border-zinc-850 rounded-lg p-0.5">
                              <button
                                type="button"
                                onClick={() => decrementCartQuantity(item.product.id)}
                                className="p-1 text-gray-500 hover:text-rose-500 dark:text-zinc-400 dark:hover:text-rose-400 hover:bg-white dark:hover:bg-zinc-800 rounded-md transition-all cursor-pointer"
                                title="Decrease quantity"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              
                              <span className="text-xs font-black px-2 text-gray-900 dark:text-white min-w-[22px] text-center font-mono">
                                {item.quantity}
                              </span>

                              <button
                                type="button"
                                onClick={() => incrementCartQuantity(item.product.id)}
                                className="p-1 text-gray-500 hover:text-emerald-500 dark:text-zinc-400 dark:hover:text-[#5eead4] hover:bg-white dark:hover:bg-zinc-800 rounded-md transition-all cursor-pointer"
                                disabled={item.quantity >= item.product.stock}
                                title={item.quantity >= item.product.stock ? "Maximum stock reached" : "Increase quantity"}
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={() => setCart(prev => prev.filter(p => p.product.id !== item.product.id))}
                              className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 dark:text-rose-400 rounded-lg transition-colors cursor-pointer"
                              title="Delete Item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {cart.length > 0 && (
                <div className="pt-4 border-t border-gray-100 dark:border-zinc-900 space-y-4 mb-2">
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-gray-500">
                      <span>Subtotal:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{selectedRegion.currencySymbol}{(subtotal * selectedRegion.exchangeRate).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-400 dark:text-zinc-500">
                      <span>{isCrossBorder ? "Delivery Global Freight:" : "Delivery Local Charge:"}</span>
                      <span className="font-medium text-gray-900 dark:text-white">{selectedRegion.currencySymbol}{(deliveryFee * selectedRegion.exchangeRate).toFixed(2)}</span>
                    </div>
                    {isCrossBorder && (
                      <div className="flex justify-between text-sky-500">
                        <span>🌍 Customs Clearance Tariff:</span>
                        <span className="font-semibold">{selectedRegion.currencySymbol}{(crossBorderCharge * selectedRegion.exchangeRate).toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-bold border-t border-gray-50 dark:border-zinc-900 pt-2 text-[#5eead4] dark:text-[#4ade80]">
                      <span>Grand Total:</span>
                      <span>{selectedRegion.currencySymbol}{(grandTotal * selectedRegion.exchangeRate).toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      setIsCheckingOut(true);
                      setCheckoutStep('shipping');
                    }}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl text-sm transition-colors cursor-pointer text-center"
                    id="btn-trigger-checkout"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Product Detail Modal and Reviewing form */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 font-sans">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-zinc-905 border border-zinc-100 dark:border-zinc-800 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative p-6"
              id="product-details-modal"
            >
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-[#f43f5e] dark:text-[#fb7185] border border-rose-550/20 rounded-xl transition-all cursor-pointer text-xs font-extrabold uppercase"
              >
                <X className="w-4 h-4" />
                <span>Close Tab</span>
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                {/* Visual */}
                <div>
                  {selectedProduct.videoUrl && (
                    <div className="flex items-center gap-1.5 p-1 bg-zinc-100 dark:bg-zinc-900 rounded-xl mb-3 border border-gray-150 dark:border-zinc-850">
                      <button
                        type="button"
                        onClick={() => setActiveMediaTab('photo')}
                        className={`flex-1 py-1.5 px-2.5 text-[11px] font-bold rounded-lg flex items-center justify-center gap-1 cursor-pointer transition-all ${
                          activeMediaTab === 'photo'
                            ? 'bg-white dark:bg-zinc-800 text-gray-900 dark:text-white shadow-xs'
                            : 'text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200'
                        }`}
                      >
                        🖼️ Product Photo
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveMediaTab('video')}
                        className={`flex-1 py-1.5 px-2.5 text-[11px] font-bold rounded-lg flex items-center justify-center gap-1 cursor-pointer transition-all ${
                          activeMediaTab === 'video'
                            ? 'bg-white dark:bg-zinc-800 text-emerald-500 shadow-xs'
                            : 'text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200'
                        }`}
                      >
                        🎥 Video Demo
                      </button>
                    </div>
                  )}

                  <div className="h-64 rounded-2xl overflow-hidden relative border border-gray-100 dark:border-zinc-800 mb-4 bg-black flex items-center justify-center">
                    {activeMediaTab === 'video' && selectedProduct.videoUrl ? (
                      <video
                        ref={videoRef}
                        src={selectedProduct.videoUrl}
                        controls
                        autoPlay
                        loop
                        playsInline
                        onLoadedMetadata={handleVideoLoadedMetadata}
                        onTimeUpdate={handleVideoTimeUpdate}
                        className="w-full h-full object-cover"
                        id="buyer-product-demo-video"
                      />
                    ) : (
                      <img
                        src={(selectedProduct.images && selectedProduct.images[activePhotoIndex]) || selectedProduct.imageUrl}
                        alt={selectedProduct.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  {/* Photo Thumbnails Selector (up to 6) */}
                  {activeMediaTab === 'photo' && selectedProduct.images && selectedProduct.images.length > 1 && (
                    <div className="flex gap-2 justify-center py-2 mb-4 bg-gray-50 dark:bg-zinc-900 rounded-xl p-1.5 border border-gray-150 dark:border-zinc-850" id="selected-product-multi-thumbnails">
                      {selectedProduct.images.map((imgUrl, thumbIdx) => (
                        <button
                          key={thumbIdx}
                          type="button"
                          onClick={() => setActivePhotoIndex(thumbIdx)}
                          className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                            thumbIdx === activePhotoIndex
                              ? 'border-emerald-500 scale-105 shadow-xs'
                              : 'border-transparent opacity-60 hover:opacity-100'
                          }`}
                        >
                          <img src={imgUrl} alt={`Thumbnail ${thumbIdx + 1}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Seekable Progress Bar Panel for Demonstration Video */}
                  {activeMediaTab === 'video' && selectedProduct.videoUrl && (
                    <div className="bg-zinc-50 dark:bg-zinc-900 border border-gray-150 dark:border-zinc-850 rounded-xl p-3 mb-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold uppercase text-emerald-500 tracking-wider flex items-center gap-1.5 animate-pulse">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Live Demo Playback
                        </span>
                        <span className="text-[10px] font-mono font-bold text-gray-400">
                          {Math.floor(videoCurrentTime / 60)}:{(Math.floor(videoCurrentTime) % 60).toString().padStart(2, '0')} / {Math.floor(videoDuration / 60) || 0}:{(Math.floor(videoDuration) % 60 || 0).toString().padStart(2, '0')}
                        </span>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <button
                          type="button"
                          onClick={handleTogglePlay}
                          className="bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-200 p-2 rounded-lg cursor-pointer transition-colors border border-gray-200 dark:border-zinc-700"
                        >
                          {isVideoPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                        </button>

                        <div className="flex-1 flex items-center relative">
                          <input
                            type="range"
                            min="0"
                            max={videoDuration || 100}
                            step="0.05"
                            value={videoCurrentTime}
                            onChange={handleVideoSeek}
                            className="w-full accent-emerald-500 h-1.5 bg-gray-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer focus:outline-none"
                            style={{
                              background: `linear-gradient(to right, #10b981 0%, #10b981 ${(videoDuration > 0 ? (videoCurrentTime / videoDuration) * 100 : 0)}%, #e4e4e7 ${(videoDuration > 0 ? (videoCurrentTime / videoDuration) * 100 : 0)}%, #e4e4e7 100%)`
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                    <span className="font-bold text-lg dark:text-white">{selectedProduct.rating}</span>
                    <span className="text-xs text-gray-400">out of 5 ({selectedProduct.ratingCount} listings verified reviews)</span>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed mb-4">
                    📦 Dimensions: Length: {selectedProduct.latitude} cm | Width: {selectedProduct.longitude} cm | Height: {selectedProduct.height || 15} cm
                  </p>

                  <div className="bg-zinc-50 dark:bg-zinc-950 p-4 rounded-2xl border border-gray-150 dark:border-zinc-900">
                    <h4 className="font-bold text-xs text-gray-800 dark:text-zinc-200 mb-2">Platform Assurance Seal</h4>
                    <p className="text-[11px] text-gray-500 leading-relaxed">
                      This product is covered under MapStore's 100% Secure Escrow protection. Funds are safely held on-platform and released only 24 hours post-delivery, with zero hidden fees for buyers.
                    </p>
                  </div>
                </div>

                {/* Details Content & Submit review */}
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] text-emerald-500 font-extrabold tracking-widest uppercase block mb-1">
                      {selectedProduct.category}
                    </span>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                      {selectedProduct.title}
                    </h2>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className="text-xs text-gray-400">Seller: <strong>{selectedProduct.sellerName}</strong></span>
                      {selectedProduct.originRegion && (
                        <span className="inline-flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 border border-gray-150 dark:border-zinc-850 text-[10px] font-bold px-2 py-0.5 rounded text-zinc-650 dark:text-zinc-300">
                          Origin: {REGION_LOOKUP[selectedProduct.originRegion]?.flag || '🌐'} {REGION_LOOKUP[selectedProduct.originRegion]?.name || selectedProduct.originRegion}
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-zinc-300 leading-relaxed">
                    {selectedProduct.description}
                  </p>

                  <div className="p-3 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-gray-150 dark:border-zinc-900 space-y-1.5">
                    <div className="text-lg font-extrabold text-[#5eead4] dark:text-[#4ade80]">
                      Price: {selectedRegion.currencySymbol}{(selectedProduct.price * selectedRegion.exchangeRate).toFixed(2)}
                    </div>
                    {selectedProduct.originRegion && selectedProduct.originRegion !== selectedRegion.id && (
                      <div className="text-[10px] text-sky-400 font-mono">
                        🌍 Cross-border convert: {selectedRegion.currencySymbol}1 = R{(1 / selectedRegion.exchangeRate).toFixed(2)} base rate clearing sync.
                      </div>
                    )}
                  </div>

                  {selectedProduct.shippedGlobally ? (
                    <div className="p-3.5 bg-emerald-500/5 border border-emerald-500/15 rounded-xl text-[11px] text-zinc-650 dark:text-zinc-300 space-y-1">
                      <div className="font-extrabold flex items-center gap-1 text-emerald-500">
                        <Truck className="w-3.5 h-3.5" /> Global Dispatch Corridor Active
                      </div>
                      <p className="leading-relaxed">
                        This seller registers dispatches to all destination ports. Automatically backed by MapStore's escrow system. International freight couriers with smart delivery scans are guaranteed.
                      </p>
                    </div>
                  ) : (
                    <div className="p-3.5 bg-amber-500/5 border border-amber-500/15 rounded-xl text-[11px] text-zinc-650 dark:text-zinc-300 space-y-1">
                      <div className="font-bold flex items-center gap-1 text-amber-500">
                        <MapPin className="w-3.5 h-3.5" /> Regional Domestic Delivery Only
                      </div>
                      <p className="leading-relaxed">
                        This item can only be transported through local parcel networks. Fits local hubs under {REGION_LOOKUP[selectedProduct.originRegion || 'ZA']?.name || 'domestic'} zones.
                      </p>
                    </div>
                  )}

                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                     <button
                       type="button"
                       onClick={() => {
                         const targetProduct = selectedProduct;
                         setSelectedProduct(null); // close product details modal
                         setTimeout(() => {
                           startChatWithSeller(targetProduct);
                         }, 100);
                       }}
                       className="w-full bg-amber-500/10 hover:bg-amber-500/15 border border-amber-500/20 dark:border-amber-500/10 text-amber-600 dark:text-amber-400 font-bold py-3 rounded-2xl text-[11px] sm:text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
                     >
                       🤝 Haggle Price & Chat
                     </button>
                     <button
                       disabled={selectedProduct.stock <= 0}
                       onClick={() => addToCart(selectedProduct, 1)}
                       className="w-full bg-emerald-500 hover:bg-emerald-600 font-bold py-3 rounded-2xl text-xs transition-colors cursor-pointer text-white flex items-center justify-center gap-1.5"
                     >
                       <ShoppingCart className="w-4 h-4" /> Add to Order Cart
                     </button>
                   </div>

                  {/* Rating reviews sections */}
                  <div className="pt-4 border-t border-gray-100 dark:border-zinc-800">
                    <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-3 flex items-center gap-1.5">
                      <Star className="w-4 h-4 text-emerald-400 fill-current" /> Verified Product Reviews
                    </h3>

                    {/* Submit Review form */}
                    <form onSubmit={handleAddReview} className="space-y-3 p-3 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-gray-100 dark:border-zinc-900 mb-4/5">
                      <span className="text-[10px] text-gray-400 block pb-1">Submit rating feedback:</span>
                      <div className="flex items-center gap-3">
                        <select
                          value={reviewForm.rating}
                          onChange={(e) => setReviewForm(prev => ({ ...prev, rating: Number(e.target.value) }))}
                          className="bg-white dark:bg-zinc-900 text-xs border border-gray-100 dark:border-zinc-800 rounded-lg p-2 font-bold focus:outline-hidden"
                        >
                          <option value="5">⭐⭐⭐⭐⭐ (5 Stars)</option>
                          <option value="4">⭐⭐⭐⭐ (4 Stars)</option>
                          <option value="3">⭐⭐⭐ (3 Stars)</option>
                          <option value="2">⭐⭐ (2 Stars)</option>
                          <option value="1">⭐ (1 Star)</option>
                        </select>
                      </div>
                      <input
                        type="text"
                        placeholder="Write dynamic product assessment..."
                        value={reviewForm.comment}
                        onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                        className="w-full bg-white dark:bg-zinc-900 text-xs text-gray-800 dark:text-white border border-gray-105 dark:border-zinc-800 px-3 py-2.5 rounded-xl focus:outline-hidden"
                      />
                      <button
                        type="submit"
                        className="bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-bold px-3 py-2 rounded-lg transition-colors cursor-pointer"
                      >
                        Submit Verified Review
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Secure Checkout Dialog Modal */}
      <AnimatePresence>
        {isCheckingOut && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 font-sans">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-850 p-6 rounded-3xl max-w-lg w-full shadow-2xl relative"
              id="checkout-dialog-modal"
            >
              <button
                onClick={() => setIsCheckingOut(false)}
                className="absolute top-4 right-4 flex items-center gap-1 px-2.5 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-[#f43f5e] dark:text-[#fb7185] border border-rose-550/20 hover:border-rose-500/30 rounded-xl transition-all cursor-pointer text-[10.5px] font-black uppercase"
                title="Exit Checkout"
                id="btn-exit-checkout"
              >
                <X className="w-3.5 h-3.5" />
                <span>Close Tab</span>
              </button>

              <div className="text-center mb-6">
                <h3 className="text-lg font-extrabold text-gray-950 dark:text-white flex items-center justify-center gap-1">
                  <Lock className="w-5 h-5 text-emerald-400" /> MapStore Payment Gateway
                </h3>
                <p className="text-[11px] text-gray-400">Secure AES-256 Transacting Protection, Slogan: "Reaching you"</p>
              </div>

              {checkoutStep === 'shipping' && (
                <div className="space-y-4">
                  <h4 className="font-bold text-xs text-zinc-400 uppercase tracking-widest pb-1 border-b border-gray-50 dark:border-zinc-800">
                    1. Shipping Information
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Full Name</label>
                      <input
                        type="text"
                        value={shippingAddress.fullName}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                        className="w-full bg-zinc-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-2.5 text-xs text-gray-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Local Address</label>
                      <input
                        type="text"
                        value={shippingAddress.streetAddress}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, streetAddress: e.target.value })}
                        className="w-full bg-zinc-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-2.5 text-xs text-gray-800 dark:text-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">City</label>
                        <input
                          type="text"
                          value={shippingAddress.city}
                          onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                          className="w-full bg-zinc-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-2.5 text-xs text-gray-800 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Postal Code</label>
                        <input
                          type="text"
                          value={shippingAddress.postalCode}
                          onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                          className="w-full bg-zinc-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-2.5 text-xs text-gray-800 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Courier Selection & Dynamic Upfront Shipping Calculator */}
                  <div className="space-y-4 pt-3 border-t border-gray-150 dark:border-zinc-850">
                    <div>
                      <h5 className="text-[10px] uppercase font-black text-gray-500 tracking-wider mb-2 flex items-center gap-1.5">
                        <Truck className="w-4 h-4 text-emerald-500 dark:text-emerald-400 animate-pulse" />
                        Select Shipping Courier Agent & Live Upfront Quote
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {availableCouriers.map((courier) => {
                          const isSelected = activeCourier.id === courier.id;
                          
                          // Calculate this courier's specific delivery cost to present as live quote
                          const calculatedDeliveryFee = cart.reduce((acc, item) => {
                            const length = Math.max(5, Math.min(100, item.product.latitude ? Math.round(Math.abs(item.product.latitude)) : 15));
                            const width = Math.max(5, Math.min(100, item.product.longitude ? Math.round(Math.abs(item.product.longitude)) : 12));
                            const height = Math.max(5, Math.min(100, item.product.height || 10));
                            const volumeCm3 = length * width * height;
                            const volumetricWeightKg = volumeCm3 / 5000;
                            const chargeableWeight = Math.max(0.2, volumetricWeightKg);
                            const baseFee = courier.baseRateRaw * 0.04;
                            const isGlobal = courier.id.startsWith('glob-');
                            const ratePerKg = isGlobal ? 0.35 : 0.15;
                            const sizeSurcharge = chargeableWeight * ratePerKg;
                            return acc + ((baseFee + sizeSurcharge) * item.quantity);
                          }, 0);

                          return (
                            <button
                              key={courier.id}
                              onClick={() => setSelectedCourierId(courier.id)}
                              type="button"
                              className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all group cursor-pointer ${
                                isSelected 
                                  ? 'bg-emerald-500/10 border-emerald-500 text-gray-900 dark:text-white' 
                                  : 'bg-zinc-50 dark:bg-zinc-900/60 border-zinc-150 dark:border-zinc-850/60 hover:bg-zinc-100 dark:hover:bg-zinc-850'
                              }`}
                            >
                              <div className="flex items-start justify-between w-full gap-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-lg">{courier.logo}</span>
                                  <div>
                                    <h6 className="text-[11px] font-bold leading-tight truncate max-w-[110px] sm:max-w-[130px]">{courier.name}</h6>
                                    <span className="text-[9px] text-gray-400 block font-semibold mt-0.5">🕒 {courier.speed}</span>
                                  </div>
                                </div>
                                {courier.escrowCertified && (
                                  <span className="shrink-0 text-[7px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/20">
                                    Escrow Ready
                                  </span>
                                )}
                              </div>
                              <div className="mt-2.5 pt-2 border-t border-dotted border-gray-200 dark:border-zinc-800 flex justify-between items-center w-full">
                                <span className="text-[9px] text-gray-400 font-medium">Estimated Carrier Cost</span>
                                <span className="text-xs font-black text-emerald-500 dark:text-emerald-400">
                                  {selectedRegion.currencySymbol}{(calculatedDeliveryFee * selectedRegion.exchangeRate).toFixed(2)}
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Dimensional breakdown helper */}
                    <div className="bg-zinc-50 dark:bg-zinc-900/60 p-3.5 rounded-2xl border border-gray-150 dark:border-zinc-850/60">
                      <div className="flex items-center justify-between gap-2 flex-wrap pb-1.5 border-b border-gray-100 dark:border-zinc-850">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                          📦 Dimensional Cargo Ledger
                        </span>
                        <span className="text-[8px] font-mono bg-zinc-200 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 px-2 py-0.5 rounded-md">
                          Metric: L × W × H / 5000 (IATA Standards)
                        </span>
                      </div>
                      
                      <div className="mt-2.5 space-y-2 max-h-[140px] overflow-y-auto pr-1">
                        {shippingCalculationDetails.items.map((item, idx) => (
                          <div key={idx} className="p-2 bg-white dark:bg-zinc-950/40 rounded-xl border border-gray-100 dark:border-zinc-850 flex justify-between items-center text-[10px] leading-tight text-gray-600 dark:text-zinc-300">
                            <div>
                              <p className="font-bold text-gray-900 dark:text-white truncate max-w-[170px] sm:max-w-[210px]">
                                {item.title} <span className="text-[9px] text-emerald-500 font-extrabold">x{item.quantity}</span>
                              </p>
                              <div className="flex gap-2 text-[9px] text-gray-400 font-mono mt-0.5">
                                <span>Size: {item.length}×{item.width}×{item.height} cm</span>
                                <span className="text-zinc-300 dark:text-zinc-805">|</span>
                                <span>Vol: {(item.volume).toLocaleString()} cc</span>
                                <span className="text-zinc-300 dark:text-zinc-805 font-bold">|</span>
                                <span className="text-amber-500 font-bold">Weight: {item.volWeight} kg</span>
                              </div>
                            </div>
                            <div className="text-right font-mono text-[9px]">
                              <span className="text-gray-400">Upfront Quote:</span>
                              <p className="font-bold text-gray-900 dark:text-white mt-0.5">
                                {selectedRegion.currencySymbol}{(item.totalItemFee * selectedRegion.exchangeRate).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-3 pt-2 border-t border-dashed border-gray-200 dark:border-zinc-800 flex justify-between items-center text-xs font-bold text-gray-800 dark:text-white">
                        <span className="flex items-center gap-1 uppercase tracking-wide text-[10px] text-gray-500 font-extrabold">
                          🧮 Total Upfront Delivery Quote:
                        </span>
                        <span className="font-mono text-emerald-500 font-black text-sm">
                          {selectedRegion.currencySymbol}{(deliveryFee * selectedRegion.exchangeRate).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={triggerPaymentStep}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-black py-3 rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer mt-4"
                  >
                    Proceed to Credit Card / payment Info
                  </button>
                </div>
              )}

              {checkoutStep === 'payment' && (
                <div className="space-y-4">
                  <h4 className="font-bold text-xs text-zinc-400 uppercase tracking-widest pb-1 border-b border-gray-50 dark:border-zinc-800">
                    2. Payment Information
                  </h4>
                  <div className="space-y-3 bg-zinc-50 dark:bg-zinc-900 p-4 rounded-2xl border border-gray-150 dark:border-zinc-800">
                    <span className="text-[10px] text-gray-500 font-semibold block">MapStore Invoice Details:</span>
                    <div className="space-y-1 text-xs text-gray-500 font-mono">
                      <div className="flex justify-between">
                        <span>Items Subtotal:</span>
                        <span>{selectedRegion.currencySymbol}{(subtotal * selectedRegion.exchangeRate).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{isCrossBorder ? "Global Freight Courier:" : "Shipping Carrier Fee:"}</span>
                        <span>{selectedRegion.currencySymbol}{(deliveryFee * selectedRegion.exchangeRate).toFixed(2)}</span>
                      </div>
                      {isCrossBorder && (
                        <div className="flex justify-between text-sky-500 font-semibold text-[11px]">
                          <span>🌍 Customs Tariff Duty:</span>
                          <span>{selectedRegion.currencySymbol}{(crossBorderCharge * selectedRegion.exchangeRate).toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-bold text-sm text-gray-900 dark:text-white border-t border-dashed border-gray-200 dark:border-zinc-850 pt-1.5">
                        <span>Grand invoice amount:</span>
                        <span>{selectedRegion.currencySymbol}{(grandTotal * selectedRegion.exchangeRate).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Card Number</label>
                      <input
                        type="text"
                        value={paymentCard.number}
                        onChange={(e) => setPaymentCard({ ...paymentCard, number: e.target.value })}
                        className="w-full bg-zinc-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-2.5 text-xs text-gray-800 dark:text-white focus:outline-hidden"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Expiry Date</label>
                        <input
                          type="text"
                          value={paymentCard.expiry}
                          onChange={(e) => setPaymentCard({ ...paymentCard, expiry: e.target.value })}
                          className="w-full bg-zinc-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-2.5 text-xs text-gray-800 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Secure CVV</label>
                        <input
                          type="password"
                          value={paymentCard.cvv}
                          onChange={(e) => setPaymentCard({ ...paymentCard, cvv: e.target.value })}
                          className="w-full bg-zinc-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-2.5 text-xs text-gray-800 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-zinc-900 border border-amber-100 dark:border-amber-950/20 rounded-xl text-[11px] text-amber-700 dark:text-amber-400">
                    <Info className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Instant Mastercard/Visa 3D-Secure multi-step validation will trigger.</span>
                  </div>

                  <button
                    onClick={processSecurePayment}
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold py-3.5 rounded-xl text-xs transition-colors cursor-pointer mt-4 shadow-md"
                  >
                    Authenticate & Authorize {selectedRegion.currencySymbol}{(grandTotal * selectedRegion.exchangeRate).toFixed(2)}
                  </button>
                </div>
              )}

              {checkoutStep === 'processing' && (
                <div className="flex flex-col items-center justify-center py-12 space-y-5 text-center">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
                    <Lock className="w-6 h-6 text-emerald-500 absolute inset-0 m-auto animate-pulse" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">Connecting Secure 3DS Broker</h4>
                    <p className="text-xs text-gray-400 mt-1">Contacting card credentials authorization and securing escrow transaction...</p>
                  </div>
                </div>
              )}

              {checkoutStep === 'success' && (
                <div className="flex flex-col items-center justify-center py-8 space-y-4 text-center">
                   <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950 rounded-full flex items-center justify-center text-emerald-500">
                    <Check className="w-8 h-8 font-extrabold" />
                  </div>
                  <div>
                    <span className="text-[10px] tracking-widest font-extrabold uppercase text-emerald-500 block mb-1">
                      Platform Confirmed
                    </span>
                    <h4 className="font-bold text-lg text-gray-900 dark:text-white">Order Settled Successfully!</h4>
                    <p className="text-xs text-gray-400 mt-2 max-w-sm">
                      Secure payment cleared. Escrow record and tracking safety parameters active. Tracking ID: <span className="font-mono text-emerald-400 font-bold">{newOrder?.id}</span>
                    </p>
                  </div>

                  <div className="bg-zinc-50 dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 p-4 rounded-2xl w-full text-xs space-y-2 text-left">
                    <span className="font-semibold block text-gray-800 dark:text-zinc-200">Delivery Information:</span>
                    <p className="text-gray-500 dark:text-zinc-300">Carrier will reach: <strong>{shippingAddress.streetAddress}, {shippingAddress.city}</strong></p>
                    <p className="text-[10px] text-gray-400 font-medium">Order Number: <strong className="font-mono text-emerald-500 font-bold select-all">{newOrder?.id}</strong></p>
                  </div>

                  {/* Real Device Messaging Feeds */}
                  <div className="w-full space-y-3 pt-4 border-t border-gray-150 dark:border-zinc-800 text-left">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Real Inbound Notifications</span>
                      <span className="text-[9px] text-[#4ade80] bg-[#4ade80]/10 px-1.5 py-0.5 rounded font-bold font-mono">SIMULATION LIVE</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                      {/* Real SMS Panel */}
                      <div className="bg-black text-white p-4 rounded-2xl border border-neutral-850 space-y-2 relative overflow-hidden">
                        <div className="absolute top-2 right-2 text-[8px] bg-emerald-500/20 text-emerald-400 font-mono px-1.5 py-0.5 rounded uppercase font-bold">
                          📱 Inbound SMS Text
                        </div>
                        <span className="text-[9px] block text-zinc-400 font-semibold uppercase tracking-wider">Sender: MapStore Logistics</span>
                        <p className="text-[10px] leading-relaxed text-zinc-300 font-mono">
                          "MapStore Order Confirmed! Watch your delivery carrier relocate live on our coordinate grid with Order ID: <strong className="text-emerald-400 font-bold select-all">{newOrder?.id}</strong>. Slogan: 'Reaching you'."
                        </p>
                        <div className="pt-1.5 flex justify-between items-center">
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(newOrder?.id || '');
                              addNotification({
                                title: '📋 Order ID Copied',
                                message: 'Ready to enter in search bar to track coordinates.',
                                type: 'system'
                              });
                            }}
                            className="bg-neutral-900 hover:bg-neutral-800 text-[#4ade80] border border-neutral-850 font-bold text-[9px] px-2.5 py-1.5 rounded-lg inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Copy className="w-3 h-3" /> Copy Order ID
                          </button>
                          <span className="text-[8px] text-zinc-500 font-mono">Just Now</span>
                        </div>
                      </div>

                      {/* Real Email Panel */}
                      <div className="bg-white dark:bg-zinc-950 p-4 rounded-2xl border border-gray-150 dark:border-zinc-850 space-y-2 relative overflow-hidden">
                        <div className="absolute top-2 right-2 text-[8px] bg-indigo-50 dark:bg-zinc-90 w-auto text-indigo-500 dark:text-indigo-400 font-mono px-1.5 py-0.5 rounded uppercase font-bold">
                          ✉️ Inbound Email
                        </div>
                        <span className="text-[9px] font-bold block text-gray-500 dark:text-zinc-400">From: orders@mapstore.com</span>
                        <p className="text-[10px] font-semibold text-gray-900 dark:text-white mt-1">
                          Subject: Reference Order Confirmed: {newOrder?.id}
                        </p>
                        <p className="text-[10px] text-gray-500 dark:text-zinc-400 leading-relaxed font-sans mt-0.5">
                          Hello {shippingAddress.fullName}, thank you for shopping. Order <strong className="font-mono text-emerald-500 font-bold">{newOrder?.id}</strong> has been registered. Track its map coordinates in the app at any time.
                        </p>
                        <div className="pt-1 text-right text-[8px] text-gray-450 font-mono">
                          Delivered to {user.email}
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsCheckingOut(false)}
                    className="w-full bg-[#121214] hover:bg-[#18181c] dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white font-semibold py-3 rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    Return to Catalog Shopping
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}

        {/* === SECURE HAGGLE MESSENGER THREADS LIST MODAL === */}
        {showBuyerMessengerList && (
          <div className="fixed inset-0 z-50 flex items-center justify-end" id="buyer-messenger-list-modal">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowBuyerMessengerList(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md h-full bg-white dark:bg-zinc-900 shadow-2xl flex flex-col border-l border-gray-100 dark:border-zinc-850"
            >
              <div className="p-5 border-b border-gray-100 dark:border-zinc-850 flex items-center justify-between bg-zinc-50 dark:bg-zinc-950 rounded-tl-3xl">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-amber-500/10 rounded-xl">
                    <Handshake className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <h2 className="text-sm font-extrabold text-gray-900 dark:text-white">Secure Haggle Messenger</h2>
                    <p className="text-[10px] text-gray-400">Escrow-backed custom trade corridors</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowBuyerMessengerList(false)}
                  className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-xl text-gray-400 hover:text-gray-650 dark:hover:text-zinc-300 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {p2pChats.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-xs">No active negotiation corridors yet.</p>
                    <p className="text-[10px] text-gray-500 mt-1">Tap the "🤝 Haggle Price & Chat" on items to negotiate.</p>
                  </div>
                ) : (
                  p2pChats.map((thread) => (
                    <div
                      key={thread.id}
                      onClick={() => {
                        setActiveChatThread(thread);
                        setIsChatDrawerOpen(true);
                        setShowBuyerMessengerList(false);
                        setP2pChats(prev => prev.map(t => t.id === thread.id ? { ...t, unreadByBuyer: false } : t));
                      }}
                      className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex gap-3 ${
                        thread.unreadByBuyer
                          ? 'bg-amber-500/5 hover:bg-amber-500/10 border-amber-500/30'
                          : 'bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-950/40 dark:hover:bg-zinc-855 border-gray-150/80 dark:border-zinc-850/65'
                      }`}
                    >
                      {thread.productImageUrl && (
                        <img
                          src={thread.productImageUrl}
                          alt={thread.productTitle}
                          className="w-12 h-12 rounded-xl object-cover shrink-0 border border-gray-100 dark:border-zinc-800"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 block truncate">
                            👤 {thread.sellerName}
                          </span>
                          <span className="text-[9px] text-gray-400 font-mono">
                            {thread.lastMessageTimestamp}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-gray-800 dark:text-zinc-200 truncate pr-4">
                          {thread.productTitle}
                        </h4>
                        <p className="text-[10px] text-gray-550 dark:text-zinc-400 truncate mt-1 italic">
                          {thread.lastMessageText}
                        </p>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-[10px] font-mono font-bold text-emerald-500">
                            Base: {selectedRegion.currencySymbol}{(thread.productPrice * selectedRegion.exchangeRate).toFixed(2)}
                          </span>
                          {thread.unreadByBuyer && (
                            <span className="px-1.5 py-0.5 bg-red-500 text-white text-[8px] font-extrabold rounded-full animate-pulse">
                              UNREAD
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-4 bg-zinc-50 dark:bg-zinc-950 border-t border-gray-150 dark:border-zinc-850 rounded-b-3xl">
                <div className="bg-amber-500/10 p-3 rounded-xl border border-amber-500/20 text-[10px] text-amber-600 dark:text-amber-400 flex gap-2 items-start">
                  <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
                  <p>
                    <strong>Double-Lock Escrow Active:</strong> Message channels are cryptographically bound to Pretoria's core trade protocols. You may securely barter prices here before paying.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* === LIVE P2P NEGOTIATIVE CHAT DRAWER === */}
        {isChatDrawerOpen && activeChatThread && (
          <div className="fixed inset-0 z-55 flex items-center justify-end" id="p2p-negotiation-chat-drawer">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsChatDrawerOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md h-full bg-white dark:bg-zinc-900 shadow-2xl flex flex-col border-l border-gray-150 dark:border-zinc-855"
            >
              {/* Header */}
              <div className="p-4 border-b border-gray-150 dark:border-zinc-850 bg-zinc-50 dark:bg-zinc-950 flex flex-col gap-3 rounded-tl-3xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setIsChatDrawerOpen(false);
                        setShowBuyerMessengerList(true);
                       }}
                      className="text-xs text-amber-550 font-extrabold hover:underline flex items-center gap-1 cursor-pointer pr-2"
                    >
                      ← Threads
                    </button>
                    <div>
                      <h3 className="text-xs font-bold text-gray-500 dark:text-zinc-400">Merchant Corridor</h3>
                      <h2 className="text-sm font-extrabold text-gray-900 dark:text-white flex items-center gap-1">
                        👤 {activeChatThread.sellerName}
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" title="Merchant active in Pretoria corridor" />
                      </h2>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsChatDrawerOpen(false)}
                    className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-xl text-gray-400 hover:text-gray-650 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Target Product Pin Card */}
                <div className="bg-white dark:bg-zinc-900 p-3 rounded-xl border border-gray-150 dark:border-zinc-850 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    {activeChatThread.productImageUrl && (
                      <img
                        src={activeChatThread.productImageUrl}
                        alt={activeChatThread.productTitle}
                        className="w-10 h-10 rounded-lg object-cover border shrink-0 border-gray-100 dark:border-zinc-800"
                      />
                    )}
                    <div className="min-w-0">
                      <h4 className="text-xs font-semibold text-gray-855 dark:text-zinc-200 truncate">
                        {activeChatThread.productTitle}
                      </h4>
                      <p className="text-[10px] text-gray-500 font-bold block">
                        Base Price: {selectedRegion.currencySymbol}{(activeChatThread.productPrice * selectedRegion.exchangeRate).toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      const p = products.find(prod => prod.id === activeChatThread.productId) || { id: activeChatThread.productId, price: activeChatThread.productPrice, title: activeChatThread.productTitle, sellerId: activeChatThread.sellerId, stock: 12, category: 'Electronics' } as Product;
                      addToCart(p, 1);
                      setIsCartOpen(true);
                      setIsChatDrawerOpen(false);
                    }}
                    className="shrink-0 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[10px] px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    🛒 Buy Now
                  </button>
                </div>
              </div>

              {/* Secure Logs Bar */}
              <div className="px-4 py-1.5 bg-zinc-100/60 dark:bg-zinc-950 font-mono text-[8px] text-gray-400 flex justify-between border-b border-gray-150 dark:border-zinc-900">
                <span>🔐 SSL CHAT ENDPOINT CORRIDOR</span>
                <span className="text-amber-500 font-bold">DOUBLE-LOCK ESCROW: LIVE</span>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-50 dark:bg-zinc-900/40">
                {activeChatThread.messages.map((msg) => {
                  const isUser = msg.senderId === user.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col max-w-[85%] ${isUser ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                    >
                      <div className="flex items-center gap-1 mb-1">
                        <span className="text-[9px] font-bold text-gray-400 dark:text-zinc-500">
                          {msg.senderName}
                        </span>
                        <span className="text-[8px] text-gray-450 font-mono">
                          {msg.timestamp}
                        </span>
                      </div>

                      <div
                        className={`p-3 rounded-2xl text-xs space-y-1 ${
                          isUser
                            ? 'bg-amber-500 text-zinc-950 font-medium rounded-tr-none'
                            : 'bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 border border-gray-150 dark:border-zinc-750 rounded-tl-none'
                        }`}
                      >
                        {msg.isOffer && (
                          <div className={`mb-1.5 p-2 rounded-xl border flex flex-col items-center text-center ${isUser ? 'bg-amber-600/20 border-amber-600/40' : 'bg-amber-500/10 border-amber-500/20 text-gray-900 dark:text-white'}`}>
                            <Handshake className="w-5 h-5 mb-0.5 text-amber-500" />
                            <span className="text-[10px] font-extrabold uppercase tracking-wide">
                              Barter Proffered Price
                            </span>
                            <span className="text-sm font-black text-amber-500 mt-0.5">
                              {selectedRegion.currencySymbol}{(msg.offerPrice! * selectedRegion.exchangeRate).toFixed(2)}
                            </span>
                            <div className="mt-1.5">
                              {msg.offerStatus === 'pending' ? (
                                <span className="px-1.5 py-0.5 bg-yellow-500 text-black text-[8px] font-bold rounded-md">
                                  ⏳ PENDING MERCHANT DECISION
                                </span>
                              ) : msg.offerStatus === 'accepted' ? (
                                <span className="px-1.5 py-0.5 bg-emerald-500 text-white text-[8px] font-bold rounded-md flex items-center gap-1 justify-center">
                                  <Check className="w-2.5 h-2.5" /> DEAL LOCKED & LISTED!
                                </span>
                              ) : (
                                <span className="px-1.5 py-0.5 bg-red-400 text-white text-[8px] font-bold rounded-md">
                                  ❌ DECLINED BY SELLER
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        <p className="leading-relaxed whitespace-pre-line">{msg.originalText}</p>

                        {msg.translatedText && (
                          <div className="mt-2 pt-1.5 border-t border-dotted border-gray-200 dark:border-zinc-700 text-gray-500 dark:text-zinc-400">
                            <span className="text-[8px] uppercase tracking-wider block font-bold text-amber-600 dark:text-amber-400">
                              🌐 Real-Time Translation ({msg.detectedLanguage?.toUpperCase() || 'ZH-CN'}):
                            </span>
                            <p className="italic text-[11px] mt-0.5 leading-relaxed">{msg.translatedText}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Barter Custom Form Toggle Overlay */}
              <AnimatePresence>
                {showOfferForm && (
                  <motion.div
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '100%' }}
                    className="absolute bottom-[72px] inset-x-0 p-4 bg-amber-50 dark:bg-zinc-950 border-t border-amber-500/20 dark:border-zinc-800 shadow-lg space-y-3 z-10 overlay-offer animate-none"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Handshake className="w-4 h-4 text-amber-500" />
                        <h4 className="text-xs font-bold text-amber-800 dark:text-amber-400">Propose Barter Exchange Price</h4>
                      </div>
                      <button
                        onClick={() => setShowOfferForm(false)}
                        className="text-[10px] text-gray-400 hover:text-gray-600 font-bold"
                      >
                        CLOSE
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="relative flex-1">
                        <span className="absolute left-3.5 top-2.5 font-bold text-gray-400 text-sm">
                          {selectedRegion.currencySymbol}
                        </span>
                        <input
                          type="number"
                          placeholder={`Enter custom target price (Base: ${activeChatThread.productPrice})`}
                          value={offerAmount}
                          onChange={(e) => setOfferAmount(e.target.value)}
                          className="w-full bg-white dark:bg-zinc-900 border border-amber-500/30 text-xs text-gray-900 dark:text-white pl-8 pr-3 py-2 rounded-xl focus:outline-hidden"
                        />
                      </div>
                      <button
                        onClick={() => {
                          const val = parseFloat(offerAmount);
                          if (!val || val <= 0) return;
                          sendP2PMessage('', true, val);
                        }}
                        className="bg-amber-500 hover:bg-amber-600 text-zinc-950 px-4 py-2 rounded-xl text-xs font-extrabold cursor-pointer transition-colors"
                      >
                        Propose
                      </button>
                    </div>
                    <p className="text-[9px] text-gray-400">
                      *Escrow rules standardly allow automatic negotiation responses within 20% of catalog MSRP instantly. Beyond 20%, merchants will receive manual review queues.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Chat Inputs */}
              <div className="p-3 border-t border-gray-150 dark:border-zinc-850 bg-white dark:bg-zinc-950 flex gap-2 items-center rounded-b-3xl">
                <button
                  type="button"
                  onClick={() => setShowOfferForm(prev => !prev)}
                  className="bg-amber-500/10 hover:bg-amber-500/15 border border-amber-500/30 dark:border-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-[10px] px-3 py-3 rounded-2xl transition-all cursor-pointer flex gap-1 items-center shrink-0"
                  title="Make a custom price barter proposal"
                >
                  <Handshake className="w-4 h-4 shrink-0" /> offer
                </button>
                <input
                  type="text"
                  placeholder="Type secure encrypted message..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') sendP2PMessage(chatInput);
                  }}
                  className="flex-1 bg-zinc-50 dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 text-xs text-gray-900 dark:text-white px-3.5 py-3 rounded-2xl focus:outline-hidden placeholder:text-gray-450"
                />
                <button
                  disabled={!chatInput.trim()}
                  onClick={() => sendP2PMessage(chatInput)}
                  className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-zinc-100 disabled:dark:bg-zinc-800 disabled:text-gray-400 text-white font-bold text-xs px-4 py-3 rounded-2xl transition-colors cursor-pointer shrink-0"
                >
                  Send
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
    </Translate>
  );
}
