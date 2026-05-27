import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mail, Smartphone, Lock, User as UserIcon, MapPin, KeyRound,
  ShieldCheck, ArrowRight, ShieldAlert, RefreshCw, Sparkles, Check, CheckCircle2, ChevronRight, Globe
} from 'lucide-react';
import { User, LanguageConfig } from '../types';
import { LANGUAGES } from '../translations';
import { Translate } from './Translate';

interface AuthWallProps {
  onAuthSuccess: (user: User) => void;
  darkMode: boolean;
  selectedLanguage: LanguageConfig;
  setSelectedLanguage: (lang: LanguageConfig) => void;
  t: (key: string) => string;
}

export default function AuthWall({
  onAuthSuccess,
  darkMode,
  selectedLanguage,
  setSelectedLanguage,
  t
}: AuthWallProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'buyer' | 'seller' | 'owner'>('buyer');
  const [registerCountry, setRegisterCountry] = useState('ZA');
  const [password, setPassword] = useState('');
  
  // OTP States
  const [otpDelivery, setOtpDelivery] = useState<'sms' | 'email'>('email');
  const [step, setStep] = useState<'credentials' | 'otp'>('credentials');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState<string[]>(Array(6).fill(''));
  const [otpError, setOtpError] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [showRealDoc, setShowRealDoc] = useState(false);
  const [simDocType, setSimDocType] = useState<'sms' | 'email'>('email');

  // Input refs for OTP fields
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Pre-configured simulation users
  const PRESET_USERS = [
    { name: 'Standard Buyer', email: 'mapstore2026@gmail.com', phone: '+1 (555) 781-9021', role: 'buyer' as const },
    { name: 'Mission Organics Seller', email: 'seller@missionorganics.com', phone: '+1 (555) 923-4410', role: 'seller' as const },
  ];

  // Auto-fill presets
  const handleApplyPreset = (preset: { name: string; email: string; phone: string; role: 'buyer' | 'seller' | 'owner' }) => {
    setEmail(preset.email);
    setPhone(preset.phone);
    setFullName(preset.name);
    setRole(preset.role);
    setPassword('mapstore2026');
  };

  // Generate OTP
  const triggerOtpGeneration = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setOtpError('');
    setEnteredOtp(Array(6).fill(''));
    setSimDocType(otpDelivery);
    setShowRealDoc(true);
    setStep('otp');
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLogin && !fullName) {
      setOtpError('Please fill out all fields.');
      return;
    }
    if (otpDelivery === 'email' && !email) {
      setOtpError('Please specify your registered email.');
      return;
    }
    if (otpDelivery === 'sms' && !phone) {
      setOtpError('Please specify a mobile text number.');
      return;
    }
    triggerOtpGeneration();
  };

  const handleResendOtp = () => {
    setIsResending(true);
    setTimeout(() => {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(code);
      setEnteredOtp(Array(6).fill(''));
      setOtpError('');
      setIsResending(false);
      setSimDocType(otpDelivery);
      setShowRealDoc(true);
    }, 1000);
  };

  // Handle individual input changes
  const handleOtpChange = (value: string, index: number) => {
    if (isNaN(Number(value))) return;
    const nextCodeList = [...enteredOtp];
    nextCodeList[index] = value.substring(value.length - 1);
    setEnteredOtp(nextCodeList);

    // Focus next element if filled
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace key press
  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !enteredOtp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  // Verify OTP Code
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const finalCode = enteredOtp.join('');
    if (finalCode === generatedOtp) {
      // Create user context
      const authenticatedUser: User = {
        id: isLogin ? (email.includes('seller') ? 'sell-alpha' : 'user-standard') : `user-${Date.now()}`,
        name: isLogin ? (fullName || 'MapStore Active User') : fullName,
        email: email || 'mapstore2026@gmail.com',
        role: role,
        wishlist: [],
        preferredCategories: ['Electronics', 'Local Organic Food'],
        purchaseHistory: []
      };

      // Add Seller profile parameters if user registered as a seller
      if (role === 'seller') {
        authenticatedUser.sellerProfile = {
          storeName: isLogin ? `${authenticatedUser.name} Local Goods` : `${fullName}'s Sourced Curations`,
          storeAddress: '777 Market St, San Francisco, CA 94103', // Default physical address
          verified: false,
          verificationStatus: 'idle',
          agreedToTerms: true,
          rating: 5.0,
          ratingCount: 1,
          prohibitedCheck: true,
          storeCountry: registerCountry
        };
      }

      onAuthSuccess(authenticatedUser);
    } else {
      setOtpError('The secure confirmation code is invalid or has expired. Please try again.');
    }
  };

  return (
    <Translate langId={selectedLanguage.id}>
      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 font-sans" id="auth-wall-container">
      {/* 1. Brand visual sidebar */}
      <div className="lg:col-span-5 bg-gradient-to-br from-zinc-950 via-zinc-900 to-[#121c18] border-r border-[#5eead4]/15 flex flex-col justify-between p-8 relative overflow-hidden">
        {/* Background geometry */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#5eead4]/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex items-center gap-3">
          <div className="bg-[#5eead4]/10 border border-[#5eead4]/30 p-2.5 rounded-2xl flex items-center justify-center">
            <MapPin className="w-6 h-6 text-[#5eead4] animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-tight uppercase">MapStore</h1>
            <p className="text-[10px] tracking-widest text-emerald-400 font-bold uppercase">Slogan: "Reaching you"</p>
          </div>
        </div>

        <div className="my-auto py-12 space-y-6 relative z-10">
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#5eead4] font-extrabold bg-[#5eead4]/10 px-3 py-1 rounded-full border border-[#5eead4]/20 inline-block">
            AUTHENTICATED SECURE LOGISTICS
          </span>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-white leading-tight">
            Global delivery grids, protected by <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5eead4] to-[#4ade80]">Instant OTP Lock</span>.
          </h2>
          <p className="text-sm text-zinc-400 leading-relaxed max-w-md">
            Enter physical coordinates or verify your store address. Instantly receive secondary confirmation keys via real SMS text packets or encrypted mail servers.
          </p>

          <div className="pt-4 space-y-3 font-medium text-xs text-zinc-350">
            <div className="flex items-center gap-2.5 text-zinc-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Flat 7% platform sale commission processing</span>
            </div>
            <div className="flex items-center gap-2.5 text-zinc-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Real Real-time GPS Delivery Tracking</span>
            </div>
            <div className="flex items-center gap-2.5 text-zinc-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Secure marketplace verification</span>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-zinc-900 flex justify-between items-center text-[11px] text-zinc-500 font-mono">
          <span>SECURE LOGIN</span>
          <span></span>
        </div>
      </div>

      {/* 2. Interactive Input Center */}
      <div className="lg:col-span-7 bg-zinc-50 dark:bg-zinc-950 p-6 lg:p-12 flex flex-col justify-center relative">
        <div className="max-w-md w-full mx-auto space-y-6">

          {/* Quick Language Selector Bar for easier navigation */}
          <div className="flex items-center justify-between p-3 bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-805 rounded-2xl shadow-xs">
            <span className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-gray-500 py-1 pl-1 flex items-center gap-1.5 font-sans">
              <Globe className="w-4 h-4 text-emerald-400" />
              {t('language')}
            </span>
            <div className="flex gap-1 overflow-x-auto max-w-[280px] scrollbar-none py-0.5">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => setSelectedLanguage(lang)}
                  type="button"
                  className={`px-2.5 py-1 text-[10px] font-extrabold rounded-lg border cursor-pointer transition-all flex items-center gap-0.5 duration-100 shrink-0 ${
                    selectedLanguage.id === lang.id
                      ? 'bg-emerald-500 border-emerald-500 text-white'
                      : 'bg-zinc-50 dark:bg-zinc-950 border-gray-200 dark:border-zinc-805 text-zinc-500 dark:text-zinc-400 hover:text-gray-950'
                  }`}
                >
                  <span>{lang.flag}</span>
                  <span>{lang.name}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Preset cheatsheet panel to ease testing */}
          <div className="bg-emerald-500/10 dark:bg-zinc-900 border border-emerald-400/20 dark:border-zinc-800 p-4 rounded-3xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-400">
              <Sparkles className="w-4 h-4" />
              <span>Account Access (Click to Auto-fill)</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {PRESET_USERS.map((user, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    handleApplyPreset(user);
                    setIsLogin(true);
                  }}
                  className="bg-white hover:bg-zinc-100 dark:bg-zinc-950 dark:hover:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-[10px] py-1.5 px-2.5 rounded-xl font-bold transition-all text-left block cursor-pointer text-gray-700 dark:text-zinc-300 shadow-sm"
                >
                  📥 {user.name} ({user.role})
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {step === 'credentials' ? (
              <motion.div
                key="credentials"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-6"
                id="auth-credentials-screen"
              >
                {/* Header and selector toggles */}
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-zinc-900 dark:text-white">
                    {isLogin ? t('welcome_title') : 'Register Store or Buyer profile'}
                  </h3>
                  <p className="text-xs text-zinc-500">
                    {isLogin
                      ? t('welcome_desc')
                      : 'Create your 2FA protected profile to browse or list local coordinate inventories.'
                    }
                  </p>
                </div>

                {/* Tabs */}
                <div className="flex bg-gray-200/60 dark:bg-zinc-900 p-1 rounded-2xl border border-gray-150 dark:border-zinc-805">
                  <button
                    onClick={() => { setIsLogin(true); setOtpError(''); }}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                      isLogin
                        ? 'bg-white text-zinc-900 dark:bg-zinc-950 dark:text-white shadow-sm'
                        : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-350'
                    }`}
                  >
                    Account Sign In
                  </button>
                  <button
                    onClick={() => { setIsLogin(false); setOtpError(''); }}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                      !isLogin
                        ? 'bg-white text-zinc-900 dark:bg-zinc-950 dark:text-white shadow-sm'
                        : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-355'
                    }`}
                  >
                    Create Account
                  </button>
                </div>

                <form onSubmit={handleSendOtp} className="space-y-4">
                  {!isLogin && (
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">Full Legal Name</label>
                      <div className="relative">
                        <UserIcon className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          placeholder="e.g. Mary Jane"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl pl-10 pr-4 py-3 text-xs text-zinc-850 dark:text-white"
                        />
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">Email Address</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          required={otpDelivery === 'email'}
                          placeholder="mary@mapstore.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl pl-10 pr-4 py-3 text-xs text-zinc-850 dark:text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">Phone Number (SMS)</label>
                      <div className="relative">
                        <Smartphone className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required={otpDelivery === 'sms'}
                          placeholder="+1 (555) 000-0000"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl pl-10 pr-4 py-3 text-xs text-zinc-850 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {!isLogin && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">Desired Platform Role</label>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => setRole('buyer')}
                            className={`p-3.5 border rounded-2xl text-xs font-bold transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                              role === 'buyer'
                                ? 'border-[#22c55e] bg-emerald-500/10 text-zinc-900 dark:text-white'
                                : 'border-gray-200 bg-white dark:bg-zinc-900 dark:border-zinc-800 text-zinc-500'
                            }`}
                          >
                            <span className="text-lg">🛒</span>
                            <span>Browse / Buyer</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setRole('seller')}
                            className={`p-3.5 border rounded-2xl text-xs font-bold transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                              role === 'seller'
                                ? 'border-[#22c55e] bg-emerald-500/10 text-zinc-900 dark:text-white'
                                : 'border-gray-200 bg-white dark:bg-zinc-900 dark:border-zinc-805 text-zinc-500'
                            }`}
                          >
                            <span className="text-lg">📦</span>
                            <span>Vendor / Seller</span>
                          </button>
                        </div>
                      </div>

                      {role === 'seller' && (
                        <div className="p-3 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-gray-150 dark:border-zinc-850 space-y-2">
                          <label className="block text-[10px] font-extrabold uppercase tracking-wider text-[#5eead4] dark:text-[#4ade80]">🌍 Business / Fulfillment Country</label>
                          <select
                            value={registerCountry}
                            onChange={(e) => setRegisterCountry(e.target.value)}
                            className="w-full bg-white dark:bg-zinc-900 border border-gray-250 dark:border-zinc-800 rounded-xl p-2.5 text-xs text-gray-805 dark:text-white font-sans font-bold focus:outline-hidden"
                          >
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
                          <span className="text-[9px] text-gray-400 block leading-tight">Configures default store hubs, shipping corridor clearance, and primary dispatcher rates.</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">Secure Password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        required
                        placeholder="••••••••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl pl-10 pr-4 py-3 text-xs text-zinc-850 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* OTP delivery mechanism */}
                  <div className="pt-3 border-t border-gray-200/50 dark:border-zinc-900 space-y-3">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400">Choose 2FA OTP Delivery Coordinates</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setOtpDelivery('email')}
                        className={`p-3 border rounded-xl text-left font-sans flex items-center gap-2.5 transition-all text-xs cursor-pointer ${
                          otpDelivery === 'email'
                            ? 'border-[#3bd1a8] bg-emerald-500/5 text-[#30b58e] dark:text-[#5eead4] font-bold'
                            : 'border-gray-200 dark:border-zinc-850 bg-white dark:bg-zinc-905 text-zinc-500'
                        }`}
                      >
                        <Mail className="w-4 h-4" />
                        <div>
                          <p className="leading-none">Send by Email</p>
                          <p className="text-[9px] text-zinc-400 font-normal mt-0.5">Secure Mail Servers</p>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setOtpDelivery('sms')}
                        className={`p-3 border rounded-xl text-left font-sans flex items-center gap-2.5 transition-all text-xs cursor-pointer ${
                          otpDelivery === 'sms'
                            ? 'border-[#3bd1a8] bg-emerald-500/5 text-[#30b58e] dark:text-[#5eead4] font-bold'
                            : 'border-gray-200 dark:border-zinc-850 bg-white dark:bg-zinc-905 text-zinc-500'
                        }`}
                      >
                        <Smartphone className="w-4 h-4" />
                        <div>
                          <p className="leading-none">Send by Text</p>
                          <p className="text-[9px] text-zinc-400 font-normal mt-0.5">Mobile carriers</p>
                        </div>
                      </button>
                    </div>
                  </div>

                  {otpError && (
                    <div className="p-3 bg-rose-500/10 border border-rose-400/20 text-rose-500 text-xs rounded-xl flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 shrink-0" />
                      <span>{otpError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-[#10b981] hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-2xl text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md mt-6"
                    id="btn-trigger-otp"
                  >
                    <span>Request One-Time verification code</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="otp"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-6"
                id="auth-verification-screen"
              >
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#5eead4] font-extrabold bg-[#5eead4]/10 px-3 py-1 rounded-full border border-[#5eead4]/20 inline-block mb-1">
                    Verify Verification Code (OTP)
                  </span>
                  <h3 className="text-2xl font-black text-zinc-900 dark:text-white">Enter Security Token</h3>
                  <p className="text-xs text-zinc-500 leading-relaxed">
                    We've real sending a 6-digit confirmation key to your{' '}
                    <strong className="text-zinc-850 dark:text-zinc-300">
                      {otpDelivery === 'email' ? (email || 'the email address') : (phone || 'the phone listed')}
                    </strong>
                    . It is displayed in the simulator overlay below!
                  </p>
                </div>

                <form onSubmit={handleVerifyOtp} className="space-y-6">
                  {/* Verification entries */}
                  <div className="flex justify-between gap-2.5">
                    {enteredOtp.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => { otpRefs.current[idx] = el; }}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(e.target.value, idx)}
                        onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                        className="w-12 h-14 text-center bg-white dark:bg-zinc-900 border border-gray-250 dark:border-zinc-800 rounded-xl text-xl font-bold font-mono text-zinc-900 dark:text-white focus:border-[#10b981] focus:ring-1 focus:ring-[#10b981] transition-all"
                        id={`otp-input-${idx}`}
                      />
                    ))}
                  </div>

                  {otpError && (
                    <div className="p-3.5 bg-rose-500/10 border border-rose-400/20 text-rose-500 text-xs rounded-xl flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 shrink-0" />
                      <span>{otpError}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setStep('credentials');
                        setOtpError('');
                      }}
                      className="text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-200 underline"
                    >
                      Change coordinates / method
                    </button>

                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={isResending}
                      className="text-[#10b981] hover:underline font-bold flex items-center gap-1 cursor-pointer disabled:text-zinc-500"
                    >
                      <RefreshCw className={`w-3 h-3 ${isResending ? 'animate-spin' : ''}`} />
                      <span>{isResending ? 'Re-sending...' : 'Request new code'}</span>
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#10b981] hover:bg-emerald-600 text-white font-bold py-3.5 px-4 rounded-2xl text-xs transition-colors cursor-pointer text-center flex items-center justify-center gap-2"
                  >
                    <ShieldCheck className="w-4.5 h-4.5" />
                    <span>Authorize device and sign in</span>
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Interactive Real Device Carrier Viewport Overlay */}
          <AnimatePresence>
            {showRealDoc && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 border border-emerald-400/30 dark:border-zinc-800 bg-white dark:bg-zinc-90 w-full rounded-3xl overflow-hidden shadow-xl"
                id="real-device-container"
              >
                {/* Header of Device Carrier screen */}
                <div className="bg-zinc-950 px-4 py-2.5 text-[10px] text-zinc-400 font-mono tracking-tighter flex justify-between items-center border-b border-zinc-900">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block"></span>
                    SIMULATOR: Inbound 2FA Stream
                  </span>
                  <div className="flex gap-2">
                    <span>9:41 AM</span>
                    <button
                      onClick={() => setShowRealDoc(false)}
                      className="text-zinc-500 hover:text-rose-500 font-bold px-1"
                    >
                      Hide
                    </button>
                  </div>
                </div>

                {/* Real Content Body */}
                {simDocType === 'sms' ? (
                  // SMS smartphone view mock
                  <div className="bg-zinc-100 p-5 font-sans space-y-4">
                    <div className="flex items-center justify-center gap-1.5 pb-2 border-b border-zinc-200">
                      <div className="w-6 h-6 rounded-full bg-neutral-800 flex items-center justify-center text-[10px] text-white font-extrabold pb-0.5">M</div>
                      <span className="text-[11px] font-bold text-gray-700">MapStore Ledger (+1 888)</span>
                    </div>

                    <div className="space-y-2">
                      <div className="bg-[#10b981] text-white p-3.5 rounded-2xl rounded-tl-none font-medium text-[11px] max-w-xs shadow-xs space-y-1">
                        <p>🔒 <strong>MapStore OTP Lock Security Alert</strong></p>
                        <p>Your instant account 2FA approval security passcode token is:</p>
                        <p className="font-mono text-center text-sm font-extrabold tracking-widest bg-black/20 py-2 rounded-xl mt-1.5 select-all border border-white/20">
                          {generatedOtp}
                        </p>
                        <p className="text-[9px] text-emerald-100">Valid for 5 minutes. Slogan: "Reaching you"</p>
                      </div>
                      <span className="text-[8px] text-gray-400 font-mono block pl-1">Delivered via local cellular broadcast</span>
                    </div>
                  </div>
                ) : (
                  // Email inbox container mock
                  <div className="bg-white p-5 font-sans border-t border-zinc-100 dark:bg-zinc-950 dark:border-neutral-900">
                    <div className="pb-3 border-b border-gray-100 dark:border-zinc-850 space-y-1">
                      <p className="text-xs text-gray-500 font-mono">
                        <strong className="text-zinc-800 dark:text-zinc-200">From:</strong> compliance@mapstore.com
                      </p>
                      <p className="text-xs text-gray-500 font-mono">
                        <strong className="text-zinc-800 dark:text-zinc-200">To:</strong> {email || 'mapstore2026@gmail.com'}
                      </p>
                      <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                        Subject: Urgent Secure One-Time Passcode Request (OTP)
                      </p>
                    </div>

                    <div className="py-4 space-y-3.5 text-xs text-gray-750 dark:text-zinc-350">
                      <div className="flex items-center gap-1.5 text-emerald-500 font-bold">
                        <ShieldCheck className="w-5 h-5" />
                        <span>MAPSTORE COMPLIANCE DELEGATES</span>
                      </div>
                      <p className="text-[11px] leading-relaxed">
                        To continue log-in or registral authorization bounds for <strong>{fullName || 'MapStore Member'}</strong>, input the following temporary security credentials under the active active session:
                      </p>

                      <div className="bg-zinc-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-4 rounded-2xl text-center space-y-1">
                        <span className="text-[9px] uppercase tracking-wider font-bold text-gray-400 block">Encrypted Security Token</span>
                        <h4 className="font-mono text-xl font-black text-gray-900 dark:text-emerald-400 tracking-widest select-all">
                          {generatedOtp}
                        </h4>
                        <p className="text-[9px] text-gray-400">If you did not issue this 2FA request, please inspect security coordinates.</p>
                      </div>

                      <div className="text-[10px] text-zinc-400 text-center italic">
                        "Reaching you" — Authorized Logistics and Secure Map Inventories.
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
    </Translate>
  );
}
