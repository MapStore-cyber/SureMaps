/**
 * MapStore Types and Interfaces
 */

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'buyer' | 'seller' | 'owner';
  wishlist: string[]; // List of product IDs
  preferredCategories: string[];
  purchaseHistory: string[]; // List of product IDs purchased
  // Seller-specific details
  sellerProfile?: {
    storeName: string;
    storeAddress?: string; // Physical seller location for shipping label pasting
    verified: boolean;
    verificationStatus: 'idle' | 'submitted' | 'approved' | 'rejected';
    verificationSubmittedAt?: string;
    idDocumentName?: string;
    proofOfAddressName?: string;
    agreedToTerms: boolean;
    rating: number;
    ratingCount: number;
    prohibitedCheck: boolean;
    storeCountry?: string; // e.g., 'ZA', 'CN', 'US', 'GB', 'JP' etc.
  };
}

export interface Review {
  id: string;
  productId: string;
  reviewerName: string;
  reviewerEmail: string;
  rating: number; // 1-5
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number; // for showing discounts
  category: string;
  imageUrl: string;
  images?: string[];
  stock: number;
  sellerId: string;
  sellerName: string;
  rating: number; // calculated from reviews
  ratingCount: number;
  latitude: number; // coordinates for local MapStore interactive map (used as Length)
  longitude: number; // used as Width
  height?: number; // product height in cm
  videoUrl?: string; // live demonstration or show video
  verified: boolean; // items must be verified compliance check
  verifiedAt?: string;
  tags?: string[];
  originRegion?: string; // The country code in uppercase like 'ZA', 'US', etc.
  shippedGlobally?: boolean; // True if the product can be shipped globally
}

export interface OrderItem {
  productId: string;
  productTitle: string;
  price: number;
  quantity: number;
  sellerId: string;
  sellerName: string;
  commissionAmount: number; // 7% commission for the platform
  netSellerAmount: number; // 93% net earning
}

export interface TrackingStep {
  status: 'pending' | 'payment_secured' | 'processing' | 'shipped' | 'out_for_delivery' | 'delivered';
  label: string;
  date: string;
  active: boolean;
  description: string;
}

export interface Order {
  id: string;
  buyerEmail: string;
  buyerName: string;
  items: OrderItem[];
  totalPrice: number;
  commissionTotal: number; // platform portion (7%)
  status: 'pending' | 'payment_secured' | 'processing' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'return_initiated';
  trackingSteps: TrackingStep[];
  timestamp: string;
  createdAt?: string;
  deliveredAt?: string;
  returnInitiated?: boolean;
  returnInitiatedAt?: string;
  realHourOffset?: number;
  shippingAddress: {
    fullName: string;
    streetAddress: string;
    city: string;
    postalCode: string;
    phone: string;
  };
  paymentType: 'card' | 'wallet';
  // real delivery driver coordinates
  driverLocation?: {
    latitude: number;
    longitude: number;
  };
}

export interface PushNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'order' | 'listing' | 'system' | 'chat';
  orderId?: string;
  productId?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'model';
  text: string;
  timestamp: string;
}

export interface P2PChatMessage {
  id: string;
  senderId: string; // e.g., user.id or 'sell-alpha'
  senderName: string;
  originalText: string;
  translatedText?: string;
  detectedLanguage?: string;
  timestamp: string;
  isOffer?: boolean;
  offerPrice?: number;
  offerStatus?: 'pending' | 'accepted' | 'declined';
}

export interface P2PChatThread {
  id: string; // e.g., `${buyerId}-${sellerId}-${productId}`
  productId: string;
  productTitle: string;
  productPrice: number;
  productImageUrl?: string;
  sellerId: string;
  sellerName: string;
  buyerId: string;
  buyerName: string;
  messages: P2PChatMessage[];
  lastMessageText: string;
  lastMessageTimestamp: string;
  unreadByBuyer: boolean;
  unreadBySeller: boolean;
}

export interface RegionConfig {
  id: string;
  name: string;
  flag: string;
  currencyCode: string;
  currencySymbol: string;
  exchangeRate: number;
}

export interface LanguageConfig {
  id: string;
  name: string;
  flag: string;
}


