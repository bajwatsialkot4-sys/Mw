import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  onSnapshot, 
  updateDoc, 
  doc, 
  query, 
  orderBy, 
  setDoc,
  Firestore,
  getDocs
} from 'firebase/firestore';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  Auth,
  User
} from 'firebase/auth';
import { Order, OrderStatus, Product } from './types';
import { INITIAL_PRODUCTS } from './data/initialProducts';

/**
 * FIREBASE CONFIGURATION
 * Place your Firebase Project credentials below or via Vite environment variables.
 */
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "YOUR_API_KEY_HERE",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "mw-cosmetics-pk.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "mw-cosmetics-pk",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "mw-cosmetics-pk.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789012",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789012:web:abcdef123456"
};

// Check if actual configuration has been provided
export const isFirebaseConfigured = (): boolean => {
  return (
    Boolean(firebaseConfig.apiKey) && 
    firebaseConfig.apiKey !== "YOUR_API_KEY_HERE" &&
    !firebaseConfig.apiKey.includes("YOUR_")
  );
};

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;
let googleProvider: GoogleAuthProvider | null = null;

if (typeof window !== 'undefined') {
  try {
    if (isFirebaseConfigured()) {
      app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
      db = getFirestore(app);
      auth = getAuth(app);
      googleProvider = new GoogleAuthProvider();
      googleProvider.setCustomParameters({ prompt: 'select_account' });
    }
  } catch (err) {
    console.warn('[MW Cosmetics] Firebase initialization deferred:', err);
  }
}

export { app, db, auth, googleProvider };

// Local fallback keys for ultra-fast performance & resilience
const LOCAL_STORAGE_ORDERS_KEY = 'mw_cosmetics_orders_v1';
const LOCAL_STORAGE_PRODUCTS_KEY = 'mw_cosmetics_products_v1';

// Seed sample orders if none exist so admin has instant data to visualize
const SAMPLE_INITIAL_ORDERS: Order[] = [
  {
    id: 'ord_sample_101',
    orderNumber: 'MW-98241',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    timestamp: Date.now() - 3600000 * 5,
    items: [
      {
        productId: 'mw-prod-1',
        productName: 'Premium Glass Skin Face Wash',
        price: 2199,
        quantity: 2,
        image: 'https://res.cloudinary.com/dsaydvr5t/image/upload/v1789710759/1d2c9b02-6847-4fba-a0e9-ea3708bd83f6_pm25ji.jpg'
      },
      {
        productId: 'mw-prod-2',
        productName: 'Oil Control Glow Serum',
        price: 2499,
        quantity: 1,
        image: 'https://res.cloudinary.com/dsaydvr5t/image/upload/v1789710762/5893d5a3-db8e-4b71-9c6c-300bf9b59880_gs8wmh.jpg'
      }
    ],
    totalAmount: 6897,
    shippingFee: 0,
    shippingDetails: {
      fullName: 'Ayesha Khan',
      phone: '0300-8472911',
      city: 'Lahore',
      address: 'House 42-B, Sector Z, Phase 5 DHA',
      landmark: 'Near Jalal Sons Market',
      notes: 'Please call before ring bell.'
    },
    paymentMethod: 'Cash on Delivery (COD)',
    status: 'Pending',
    courier: 'TCS Express'
  },
  {
    id: 'ord_sample_102',
    orderNumber: 'MW-98240',
    createdAt: new Date(Date.now() - 3600000 * 22).toISOString(),
    timestamp: Date.now() - 3600000 * 22,
    items: [
      {
        productId: 'mw-prod-3',
        productName: 'Glaze Glow Gel Moisturizer',
        price: 2799,
        quantity: 1,
        image: 'https://res.cloudinary.com/dsaydvr5t/image/upload/v1789710760/95f1fff5-677d-44c5-8663-9402316a1401_nnacci.jpg'
      }
    ],
    totalAmount: 2799,
    shippingFee: 0,
    shippingDetails: {
      fullName: 'Zainab Fatima',
      phone: '0321-4920188',
      city: 'Karachi',
      address: 'Flat 402, Al-Razi Heights, Clifton Block 2',
      landmark: 'Opposite Bilawal House',
      notes: 'Leave with reception if not home.'
    },
    paymentMethod: 'Cash on Delivery (COD)',
    status: 'Shipped',
    trackingNumber: 'LEO-9948201',
    courier: 'Leopards Courier'
  }
];

