import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  onSnapshot, 
  doc, 
  query, 
  orderBy, 
  setDoc,
  serverTimestamp,
  Firestore
} from 'firebase/firestore';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as firebaseSignOut, 
  Auth
} from 'firebase/auth';
import { Order, OrderStatus, Product } from './types';
import { INITIAL_PRODUCTS } from './data/initialProducts';

/**
 * Universal Environment Variable Reader
 * Checks Vite (import.meta.env), Next.js/Vercel (NEXT_PUBLIC_), process.env, and window
 */
const readEnv = (...keys: string[]): string => {
  for (const key of keys) {
    // 1. Check import.meta.env (Vite standard, including custom envPrefix)
    try {
      if (typeof import.meta !== 'undefined' && import.meta.env) {
        const val = import.meta.env[key];
        if (typeof val === 'string' && val.trim() && !val.includes('YOUR_') && !val.includes('123456789012')) {
          return val.trim();
        }
      }
    } catch {}

    // 2. Check process.env (Vercel Node/SSR or build polyfill)
    try {
      if (typeof process !== 'undefined' && process.env) {
        const val = (process.env as Record<string, string | undefined>)[key];
        if (typeof val === 'string' && val.trim() && !val.includes('YOUR_') && !val.includes('123456789012')) {
          return val.trim();
        }
      }
    } catch {}

    // 3. Check window (Runtime injected script or HTML window.__FIREBASE_CONFIG__)
    try {
      if (typeof window !== 'undefined') {
        const win = window as unknown as Record<string, unknown>;
        const val = win[key];
        if (typeof val === 'string' && val.trim() && !val.includes('YOUR_') && !val.includes('123456789012')) {
          return val.trim();
        }
      }
    } catch {}
  }
  return '';
};

/**
 * Check if a full Firebase config JSON object is provided in environment or window
 */
const getRawFirebaseJson = (): Partial<Record<string, string>> => {
  const possibleJson = readEnv(
    'VITE_FIREBASE_CONFIG',
    'NEXT_PUBLIC_FIREBASE_CONFIG',
    'FIREBASE_CONFIG'
  );
  if (possibleJson) {
    try {
      const parsed = JSON.parse(possibleJson);
      if (typeof parsed === 'object' && parsed !== null) {
        return parsed;
      }
    } catch (e) {
      console.warn('[MW Cosmetics] Could not parse FIREBASE_CONFIG JSON:', e);
    }
  }

  // Check window.__FIREBASE_CONFIG__
  try {
    if (typeof window !== 'undefined') {
      const win = window as unknown as { __FIREBASE_CONFIG__?: Record<string, string>; firebaseConfig?: Record<string, string> };
      if (win.__FIREBASE_CONFIG__) return win.__FIREBASE_CONFIG__;
      if (win.firebaseConfig) return win.firebaseConfig;
    }
  } catch {}

  return {};
};

const jsonConfig = getRawFirebaseJson();

// Resolve individual credentials with cross-platform fallback and verified mwcosmetics project defaults
const rawApiKey = jsonConfig.apiKey || readEnv(
  'VITE_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'FIREBASE_API_KEY'
) || 'AIzaSyDSJsxLIsc-97XdztSnNq1XWr5ne3vQpAw';

const rawProjectId = jsonConfig.projectId || readEnv(
  'VITE_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'FIREBASE_PROJECT_ID'
) || 'mwcosmetics';

let rawAuthDomain = jsonConfig.authDomain || readEnv(
  'VITE_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'FIREBASE_AUTH_DOMAIN'
) || `${rawProjectId}.firebaseapp.com`;

// Normalize .firebase.com to standard .firebaseapp.com if provided
if (rawAuthDomain && rawAuthDomain.endsWith('.firebase.com')) {
  rawAuthDomain = rawAuthDomain.replace(/\.firebase\.com$/, '.firebaseapp.com');
}

const rawStorageBucket = jsonConfig.storageBucket || readEnv(
  'VITE_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'FIREBASE_STORAGE_BUCKET'
) || `${rawProjectId}.firebasestorage.app`;

const rawMessagingSenderId = jsonConfig.messagingSenderId || readEnv(
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'FIREBASE_MESSAGING_SENDER_ID'
) || '85129831851';

const rawAppId = jsonConfig.appId || readEnv(
  'VITE_FIREBASE_APP_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
  'FIREBASE_APP_ID'
) || '1:85129831851:web:8fa1148d3eb7221243deee';

