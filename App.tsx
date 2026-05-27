import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bell, Sun, Moon, ShoppingBag, ShieldCheck, Compass, Heart, User as UserIcon,
  Truck, ArrowRight, Star, HelpCircle, CheckCircle2, ChevronRight, LogOut, Sliders, MapPin, Eye, FileText,
  XCircle, RotateCcw, ShieldAlert, ShoppingCart, Trash2, FileCheck, TrendingUp, Briefcase
} from 'lucide-react';
import { User, Product, Order, PushNotification, RegionConfig, LanguageConfig, P2PChatThread, P2PChatMessage } from './types';
import { INITIAL_PRODUCTS } from './initialData';
import { LANGUAGES, TRANSLATIONS, translateText } from './translations';
import MapStoreLogo from './components/MapStoreLogo';
import ToSAndPrivacy from './components/ToSAndPrivacy';
import CustomerSupportChat from './components/CustomerSupportChat';
import BuyerPortal from './components/BuyerPortal';
import SellerPortal from './components/SellerPortal';
import OwnerPortal from './components/OwnerPortal';
import AuthWall from './components/AuthWall';
import { Translate } from './components/Translate';
import { InvestorPitchDeck } from './components/InvestorPitchDeck';
import LetterheadModal from './components/LetterheadModal';
import BusinessPlanModal from './components/BusinessPlanModal';
import SupplierRecruitmentPitchModal from './components/SupplierRecruitmentPitchModal';

const REGIONS: RegionConfig[] = [
  { id: 'ZA', name: 'South Africa', flag: '🇿🇦', currencyCode: 'ZAR', currencySymbol: 'R', exchangeRate: 1.0 },
  { id: 'US', name: 'United States', flag: '🇺🇸', currencyCode: 'USD', currencySymbol: '$', exchangeRate: 0.054 },
  { id: 'EU', name: 'European Union', flag: '🇪🇺', currencyCode: 'EUR', currencySymbol: '€', exchangeRate: 0.050 },
  { id: 'GB', name: 'United Kingdom', flag: '🇬🇧', currencyCode: 'GBP', currencySymbol: '£', exchangeRate: 0.042 },
  { id: 'JP', name: 'Japan', flag: '🇯🇵', currencyCode: 'JPY', currencySymbol: '¥', exchangeRate: 8.5 },
  { id: 'AU', name: 'Australia', flag: '🇦🇺', currencyCode: 'AUD', currencySymbol: 'A$', exchangeRate: 0.082 },
  { id: 'CA', name: 'Canada', flag: '🇨🇦', currencyCode: 'CAD', currencySymbol: 'C$', exchangeRate: 0.074 },
  { id: 'IN', name: 'India', flag: '🇮🇳', currencyCode: 'INR', currencySymbol: '₹', exchangeRate: 4.5 },
  { id: 'BR', name: 'Brazil', flag: '🇧🇷', currencyCode: 'BRL', currencySymbol: 'R$', exchangeRate: 0.27 },
  { id: 'GLOBAL', name: 'Global Corridor', flag: '🌐', currencyCode: 'USD', currencySymbol: 'US$', exchangeRate: 0.054 },
];