// Helper to get local orders
export const getLocalOrders = (): Order[] => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_ORDERS_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_ORDERS_KEY, JSON.stringify(SAMPLE_INITIAL_ORDERS));
      return SAMPLE_INITIAL_ORDERS;
    }
    return JSON.parse(raw);
  } catch (err) {
    return SAMPLE_INITIAL_ORDERS;
  }
};

// Helper to get local products
export const getLocalProducts = (): Product[] => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_PRODUCTS_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_PRODUCTS_KEY, JSON.stringify(INITIAL_PRODUCTS));
      return INITIAL_PRODUCTS;
    }
    return JSON.parse(raw);
  } catch (err) {
    return INITIAL_PRODUCTS;
  }
};

// Save a brand new order to Firestore (with seamless local fallback)
export const saveOrderToDatabase = async (orderData: Omit<Order, 'id'>): Promise<Order> => {
  const generatedId = 'ord_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now();
  const fullOrder: Order = {
    ...orderData,
    id: generatedId,
  };

  // Always update local cache & broadcast immediately for zero-latency UI
  try {
    const currentOrders = getLocalOrders();
    const updated = [fullOrder, ...currentOrders];
    localStorage.setItem(LOCAL_STORAGE_ORDERS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('mw-new-order', { detail: fullOrder }));
  } catch (err) {
    console.error('Local cache error:', err);
  }

  // If live Firestore is configured, write to 'orders' collection
  if (db && isFirebaseConfigured()) {
    try {
      const ordersRef = collection(db, 'orders');
      const docRef = await addDoc(ordersRef, {
        ...fullOrder,
        createdAtServer: new Date()
      });
      fullOrder.id = docRef.id;
    } catch (firebaseErr) {
      console.warn('[Firestore] Could not sync order to cloud Firestore; stored locally.', firebaseErr);
    }
  }

  return fullOrder;
};

// Subscribe to real-time orders (Firestore onSnapshot + window events)
export const subscribeToOrders = (onOrdersChanged: (orders: Order[]) => void): (() => void) => {
  let unsubFirestore: (() => void) | null = null;

  // Initial read from local
  onOrdersChanged(getLocalOrders());

  // Listen to local events across tabs or local checkout triggers
  const handleLocalUpdate = (e: Event) => {
    onOrdersChanged(getLocalOrders());
  };
  window.addEventListener('storage', handleLocalUpdate);
  window.addEventListener('mw-new-order', handleLocalUpdate);
  window.addEventListener('mw-orders-updated', handleLocalUpdate);

  // If real Firestore is active, hook onSnapshot
  if (db && isFirebaseConfigured()) {
    try {
      const ordersQuery = query(collection(db, 'orders'), orderBy('timestamp', 'desc'));
      unsubFirestore = onSnapshot(ordersQuery, (snapshot) => {
        const firestoreOrders: Order[] = [];
        snapshot.forEach((docSnap) => {
          firestoreOrders.push({ id: docSnap.id, ...(docSnap.data() as Omit<Order, 'id'>) });
        });
        if (firestoreOrders.length > 0) {
          // Merge with any local offline orders
          const localOnly = getLocalOrders().filter(
            (loc) => !firestoreOrders.some((f) => f.orderNumber === loc.orderNumber)
          );
          const combined = [...firestoreOrders, ...localOnly].sort((a, b) => b.timestamp - a.timestamp);
          onOrdersChanged(combined);
          localStorage.setItem(LOCAL_STORAGE_ORDERS_KEY, JSON.stringify(combined));
        }
      }, (err) => {
        console.warn('[Firestore] Realtime order listener error:', err);
      });
    } catch (err) {
      console.warn('[Firestore] Snapshot setup failed:', err);
    }
  }

  return () => {
    window.removeEventListener('storage', handleLocalUpdate);
    window.removeEventListener('mw-new-order', handleLocalUpdate);
    window.removeEventListener('mw-orders-updated', handleLocalUpdate);
    if (unsubFirestore) {
      unsubFirestore();
    }
  };
};