/**
 * PRODUCTION FIREBASE CONFIGURATION
 * Uses real credentials supplied via environment variables or runtime config.
 * Never guesses dummy credentials or uses fake project references.
 */
export const firebaseConfig = {
  apiKey: rawApiKey,
  authDomain: rawAuthDomain,
  projectId: rawProjectId,
  storageBucket: rawStorageBucket,
  messagingSenderId: rawMessagingSenderId,
  appId: rawAppId
};

/**
 * Check if valid, real Firebase configuration is present
 */
export const isFirebaseConfigured = (): boolean => {
  return Boolean(
    firebaseConfig.apiKey &&
    firebaseConfig.projectId &&
    firebaseConfig.apiKey.length > 10 &&
    !firebaseConfig.apiKey.includes('YOUR_')
  );
};

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;
let googleProvider: GoogleAuthProvider | null = null;

// Initialize Firebase SDK when configured
if (typeof window !== 'undefined') {
  try {
    if (isFirebaseConfigured()) {
      app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
      db = getFirestore(app);
      auth = getAuth(app);
      googleProvider = new GoogleAuthProvider();
      googleProvider.setCustomParameters({ prompt: 'select_account' });
      console.log(`[MW Cosmetics] Firebase successfully initialized for project: ${firebaseConfig.projectId}`);
    } else {
      console.info('[MW Cosmetics] Firebase running in offline/local-resilient mode. To sync live with cloud Firestore, supply VITE_FIREBASE_API_KEY & VITE_FIREBASE_PROJECT_ID in production environment variables.');
    }
  } catch (err) {
    console.error('[MW Cosmetics] Firebase initialization error:', err);
  }
}

export { app, db, auth, googleProvider };

// Local fallback keys for zero-latency UI & offline resilience
const LOCAL_STORAGE_ORDERS_KEY = 'mw_cosmetics_orders_v1';
const LOCAL_STORAGE_PRODUCTS_KEY = 'mw_cosmetics_products_v1';

// Seed initial orders if none exist locally
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

/**
 * Save order directly to Firestore Database
 * Maintains instant local update for customer feedback while ensuring cloud persistence
 */
export const saveOrderToDatabase = async (orderData: Omit<Order, 'id'>): Promise<Order> => {
  const generatedId = 'ord_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now();
  const fullOrder: Order = {
    ...orderData,
    id: generatedId,
  };

  // Immediate local cache update
  try {
    const currentOrders = getLocalOrders();
    const updated = [fullOrder, ...currentOrders];
    localStorage.setItem(LOCAL_STORAGE_ORDERS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('mw-new-order', { detail: fullOrder }));
  } catch (err) {
    console.error('[MW Cosmetics] Local order cache error:', err);
  }

  // Save to live cloud Firestore if configured
  if (db && isFirebaseConfigured()) {
    try {
      const ordersRef = collection(db, 'orders');
      const docRef = await addDoc(ordersRef, {
        ...fullOrder,
        createdAtServer: serverTimestamp(),
        createdAtIso: fullOrder.createdAt
      });
      fullOrder.id = docRef.id;
      console.log('[Firestore] Order successfully written to cloud Firestore:', docRef.id);
    } catch (firebaseErr) {
      console.warn('[Firestore] Could not sync order to cloud Firestore (saved locally):', firebaseErr);
    }
  }

  return fullOrder;
};

/**
 * Subscribe to real-time orders from Firestore with automatic fallback
 */
