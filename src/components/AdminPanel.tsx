import React, { useState, useEffect, useRef } from 'react';
import { 
  Lock, 
  ShieldCheck, 
  Key, 
  Mail, 
  LogOut, 
  Bell, 
  Volume2, 
  VolumeX, 
  Package, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  Truck, 
  AlertCircle, 
  Search, 
  Filter, 
  Plus, 
  Edit3, 
  Save, 
  Trash2, 
  Printer, 
  Download, 
  Eye, 
  X,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { Order, OrderStatus, Product } from '../types';
import { BRAND_ASSETS, PAKISTAN_CITIES } from '../data/initialProducts';
import { 
  signInWithGoogle, 
  signOutGoogle, 
  updateOrderStatusInDb, 
  saveProductsToDb 
} from '../firebase';
import { playOrderNotificationSound } from '../utils/audio';

interface AdminPanelProps {
  orders: Order[];
  products: Product[];
  onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  orders,
  products,
  onClose
}) => {
  // Dual Auth State
  const [googleUser, setGoogleUser] = useState<{ email: string; displayName: string; photoURL?: string } | null>(null);
  const [passcode, setPasscode] = useState('');
  const [passcodeVerified, setPasscodeVerified] = useState(false);
  const [authError, setAuthError] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);

  // Active Admin View: 'orders' | 'inventory' | 'analytics'
  const [activeTab, setActiveTab] = useState<'orders' | 'inventory'>('orders');

  // Filters
  const [searchOrder, setSearchOrder] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [cityFilter, setCityFilter] = useState<string>('all');

  // Audio Alerts
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [recentOrderAlert, setRecentOrderAlert] = useState<Order | null>(null);
  const prevOrdersCountRef = useRef(orders.length);

  // Product Inventory Editing State
  const [inventoryList, setInventoryList] = useState<Product[]>(products);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(false);
  const [newProductForm, setNewProductForm] = useState<Partial<Product>>({
    name: '',
    tagline: '',
    price: 2499,
    originalPrice: 2999,
    image: '',
    category: 'Skincare',
    description: '',
    volume: '50 ml',
    inStock: true,
  });

  // Sync products when external prop changes
  useEffect(() => {
    setInventoryList(products);
  }, [products]);

  // Audio & Visual notification when a new order arrives
  useEffect(() => {
    if (orders.length > prevOrdersCountRef.current && prevOrdersCountRef.current > 0) {
      const newest = orders[0];
      setRecentOrderAlert(newest);

      if (soundEnabled) {
        playOrderNotificationSound();
      }

      const timer = setTimeout(() => {
        setRecentOrderAlert(null);
      }, 8000);
      return () => clearTimeout(timer);
    }
    prevOrdersCountRef.current = orders.length;
  }, [orders, soundEnabled]);

  // Step 1: Handle Google Sign In
  const handleGoogleAuth = async () => {
    try {
      setIsSigningIn(true);
      setAuthError('');
      const user = await signInWithGoogle();
      setGoogleUser(user);
    } catch (err: any) {
      setAuthError(err.message || 'Google Authentication failed. Please retry.');
    } finally {
      setIsSigningIn(false);
    }
  };

  // Step 2: Handle 10-Character Passcode Verification ("Pak#9842@M")
  const handleVerifyPasscode = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (passcode.trim() === BRAND_ASSETS.adminPasscode) {
      setPasscodeVerified(true);
      // Play brief chime upon authorized entrance
      if (soundEnabled) playOrderNotificationSound();
    } else {
      setAuthError(`Invalid 10-character Passcode. Access Denied.`);
    }
  };

  const handleLogout = async () => {
    await signOutGoogle();
    setGoogleUser(null);
    setPasscodeVerified(false);
    setPasscode('');
  };

  // Change Order Status
  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    await updateOrderStatusInDb(orderId, newStatus);
  };

  // Product Inventory updates
  const handleSaveProductEdit = async () => {
    if (!editingProduct) return;
    const updated = inventoryList.map(p => p.id === editingProduct.id ? editingProduct : p);
    setInventoryList(updated);
    await saveProductsToDb(updated);
    setEditingProduct(null);
  };

  const handleCreateNewProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductForm.name || !newProductForm.price || !newProductForm.image) {
      alert('Please fill out product title, price, and image URL.');
      return;
    }

    const created: Product = {
      id: 'mw-prod-' + Date.now(),
      name: newProductForm.name!,
      tagline: newProductForm.tagline || 'MW Luxury Skincare Formula',
      price: Number(newProductForm.price),
      originalPrice: Number(newProductForm.originalPrice || newProductForm.price),
      image: newProductForm.image!,
      category: newProductForm.category || 'Skincare',
      rating: 5.0,
      reviewCount: 1,
      description: newProductForm.description || 'Luxurious Pakistani skincare treatment formulated for radiant glass glow.',
      volume: newProductForm.volume || '50 ml',
      benefits: ['Promotes glass skin luminosity', 'Dermatologically tested'],
      ingredients: 'Purified Water, Botanical Extracts, Multi-vitamins, Gold Mica.',
      howToUse: 'Apply gently onto cleansed face. Use AM & PM.',
      inStock: newProductForm.inStock ?? true,
      isBestSeller: false,
    };

    const updated = [created, ...inventoryList];
    setInventoryList(updated);
    await saveProductsToDb(updated);
    setIsNewProductModalOpen(false);
    setNewProductForm({
      name: '',
      tagline: '',
      price: 2499,
      originalPrice: 2999,
      image: '',
      category: 'Skincare',
      description: '',
      volume: '50 ml',
      inStock: true,
    });
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Are you sure you want to remove this product from the live catalog?')) {
      const updated = inventoryList.filter(p => p.id !== id);
      setInventoryList(updated);
      await saveProductsToDb(updated);
    }
  };

  // Export orders to CSV
  const handleExportCSV = () => {
    const headers = ['Order Number', 'Date', 'Customer Name', 'Phone', 'City', 'Address', 'Landmark', 'Items', 'Total Amount', 'Status'];
    const rows = orders.map(o => [
      o.orderNumber,
      new Date(o.createdAt).toLocaleString(),
      `"${o.shippingDetails.fullName}"`,
      `"${o.shippingDetails.phone}"`,
      `"${o.shippingDetails.city}"`,
      `"${o.shippingDetails.address.replace(/"/g, '""')}"`,
      `"${o.shippingDetails.landmark.replace(/"/g, '""')}"`,
      `"${o.items.map(i => `${i.productName} (x${i.quantity})`).join(', ')}"`,
      o.totalAmount,
      o.status
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `MW_Cosmetics_Orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered Orders
  const filteredOrders = orders.filter((o) => {
    const matchesSearch = 
      o.orderNumber.toLowerCase().includes(searchOrder.toLowerCase()) ||
      o.shippingDetails.fullName.toLowerCase().includes(searchOrder.toLowerCase()) ||
      o.shippingDetails.phone.includes(searchOrder) ||
      o.shippingDetails.city.toLowerCase().includes(searchOrder.toLowerCase());

    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    const matchesCity = cityFilter === 'all' || o.shippingDetails.city === cityFilter;

    return matchesSearch && matchesStatus && matchesCity;
  });

  // KPI calculations
  const totalRevenue = orders.reduce((sum, o) => o.status !== 'Cancelled' ? sum + o.totalAmount : sum, 0);
  const pendingOrdersCount = orders.filter(o => o.status === 'Pending').length;
  const deliveredCount = orders.filter(o => o.status === 'Delivered').length;
  const avgOrderValue = orders.length > 0 ? Math.round(totalRevenue / (orders.length || 1)) : 0;

  // Render Gate 1 & 2: Dual Authentication Screen
  if (!googleUser || !passcodeVerified) {
    return (
      <div className="fixed inset-0 z-50 bg-[#1F1417]/95 backdrop-blur-md flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-[#D4AF37]/50 animate-in zoom-in-95">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#2A1418] via-[#3B1C22] to-[#2A1418] p-6 text-white text-center relative border-b border-[#D4AF37]/30">
            <button
              type="button"
              onClick={onClose}
              aria-label="Close portal"
              className="absolute top-4 right-4 p-1.5 rounded-full text-[#E8C2B9] hover:text-white bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#FFF3B0] text-[#2A1418] flex items-center justify-center shadow-lg mb-2">
              <Lock className="w-7 h-7" />
            </div>
            <h2 className="font-serif-luxury text-2xl font-bold">
              MW Admin Terminal
            </h2>
            <p className="text-xs text-[#E8C2B9] mt-1 tracking-wider uppercase">
              Dual-Authentication Security Protocol
            </p>
          </div>

          <div className="p-6 space-y-5">
            {authError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            {/* Stage 1: Google Authorized Sign-In */}
            <div className={`p-4 rounded-2xl border transition-all ${googleUser ? 'bg-[#F0FFF4] border-[#9AE6B4]' : 'bg-[#FFF8F7] border-[#F2D6D0]'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#4A2E33] flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-[#8B263E] text-white flex items-center justify-center text-[10px]">1</span>
                  Gmail Authorized Sign-In
                </span>
                {googleUser && (
                  <span className="text-xs text-[#2E7D32] font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                  </span>
                )}
              </div>

              {googleUser ? (
                <div className="flex items-center gap-2.5 pt-1">
                  <div className="w-8 h-8 rounded-full bg-[#3B1C22] text-[#FFF3B0] font-bold flex items-center justify-center text-xs">
                    {googleUser.displayName.charAt(0)}
                  </div>
                  <div className="text-xs truncate">
                    <p className="font-bold text-[#2D1B1E] truncate">{googleUser.displayName}</p>
                    <p className="text-[#7A585F] text-[11px] truncate">{googleUser.email}</p>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-xs text-[#7A585F] mb-3">
                    Authenticate your identity via Firebase Google sign-in credentials.
                  </p>
                  <button
                    type="button"
                    onClick={handleGoogleAuth}
                    disabled={isSigningIn}
                    className="w-full py-2.5 px-4 bg-white hover:bg-gray-50 border border-[#D4AF37] rounded-xl text-xs font-bold text-[#2D1B1E] flex items-center justify-center gap-2 shadow-xs transition-all active:scale-98 cursor-pointer"
                  >
                    <Mail className="w-4 h-4 text-[#D4AF37]" />
                    <span>{isSigningIn ? 'Connecting...' : 'Sign in with Google (Firebase Auth)'}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Stage 2: 10-Character Passcode Access */}
            <div className={`p-4 rounded-2xl border transition-all ${!googleUser ? 'opacity-40 pointer-events-none bg-gray-50 border-gray-200' : 'bg-[#FFF8F7] border-[#F2D6D0]'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#4A2E33] flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-[#8B263E] text-white flex items-center justify-center text-[10px]">2</span>
                  10-Character Passcode Access
                </span>
                <span className="text-[10px] text-[#8C646B] font-mono">10 Characters</span>
              </div>

              <form onSubmit={handleVerifyPasscode} className="space-y-3">
                <div className="relative">
                  <Key className="absolute left-3 top-3 w-4 h-4 text-[#9A7077]" />
                  <input
                    type="password"
                    placeholder="Enter security passcode"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    maxLength={10}
                    className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#F2D6D0] rounded-xl text-xs font-mono tracking-widest text-[#2D1B1E] focus:outline-hidden focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20"
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#8C646B] px-1">
                  <span>Passcode: <code className="bg-gray-100 px-1.5 py-0.5 rounded text-[#8B263E] font-bold">Pak#9842@M</code></span>
                  <span>{passcode.length}/10</span>
                </div>

                <button
                  type="submit"
                  disabled={!googleUser || passcode.length === 0}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#8B263E] to-[#591424] hover:from-[#A02C48] hover:to-[#6E192D] transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-[#FFF3B0]" />
                  <span>Verify Passcode & Enter Admin Panel</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Full Admin Panel View
  return (
    <div className="fixed inset-0 z-50 bg-[#FBF8F8] overflow-y-auto">
      {/* Top Admin Bar */}
      <header className="sticky top-0 z-30 bg-[#2D161A] text-white border-b border-[#D4AF37]/40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={BRAND_ASSETS.logo}
              alt="MW Logo"
              className="w-9 h-9 rounded-full border border-[#D4AF37] object-cover"
            />
            <div>
              <h1 className="font-serif-luxury text-base sm:text-lg font-bold flex items-center gap-2">
                <span>MW Cosmetics</span>
                <span className="text-[10px] uppercase font-mono tracking-widest bg-[#D4AF37] text-[#2D161A] font-bold px-2 py-0.5 rounded-full">
                  Admin v2.4
                </span>
              </h1>
              <p className="text-[10px] text-[#E8C2B9] hidden sm:block">
                Real-Time Pakistani Orders & Cloud Database Management
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            {/* Audio Toggle */}
            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? 'Mute Order Chime' : 'Enable Order Chime'}
              className={`p-2 rounded-xl flex items-center gap-1.5 transition-colors border ${
                soundEnabled 
                  ? 'bg-[#3B1C22] text-[#FFF3B0] border-[#D4AF37]/50' 
                  : 'bg-white/10 text-gray-400 border-white/10'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-[#D4AF37]" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden md:inline">{soundEnabled ? 'Audio Chime ON' : 'Audio Muted'}</span>
            </button>

            {/* User Profile */}
            <div className="hidden lg:flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="truncate max-w-[140px] text-[#FFF3B0] font-medium">
                {googleUser.displayName}
              </span>
            </div>

            {/* Logout */}
            <button
              type="button"
              onClick={handleLogout}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-red-900/40 hover:bg-red-900/70 text-red-200 border border-red-700/50 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>

            {/* Close Admin View */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Exit admin view"
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Real-Time Audio-Visual Order Alert Toast */}
        {recentOrderAlert && (
          <div className="bg-gradient-to-r from-[#D4AF37] via-[#FFF3B0] to-[#E8CA65] text-[#2D161A] py-2 px-4 text-xs font-bold flex items-center justify-between animate-bounce shadow-lg">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#8B263E] animate-ping" />
              <span>
                🔔 NEW COD ORDER RECEIVED! Order #{recentOrderAlert.orderNumber} from {recentOrderAlert.shippingDetails.city} — Rs. {recentOrderAlert.totalAmount.toLocaleString()}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setRecentOrderAlert(null)}
              className="text-[#2D161A] hover:opacity-70 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* KPI Dashboard Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white p-4 rounded-2xl border border-[#F2D6D0] shadow-xs">
            <div className="flex items-center justify-between text-xs text-[#8C646B] mb-1">
              <span>Gross COD Revenue</span>
              <TrendingUp className="w-4 h-4 text-[#2E7D32]" />
            </div>
            <p className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#2D1B1E]">
              Rs. {totalRevenue.toLocaleString()}
            </p>
            <p className="text-[10px] text-[#2E7D32] mt-0.5">Nationwide COD volume</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#F2D6D0] shadow-xs">
            <div className="flex items-center justify-between text-xs text-[#8C646B] mb-1">
              <span>Total Orders</span>
              <Package className="w-4 h-4 text-[#8B263E]" />
            </div>
            <p className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#2D1B1E]">
              {orders.length}
            </p>
            <p className="text-[10px] text-[#8C646B] mt-0.5">{deliveredCount} parcels delivered</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#F2D6D0] shadow-xs">
            <div className="flex items-center justify-between text-xs text-[#8C646B] mb-1">
              <span>Pending Dispatch</span>
              <Clock className="w-4 h-4 text-[#D4AF37]" />
            </div>
            <p className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#D4AF37]">
              {pendingOrdersCount}
            </p>
            <p className="text-[10px] text-[#8C646B] mt-0.5">Requires 3-4 day booking</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#F2D6D0] shadow-xs">
            <div className="flex items-center justify-between text-xs text-[#8C646B] mb-1">
              <span>Avg. Basket Value</span>
              <Sparkles className="w-4 h-4 text-[#B8860B]" />
            </div>
            <p className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#2D1B1E]">
              Rs. {avgOrderValue.toLocaleString()}
            </p>
            <p className="text-[10px] text-[#8C646B] mt-0.5">Average PKR per checkout</p>
          </div>
        </div>

        {/* Tab Navigation: Orders vs Inventory */}
        <div className="flex items-center justify-between border-b border-[#F2D6D0] pb-2">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('orders')}
              className={`py-2 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-[#3B1C22] text-[#FFF3B0] shadow-xs'
                  : 'bg-white text-[#523A3E] hover:bg-[#FFF2F0]'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Real-Time Orders ({orders.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('inventory')}
              className={`py-2 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'inventory'
                  ? 'bg-[#3B1C22] text-[#FFF3B0] shadow-xs'
                  : 'bg-white text-[#523A3E] hover:bg-[#FFF2F0]'
              }`}
            >
              <Edit3 className="w-4 h-4" />
              <span>Product Inventory ({inventoryList.length})</span>
            </button>
          </div>

          {activeTab === 'orders' ? (
            <button
              type="button"
              onClick={handleExportCSV}
              className="py-2 px-3 rounded-xl bg-white hover:bg-[#FFF8F7] border border-[#F2D6D0] text-xs font-semibold text-[#4A2E33] flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#8B263E]" />
              <span className="hidden sm:inline">Export Courier CSV</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsNewProductModalOpen(true)}
              className="py-2 px-3.5 rounded-xl bg-[#8B263E] hover:bg-[#A02C48] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#FFF3B0]" />
              <span>Add New Product</span>
            </button>
          )}
        </div>

        {/* TAB 1: Real-Time Orders Table */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {/* Search & Filter Bar */}
            <div className="bg-white p-3.5 rounded-2xl border border-[#F2D6D0] flex flex-wrap gap-2.5 items-center justify-between">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Filter by Order ID, customer, phone (03XX), or city..."
                  value={searchOrder}
                  onChange={(e) => setSearchOrder(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-[#FFFDFD] border border-[#F2D6D0] rounded-xl text-xs text-[#2D1B1E] focus:outline-hidden focus:border-[#D4AF37]"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 bg-[#FFFDFD] border border-[#F2D6D0] rounded-xl text-xs text-[#2D1B1E] focus:outline-hidden cursor-pointer"
                >
                  <option value="all">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>

                <select
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                  className="px-3 py-2 bg-[#FFFDFD] border border-[#F2D6D0] rounded-xl text-xs text-[#2D1B1E] focus:outline-hidden cursor-pointer"
                >
                  <option value="all">All Cities</option>
                  {PAKISTAN_CITIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-2xl border border-[#F2D6D0] overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#FFF8F7] text-[#4A2E33] border-b border-[#F2D6D0] uppercase tracking-wider text-[11px] font-bold">
                      <th className="py-3.5 px-4">Order ID & Date</th>
                      <th className="py-3.5 px-4">Customer Details</th>
                      <th className="py-3.5 px-4">Delivery Address & Landmark</th>
                      <th className="py-3.5 px-4">Items & Quantities</th>
                      <th className="py-3.5 px-4">Total Amount</th>
                      <th className="py-3.5 px-4">Status Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F2D6D0]">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-gray-500">
                          <Package className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                          <p className="font-semibold text-sm">No orders found</p>
                          <p className="text-xs text-gray-400">Try adjusting your search or filters.</p>
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((order) => {
                        const statusColors: Record<OrderStatus, string> = {
                          Pending: 'bg-amber-100 text-amber-800 border-amber-300',
                          Confirmed: 'bg-blue-100 text-blue-800 border-blue-300',
                          Shipped: 'bg-purple-100 text-purple-800 border-purple-300',
                          Delivered: 'bg-emerald-100 text-emerald-800 border-emerald-300',
                          Cancelled: 'bg-rose-100 text-rose-800 border-rose-300',
                        };

                        return (
                          <tr key={order.id} className="hover:bg-[#FFFDFD] transition-colors">
                            {/* Order ID & Date */}
                            <td className="py-4 px-4 align-top">
                              <span className="font-mono font-bold text-sm text-[#8B263E] block">
                                #{order.orderNumber}
                              </span>
                              <span className="text-[11px] text-[#8C646B] block mt-0.5">
                                {new Date(order.createdAt).toLocaleDateString('en-PK', {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                              <span className="inline-block mt-1 text-[10px] bg-gray-100 px-1.5 py-0.2 rounded text-gray-600">
                                COD
                              </span>
                            </td>

                            {/* Customer */}
                            <td className="py-4 px-4 align-top">
                              <p className="font-bold text-[#2D1B1E] text-sm">
                                {order.shippingDetails.fullName}
                              </p>
                              <a 
                                href={`tel:${order.shippingDetails.phone}`} 
                                className="text-xs font-semibold text-[#8B263E] hover:underline flex items-center gap-1 mt-0.5"
                              >
                                🇵🇰 {order.shippingDetails.phone}
                              </a>
                              {order.shippingDetails.alternatePhone && (
                                <p className="text-[10px] text-gray-500">
                                  Alt: {order.shippingDetails.alternatePhone}
                                </p>
                              )}
                            </td>

                            {/* Address & Landmark */}
                            <td className="py-4 px-4 align-top max-w-xs">
                              <span className="font-bold text-[#2D1B1E] block text-xs">
                                📍 {order.shippingDetails.city}
                              </span>
                              <p className="text-[#523A3E] text-[11px] line-clamp-2 mt-0.5">
                                {order.shippingDetails.address}
                              </p>
                              <p className="text-[11px] text-[#8B263E] mt-1 font-medium bg-[#FFF5F3] px-2 py-0.5 rounded-md inline-block">
                                Landmark: {order.shippingDetails.landmark}
                              </p>
                              {order.shippingDetails.notes && (
                                <p className="text-[10px] text-gray-500 italic mt-0.5">
                                  Note: {order.shippingDetails.notes}
                                </p>
                              )}
                            </td>

                            {/* Items */}
                            <td className="py-4 px-4 align-top">
                              <div className="space-y-1">
                                {order.items.map((item, i) => (
                                  <div key={i} className="flex items-center gap-1.5 text-[11px]">
                                    <span className="font-bold text-[#8B263E] bg-[#FFF2F0] px-1.5 py-0.2 rounded-md">
                                      {item.quantity}×
                                    </span>
                                    <span className="font-medium text-[#2D1B1E] truncate max-w-[150px]">
                                      {item.productName}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </td>

                            {/* Total Amount */}
                            <td className="py-4 px-4 align-top">
                              <span className="font-serif-luxury font-bold text-sm text-[#2D1B1E] block">
                                Rs. {order.totalAmount.toLocaleString()}
                              </span>
                              <span className="text-[10px] text-emerald-600 font-semibold block">
                                Free Shipping
                              </span>
                            </td>

                            {/* Status Selector */}
                            <td className="py-4 px-4 align-top">
                              <select
                                value={order.status}
                                onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                                className={`text-xs font-bold py-1.5 px-2.5 rounded-xl border cursor-pointer focus:outline-hidden ${statusColors[order.status]}`}
                              >
                                <option value="Pending">Pending</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Product Inventory Management */}
        {activeTab === 'inventory' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {inventoryList.map((product) => (
                <div 
                  key={product.id}
                  className="bg-white rounded-2xl border border-[#F2D6D0] p-4 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="relative aspect-video rounded-xl overflow-hidden mb-3 bg-gray-50 border border-[#F2D6D0]">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2 right-2 bg-white/90 backdrop-blur-xs text-[10px] font-bold px-2 py-0.5 rounded-full text-[#8B263E]">
                        {product.category}
                      </span>
                    </div>

                    <h3 className="font-serif-luxury font-bold text-base text-[#2D1B1E]">
                      {product.name}
                    </h3>
                    <p className="text-xs text-[#8C646B] line-clamp-1 mt-0.5">
                      {product.tagline}
                    </p>

                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="font-bold text-base text-[#2D1B1E]">
                        Rs. {product.price.toLocaleString()}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs text-gray-400 line-through">
                          Rs. {product.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-[#F2D6D0] flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingProduct(product)}
                      className="flex-1 py-1.5 px-3 bg-[#FFF2F0] hover:bg-[#FFE5E0] text-[#8B263E] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Item</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteProduct(product.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 rounded-xl hover:bg-red-50 transition-colors"
                      title="Delete Product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#D4AF37] space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-serif-luxury text-lg font-bold text-[#2D1B1E]">
                Update Product Information
              </h3>
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="text-gray-400 hover:text-black p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#4A2E33] uppercase mb-1">Product Title</label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-[#4A2E33] uppercase mb-1">Tagline</label>
                <input
                  type="text"
                  value={editingProduct.tagline}
                  onChange={(e) => setEditingProduct({ ...editingProduct, tagline: e.target.value })}
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#4A2E33] uppercase mb-1">Price in PKR</label>
                  <input
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#4A2E33] uppercase mb-1">Original Price (Strike)</label>
                  <input
                    type="number"
                    value={editingProduct.originalPrice || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, originalPrice: Number(e.target.value) })}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#4A2E33] uppercase mb-1">Image URL</label>
                <input
                  type="text"
                  value={editingProduct.image}
                  onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                  className="w-full p-2.5 border rounded-xl font-mono text-[11px]"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t">
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="flex-1 py-2 rounded-xl border text-xs font-semibold text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveProductEdit}
                className="flex-1 py-2 rounded-xl bg-[#8B263E] text-white text-xs font-bold hover:bg-[#A02C48] flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Save className="w-4 h-4 text-[#FFF3B0]" />
                <span>Save Changes to Database</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Product Modal */}
      {isNewProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleCreateNewProduct} className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#D4AF37] space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-serif-luxury text-lg font-bold text-[#2D1B1E]">
                Add New Product to MW Cosmetics Catalog
              </h3>
              <button
                type="button"
                onClick={() => setIsNewProductModalOpen(false)}
                className="text-gray-400 hover:text-black p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#4A2E33] uppercase mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 24K Gold Radiant Beauty Elixir"
                  value={newProductForm.name}
                  onChange={(e) => setNewProductForm({ ...newProductForm, name: e.target.value })}
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-[#4A2E33] uppercase mb-1">Tagline</label>
                <input
                  type="text"
                  placeholder="e.g. Infused with pure saffron & gold dust"
                  value={newProductForm.tagline}
                  onChange={(e) => setNewProductForm({ ...newProductForm, tagline: e.target.value })}
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#4A2E33] uppercase mb-1">Price (PKR) *</label>
                  <input
                    type="number"
                    required
                    placeholder="2499"
                    value={newProductForm.price}
                    onChange={(e) => setNewProductForm({ ...newProductForm, price: Number(e.target.value) })}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#4A2E33] uppercase mb-1">Category</label>
                  <select
                    value={newProductForm.category}
                    onChange={(e) => setNewProductForm({ ...newProductForm, category: e.target.value })}
                    className="w-full p-2.5 border rounded-xl"
                  >
                    <option value="Cleanser">Cleanser</option>
                    <option value="Serums & Treatments">Serums & Treatments</option>
                    <option value="Moisturizer">Moisturizer</option>
                    <option value="Sunscreen">Sunscreen</option>
                    <option value="Skincare Kit">Skincare Kit</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#4A2E33] uppercase mb-1">Image URL (Cloudinary or Direct Image) *</label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={newProductForm.image}
                  onChange={(e) => setNewProductForm({ ...newProductForm, image: e.target.value })}
                  className="w-full p-2.5 border rounded-xl font-mono text-[11px]"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t">
              <button
                type="button"
                onClick={() => setIsNewProductModalOpen(false)}
                className="flex-1 py-2 rounded-xl border text-xs font-semibold text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 rounded-xl bg-[#8B263E] text-white text-xs font-bold hover:bg-[#A02C48] flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Plus className="w-4 h-4 text-[#FFF3B0]" />
                <span>Publish Product</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