// Update order status in Database
export const updateOrderStatusInDb = async (orderId: string, newStatus: OrderStatus): Promise<void> => {
  const currentOrders = getLocalOrders();
  const updatedOrders = currentOrders.map((ord) => 
    ord.id === orderId ? { ...ord, status: newStatus } : ord
  );
  localStorage.setItem(LOCAL_STORAGE_ORDERS_KEY, JSON.stringify(updatedOrders));
  window.dispatchEvent(new CustomEvent('mw-orders-updated'));

  if (db && isFirebaseConfigured()) {
    try {
      const orderDocRef = doc(db, 'orders', orderId);
      await updateDoc(orderDocRef, { status: newStatus, updatedAt: new Date().toISOString() });
    } catch (err) {
      console.warn('[Firestore] Order status cloud sync error:', err);
    }
  }
};

// Update products catalog in Database
export const saveProductsToDb = async (products: Product[]): Promise<void> => {
  localStorage.setItem(LOCAL_STORAGE_PRODUCTS_KEY, JSON.stringify(products));
  window.dispatchEvent(new CustomEvent('mw-products-updated'));

  if (db && isFirebaseConfigured()) {
    try {
      for (const prod of products) {
        await setDoc(doc(db, 'products', prod.id), prod, { merge: true });
      }
    } catch (err) {
      console.warn('[Firestore] Products cloud sync error:', err);
    }
  }
};

// Subscribe to products changes
export const subscribeToProducts = (onProductsChanged: (products: Product[]) => void): (() => void) => {
  onProductsChanged(getLocalProducts());

  const handleUpdate = () => {
    onProductsChanged(getLocalProducts());
  };
  window.addEventListener('storage', handleUpdate);
  window.addEventListener('mw-products-updated', handleUpdate);

  let unsub: (() => void) | null = null;
  if (db && isFirebaseConfigured()) {
    try {
      unsub = onSnapshot(collection(db, 'products'), (snapshot) => {
        if (!snapshot.empty) {
          const prods: Product[] = [];
          snapshot.forEach((d) => prods.push(d.data() as Product));
          if (prods.length > 0) {
            localStorage.setItem(LOCAL_STORAGE_PRODUCTS_KEY, JSON.stringify(prods));
            onProductsChanged(prods);
          }
        }
      });
    } catch (e) {
      // ignore
    }
  }

  return () => {
    window.removeEventListener('storage', handleUpdate);
    window.removeEventListener('mw-products-updated', handleUpdate);
    if (unsub) unsub();
  };
};

// Dual-Authentication Firebase Google Sign-In helper
export const signInWithGoogle = async (): Promise<{ email: string; displayName: string; photoURL?: string }> => {
  if (auth && googleProvider && isFirebaseConfigured()) {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    return {
      email: user.email || 'salmanali000001122@gmail.com',
      displayName: user.displayName || 'Authorized Admin',
      photoURL: user.photoURL || undefined
    };
  }

  // Simulated Google Auth provider if Firebase keys are placeholders
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        email: 'salmanali000001122@gmail.com',
        displayName: 'Salman Ali (MW Admin)',
        photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
      });
    }, 400);
  });
};

export const signOutGoogle = async (): Promise<void> => {
  if (auth && isFirebaseConfigured()) {
    await firebaseSignOut(auth);
  }
};