export default function App() {
  // Global States
  const [selectedRegion, setSelectedRegion] = useState<RegionConfig>(REGIONS[0]); // South Africa default
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageConfig>(LANGUAGES[0]); // Default English
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Translation function helper
  const t = (key: string): string => {
    return translateText(key, selectedLanguage.id);
  };
  const [user, setUser] = useState<User>({
    id: 'user-standard',
    name: 'MapStore Buyer',
    email: 'mapstore2026@gmail.com', // Active User Email from environment
    role: 'buyer',
    wishlist: ['prod-3', 'prod-6'],
    preferredCategories: ['Electronics', 'Local Organic Food'],
    purchaseHistory: []
  });

  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>([]);
  const [p2pChats, setP2pChats] = useState<P2PChatThread[]>(() => [
    {
      id: 'thread-demo-1',
      productId: 'prod-1',
      productTitle: 'Precision Brew Espresso Machine',
      productPrice: 349.99,
      productImageUrl: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&q=80&w=600',
      sellerId: 'sell-alpha',
      sellerName: 'Alpha Tech Goods',
      buyerId: 'user-standard',
      buyerName: 'MapStore Buyer',
      unreadByBuyer: false,
      unreadBySeller: true,
      lastMessageText: 'Can you do 310.00? Looking to buy for my office in Pretoria.',
      lastMessageTimestamp: '13:02',
      messages: [
        {
          id: 'msg-1',
          senderId: 'user-standard',
          senderName: 'MapStore Buyer',
          originalText: 'Hi, is this espresso machine still available for shipping to Pretoria, Gauteng?',
          timestamp: '12:55',
          detectedLanguage: 'en'
        },
        {
          id: 'msg-2',
          senderId: 'sell-alpha',
          senderName: 'Alpha Tech Goods',
          originalText: 'Yes, absolutely! We ship from our SF hub within 24 hours. Transit tracks globally on Google Maps.',
          translatedText: 'Ewe, nakanjani! Sithumela ngesikhathi esizayo. Ungakwazi ukulandelela iphasela lakho.',
          timestamp: '12:58',
          detectedLanguage: 'en'
        },
        {
          id: 'msg-3',
          senderId: 'user-standard',
          senderName: 'MapStore Buyer',
          originalText: 'Can you do 310.00? Looking to buy for my office in Pretoria.',
          timestamp: '13:02',
          detectedLanguage: 'en',
          isOffer: true,
          offerPrice: 310.00,
          offerStatus: 'pending'
        }
      ]
    },
    {
      id: 'thread-demo-2',
      productId: 'prod-2',
      productTitle: 'Artisanal Hand-Poured Soy Candle Set',
      productPrice: 24.50,
      productImageUrl: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=600',
      sellerId: 'sell-beta',
      sellerName: 'Terra Crafts & Co',
      buyerId: 'user-standard',
      buyerName: 'MapStore Buyer',
      unreadByBuyer: true,
      unreadBySeller: false,
      lastMessageText: 'The standard commission is covered. Offer is accepted.',
      lastMessageTimestamp: '10:45',
      messages: [
        {
          id: 'msg-4',
          senderId: 'user-standard',
          senderName: 'MapStore Buyer',
          originalText: 'Molo! Do you have the Rosemary and Lavender scent?',
          timestamp: '10:30',
          detectedLanguage: 'zu'
        },
        {
          id: 'msg-5',
          senderId: 'sell-beta',
          senderName: 'Terra Crafts & Co',
          originalText: 'Hi! Yes we have 10 units left in South Africa corridor.',
          translatedText: 'Sawubona! Yebo sinezinhlobo eziyi-10 ezisele kulo mhubhe.',
          timestamp: '10:35',
          detectedLanguage: 'en'
        },
        {
          id: 'msg-6',
          senderId: 'user-standard',
          senderName: 'MapStore Buyer',
          originalText: 'Awesome, sending an escrow-locked barter offer for 18.50.',
          timestamp: '10:40',
          isOffer: true,
          offerPrice: 18.50,
          offerStatus: 'accepted'
        },
        {
          id: 'msg-7',
          senderId: 'sell-beta',
          senderName: 'Terra Crafts & Co',
          originalText: 'The standard platform fee remains active. Offer is accepted.',
          translatedText: 'Inkokhelo yethu ejwayelekile yesikhulumi isasebenza. Isithembiso samukelwe.',
          timestamp: '10:45',
          detectedLanguage: 'en'
        }
      ]
    }
  ]);
  const [notifications, setNotifications] = useState<PushNotification[]>([
    {
      id: 'noti-init',
      title: 'Welcome to MapStore! 🌿',
      message: 'Browse premium products near you with real-time GPS tracking. Slogan: "Reaching you".',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
      type: 'system'
    }
  ]);

  const [activeTab, setActiveTab] = useState<'buyer' | 'seller' | 'owner'>('buyer');
  const [buyerSubTab, setBuyerSubTab] = useState<'featured' | 'wishlist' | 'profile'>('featured');
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [legalView, setLegalView] = useState(false);
  const [isPitchDeckOpen, setIsPitchDeckOpen] = useState(false);
  const [isLetterheadOpen, setIsLetterheadOpen] = useState(false);
  const [isBusinessPlanOpen, setIsBusinessPlanOpen] = useState(false);
  const [isSupplierPitchOpen, setIsSupplierPitchOpen] = useState(false);
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Active tracking state for modal
  const [activeTrackingOrder, setActiveTrackingOrder] = useState<Order | null>(null);

  // Toast Notification state
  const [activeToast, setActiveToast] = useState<{ title: string; message: string } | null>(null);

  // HTML Element class toggle for Tailwind Dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // General Notification Adder
  const addNotification = (noti: Omit<PushNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNoti: PushNotification = {
      ...noti,
      id: `noti-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false
    };
    setNotifications(prev => [newNoti, ...prev]);

    // Show temporary dynamic bottom alert toast
    setActiveToast({ title: noti.title, message: noti.message });
    setTimeout(() => {
      setActiveToast(null);
    }, 4000);
  };

  const handleToggleWishlist = (id: string) => {
    setUser((prev) => {
      const isFav = prev.wishlist.includes(id);
      const updated = isFav ? prev.wishlist.filter(item => item !== id) : [...prev.wishlist, id];
      return { ...prev, wishlist: updated };
    });
    addNotification({
      title: 'Wishlist Sync',
      message: `${products.find(p => p.id === id)?.title} coordinates matching updated in your savings drawer.`,
      type: 'system'
    });
  };

  // Add order callback
  const handleAddOrder = (order: Order) => {
    setOrders(prev => [order, ...prev]);
  };

  const handleCancelOrder = (orderId: string) => {
    setOrders(currentOrders => {
      return currentOrders.map(ord => {
        if (ord.id !== orderId) return ord;
        
        // Mark tracking step as cancelled
        const updatedSteps = ord.trackingSteps.map(step => {
          if (step.status === 'pending' || step.status === 'payment_secured') {
            return { ...step, description: 'Order Cancelled by buyer. Full refund issued.' };
          }
          return step;
        });

        const updated: Order = {
          ...ord,
          status: 'cancelled',
          trackingSteps: updatedSteps
        };

        addNotification({
          title: `❌ Order #${ord.id} Cancelled`,
          message: `Order successfully cancelled within the 12-hour window. Funds refunded to buyer.`,
          type: 'order',
          orderId: ord.id
        });

        if (activeTrackingOrder && activeTrackingOrder.id === orderId) {
          setActiveTrackingOrder(updated);
        }

        return updated;
      });
    });
  };

  const handleInitiateReturn = (orderId: string) => {
    setOrders(currentOrders => {
      return currentOrders.map(ord => {
        if (ord.id !== orderId) return ord;

        const updated: Order = {
          ...ord,
          status: 'return_initiated',
          returnInitiated: true,
          returnInitiatedAt: new Date().toISOString()
        };

        addNotification({
          title: `🔄 Return Initiated: #${ord.id}`,
          message: `Buyer initiated a package return. Commission and net funds frozen on escrow hold.`,
          type: 'order',
          orderId: ord.id
        });

        if (activeTrackingOrder && activeTrackingOrder.id === orderId) {
          setActiveTrackingOrder(updated);
        }

        return updated;
      });
    });
  };

  const handleSimulateTimeTravel = (orderId: string, action: 'expire_cancel' | 'release_funds' | 'expire_return' | 'force_delivered_fresh') => {
    setOrders(currentOrders => {
      return currentOrders.map(ord => {
        if (ord.id !== orderId) return ord;

        const updated = { ...ord };
        const now = Date.now();

        if (action === 'expire_cancel') {
          // Set createdAt to 13 hours ago (so cancellation is expired)
          updated.createdAt = new Date(now - 13 * 3600 * 1000).toISOString();
          addNotification({
            title: '⏳ Simulating 13 Hours Later',
            message: `Order creation time backdated to 13 hours ago. Cancellation window has expired!`,
            type: 'system',
            orderId: ord.id
          });
        } else if (action === 'release_funds') {
          // Deliver now and set deliveredAt to 25 hours ago, so delivery time elapsed ≥ 24 hours.
          const twentyFiveHoursAgo = new Date(now - 25 * 3600 * 1000).toISOString();
          const thirtyHoursAgo = new Date(now - 30 * 3600 * 1000).toISOString();
          updated.status = 'delivered' as const;
          updated.createdAt = thirtyHoursAgo;
          updated.deliveredAt = twentyFiveHoursAgo;
          
          updated.trackingSteps = updated.trackingSteps.map(step => ({
            ...step,
            active: true,
            date: step.date === 'TBD' ? new Date(now - 26 * 3600 * 1000).toLocaleTimeString() : step.date
          }));

          addNotification({
            title: '💰 Escrow Payout Released!',
            message: `Order has been delivered for 25 hours. Funds successfully unlocked for withdrawal.`,
            type: 'system',
            orderId: ord.id
          });
        } else if (action === 'expire_return') {
          // Set deliveredAt to 13 hours ago (return window expired, but escrow payout released is still pending because it is only 13h)
          const thirteenHoursAgo = new Date(now - 13 * 3600 * 1000).toISOString();
          updated.status = 'delivered' as const;
          updated.deliveredAt = thirteenHoursAgo;
          
          updated.trackingSteps = updated.trackingSteps.map(step => ({
            ...step,
            active: true
          }));

          addNotification({
            title: '📦 Return Window Expired',
            message: `Delivery backdated to 13 hours ago. return process is locked. 11 hours until payout clears.`,
            type: 'system',
            orderId: ord.id
          });
        } else if (action === 'force_delivered_fresh') {
          // Set status to delivered, deliveredAt to right now (within 12 hour return window, but funds locked)
          updated.status = 'delivered' as const;
          updated.deliveredAt = new Date().toISOString();
          
          updated.trackingSteps = updated.trackingSteps.map(step => ({
            ...step,
            active: true,
            date: step.date === 'TBD' ? new Date().toLocaleTimeString() : step.date
          }));

          addNotification({
            title: '🏁 Delivered Just Now',
            message: `Simulating hot delivery. 12-hour return grace period is active. Funds locked in escrow.`,
            type: 'system',
            orderId: ord.id
          });
        }

        if (activeTrackingOrder && activeTrackingOrder.id === orderId) {
          // Sync active tracking modal state
          setTimeout(() => setActiveTrackingOrder(updated), 50);
        }

        return updated;
      });
    });
  };

  // GPS Simulation: Buyer updates delivery steppers and driver coordinate moves
  const advanceTrackingStage = (orderId: string) => {
    setOrders((currentOrders) => {
      return currentOrders.map((ord) => {
        if (ord.id !== orderId) return ord;

        const stages: Order['status'][] = ['pending', 'payment_secured', 'processing', 'shipped', 'out_for_delivery', 'delivered'];
        const currentIdx = stages.indexOf(ord.status);
        if (currentIdx === -1 || currentIdx === stages.length - 1) return ord;

        const nextStatus = stages[currentIdx + 1];

        // Mark tracking step as active
        const updatedSteps = ord.trackingSteps.map((step) => {
          if (step.status === nextStatus) {
            return { ...step, active: true, date: new Date().toLocaleTimeString() };
          }
          return step;
        });

        // Simulate GPS driver jittering coordinates towards delivery point
        const currentDriverCoords = ord.driverLocation
          ? {
              latitude: ord.driverLocation.latitude + (37.7833 - ord.driverLocation.latitude) * 0.4,
              longitude: ord.driverLocation.longitude + (-122.4167 - ord.driverLocation.longitude) * 0.4
            }
          : undefined;

        const updatedOrder: Order = {
          ...ord,
          status: nextStatus,
          trackingSteps: updatedSteps,
          driverLocation: currentDriverCoords,
          deliveredAt: nextStatus === 'delivered' ? new Date().toISOString() : ord.deliveredAt
        };

        // Notify Buyer
        addNotification({
          title: `📦 Delivery Alert: ${ord.id}`,
          message: `Your shipping carrier status changed to: ${nextStatus.replace('_', ' ').toUpperCase()}.`,
          type: 'order',
          orderId: ord.id
        });

        // Sync modal if visible
        if (activeTrackingOrder && activeTrackingOrder.id === orderId) {
          setActiveTrackingOrder(updatedOrder);
        }

        return updatedOrder;
      });
    });
  };

  if (!isAuthenticated) {
    return (
      <AuthWall
        onAuthSuccess={(authenticatedUser) => {
          setUser(authenticatedUser);
          setIsAuthenticated(true);
          // Set initial sub-tabs for easier redirection
          if (authenticatedUser.role === 'seller') {
            setActiveTab('seller');
          } else if (authenticatedUser.role === 'owner') {
            setActiveTab('owner');
          } else {
            setActiveTab('buyer');
            setBuyerSubTab('featured');
          }
          addNotification({
            title: '🔑 Sec-2FA Authentication Granted',
            message: `Logged in successfully as ${authenticatedUser.name} (${authenticatedUser.role.toUpperCase()}).`,
            type: 'system'
          });
        }}
        darkMode={darkMode}
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
        t={t}
      />
    );
  }

  return (
    <Translate langId={selectedLanguage.id}>
      <div className={`min-h-screen font-sans transition-colors duration-200 ${darkMode ? 'bg-zinc-950 text-zinc-100' : 'bg-gray-50 text-gray-900'}`} id="app-wrapper">
      {/* Top Main Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-b border-gray-150 dark:border-zinc-900 p-4 safe-padding-top">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center justify-between w-full md:w-auto">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => { setActiveTab('buyer'); setLegalView(false); }}>
              <MapStoreLogo showSlogan={true} className="scale-90 sm:scale-100 origin-left" />
            </div>

            {/* Quick action buttons for mobile (visible only on iOS/Android portraits) */}
            <div className="flex items-center gap-1.5 md:hidden">
              <button
                onClick={() => setIsCartOpen(!isCartOpen)}
                className="relative p-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 rounded-xl cursor-pointer text-gray-700 dark:text-zinc-300 transition-colors"
                title="View Shopping Cart"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                {cart.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-white text-[8px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-black">
                    {cart.reduce((s, c) => s + c.quantity, 0)}
                  </span>
                )}
              </button>

              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 rounded-xl cursor-pointer text-gray-700 dark:text-zinc-300 transition-colors"
                title={`${darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}`}
              >
                {darkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
              </button>

              <div className="relative">
                <button
                  onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                  className="p-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 rounded-xl cursor-pointer text-gray-700 dark:text-zinc-300 transition-colors"
                >
                  <Bell className="w-3.5 h-3.5" />
                  {notifications.some(n => !n.read) && (
                    <span className="absolute top-1 right-1 flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                    </span>
                  )}
                </button>
              </div>

              <button
                onClick={() => {
                  setIsAuthenticated(false);
                  addNotification({
                    title: '🔐 Platform Log Out Active',
                    message: 'Session cleared successfully.',
                    type: 'system'
                  });
                }}
                className="p-2.5 bg-rose-500/10 text-[#f43f5e] dark:text-[#fb7185] rounded-xl cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Nav Controls Group - wraps cleanly on mobile screens while aligning right on iPad and Mac screens */}
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 w-full md:w-auto">
            
            {/* Global Region & Currency Selector */}
            <div className="flex items-center gap-1 bg-gray-100 dark:bg-zinc-900 border border-gray-150 dark:border-zinc-805 rounded-2xl p-0.5 shrink-0">
              <span className="text-[9px] uppercase font-mono tracking-wider font-extrabold text-gray-400 pl-2 pr-0.5 hidden sm:inline-block">{t('region')}:</span>
              <select
                value={selectedRegion.id}
                onChange={(e) => {
                  const targetReg = REGIONS.find(r => r.id === e.target.value);
                  if (targetReg) {
                    setSelectedRegion(targetReg);
                    addNotification({
                      title: `🌐 Region Switch: ${targetReg.name}`,
                      message: `Dynamic conversion to ${targetReg.currencyCode} (${targetReg.currencySymbol}) applied automatically.`,
                      type: 'system'
                    });
                  }
                }}
                className="bg-transparent text-gray-800 dark:text-zinc-200 text-xs font-bold py-1 px-1.5 focus:outline-hidden cursor-pointer rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-800 border-none outline-none font-sans"
                id="region-currency-switcher"
              >
                {REGIONS.map((reg) => (
                  <option key={reg.id} value={reg.id} className="bg-white dark:bg-zinc-950 font-sans text-gray-800 dark:text-zinc-200 font-bold">
                    {reg.flag} {reg.id} ({reg.currencySymbol})
                  </option>
                ))}
              </select>
            </div>

            {/* Global Language Selector for easier navigation */}
            <div className="flex items-center gap-1 bg-gray-100 dark:bg-zinc-900 border border-gray-150 dark:border-zinc-805 rounded-2xl p-0.5 shrink-0">
              <span className="text-[9px] uppercase font-mono tracking-wider font-extrabold text-gray-400 pl-2 pr-0.5 hidden sm:inline-block">{t('language')}:</span>
              <select
                value={selectedLanguage.id}
                onChange={(e) => {
                  const targetLang = LANGUAGES.find(l => l.id === e.target.value);
                  if (targetLang) {
                    setSelectedLanguage(targetLang);
                    addNotification({
                      title: `🌐 Language Switch: ${targetLang.name}`,
                      message: `Translations for ${targetLang.name} successfully loaded.`,
                      type: 'system'
                    });
                  }
                }}
                className="bg-transparent text-gray-800 dark:text-zinc-200 text-xs font-bold py-1 px-1.5 focus:outline-hidden cursor-pointer rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-800 border-none outline-none font-sans"
                id="language-switcher-hub"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.id} value={lang.id} className="bg-white dark:bg-zinc-950 font-sans text-gray-800 dark:text-zinc-200 font-bold">
                    {lang.flag} {lang.id.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            {/* Main Tabs (Browse vs Seller Hub) */}
            <div className="flex bg-gray-100 dark:bg-zinc-905 p-1 rounded-2xl border border-gray-150 dark:border-zinc-805 shrink-0">
              <button
                onClick={() => { setActiveTab('buyer'); setLegalView(false); }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  activeTab === 'buyer' && !legalView
                    ? 'bg-emerald-500 text-white shadow-xs'
                    : 'text-gray-500 dark:text-zinc-400 hover:text-gray-950 dark:hover:text-white'
                }`}
              >
                {t('browse_shop')}
              </button>
              <button
                onClick={() => { setActiveTab('seller'); setLegalView(false); }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  activeTab === 'seller' && !legalView
                    ? 'bg-[#5eead4] dark:bg-[#4ade80] text-black shadow-xs'
                    : 'text-gray-500 dark:text-zinc-400 hover:text-gray-950 dark:hover:text-white'
                }`}
              >
                {t('seller_hub')}
              </button>
              {user.role === 'owner' && (
                <button
                  onClick={() => { setActiveTab('owner'); setLegalView(false); }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                    activeTab === 'owner' && !legalView
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'text-gray-500 dark:text-zinc-400 hover:text-gray-950 dark:hover:text-white'
                  }`}
                  id="btn-header-owner-hub"
                >
                  👑 Owner Hub
                </button>
              )}
            </div>

            {/* Document/Investor Hub controls are only displayed in the Owner Hub */}
            {activeTab === 'owner' && (
              <>
                {/* Interactive Pitch Deck Presentation Trigger Button */}
                <button
                  onClick={() => setIsPitchDeckOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 hover:from-emerald-500/20 hover:to-teal-500/20 border border-emerald-500/20 dark:border-emerald-500/30 rounded-2xl text-[11px] font-black text-emerald-600 dark:text-[#5eead4] cursor-pointer transition-all shrink-0 active:scale-95 shadow-xs"
                  id="header-btn-pitch-deck"
                  title="Open Live Investor Presentation Gameplan"
                >
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5eead4] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#5eead4]"></span>
                  </span>
                  <span>💼 Investor Arena</span>
                </button>

                {/* MapStore Corporate Letterhead Generator Trigger */}
                <button
                  onClick={() => setIsLetterheadOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 hover:from-emerald-500/20 hover:to-teal-500/20 border border-emerald-500/20 dark:border-emerald-500/30 rounded-2xl text-[11px] font-black text-emerald-600 dark:text-[#5eead4] cursor-pointer transition-all shrink-0 active:scale-95 shadow-xs"
                  id="header-btn-letterhead"
                  title="Open Printable Corporate Letterhead & Invoice Cover Generator"
                >
                  <FileText className="w-3.5 h-3.5 text-[#5eead4]" />
                  <span>📄 Letterhead</span>
                </button>

                {/* MapStore Corporate Business Plan Generator Trigger */}
                <button
                  onClick={() => setIsBusinessPlanOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 hover:from-emerald-500/20 hover:to-teal-500/20 border border-emerald-500/20 dark:border-emerald-500/30 rounded-2xl text-[11px] font-black text-emerald-600 dark:text-[#5eead4] cursor-pointer transition-all shrink-0 active:scale-95 shadow-xs"
                  id="header-btn-business-plan"
                  title="Open Printable Corporate Business Plan with Watermark"
                >
                  <FileText className="w-3.5 h-3.5 text-[#5eead4]" />
                  <span>📋 Business Plan</span>
                </button>

                {/* MapStore Supplier Recruitment Pitch Generator Trigger */}
                <button
                  onClick={() => setIsSupplierPitchOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 hover:from-emerald-500/20 hover:to-teal-500/20 border border-emerald-500/20 dark:border-emerald-500/30 rounded-2xl text-[11px] font-black text-emerald-600 dark:text-[#5eead4] cursor-pointer transition-all shrink-0 active:scale-95 shadow-xs"
                  id="header-btn-supplier-pitch"
                  title="Open Printable Supplier & Seller Onboarding Blueprint"
                >
                  <Briefcase className="w-3.5 h-3.5 text-[#5eead4]" />
                  <span>🤝 Seller Pitch</span>
                </button>
              </>
            )}

            {/* Desktop-only action items (hidden on mobile and compact screens) */}
            <div className="hidden md:flex items-center gap-2">
              {/* Shopping Cart Header Button on top */}
              <button
                onClick={() => setIsCartOpen(!isCartOpen)}
                className="relative p-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 rounded-xl cursor-pointer text-gray-700 dark:text-zinc-300 transition-colors"
                id="header-cart-toggle"
                title="View Shopping Cart"
              >
                <ShoppingCart className="w-4 h-4" />
                {cart.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-white text-[9px] w-5 h-5 rounded-full flex items-center justify-center font-extrabold shadow-sm">
                    {cart.reduce((s, c) => s + c.quantity, 0)}
                  </span>
                )}
              </button>

              {/* Dark Mode toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 rounded-xl cursor-pointer text-gray-700 dark:text-zinc-300 transition-colors"
                id="theme-toggler"
              >
                {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* Notification push bell center */}
              <div className="relative">
                <button
                  onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                  className="p-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 rounded-xl cursor-pointer text-gray-700 dark:text-zinc-300 transition-colors"
                  id="btn-bell-notifications"
                >
                  <Bell className="w-4 h-4" />
                  {notifications.some(n => !n.read) && (
                    <span className="absolute top-1 right-1 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                  )}
                </button>

                <AnimatePresence>
                  {isNotificationOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2.5 w-80 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl shadow-2xl p-4 overflow-hidden z-50 text-xs text-gray-700 dark:text-zinc-200"
                      id="alerts-dropdown-panel"
                    >
                      <div className="flex justify-between items-center pb-2 border-b border-gray-105 dark:border-zinc-800 mb-3 font-semibold">
                        <span>Recent Alerts</span>
                        <button
                          onClick={() => {
                            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                            setIsNotificationOpen(false);
                          }}
                          className="text-emerald-500 text-[10px] uppercase font-bold hover:underline"
                        >
                          Mark Read
                        </button>
                      </div>

                      <div className="space-y-3 max-h-60 overflow-y-auto">
                        {notifications.map((n) => (
                          <div key={n.id} className={`p-2 rounded-xl transition-colors ${n.read ? 'opacity-70' : 'bg-zinc-50 dark:bg-zinc-950 font-medium'}`}>
                            <div className="flex justify-between font-bold text-gray-900 dark:text-white mb-0.5">
                              <span className="truncate">{n.title}</span>
                              <span className="text-[8px] font-mono text-gray-400">{n.timestamp}</span>
                            </div>
                            <p className="text-[11px] leading-relaxed text-gray-500 dark:text-zinc-300">{n.message}</p>
                            {n.orderId && (
                              <button
                                onClick={() => {
                                  const orderToFind = orders.find(o => o.id === n.orderId);
                                  if (orderToFind) setActiveTrackingOrder(orderToFind);
                                  setIsNotificationOpen(false);
                                }}
                                className="text-[10px] text-emerald-500 mt-1 flex items-center gap-0.5 hover:underline font-bold"
                              >
                                Track Order <ArrowRight className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* End-user active Log Out session action */}
              <button
                onClick={() => {
                  setIsAuthenticated(false);
                  addNotification({
                    title: '🔐 Platform Log Out Active',
                    message: 'Cleaned secure context cache thread metrics. Please sign in again.',
                    type: 'system'
                  });
                }}
                title="Sign Out Session"
                className="p-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-[#f43f5e] dark:text-[#fb7185] rounded-xl cursor-pointer transition-colors flex items-center justify-center gap-1.5"
                id="btn-header-logout"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-[10.5px] font-extrabold uppercase hidden md:inline">Sign Out</span>
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Main Container Workspace */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {legalView ? (
          <ToSAndPrivacy onBack={() => setLegalView(false)} langId={selectedLanguage.id} />
        ) : (
          <div className="space-y-6">
            {/* Buyer Sub-nav Bar exclusive to Shop Mode */}
            {activeTab === 'buyer' && (
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-zinc-900 gap-2 overflow-x-auto">
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => setBuyerSubTab('featured')}
                    className={`px-4.5 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                      buyerSubTab === 'featured'
                        ? 'bg-zinc-900 text-white dark:bg-white dark:text-black shadow-xs'
                        : 'bg-white dark:bg-zinc-900 hover:bg-zinc-100 border border-gray-100 dark:border-zinc-800 text-gray-600 dark:text-zinc-300'
                    }`}
                  >
                    🚀 Local Showcase
                  </button>
                  <button
                    onClick={() => setBuyerSubTab('wishlist')}
                    className={`px-4.5 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors relative ${
                      buyerSubTab === 'wishlist'
                        ? 'bg-zinc-900 text-white dark:bg-white dark:text-black shadow-xs'
                        : 'bg-white dark:bg-zinc-900 hover:bg-zinc-100 border border-gray-100 dark:border-zinc-800 text-gray-600 dark:text-zinc-300'
                    }`}
                  >
                    ❤️ Wishlist
                    {user.wishlist.length > 0 && (
                      <span className="absolute -top-1.5 -right-1 bg-rose-500 text-white text-[9px] font-bold h-4.5 w-4.5 rounded-full flex items-center justify-center">
                        {user.wishlist.length}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => setBuyerSubTab('profile')}
                    className={`px-4.5 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                      buyerSubTab === 'profile'
                        ? 'bg-zinc-900 text-white dark:bg-white dark:text-black shadow-xs'
                        : 'bg-white dark:bg-zinc-900 hover:bg-zinc-100 border border-gray-100 dark:border-zinc-800 text-gray-600 dark:text-zinc-300'
                    }`}
                    id="btn-profile-tab"
                  >
                    👤 My Account & Orders
                  </button>
                </div>

                <div className="text-xs bg-[#5eead4]/10 border border-[#5eead4]/30 text-emerald-800 dark:text-emerald-400 font-bold px-3 py-1.5 rounded-xl shrink-0">
                   7% Platform Commission Applied Securely
                </div>
              </div>
            )}

            {/* Portals Router */}
            <div>
              {activeTab === 'buyer' && buyerSubTab === 'featured' && (
                <BuyerPortal
                  products={products}
                  setProducts={setProducts}
                  user={user}
                  setUser={setUser}
                  wishlist={user.wishlist}
                  toggleWishlist={handleToggleWishlist}
                  orders={orders}
                  addOrder={handleAddOrder}
                  addNotification={addNotification}
                  darkMode={darkMode}
                  onOpenLegal={() => setLegalView(true)}
                  selectedRegion={selectedRegion}
                  t={t}
                  cart={cart}
                  setCart={setCart}
                  isCartOpen={isCartOpen}
                  setIsCartOpen={setIsCartOpen}
                  langId={selectedLanguage.id}
                  p2pChats={p2pChats}
                  setP2pChats={setP2pChats}
                />
              )}

              {activeTab === 'buyer' && buyerSubTab === 'wishlist' && (
                <div className="space-y-6">
                  <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-gray-100 dark:border-zinc-800 shadow-xs">
                    <h2 className="text-xl font-extrabold text-gray-900 dark:text-white mb-2">Saved Wishlist</h2>
                    <p className="text-xs text-gray-500">Verify coordinates and track items before checkout.</p>
                  </div>

                  {user.wishlist.length === 0 ? (
                    <div className="text-center p-12 bg-zinc-50 dark:bg-zinc-900/40 border border-dashed border-gray-200 dark:border-zinc-800 rounded-3xl">
                      <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-400 text-sm">Wishlist is empty. Click the heart icon on cards to add items!</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {products
                        .filter(p => user.wishlist.includes(p.id))
                        .map(p => (
                          <div key={p.id} className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-4 rounded-3xl flex gap-4 shadow-xs relative">
                            <img src={p.imageUrl} alt={p.title} referrerPolicy="no-referrer" className="w-20 h-20 rounded-2xl object-cover shrink-0" />
                            <div className="flex-1 flex flex-col justify-between overflow-hidden">
                              <div>
                                <h3 className="font-bold text-sm text-gray-900 dark:text-white truncate">{p.title}</h3>
                                <span className="text-[10px] text-zinc-400">Seller: {p.sellerName}</span>
                              </div>
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-sm font-extrabold text-[#5eead4] dark:text-[#4ade80]">{selectedRegion.currencySymbol}{(p.price * selectedRegion.exchangeRate).toFixed(2)}</span>
                                <button
                                  onClick={() => handleToggleWishlist(p.id)}
                                  className="text-[10px] text-rose-500 font-bold hover:underline cursor-pointer"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'buyer' && buyerSubTab === 'profile' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Left panel: Account Settings */}
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-zinc-900 p-6 border border-gray-100 dark:border-zinc-850 rounded-3xl shadow-xs">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-emerald-500/15 rounded-xl flex items-center justify-center">
                          <UserIcon className="w-6 h-6 text-emerald-500" />
                        </div>
                        <div>
                          <h3 className="font-bold text-md leading-tight text-gray-900 dark:text-white">{user.name}</h3>
                          <span className="text-[10px] font-mono text-zinc-400">{user.email}</span>
                        </div>
                      </div>

                      <div className="space-y-4 pt-4 border-t border-gray-50 dark:border-zinc-800 text-xs">
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1.5">User Roles Permission</label>
                          <div className="bg-zinc-50 dark:bg-zinc-950 p-2.5 rounded-lg border border-gray-150 dark:border-zinc-850 font-bold capitalize">
                            Authenticated {user.role} Account Status
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1.5 font-sans">Preferred Product Categories</label>
                          <div className="flex flex-wrap gap-1.5">
                            {['Electronics', 'Handcrafted', 'Local Organic Food'].map((cat) => {
                              const isPref = user.preferredCategories.includes(cat);
                              return (
                                <button
                                  key={cat}
                                  onClick={() => {
                                    const next = isPref
                                      ? user.preferredCategories.filter(c => c !== cat)
                                      : [...user.preferredCategories, cat];
                                    setUser({ ...user, preferredCategories: next });
                                  }}
                                  className={`px-2.5 py-1 rounded-full text-[10px] font-medium transition-colors ${
                                    isPref
                                      ? 'bg-emerald-500 text-white'
                                      : 'bg-zinc-100 text-gray-500 dark:bg-zinc-950 dark:text-zinc-400'
                                  }`}
                                >
                                  {cat}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <div className="bg-zinc-50 dark:bg-zinc-950 p-3.5 rounded-xl border border-gray-100 dark:border-zinc-900">
                          <span className="font-bold block text-gray-800 dark:text-zinc-200 mb-1">AES-256 Account Security</span>
                          <span className="text-[10px] text-gray-400 leading-relaxed block">Secure payment tokens and scan profiles are encrypted. Standard 2FA enabled.</span>
                        </div>

                        <button
                          onClick={() => {
                            setIsAuthenticated(false);
                            addNotification({
                              title: '🔐 Secure Session Terminated',
                              message: 'Successfully removed session token from active browser caches.',
                              type: 'system'
                            });
                          }}
                          className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-2.5 rounded-2xl text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer mt-2"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Log Out of Session</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right panel: Purchase History / Active order list */}
                  <div className="md:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-zinc-900 p-6 border border-gray-100 dark:border-zinc-850 rounded-3xl shadow-xs">
                      <h3 className="font-extrabold text-sm text-gray-950 dark:text-white mb-1">My Orders & tracking console</h3>
                      <p className="text-[11px] text-gray-405 mb-4">Click track order to open active steppers and simulate driver coordinates moves.</p>

                      <div className="space-y-4">
                        {orders.map((ord) => (
                          <div
                            key={ord.id}
                            className="p-4 bg-zinc-50 dark:bg-zinc-950 border border-gray-100 dark:border-zinc-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                                  {ord.id}
                                </span>
                                <span className="text-[10px] text-gray-400">{ord.timestamp}</span>
                              </div>
                              <div className="text-xs text-gray-700 dark:text-zinc-300">
                                {ord.items.map((i) => `${i.productTitle} (x${i.quantity})`).join(', ')}
                              </div>
                              <p className="text-xs">
                                Invoice Amount: <strong className="text-gray-950 dark:text-zinc-100">{selectedRegion.currencySymbol}{(ord.totalPrice * selectedRegion.exchangeRate).toFixed(2)}</strong>
                              </p>

                              {(() => {
                                const createdTime = ord.createdAt ? new Date(ord.createdAt).getTime() : new Date(ord.timestamp || Date.now()).getTime();
                                const hoursSinceCreation = (Date.now() - createdTime) / (3600 * 1000);
                                const cancelWindowActive = ord.status !== 'cancelled' && ord.status !== 'delivered' && ord.status !== 'return_initiated' && hoursSinceCreation <= 12;
                                const cancelHrsLeft = Math.max(0, 12 - hoursSinceCreation);

                                const deliveryTime = ord.deliveredAt ? new Date(ord.deliveredAt).getTime() : 0;
                                const hoursSinceDelivery = deliveryTime ? (Date.now() - deliveryTime) / (3600 * 1000) : 0;
                                
                                const returnWindowActive = ord.status === 'delivered' && deliveryTime && hoursSinceDelivery <= 12 && !ord.returnInitiated;
                                const returnHrsLeft = Math.max(0, 12 - hoursSinceDelivery);

                                const escrowHoldActive = ord.status === 'delivered' && deliveryTime && hoursSinceDelivery < 24;
                                const escrowHrsLeft = Math.max(0, 24 - hoursSinceDelivery);
                                const escrowReleased = ord.status === 'delivered' && deliveryTime && hoursSinceDelivery >= 24 && !ord.returnInitiated;

                                return (
                                  <div className="mt-2.5 p-3 bg-white/40 dark:bg-zinc-900 border border-gray-150 dark:border-zinc-805 rounded-xl space-y-2 text-xs">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pb-2 border-b border-gray-100 dark:border-zinc-800">
                                      <span className="font-mono font-bold text-[9px] uppercase tracking-wider text-gray-500">🛡️ Escrow Clearance Audit</span>
                                      <div className="flex items-center gap-1">
                                        {ord.status === 'cancelled' && (
                                          <span className="px-1.5 py-0.5 bg-rose-500/10 text-rose-500 text-[8px] font-sans font-extrabold uppercase rounded">❌ Refunded</span>
                                        )}
                                        {ord.returnInitiated && (
                                          <span className="px-1.5 py-0.5 bg-amber-500/10 text-amber-500 text-[8px] font-sans font-extrabold uppercase rounded animate-pulse">🔄 Dispute Hold</span>
                                        )}
                                        {escrowReleased && (
                                          <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 text-[8px] font-sans font-extrabold uppercase rounded">✨ Funds Cleared</span>
                                        )}
                                        {escrowHoldActive && !ord.returnInitiated && (
                                          <span className="px-1.5 py-0.5 bg-blue-500/10 text-blue-400 text-[8px] font-sans font-extrabold uppercase rounded">🔒 Escrow Hold (24h)</span>
                                        )}
                                        {!deliveryTime && ord.status !== 'cancelled' && (
                                          <span className="px-1.5 py-0.5 bg-purple-500/10 text-purple-400 text-[8px] font-sans font-extrabold uppercase rounded">🚚 Pre-Delivery Hold</span>
                                        )}
                                      </div>
                                    </div>

                                    <div className="space-y-1 text-[11px] leading-relaxed">
                                      {ord.status === 'cancelled' ? (
                                        <p className="text-rose-500 font-semibold">Cancelled: This order was returned/cancelled inside the 12-hour window. Full refund generated.</p>
                                      ) : ord.returnInitiated ? (
                                        <p className="text-amber-500 font-semibold">Return Initiated: 12-hour limit met. All funds remain frozen on escrow hold until dispute clears.</p>
                                      ) : ord.status === 'delivered' ? (
                                        <div>
                                          <p className="text-gray-500 dark:text-zinc-400">
                                            Arrived on: <strong className="font-mono text-gray-700 dark:text-zinc-300">{new Date(deliveryTime).toLocaleTimeString()} ({hoursSinceDelivery.toFixed(1)}h elapsed)</strong>
                                          </p>
                                          {escrowHoldActive ? (
                                            <p className="text-indigo-400 font-medium">
                                              ⌛ Funds ({selectedRegion.currencySymbol}{(ord.totalPrice * selectedRegion.exchangeRate).toFixed(2)}) locked in Escrow. Autorelease in <strong>{escrowHrsLeft.toFixed(1)} hours</strong>.
                                            </p>
                                          ) : (
                                            <p className="text-emerald-400 font-medium">
                                              ✅ 24-Hour Hold Cleared: Platform commission deducted. Payout reflected inside wallets.
                                            </p>
                                          )}

                                          {returnWindowActive ? (
                                            <div className="mt-2 p-1.5 bg-amber-500/15 border border-amber-500/30 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1.5">
                                              <span className="text-amber-500 font-extrabold text-[10px]">📦 Return Window: {returnHrsLeft.toFixed(1)}h remaining</span>
                                              <button
                                                onClick={() => handleInitiateReturn(ord.id)}
                                                className="bg-amber-500 hover:bg-amber-600 font-black text-white text-[9px] px-2 py-1 rounded uppercase tracking-wider cursor-pointer"
                                              >
                                                Start Return
                                              </button>
                                            </div>
                                          ) : (
                                            <p className="text-zinc-550 dark:text-zinc-400 text-[10px] italic mt-1 font-sans">
                                              🔒 12-hour Buyer return/refund change-of-mind period has expired.
                                            </p>
                                          )}
                                        </div>
                                      ) : (
                                        <div>
                                          <p className="text-zinc-500">Registered: {ord.timestamp}</p>
                                          {cancelWindowActive ? (
                                            <div className="mt-2 p-1.5 bg-rose-500/10 border border-rose-500/20 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1.5">
                                              <span className="text-rose-400 font-extrabold text-[10px]">⏳ Cancel Window: {cancelHrsLeft.toFixed(1)}h left</span>
                                              <button
                                                onClick={() => handleCancelOrder(ord.id)}
                                                className="bg-rose-500 hover:bg-rose-600 font-black text-white text-[9px] px-2 py-1 rounded uppercase tracking-wider cursor-pointer"
                                              >
                                                Cancel Order
                                              </button>
                                            </div>
                                          ) : (
                                            <p className="text-zinc-550 dark:text-zinc-400 text-[10px] italic mt-1 font-sans">
                                              🔒 Cancel grace-period expired (&gt;12 hours elapsed). Packages are on transit coordinate holding locks.
                                            </p>
                                          )}
                                        </div>
                                      )}
                                    </div>

                                    {/* Passage of Time Fast-Forward Controls */}
                                    <div className="pt-2 border-t border-gray-100 dark:border-zinc-800 space-y-1">
                                      <span className="text-[9px] uppercase font-mono font-extrabold text-zinc-400 block">⌚ Speed Simulation Sandbox:</span>
                                      <div className="flex flex-wrap gap-1">
                                        {ord.status !== 'cancelled' && ord.status !== 'delivered' && ord.status !== 'return_initiated' && (
                                          <button
                                            onClick={() => handleSimulateTimeTravel(ord.id, 'expire_cancel')}
                                            className="px-2 py-0.5 bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-[9px] hover:text-rose-400 dark:hover:text-rose-400 rounded-sm font-semibold cursor-pointer border"
                                          >
                                            Expire Cancel Window (+13h)
                                          </button>
                                        )}
                                        {ord.status !== 'cancelled' && ord.status !== 'return_initiated' && (
                                          <button
                                            onClick={() => handleSimulateTimeTravel(ord.id, 'force_delivered_fresh')}
                                            className="px-2 py-0.5 bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-[9px] hover:text-emerald-400 dark:hover:text-emerald-400 rounded-sm font-semibold cursor-pointer border"
                                          >
                                            Simulate Delivery (Hot)
                                          </button>
                                        )}
                                        {ord.status === 'delivered' && (
                                          <>
                                            <button
                                              onClick={() => handleSimulateTimeTravel(ord.id, 'expire_return')}
                                              className="px-2 py-0.5 bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-[9px] hover:text-amber-400 dark:hover:text-amber-400 rounded-sm font-semibold cursor-pointer border"
                                            >
                                              Expire Return Window (+13h)
                                            </button>
                                            <button
                                              onClick={() => handleSimulateTimeTravel(ord.id, 'release_funds')}
                                              className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 text-[9px] hover:bg-emerald-500/20 rounded-sm font-extrabold cursor-pointer border border-emerald-500/30 animate-pulse"
                                            >
                                              Clear Escrow Clearance (+25h)
                                            </button>
                                          </>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })()}
                            </div>

                            <div className="flex flex-col gap-2 shrink-0">
                              <div className="text-xs font-semibold capitalize text-amber-500 flex items-center gap-1">
                                <Truck className="w-4 h-4" /> {ord.status.replace('_', ' ')}
                              </div>
                              <button
                                onClick={() => setActiveTrackingOrder(ord)}
                                className="bg-[#121214] hover:bg-black text-white dark:bg-zinc-805 dark:hover:bg-zinc-705 text-[10px] font-bold px-3.5 py-2 rounded-xl transition-all cursor-pointer text-center"
                              >
                                Track & Simulate Route
                              </button>
                            </div>
                          </div>
                        ))}

                        {orders.length === 0 && (
                          <div className="text-center p-8 bg-white dark:bg-zinc-900 border border-dashed border-gray-150 dark:border-neutral-800 rounded-2xl">
                            <ShoppingBag className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                            <p className="text-xs text-gray-400">No registered purchases made yet during this active session browser state.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'seller' && (
                <SellerPortal
                  products={products}
                  setProducts={setProducts}
                  user={user}
                  setUser={setUser}
                  orders={orders}
                  addOrder={handleAddOrder}
                  setOrders={setOrders}
                  addNotification={addNotification}
                  darkMode={darkMode}
                  onOpenLegal={() => setLegalView(true)}
                  selectedRegion={selectedRegion}
                  t={t}
                  onOpenPitchDeck={() => setIsPitchDeckOpen(true)}
                  onOpenLetterhead={() => setIsLetterheadOpen(true)}
                  onOpenBusinessPlan={() => setIsBusinessPlanOpen(true)}
                  onOpenSupplierPitch={() => setIsSupplierPitchOpen(true)}
                  langId={selectedLanguage.id}
                  p2pChats={p2pChats}
                  setP2pChats={setP2pChats}
                />
              )}

              {activeTab === 'owner' && user.role === 'owner' && (
                <OwnerPortal
                  products={products}
                  setProducts={setProducts}
                  orders={orders}
                  setOrders={setOrders}
                  addNotification={addNotification}
                  user={user}
                  selectedRegion={selectedRegion}
                  setIsLetterheadOpen={setIsLetterheadOpen}
                  t={t}
                  langId={selectedLanguage.id}
                />
              )}
            </div>
          </div>
        )}
      </main>

      {/* Floating System Customer Support Chat powered by Gemini SDK on the backend */}
      <CustomerSupportChat user={user} t={t} langId={selectedLanguage.id} />

      {/* Footer copyright agreements */}
      <footer className="mt-16 bg-white dark:bg-zinc-950 border-t border-gray-100 dark:border-zinc-90 w-full p-6 text-center text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-gray-500 dark:text-zinc-400">
          <p>© 2026 MapStore Inc. Logo with slogan: "Reaching you". All rights reserved.</p>
          <div className="flex gap-4">
            <button
              onClick={() => setLegalView(true)}
              className="hover:text-emerald-500 cursor-pointer underline"
            >
              Terms of Service & 7% Platform Commissions
            </button>
            <button
              onClick={() => setLegalView(true)}
              className="hover:text-emerald-500 cursor-pointer underline"
            >
              Privacy Policy
            </button>
          </div>
        </div>
      </footer>

      {/* Active GPS/Order Tracking Simulator modal overlay */}
      <AnimatePresence>
        {activeTrackingOrder && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 font-sans">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-zinc-955 border border-zinc-100 dark:border-zinc-805 p-6 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative"
              id="gps-tracking-modal"
            >
              <button
                onClick={() => setActiveTrackingOrder(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 p-2 cursor-pointer font-bold"
              >
                Close Tracking
              </button>

              <div className="mb-4">
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#5eead4] dark:text-[#4ade80] font-extrabold">Active Delivery Tracking</span>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Order Reference: {activeTrackingOrder.id}</h3>
                <p className="text-xs text-gray-400">Destined branch target: <strong>{activeTrackingOrder.shippingAddress.streetAddress}, {activeTrackingOrder.shippingAddress.city}</strong></p>
              </div>

              {/* Simulation triggers panel */}
              <div className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-gray-150 dark:border-zinc-805 flex flex-col sm:flex-row gap-2.5 sm:items-center justify-between text-[11px] text-zinc-500 mb-6">
                <div>
                  <span className="font-extrabold text-gray-900 dark:text-zinc-200 block uppercase tracking-wider text-[10px] mb-0.5">🔒 Verified Merchant Fulfillment Only</span>
                  <span>Parcel dispatch, logistics en-route updates, and delivery confirmations are managed solely by authorized sellers via their secure portal dashboard.</span>
                </div>
              </div>

              {/* Interactive real maps tracing parcel location movement */}
              <div className="h-44 bg-zinc-100 dark:bg-zinc-900 rounded-2xl relative border border-gray-200 dark:border-zinc-800 flex items-center justify-center overflow-hidden mb-6">
                {/* SVG Coordinate Lines */}
                <div className="absolute inset-0 grid grid-cols-10 grid-rows-4 opacity-15 pointer-events-none">
                  {Array.from({ length: 10 }).map((_, i) => <div key={i} className="border-r border-zinc-500 h-full"></div>)}
                  {Array.from({ length: 4 }).map((_, i) => <div key={i} className="border-b border-zinc-500 w-full"></div>)}
                </div>

                {/* Route drawing */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 400 150">
                  <path d="M 50,75 Q 150,120 250,50 T 350,75" fill="none" stroke="#10b981" strokeWidth="3" strokeDasharray="5" />
                </svg>

                {/* Shipping Pin Coords */}
                <div className="absolute left-[50px] top-[75px] -translate-x-1/2 -translate-y-1/2 text-rose-500 z-10">
                  <MapPin className="w-5 h-5 fill-current" />
                  <span className="absolute top-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[8px] bg-red-650 font-bold px-1 rounded">Sellers Hub</span>
                </div>

                {/* Delivery Moving Truck */}
                <div
                  className="absolute z-20 text-emerald-400 flex flex-col items-center justify-center"
                  style={{
                    left: activeTrackingOrder.status === 'delivered' ? '350px' : activeTrackingOrder.status === 'out_for_delivery' ? '280px' : activeTrackingOrder.status === 'shipped' ? '180px' : '50px',
                    top: activeTrackingOrder.status === 'delivered' ? '75px' : activeTrackingOrder.status === 'out_for_delivery' ? '56px' : activeTrackingOrder.status === 'shipped' ? '92px' : '75px',
                    transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  <div className="p-2 bg-emerald-500 text-white rounded-xl shadow-lg animate-bounce">
                    <Truck className="w-4 h-4" />
                  </div>
                </div>

                {/* Buyers Amphitheatre target PIN */}
                <div className="absolute left-[350px] top-[75px] -translate-x-1/2 -translate-y-1/2 text-emerald-500 z-10">
                  <MapPin className="w-6 h-6 fill-current animate-pulse" />
                  <span className="absolute top-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[8px] bg-emerald-600 text-white font-bold px-1 rounded">Target Coords</span>
                </div>
              </div>

              {/* Stepper display */}
              <div className="space-y-4">
                {activeTrackingOrder.trackingSteps.map((step, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                        step.active
                          ? 'bg-emerald-500 text-white animate-pulse'
                          : 'bg-zinc-100 text-zinc-400 dark:bg-zinc-900'
                      }`}>
                        {step.active ? '✓' : idx + 1}
                      </div>
                      {idx < activeTrackingOrder.trackingSteps.length - 1 && (
                        <div className={`w-0.5 h-10 ${step.active ? 'bg-emerald-400' : 'bg-gray-200 dark:bg-zinc-800'}`}></div>
                      )}
                    </div>

                    <div className="overflow-hidden">
                      <h4 className={`font-bold text-xs ${step.active ? 'text-gray-950 dark:text-white' : 'text-zinc-500'}`}>
                        {step.label}
                      </h4>
                      <p className="text-[11px] text-gray-400 leading-relaxed mb-0.5">{step.description}</p>
                      {step.active && step.date !== 'TBD' && (
                        <span className="text-[9px] font-mono text-emerald-400">{step.date}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Real-time Escrow Timeline Card inside track modal */}
              {(() => {
                const ord = orders.find(o => o.id === activeTrackingOrder.id) || activeTrackingOrder;
                const createdTime = ord.createdAt ? new Date(ord.createdAt).getTime() : new Date(ord.timestamp || Date.now()).getTime();
                const hoursSinceCreation = (Date.now() - createdTime) / (3600 * 1000);
                const cancelWindowActive = ord.status !== 'cancelled' && ord.status !== 'delivered' && ord.status !== 'return_initiated' && hoursSinceCreation <= 12;
                const cancelHrsLeft = Math.max(0, 12 - hoursSinceCreation);

                const deliveryTime = ord.deliveredAt ? new Date(ord.deliveredAt).getTime() : 0;
                const hoursSinceDelivery = deliveryTime ? (Date.now() - deliveryTime) / (3600 * 1000) : 0;
                
                const returnWindowActive = ord.status === 'delivered' && deliveryTime && hoursSinceDelivery <= 12 && !ord.returnInitiated;
                const returnHrsLeft = Math.max(0, 12 - hoursSinceDelivery);

                const escrowHoldActive = ord.status === 'delivered' && deliveryTime && hoursSinceDelivery < 24;
                const escrowHrsLeft = Math.max(0, 24 - hoursSinceDelivery);
                const escrowReleased = ord.status === 'delivered' && deliveryTime && hoursSinceDelivery >= 24 && !ord.returnInitiated;

                return (
                  <div className="mt-6 p-4 bg-zinc-50 dark:bg-zinc-900 border border-gray-150 dark:border-zinc-805 rounded-2xl space-y-3 text-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pb-2 border-b border-gray-150 dark:border-zinc-800">
                      <span className="font-mono font-bold text-[9px] uppercase tracking-wider text-gray-500">🛡️ Live Escrow Audit & Logistics Timer</span>
                      <div className="flex items-center gap-1">
                        {ord.status === 'cancelled' && (
                          <span className="px-1.5 py-0.5 bg-rose-500/10 text-rose-500 text-[8px] font-extrabold uppercase rounded">❌ Canceled & Refunded</span>
                        )}
                        {ord.returnInitiated && (
                          <span className="px-1.5 py-0.5 bg-amber-500/10 text-amber-500 text-[8px] font-extrabold uppercase rounded animate-pulse">🔄 Custody Hold</span>
                        )}
                        {escrowReleased && (
                          <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 text-[8px] font-extrabold uppercase rounded">✨ Escrow Dispatched</span>
                        )}
                        {escrowHoldActive && !ord.returnInitiated && (
                          <span className="px-1.5 py-0.5 bg-blue-500/10 text-blue-400 text-[8px] font-extrabold uppercase rounded">🔒 Escrow Hold (24h)</span>
                        )}
                        {!deliveryTime && ord.status !== 'cancelled' && (
                          <span className="px-1.5 py-0.5 bg-purple-500/10 text-purple-400 text-[8px] font-extrabold uppercase rounded">🚚 Transit Escrow Queue</span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1.5 text-[11px] leading-relaxed">
                      {ord.status === 'cancelled' ? (
                        <p className="text-rose-500 font-bold">This ledger transaction was voided. No funds exchanged. Client commissions reimbursed.</p>
                      ) : ord.returnInitiated ? (
                        <p className="text-amber-500 font-bold">A returned parcel status was logged. The escrow hold remains frozen to prevent wallet payments until disputes settle.</p>
                      ) : ord.status === 'delivered' ? (
                        <div>
                          <p className="text-gray-500 dark:text-zinc-400">
                            Parcel Arrival: <strong className="font-mono text-gray-700 dark:text-zinc-300">{new Date(deliveryTime).toLocaleString()} ({hoursSinceDelivery.toFixed(1)}h ago)</strong>
                          </p>
                          {escrowHoldActive ? (
                            <p className="text-indigo-400 font-medium">
                              ⌛ Wallet payments are in transit. Clearance completes in <strong>{escrowHrsLeft.toFixed(1)} hours</strong>.
                            </p>
                          ) : (
                            <p className="text-emerald-400 font-medium">
                              ✅ Trust escrow cleared. Plat fees (7%) split and net revenues transferred safely.
                            </p>
                          )}

                          {returnWindowActive ? (
                            <div className="mt-2.5 p-2 bg-amber-500/10 border border-amber-500/35 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1.5">
                              <span className="text-amber-500 font-extrabold text-[10px]">📦 Open return Dispute window: {returnHrsLeft.toFixed(1)}h remaining</span>
                              <button
                                onClick={() => handleInitiateReturn(ord.id)}
                                className="bg-amber-500 hover:bg-amber-600 font-black text-white text-[9px] px-2.5 py-1 rounded-md uppercase tracking-wide cursor-pointer text-center"
                              >
                                Request Return / Refund
                              </button>
                            </div>
                          ) : (
                            <p className="text-zinc-500 dark:text-zinc-455 text-[10px] italic mt-1 font-sans">
                              🔒 12-hour Buyer return/refund change-of-mind period has expired.
                            </p>
                          )}
                        </div>
                      ) : (
                        <div>
                          <p className="text-zinc-550 dark:text-zinc-400">Creation ledger: {ord.timestamp}</p>
                          {cancelWindowActive ? (
                            <div className="mt-2.5 p-2 bg-rose-500/10 border border-rose-500/20 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1.5">
                              <span className="text-rose-450 font-extrabold text-[10px] text-rose-400">⏳ Cancellation grace-period: {cancelHrsLeft.toFixed(1)}h remaining</span>
                              <button
                                onClick={() => handleCancelOrder(ord.id)}
                                className="bg-rose-500 hover:bg-rose-600 font-black text-white text-[9px] px-2.5 py-1 rounded-md uppercase tracking-wide cursor-pointer text-center"
                              >
                                Void Order (Cancel)
                              </button>
                            </div>
                          ) : (
                            <p className="text-zinc-550 dark:text-zinc-455 text-[10px] italic mt-1 font-sans">
                              🔒 Cancellation grace-period has elapsed. Packages are locked en-route.
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Simulation tools inside track modal */}
                    <div className="pt-2 border-t border-gray-150 dark:border-zinc-800 space-y-1">
                      <span className="text-[9px] uppercase font-mono font-extrabold text-zinc-400 block">⌚ Fast-Forward GPS Timeline Simulator:</span>
                      <div className="flex flex-wrap gap-1">
                        {ord.status !== 'cancelled' && ord.status !== 'delivered' && ord.status !== 'return_initiated' && (
                          <button
                            onClick={() => handleSimulateTimeTravel(ord.id, 'expire_cancel')}
                            className="px-2 py-0.5 bg-zinc-200 dark:bg-zinc-805 text-zinc-700 dark:text-zinc-300 text-[9px] rounded-md font-semibold cursor-pointer border dark:border-zinc-700"
                          >
                            Expire Cancel Window (+13h)
                          </button>
                        )}
                        {ord.status !== 'cancelled' && ord.status !== 'return_initiated' && (
                          <button
                            onClick={() => handleSimulateTimeTravel(ord.id, 'force_delivered_fresh')}
                            className="px-2 py-0.5 bg-zinc-200 dark:bg-zinc-805 text-zinc-700 dark:text-zinc-300 text-[9px] rounded-md font-semibold cursor-pointer border dark:border-zinc-700"
                          >
                            Simulate Delivered (Active Receivership)
                          </button>
                        )}
                        {ord.status === 'delivered' && (
                          <>
                            <button
                              onClick={() => handleSimulateTimeTravel(ord.id, 'expire_return')}
                              className="px-2 py-0.5 bg-zinc-200 dark:bg-zinc-805 text-zinc-700 dark:text-zinc-300 text-[9px] rounded-md font-semibold cursor-pointer border dark:border-zinc-700"
                            >
                              Expire Return Window (+13h)
                            </button>
                            <button
                              onClick={() => handleSimulateTimeTravel(ord.id, 'release_funds')}
                              className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 text-[9px] hover:bg-emerald-500/20 rounded-md font-extrabold cursor-pointer border border-emerald-500/30 animate-pulse"
                            >
                              Clear Escrow Clearance (+25h)
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Dynamic Push Toast Notification Banner alert popping in */}
      <AnimatePresence>
        {activeToast && (
          <motion.div
            initial={{ opacity: 0, y: 100, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 100, x: '-50%' }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-zinc-900 border border-neutral-800 text-white p-4 rounded-2xl shadow-2xl flex items-center gap-3.5 max-w-sm w-11/12"
            id="notification-toast-bar"
          >
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl">
              <Bell className="w-5 h-5 animate-swing" />
            </div>
            <div>
              <h5 className="font-extrabold text-xs">{activeToast.title}</h5>
              <p className="text-[11px] text-gray-400 mt-0.5 leading-tight">{activeToast.message}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Investor Pitch Deck Presentation Overlay Mode */}
      <AnimatePresence>
        {isPitchDeckOpen && (
          <InvestorPitchDeck onClose={() => setIsPitchDeckOpen(false)} />
        )}
      </AnimatePresence>

      {/* MapStore Printable Corporate Letterhead & Document Generator */}
      <AnimatePresence>
        {isLetterheadOpen && (
          <LetterheadModal onClose={() => setIsLetterheadOpen(false)} />
        )}
      </AnimatePresence>

      {/* MapStore Printable Corporate Business Plan with Watermark */}
      <AnimatePresence>
        {isBusinessPlanOpen && (
          <BusinessPlanModal onClose={() => setIsBusinessPlanOpen(false)} />
        )}
      </AnimatePresence>

      {/* MapStore Supplier/Seller Onboarding & Recruitment Pitch Generator with PDF layout */}
      <AnimatePresence>
        {isSupplierPitchOpen && (
          <SupplierRecruitmentPitchModal onClose={() => setIsSupplierPitchOpen(false)} />
        )}
      </AnimatePresence>
    </div>
    </Translate>
  );
}
