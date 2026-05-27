import React from 'react';
import { BookOpen, ShieldAlert, HeartHandshake, ArrowLeft } from 'lucide-react';
import { Translate } from './Translate';

interface ToSAndPrivacyProps {
  onBack: () => void;
  langId?: string;
}

export default function ToSAndPrivacy({ onBack, langId = 'en' }: ToSAndPrivacyProps) {
  return (
    <Translate langId={langId}>
      <div className="max-w-4xl mx-auto px-4 py-8 font-sans" id="tos-privacy-container">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-emerald-500 transition-colors mb-6 cursor-pointer"
        id="btn-back-from-legal"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Store
      </button>

      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Legal Agreements</h1>
        <p className="text-gray-500 dark:text-gray-400">MapStore Platform Policies, Slogan: "Reaching you"</p>
      </div>

      <div className="space-y-8">
        {/* Section 1: Terms of Service */}
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-xs">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-6 h-6 text-emerald-500" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">1. Terms of Service & Seller Agreement</h2>
          </div>
          <div className="space-y-4 text-sm text-gray-600 dark:text-zinc-300 leading-relaxed">
            <p>
              Thank you for choosing <strong>MapStore</strong> (slogan: "Reaching you"), a dedicated local marketplace connecting consumers with regional sellers. By using this service, you agree to comply with our general platform policies.
            </p>
            <h3 className="font-semibold text-gray-900 dark:text-white mt-2">A. Platform Commission Structures</h3>
            <p>
              MapStore charges a flat commission of <strong>7%</strong> on every item sold. Comission rates are calculated in real-time and deducted at checkout. The remaining 93% of sales revenue is distributed to the verified seller's secure wallet or bank account. Listing products is completely free of charge.
            </p>
            <h3 className="font-semibold text-gray-900 dark:text-white mt-2">B. Seller Registration & Security Verification</h3>
            <p>
              To maintain absolute transparency and trust, all sellers are strictly required to request selling access and complete our verification workflow. This requires successfully scanning a valid national Identity Document (ID / Passport) and uploading an official utilities document or bank statement as Proof of Address. Verification undergoes secure review and completes within <strong>24 hours</strong>.
            </p>
            <h3 className="font-semibold text-gray-900 dark:text-white mt-2">C. Representation of Listings</h3>
            <p>
              Sellers must supply honest, accurate, and completely verified details (descriptions, specifications, stock levels, and precise geographical coordinates). Creating misleading or falsely advertised listings is ground for immediate, permanent account suspension.
            </p>
          </div>
        </div>

        {/* Section 2: Prohibited Items Policy */}
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-xs">
          <div className="flex items-center gap-3 mb-4">
            <ShieldAlert className="w-6 h-6 text-red-500" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white text-rose-500">2. Prohibited Items Policy</h2>
          </div>
          <div className="text-sm text-gray-600 dark:text-zinc-300 space-y-3 leading-relaxed">
            <p>
              MapStore maintains zero tolerance for prohibited or illegal items. Sellers must agree not to post any items containing:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-zinc-300">
              <li>Alcohol, tobacco, and vaping materials.</li>
              <li>Unauthorized prescription medication, drugs, or drug paraphernalia.</li>
              <li>Weapons, explosives, hazardous chemicals, or safety hazards of any nature.</li>
              <li>Counterfeit merchandise, pirated software, or intellectual property violations.</li>
              <li>Misrepresented organic foods or items without sanitation assurance.</li>
            </ul>
            <p className="mt-2 text-xs text-rose-500 dark:text-rose-400 font-semibold italic">
              Violators of the Prohibited Items Policy will be banned immediately, and all pending sales revenue will be legally frozen for verification.
            </p>
          </div>
        </div>

        {/* Section 3: Privacy & Security */}
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-xs">
          <div className="flex items-center gap-3 mb-4">
            <HeartHandshake className="w-6 h-6 text-cyan-500" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">3. Consumer Privacy Policy</h2>
          </div>
          <div className="space-y-3 text-sm text-gray-600 dark:text-zinc-300 leading-relaxed">
            <p>
              Your security and trust are the foundation of "Reaching you". MapStore protects all sensitive documents (scanned IDs, bank cards, bank details, and geographic street locations) using modern industry-grade secure data structures.
            </p>
            <p>
              We never sell or distribute your private search history, wishlist items, or transactional patterns. Driver coordinate sharing is active exclusively while an active in-transit shipping operation is occurring, and is permanently deleted upon successful order delivery.
            </p>
          </div>
        </div>
      </div>

      <div className="text-center mt-10">
        <p className="text-xs text-gray-400 dark:text-gray-500">
          Last revised: May 21, 2026. MapStore operations reserve all rights.
        </p>
      </div>
    </div>
    </Translate>
  );
}