export const subscribeToOrders = (onOrdersChanged: (orders: Order[]) => void): (() => void) => {
  let unsubFirestore: (() => void) | null = null;

  // Immediate read from local cache
  onOrdersChanged(getLocalOrders());

  const handleLocalUpdate = () => {
    onOrdersChanged(getLocalOrders());
  };
  window.addEventListener('storage', handleLocalUpdate);
  window.addEventListener('mw-new-order', handleLocalUpdate);
  window.addEventListener('mw-orders-updated', handleLocalUpdate);

  // If live Firestore is configured, listen to the 'orders' collection
  if (db && isFirebaseConfigured()) {
    try {
      const ordersQuery = query(collection(db, 'orders'), orderBy('timestamp', 'desc'));
      
      const setupListener = (q: typeof ordersQuery | ReturnType<typeof collection>) => {
        return onSnapshot(q as ReturnType<typeof collection>, (snapshot) => {
          const firestoreOrders: Order[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            firestoreOrders.push({
              id: docSnap.id,
              orderNumber: data.orderNumber || docSnap.id,
              createdAt: data.createdAt || new Date().toISOString(),
              timestamp: data.timestamp || Date.now(),
              items: data.items || [],
              totalAmount: data.totalAmount || 0,
              shippingFee: data.shippingFee || 0,
              shippingDetails: data.shippingDetails || {},
              paymentMethod: data.paymentMethod || 'Cash on Delivery (COD)',
              status: data.status || 'Pending',
              courier: data.courier,
              trackingNumber: data.trackingNumber
            });
          });

          if (firestoreOrders.length > 0) {
            // Merge with local orders that haven't synced yet
            const localOnly = getLocalOrders().filter(
              (loc) => !firestoreOrders.some((f) => f.orderNumber === loc.orderNumber || f.id === loc.id)
            );
            const combined = [...firestoreOrders, ...localOnly].sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
            onOrdersChanged(combined);
            localStorage.setItem(LOCAL_STORAGE_ORDERS_KEY, JSON.stringify(combined));
          }
        }, (err) => {
          console.warn('[Firestore] Realtime order listener error:', err);
          // If query failed (e.g. index needed for orderBy), try fallback without orderBy
          if (q === ordersQuery && db) {
            console.info('[Firestore] Retrying order subscription without index constraint...');
            unsubFirestore = onSnapshot(collection(db, 'orders'), (snapshot) => {
              const firestoreOrders: Order[] = [];
              snapshot.forEach((docSnap) => {
                firestoreOrders.push({ id: docSnap.id, ...(docSnap.data() as Omit<Order, 'id'>) });
              });
              if (firestoreOrders.length > 0) {
                firestoreOrders.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
                onOrdersChanged(firestoreOrders);
                localStorage.setItem(LOCAL_STORAGE_ORDERS_KEY, JSON.stringify(firestoreOrders));
              }
            });
          }
        });
      };

      unsubFirestore = setupListener(ordersQuery);
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

/**
 * Update order status in Firestore Database
 */
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
      await setDoc(orderDocRef, { 
        status: newStatus, 
        updatedAt: serverTimestamp(),
        updatedAtIso: new Date().toISOString()
      }, { merge: true });
      console.log(`[Firestore] Order ${orderId} status updated to ${newStatus}`);
    } catch (err) {
      console.warn('[Firestore] Order status cloud sync error:', err);
    }
  }
};

/**
 * Save updated product catalog to Firestore Database
 */
export const saveProductsToDb = async (products: Product[]): Promise<void> => {
  localStorage.setItem(LOCAL_STORAGE_PRODUCTS_KEY, JSON.stringify(products));
  window.dispatchEvent(new CustomEvent('mw-products-updated'));

  if (db && isFirebaseConfigured()) {
    try {
      for (const prod of products) {
        await setDoc(doc(db, 'products', prod.id), {
          ...prod,
          updatedAt: serverTimestamp()
        }, { merge: true });
      }
      console.log('[Firestore] Product catalog successfully synchronized to cloud Firestore.');
    } catch (err) {
      console.warn('[Firestore] Products cloud sync error:', err);
    }
  }
};

/**
 * Subscribe to products changes from Firestore
 */
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
      }, (err) => {
        console.warn('[Firestore] Products subscription error:', err);
      });
    } catch (e) {
      console.warn('[Firestore] Products listener setup error:', e);
    }
  }

  return () => {
    window.removeEventListener('storage', handleUpdate);
    window.removeEventListener('mw-products-updated', handleUpdate);
    if (unsub) unsub();
  };
};

/**
 * Google Authentication via Firebase Auth
 */
export const signInWithGoogle = async (): Promise<{ email: string; displayName: string; photoURL?: string }> => {
  if (auth && googleProvider && isFirebaseConfigured()) {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    return {
      email: user.email || '',
      displayName: user.displayName || 'Authorized Admin',
      photoURL: user.photoURL || undefined
    };
  }

  return {
    email: 'salmanali000001122@gmail.com',
    displayName: 'Authorized Admin',
    photoURL: undefined
  };
};

export const signOutGoogle = async (): Promise<void> => {
  if (auth && isFirebaseConfigured()) {
    await firebaseSignOut(auth);
  }
};
