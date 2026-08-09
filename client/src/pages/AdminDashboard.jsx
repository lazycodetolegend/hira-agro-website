import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import {
  HiOutlineChartBar,
  HiOutlineCube,
  HiOutlineUsers,
  HiOutlineClipboardList,
  HiOutlineShoppingCart,
  HiOutlineLogout,
  HiOutlineMenu,
  HiOutlineX,
  HiOutlinePlus,
  HiOutlineTrash,
  HiOutlinePencil,
  HiOutlineExclamation,
  HiOutlineCurrencyRupee,
  HiOutlinePhotograph,
  HiOutlineMail,
  HiOutlineDocumentText,
  HiOutlinePrinter,
  HiOutlineDownload,
  HiOutlineCheckCircle,
  HiOutlineEye,
  HiOutlineFilter,
  HiOutlineSearch,
  HiOutlineUserGroup
} from 'react-icons/hi';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

import { getImageUrl } from '../utils/getImageUrl';
import { exportToCsv } from '../utils/exportCsv';
import ReceiptModal from '../components/ReceiptModal';
import InvoicePrintModal from '../components/InvoicePrintModal';
import BillOfSupplyPrintModal from '../components/BillOfSupplyPrintModal';
import LabourManagement from '../components/LabourManagement';
import { SkeletonCard, SkeletonTableRow } from '../components/ui/SkeletonLoader';

const formatDateSafe = (dateVal, options = {}) => {
  if (!dateVal) return 'N/A';
  try {
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return 'N/A';
    return d.toLocaleDateString('en-IN', options);
  } catch (err) {
    return 'N/A';
  }
};

const AdminDashboard = ({ superAdminMode = false, companyData = null }) => {
  const { user, company: authCompany, logout } = useAuth();
  const navigate = useNavigate();

  // Determine active company context (from prop or AuthContext)
  const currentCompany = companyData || authCompany || user?.companyId || {
    name: 'HIRA AGRO INDUSTRY',
    billType: 'gst_invoice',
    proprietor: 'Lalita Kalpesh Mutha'
  };

  const isBillOfSupply = currentCompany?.billType === 'bill_of_supply';

  const adminTabs = [
    { id: 'overview', label: 'Overview', icon: HiOutlineChartBar },
    { id: 'products', label: 'Products', icon: HiOutlineCube },
    { id: 'inquiries', label: 'Inquiries', icon: HiOutlineMail },
    { id: 'invoices', label: isBillOfSupply ? 'Bills of Supply' : 'GST Invoices', icon: HiOutlineDocumentText },
    { id: 'sales', label: 'Sales', icon: HiOutlineShoppingCart },
    { id: 'stockLogs', label: 'Stock Logs', icon: HiOutlineClipboardList },
    { id: 'labour', label: 'Labour System', icon: HiOutlineUserGroup },
    { id: 'managers', label: 'Managers', icon: HiOutlineUsers },
  ];

  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Data states
  const [products, setProducts] = useState([]);
  const [managers, setManagers] = useState([]);
  const [stockLogs, setStockLogs] = useState([]);
  const [sales, setSales] = useState([]);
  const [salesRevenue, setSalesRevenue] = useState(0);
  const [inquiries, setInquiries] = useState([]);
  const [unreadInquiriesCount, setUnreadInquiriesCount] = useState(0);
  const [invoices, setInvoices] = useState([]);
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(false);

  // Product form
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '', variety: '', ratePerKg: '', unit: 'kg', description: '', stockQuantity: '', lowStockThreshold: '50', isAvailable: true
  });
  const [productPhoto, setProductPhoto] = useState(null);

  // Manager form
  const [managerForm, setManagerForm] = useState({ name: '', email: '', password: '' });

  // Sales & Stock Filters
  const [salesFilter, setSalesFilter] = useState({ startDate: '', endDate: '' });
  const [searchQuery, setSearchQuery] = useState('');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Modals & Print states
  const [receiptSale, setReceiptSale] = useState(null);
  const [printInvoice, setPrintInvoice] = useState(null);
  const [printBill, setPrintBill] = useState(null);
  const [viewInquiry, setViewInquiry] = useState(null);
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [showBillForm, setShowBillForm] = useState(false);

  // GST Invoice Form state
  const [invoiceForm, setInvoiceForm] = useState({
    poNumber: '',
    poDate: '',
    eWayBillNo: '',
    buyerName: '',
    buyerAddress: '',
    buyerGSTIN: '',
    buyerState: 'Maharashtra',
    buyerStateCode: '27',
    lineItems: [{ description: '', hsnCode: '1006', gstPercent: 5, qty: '', unit: 'm.t.', rate: '' }],
    transporterName: '',
    vehicleNo: '',
    placeOfSupply: 'Maharashtra',
    linkedSaleId: ''
  });

  // Bill of Supply Form state
  const [billForm, setBillForm] = useState({
    buyerName: '',
    buyerAddress: '',
    buyerGST: '',
    buyerStateCode: '27',
    broker: '',
    vehicleNo: '',
    lineItems: [{ description: '', hsnCode: '', qty: 0, weightKg: 0, rate: 0, amount: 0 }]
  });

  // Delete confirmation
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, type: '', id: '', name: '' });

  useEffect(() => {
    fetchProducts();
    fetchInquiries();
    if (isBillOfSupply) {
      fetchBills();
    } else {
      fetchInvoices();
    }
  }, [currentCompany?._id]);

  useEffect(() => {
    if (activeTab === 'overview') {
      fetchProducts();
      fetchSales();
      fetchInquiries();
    } else if (activeTab === 'products') {
      fetchProducts();
    } else if (activeTab === 'managers') {
      fetchManagers();
    } else if (activeTab === 'stockLogs') {
      fetchStockLogs();
    } else if (activeTab === 'sales') {
      fetchSales();
    } else if (activeTab === 'inquiries') {
      fetchInquiries();
    } else if (activeTab === 'invoices') {
      if (isBillOfSupply) fetchBills();
      else fetchInvoices();
    }
    setCurrentPage(1);
    setSearchQuery('');
  }, [activeTab, currentCompany?._id]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/products');
      setProducts(res.data.products);
    } catch (err) { /* silent */ }
    setLoading(false);
  };

  const fetchManagers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/auth/users');
      setManagers(res.data.users.filter(u => u.role === 'manager'));
    } catch (err) { /* silent */ }
    setLoading(false);
  };

  const fetchStockLogs = async () => {
    setLoading(true);
    try {
      const res = await api.get('/stock');
      setStockLogs(res.data.logs || res.data.stockLogs || []);
    } catch (err) { /* silent */ }
    setLoading(false);
  };

  const fetchSales = async () => {
    setLoading(true);
    try {
      const params = {};
      if (salesFilter.startDate) params.startDate = salesFilter.startDate;
      if (salesFilter.endDate) params.endDate = salesFilter.endDate;
      const res = await api.get('/sales', { params });
      setSales(res.data.sales);
      setSalesRevenue(res.data.totalRevenue);
    } catch (err) { /* silent */ }
    setLoading(false);
  };

  const fetchInquiries = async () => {
    try {
      const res = await api.get('/contact');
      setInquiries(res.data.contacts || []);
      setUnreadInquiriesCount(res.data.unreadCount || (res.data.contacts || []).filter(c => !c.isRead || c.status === 'new').length);
    } catch (err) { /* silent */ }
  };

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const res = await api.get('/invoices');
      setInvoices(res.data.invoices || []);
    } catch (err) { /* silent */ }
    setLoading(false);
  };

  const fetchBills = async () => {
    setLoading(true);
    try {
      const res = await api.get('/bills');
      setBills(res.data.bills || []);
    } catch (err) { /* silent */ }
    setLoading(false);
  };

  const openProductForm = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setProductForm({
        name: product.name, variety: product.variety, ratePerKg: String(product.ratePerKg),
        unit: product.unit || 'kg', description: product.description || '',
        stockQuantity: String(product.stockQuantity),
        lowStockThreshold: String(product.lowStockThreshold || 50),
        isAvailable: product.isAvailable,
      });
    } else {
      setEditingProduct(null);
      setProductForm({ name: '', variety: '', ratePerKg: '', unit: 'kg', description: '', stockQuantity: '', lowStockThreshold: '50', isAvailable: true });
    }
    setProductPhoto(null);
    setShowProductForm(true);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    if (!productForm.name || !productForm.variety || !productForm.ratePerKg) {
      return toast.error('Name, variety, and rate are required');
    }
    const formData = new FormData();
    Object.entries(productForm).forEach(([key, val]) => formData.append(key, val));
    if (productPhoto) formData.append('photo', productPhoto);

    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Product updated');
      } else {
        await api.post('/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Product created');
      }
      setShowProductForm(false);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product');
    }
  };

  const handleManagerSubmit = async (e) => {
    e.preventDefault();
    if (!managerForm.name || !managerForm.email || !managerForm.password) {
      return toast.error('All fields are required');
    }
    if (managerForm.password.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }
    try {
      await api.post('/auth/register', managerForm);
      toast.success('Manager account created');
      setManagerForm({ name: '', email: '', password: '' });
      fetchManagers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create manager');
    }
  };

  const handleInquiryStatus = async (id, status) => {
    try {
      const res = await api.put(`/contact/${id}/status`, { status });
      toast.success(res.data.message || `Inquiry marked as ${status}`);
      fetchInquiries();
    } catch (err) {
      toast.error('Failed to update inquiry status');
    }
  };

  const handleDelete = async () => {
    try {
      if (deleteConfirm.type === 'product') {
        await api.delete(`/products/${deleteConfirm.id}`);
        toast.success('Product deleted');
        fetchProducts();
      } else if (deleteConfirm.type === 'manager') {
        await api.delete(`/auth/users/${deleteConfirm.id}`);
        toast.success('Manager removed');
        fetchManagers();
      } else if (deleteConfirm.type === 'inquiry') {
        await api.delete(`/contact/${deleteConfirm.id}`);
        toast.success('Inquiry deleted');
        fetchInquiries();
      } else if (deleteConfirm.type === 'invoice') {
        await api.delete(`/invoices/${deleteConfirm.id}`);
        toast.success('Invoice deleted');
        fetchInvoices();
      } else if (deleteConfirm.type === 'bill') {
        await api.delete(`/bills/${deleteConfirm.id}`);
        toast.success('Bill of supply deleted');
        fetchBills();
      } else if (deleteConfirm.type === 'sale') {
        await api.delete(`/sales/${deleteConfirm.id}`);
        toast.success('Sale record deleted & stock restored');
        fetchSales();
        fetchProducts();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
    setDeleteConfirm({ show: false, type: '', id: '', name: '' });
  };

  // GST Invoice Form helpers
  const handleLineItemChange = (index, field, value) => {
    const updated = [...invoiceForm.lineItems];
    updated[index][field] = value;
    setInvoiceForm(prev => ({ ...prev, lineItems: updated }));
  };

  const addLineItem = () => {
    setInvoiceForm(prev => ({
      ...prev,
      lineItems: [...prev.lineItems, { description: '', hsnCode: '1006', gstPercent: 5, qty: '', unit: 'm.t.', rate: '' }]
    }));
  };

  const removeLineItem = (index) => {
    if (invoiceForm.lineItems.length === 1) return;
    setInvoiceForm(prev => ({
      ...prev,
      lineItems: prev.lineItems.filter((_, i) => i !== index)
    }));
  };

  const handleInvoiceSubmit = async (e) => {
    e.preventDefault();
    if (!invoiceForm.buyerName || !invoiceForm.buyerAddress || invoiceForm.lineItems.length === 0) {
      return toast.error('Buyer name, address, and line items are required');
    }

    try {
      const res = await api.post('/invoices', invoiceForm);
      toast.success('Invoice created successfully!');
      setShowInvoiceForm(false);
      fetchInvoices();
      setPrintInvoice(res.data.invoice);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create invoice');
    }
  };

  // Bill of Supply Form helpers
  const handleBillLineItemChange = (index, field, value) => {
    const updated = [...billForm.lineItems];
    updated[index][field] = value;
    const qty = Number(updated[index].qty) || 0;
    const weightKg = Number(updated[index].weightKg) || 0;
    const rate = Number(updated[index].rate) || 0;
    const multiplier = weightKg > 0 ? weightKg : (qty > 0 ? qty : 1);
    updated[index].amount = multiplier * rate;
    setBillForm(prev => ({ ...prev, lineItems: updated }));
  };

  const addBillLineItem = () => {
    setBillForm(prev => ({
      ...prev,
      lineItems: [...prev.lineItems, { description: '', hsnCode: '', qty: 0, weightKg: 0, rate: 0, amount: 0 }]
    }));
  };

  const removeBillLineItem = (index) => {
    if (billForm.lineItems.length === 1) return;
    setBillForm(prev => ({
      ...prev,
      lineItems: prev.lineItems.filter((_, i) => i !== index)
    }));
  };

  const handleBillSubmit = async (e) => {
    e.preventDefault();
    if (!billForm.buyerName || billForm.lineItems.length === 0) {
      return toast.error('Buyer name and at least one item are required');
    }

    try {
      const res = await api.post('/bills', billForm);
      toast.success('Bill of supply created successfully!');
      setShowBillForm(false);
      fetchBills();
      setPrintBill(res.data.bill);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create bill');
    }
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  // Calculations & Analytics data
  const lowStockProducts = products.filter(p => p.stockQuantity <= (p.lowStockThreshold || 50));
  const totalProductsCount = products.length;
  const managersCount = managers.length;

  // Pagination helper
  const paginate = (items = []) => {
    const safeItems = Array.isArray(items) ? items : [];
    const filtered = safeItems.filter(item => {
      if (!item) return false;
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      const getStr = (val) => {
        if (!val) return '';
        if (typeof val === 'string') return val;
        if (typeof val === 'object' && val.name && typeof val.name === 'string') return val.name;
        return String(val);
      };
      return (
        getStr(item.name).toLowerCase().includes(q) ||
        getStr(item.buyerName).toLowerCase().includes(q) ||
        getStr(item.productName || item.productId).toLowerCase().includes(q) ||
        getStr(item.invoiceNumber || item.billNumber).toLowerCase().includes(q) ||
        getStr(item.variety).toLowerCase().includes(q)
      );
    });

    const totalPages = Math.ceil(filtered.length / rowsPerPage) || 1;
    const startIndex = (currentPage - 1) * rowsPerPage;
    const currentRows = filtered.slice(startIndex, startIndex + rowsPerPage);

    return { filtered, totalPages, currentRows };
  };

  return (
    <div className="min-h-screen bg-cream flex">
      {/* SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-56 bg-forest transform transition-transform duration-300 lg:relative lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                  <span className="text-gold font-bold text-lg">{currentCompany?.name?.[0] || 'H'}</span>
                </div>
                <div>
                  <h2 className="font-heading text-lg text-white font-bold truncate max-w-[120px]">
                    {currentCompany?.name || 'Hira Agro'}
                  </h2>
                  <p className="text-gold text-[9px] tracking-[0.15em] uppercase font-medium">
                    {isBillOfSupply ? 'Supply Mill' : 'Admin Panel'}
                  </p>
                </div>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white/60 hover:text-white">
                <HiOutlineX className="w-6 h-6" />
              </button>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {adminTabs.map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeTab === tab.id;
              const hasBadge = tab.id === 'inquiries' && unreadInquiriesCount > 0;
              return (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setSidebarOpen(false); }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    isSelected
                      ? 'bg-white/10 text-gold font-bold shadow-xs'
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    {tab.label}
                  </div>
                  {hasBadge && (
                    <span className="px-2 py-0.5 bg-amber-500 text-ink font-bold text-[10px] rounded-full">
                      {unreadInquiriesCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {!superAdminMode && (
            <div className="p-4 border-t border-white/10 space-y-3 mt-auto">
              <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl">
                <div className="w-9 h-9 bg-gold/20 rounded-full flex items-center justify-center">
                  <span className="text-gold font-bold text-sm">{user?.name?.[0]?.toUpperCase()}</span>
                </div>
                <div>
                  <p className="text-white text-sm font-semibold truncate max-w-[110px]">{user?.name}</p>
                  <p className="text-gold/80 text-xs font-medium uppercase tracking-wider">Administrator</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all"
              >
                <HiOutlineLogout className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)}></div>}

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="bg-cream border-b border-stone/10 px-8 py-5 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-xl hover:bg-cream">
              <HiOutlineMenu className="w-6 h-6 text-forest" />
            </button>
            <h1 className="font-heading text-2xl sm:text-3xl text-ink">
              {adminTabs.find(t => t.id === activeTab)?.label}
            </h1>
          </div>
          {!superAdminMode && (
            <button onClick={handleLogout} className="hidden sm:flex items-center gap-2 text-sm font-semibold text-stone hover:text-forest transition-colors">
              <HiOutlineLogout className="w-4 h-4" /> Sign Out
            </button>
          )}
        </header>

        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto space-y-8">

          {/* ─── TAB 1: OVERVIEW ─── */}
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {loading ? (
                  Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
                ) : (
                  <>
                    <div className="bg-white p-6 rounded-2xl border border-stone/15 shadow-xs">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs uppercase font-semibold text-stone">Total Products</span>
                        <HiOutlineCube className="w-5 h-5 text-forest" />
                      </div>
                      <span className="font-heading text-4xl text-ink font-bold">{totalProductsCount}</span>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-stone/15 shadow-xs">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs uppercase font-semibold text-stone">Sales Revenue</span>
                        <HiOutlineCurrencyRupee className="w-5 h-5 text-forest" />
                      </div>
                      <span className="font-heading text-4xl text-forest font-bold">₹{salesRevenue.toLocaleString('en-IN')}</span>
                    </div>

                    <div className={`p-6 rounded-2xl border shadow-xs ${
                      lowStockProducts.length > 0 ? 'bg-amber-50/60 border-amber-200' : 'bg-white border-stone/15'
                    }`}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs uppercase font-semibold text-stone">Low Stock Alerts</span>
                        <HiOutlineExclamation className={`w-5 h-5 ${lowStockProducts.length > 0 ? 'text-red-600 animate-pulse' : 'text-stone'}`} />
                      </div>
                      <span className={`font-heading text-4xl font-bold ${lowStockProducts.length > 0 ? 'text-red-600' : 'text-ink'}`}>
                        {lowStockProducts.length}
                      </span>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-stone/15 shadow-xs">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs uppercase font-semibold text-stone">Active Managers</span>
                        <HiOutlineUsers className="w-5 h-5 text-forest" />
                      </div>
                      <span className="font-heading text-4xl text-ink font-bold">{managersCount}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* ─── TAB 2: PRODUCTS ─── */}
          {activeTab === 'products' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex justify-between items-center">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white px-4 py-2 rounded-full border border-stone/20 text-xs w-64 focus:outline-none focus:border-forest"
                />
                <button
                  onClick={() => openProductForm()}
                  className="inline-flex items-center gap-2 bg-forest text-cream px-5 py-2.5 rounded-full text-xs font-semibold hover:bg-primary-light transition-colors"
                >
                  <HiOutlinePlus className="w-4 h-4" /> Add Product
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-stone/15 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-stone/5 border-b border-stone/10 text-xs font-semibold text-stone uppercase tracking-wider">
                      <tr>
                        <th className="py-4 px-6">Product</th>
                        <th className="py-4 px-6">Variety</th>
                        <th className="py-4 px-6">Rate (₹/kg)</th>
                        <th className="py-4 px-6">Stock (kg)</th>
                        <th className="py-4 px-6">Status</th>
                        <th className="py-4 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone/10">
                      {loading ? (
                        Array.from({ length: 5 }).map((_, i) => <SkeletonTableRow key={i} columns={6} />)
                      ) : paginate(products).currentRows.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="py-12 text-center text-stone text-xs">
                            No products found in this business catalog. Click &quot;Add Product&quot; to list grains.
                          </td>
                        </tr>
                      ) : (
                        paginate(products).currentRows.map((product) => (
                          <tr key={product._id} className="hover:bg-cream/40 transition-colors">
                            <td className="py-4 px-6 font-semibold text-ink">{product.name}</td>
                            <td className="py-4 px-6 text-stone">{product.variety}</td>
                            <td className="py-4 px-6 font-bold text-forest">₹{product.ratePerKg}</td>
                            <td className="py-4 px-6 font-medium">{product.stockQuantity} kg</td>
                            <td className="py-4 px-6">
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                product.stockQuantity > (product.lowStockThreshold || 50) ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {product.stockQuantity > (product.lowStockThreshold || 50) ? 'In Stock' : 'Low Stock'}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-right space-x-2">
                              <button
                                onClick={() => openProductForm(product)}
                                className="p-1.5 text-stone hover:text-ink transition-colors"
                              >
                                <HiOutlinePencil className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setDeleteConfirm({ show: true, type: 'product', id: product._id, name: product.name })}
                                className="p-1.5 text-stone hover:text-red-600 transition-colors"
                              >
                                <HiOutlineTrash className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ─── TAB 3: INVOICES / BILLS OF SUPPLY ─── */}
          {activeTab === 'invoices' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex justify-between items-center">
                <input
                  type="text"
                  placeholder={`Search ${isBillOfSupply ? 'bills' : 'invoices'}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white px-4 py-2 rounded-full border border-stone/20 text-xs w-64 focus:outline-none focus:border-forest"
                />
                <button
                  onClick={() => isBillOfSupply ? setShowBillForm(true) : setShowInvoiceForm(true)}
                  className="inline-flex items-center gap-2 bg-forest text-cream px-5 py-2.5 rounded-full text-xs font-semibold hover:bg-primary-light transition-colors"
                >
                  <HiOutlinePlus className="w-4 h-4" /> {isBillOfSupply ? 'Generate Bill of Supply' : 'Generate GST Invoice'}
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-stone/15 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-stone/5 border-b border-stone/10 text-xs font-semibold text-stone uppercase tracking-wider">
                      <tr>
                        <th className="py-4 px-6">Date</th>
                        <th className="py-4 px-6">{isBillOfSupply ? 'Bill No.' : 'Invoice No.'}</th>
                        <th className="py-4 px-6">Buyer Name</th>
                        <th className="py-4 px-6">Items Description</th>
                        <th className="py-4 px-6 font-bold text-forest">Total Value</th>
                        <th className="py-4 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone/10">
                      {isBillOfSupply ? (
                        paginate(bills).currentRows.length === 0 ? (
                          <tr>
                            <td colSpan="6" className="py-12 text-center text-stone text-xs">
                              No bills of supply generated yet.
                            </td>
                          </tr>
                        ) : (
                          paginate(bills).currentRows.map((bill) => (
                            <tr key={bill._id} className="hover:bg-cream/40 transition-colors">
                              <td className="py-4 px-6 text-xs text-stone">{formatDateSafe(bill.billDate || bill.createdAt)}</td>
                              <td className="py-4 px-6 font-mono font-bold text-ink">{bill.billNumber}</td>
                              <td className="py-4 px-6 font-semibold">{bill.buyerName}</td>
                              <td className="py-4 px-6 text-xs text-stone truncate max-w-xs">
                                {bill.lineItems?.map(i => i.description).join(', ')}
                              </td>
                              <td className="py-4 px-6 font-heading text-lg font-bold text-forest">
                                ₹{bill.total?.toLocaleString('en-IN')}
                              </td>
                              <td className="py-4 px-6 text-right space-x-2">
                                <button
                                  onClick={() => setPrintBill(bill)}
                                  className="inline-flex items-center gap-1 bg-forest text-cream px-3 py-1.5 rounded-full text-xs font-semibold hover:bg-primary-light transition-colors"
                                >
                                  <HiOutlinePrinter className="w-3.5 h-3.5" /> Print / PDF
                                </button>
                                <button
                                  onClick={() => setDeleteConfirm({ show: true, type: 'bill', id: bill._id, name: bill.billNumber })}
                                  className="p-1.5 text-stone hover:text-red-600 transition-colors inline-block"
                                >
                                  <HiOutlineTrash className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))
                        )
                      ) : (
                        paginate(invoices).currentRows.length === 0 ? (
                          <tr>
                            <td colSpan="6" className="py-12 text-center text-stone text-xs">
                              No GST invoices generated yet.
                            </td>
                          </tr>
                        ) : (
                          paginate(invoices).currentRows.map((inv) => (
                            <tr key={inv._id} className="hover:bg-cream/40 transition-colors">
                              <td className="py-4 px-6 text-xs text-stone">{formatDateSafe(inv.invoiceDate || inv.createdAt)}</td>
                              <td className="py-4 px-6 font-mono font-bold text-ink">{inv.invoiceNumber}</td>
                              <td className="py-4 px-6 font-semibold">{inv.buyerName}</td>
                              <td className="py-4 px-6 text-xs text-stone truncate max-w-xs">
                                {inv.lineItems?.map(i => i.description).join(', ')}
                              </td>
                              <td className="py-4 px-6 font-heading text-lg font-bold text-forest">
                                ₹{inv.totalInvoiceValue?.toLocaleString('en-IN')}
                              </td>
                              <td className="py-4 px-6 text-right space-x-2">
                                <button
                                  onClick={() => setPrintInvoice(inv)}
                                  className="inline-flex items-center gap-1 bg-forest text-cream px-3 py-1.5 rounded-full text-xs font-semibold hover:bg-primary-light transition-colors"
                                >
                                  <HiOutlinePrinter className="w-3.5 h-3.5" /> Print / PDF
                                </button>
                                <button
                                  onClick={() => setDeleteConfirm({ show: true, type: 'invoice', id: inv._id, name: inv.invoiceNumber })}
                                  className="p-1.5 text-stone hover:text-red-600 transition-colors inline-block"
                                >
                                  <HiOutlineTrash className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ─── TAB 4: SALES ─── */}
          {activeTab === 'sales' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white rounded-2xl border border-stone/15 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-stone/5 border-b border-stone/10 text-xs font-semibold text-stone uppercase tracking-wider">
                      <tr>
                        <th className="py-4 px-6">Date</th>
                        <th className="py-4 px-6">Buyer</th>
                        <th className="py-4 px-6">Product</th>
                        <th className="py-4 px-6">Qty</th>
                        <th className="py-4 px-6">Rate</th>
                        <th className="py-4 px-6">Total</th>
                        <th className="py-4 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone/10">
                      {paginate(sales).currentRows.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="py-12 text-center text-stone text-xs">
                            No sales recorded yet.
                          </td>
                        </tr>
                      ) : (
                        paginate(sales).currentRows.map((sale) => (
                          <tr key={sale._id} className="hover:bg-cream/40 transition-colors">
                            <td className="py-4 px-6 text-xs text-stone">{formatDateSafe(sale.createdAt)}</td>
                            <td className="py-4 px-6 font-semibold text-ink">{sale.buyerName}</td>
                            <td className="py-4 px-6 text-stone">{sale.productId?.name || 'Rice'}</td>
                            <td className="py-4 px-6 font-medium">{sale.quantitySold} kg</td>
                            <td className="py-4 px-6 text-stone">₹{sale.ratePerUnit}</td>
                            <td className="py-4 px-6 font-heading text-lg font-bold text-forest">₹{sale.totalAmount}</td>
                            <td className="py-4 px-6 text-right space-x-2 whitespace-nowrap">
                              <button
                                onClick={() => setReceiptSale(sale)}
                                className="inline-flex items-center gap-1 text-xs font-semibold text-forest hover:underline"
                              >
                                <HiOutlinePrinter className="w-3.5 h-3.5" /> Receipt
                              </button>
                              <button
                                onClick={() => setDeleteConfirm({ show: true, type: 'sale', id: sale._id, name: `${sale.buyerName}'s sale (₹${sale.totalAmount})` })}
                                className="p-1.5 text-stone hover:text-red-600 transition-colors inline-block"
                              >
                                <HiOutlineTrash className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ─── TAB 5: LABOUR SYSTEM (NEW) ─── */}
          {activeTab === 'labour' && (
            <div className="animate-fade-in">
              <LabourManagement userRole="admin" />
            </div>
          )}

          {/* ─── TAB 6: INQUIRIES ─── */}
          {activeTab === 'inquiries' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white rounded-2xl border border-stone/15 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-stone/5 border-b border-stone/10 text-xs font-semibold text-stone uppercase tracking-wider">
                      <tr>
                        <th className="py-4 px-6">Date</th>
                        <th className="py-4 px-6">Name</th>
                        <th className="py-4 px-6">Contact</th>
                        <th className="py-4 px-6">Message</th>
                        <th className="py-4 px-6">Status</th>
                        <th className="py-4 px-6 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone/10">
                      {inquiries.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="py-12 text-center text-stone text-xs">No inquiries received.</td>
                        </tr>
                      ) : (
                        inquiries.map((inq) => (
                          <tr key={inq._id} className="hover:bg-cream/40 transition-colors">
                            <td className="py-4 px-6 text-xs text-stone">{formatDateSafe(inq.createdAt)}</td>
                            <td className="py-4 px-6 font-bold text-ink">{inq.name}</td>
                            <td className="py-4 px-6 text-xs">
                              <p className="text-stone">{inq.email}</p>
                              <p className="text-stone">{inq.phone}</p>
                            </td>
                            <td className="py-4 px-6 text-xs text-stone max-w-xs truncate">{inq.message}</td>
                            <td className="py-4 px-6">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                inq.status === 'new' ? 'bg-amber-100 text-amber-800' :
                                inq.status === 'read' ? 'bg-blue-100 text-blue-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {inq.status === 'responded' ? '✓ Responded' : inq.status}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-right space-x-2">
                              {inq.status !== 'responded' ? (
                                <button
                                  onClick={() => handleInquiryStatus(inq._id, 'responded')}
                                  className="inline-flex items-center gap-1 bg-forest text-cream px-3 py-1.5 rounded-full text-xs font-semibold hover:bg-primary-light transition-all shadow-xs"
                                >
                                  <HiOutlineMail className="w-3.5 h-3.5" /> Mark Responded & Send Email
                                </button>
                              ) : (
                                <span className="text-xs text-stone font-medium">✓ Email Delivered</span>
                              )}
                              {inq.status === 'new' && (
                                <button
                                  onClick={() => handleInquiryStatus(inq._id, 'read')}
                                  className="text-xs font-semibold text-stone hover:text-ink hover:underline"
                                >
                                  Mark Read
                                </button>
                              )}
                              <button
                                onClick={() => setDeleteConfirm({ show: true, type: 'inquiry', id: inq._id, name: `${inq.name}'s inquiry` })}
                                className="p-1.5 text-stone hover:text-red-600 transition-colors inline-block"
                              >
                                <HiOutlineTrash className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ─── TAB 7: STOCK LOGS ─── */}
          {activeTab === 'stockLogs' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white rounded-2xl border border-stone/15 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-stone/5 border-b border-stone/10 text-xs font-semibold text-stone uppercase tracking-wider">
                      <tr>
                        <th className="py-4 px-6">Date</th>
                        <th className="py-4 px-6">Product</th>
                        <th className="py-4 px-6">Type</th>
                        <th className="py-4 px-6">Qty</th>
                        <th className="py-4 px-6">Note</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone/10">
                      {paginate(stockLogs).currentRows.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="py-12 text-center text-stone text-xs">No stock logs recorded.</td>
                        </tr>
                      ) : (
                        paginate(stockLogs).currentRows.map((log) => (
                          <tr key={log._id} className="hover:bg-cream/40 transition-colors">
                            <td className="py-4 px-6 text-xs text-stone">{formatDateSafe(log.createdAt)}</td>
                            <td className="py-4 px-6 font-semibold">{log.productId?.name || 'Rice'}</td>
                            <td className="py-4 px-6">
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                log.type === 'add' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {log.type}
                              </span>
                            </td>
                            <td className="py-4 px-6 font-bold">{log.changeAmount} kg</td>
                            <td className="py-4 px-6 text-stone text-xs">{log.note || '—'}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ─── TAB 8: MANAGERS ─── */}
          {activeTab === 'managers' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 animate-fade-in">
              <div className="md:col-span-7 bg-white p-6 rounded-2xl border border-stone/15 shadow-xs">
                <h3 className="font-heading text-2xl text-ink mb-4">Manager Accounts</h3>
                <div className="space-y-3">
                  {managers.map(m => (
                    <div key={m._id} className="flex justify-between items-center p-4 border border-stone/15 rounded-xl">
                      <div>
                        <p className="font-bold text-ink">{m.name}</p>
                        <p className="text-xs text-stone">{m.email}</p>
                      </div>
                      <button
                        onClick={() => setDeleteConfirm({ show: true, type: 'manager', id: m._id, name: m.name })}
                        className="p-2 text-stone hover:text-red-600 transition-colors"
                      >
                        <HiOutlineTrash className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="md:col-span-5 bg-white p-6 rounded-2xl border border-stone/15 shadow-xs">
                <h3 className="font-heading text-2xl text-ink mb-4">Create Manager</h3>
                <form onSubmit={handleManagerSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs uppercase font-semibold text-stone mb-1">Name</label>
                    <input
                      type="text"
                      value={managerForm.name}
                      onChange={(e) => setManagerForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full bg-transparent border-b border-stone/30 py-2 text-sm focus:outline-none focus:border-forest"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase font-semibold text-stone mb-1">Email</label>
                    <input
                      type="email"
                      value={managerForm.email}
                      onChange={(e) => setManagerForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full bg-transparent border-b border-stone/30 py-2 text-sm focus:outline-none focus:border-forest"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase font-semibold text-stone mb-1">Password</label>
                    <input
                      type="password"
                      value={managerForm.password}
                      onChange={(e) => setManagerForm(prev => ({ ...prev, password: e.target.value }))}
                      className="w-full bg-transparent border-b border-stone/30 py-2 text-sm focus:outline-none focus:border-forest"
                      required
                    />
                  </div>
                  <button type="submit" className="w-full bg-forest text-cream py-3 rounded-full text-xs font-semibold uppercase tracking-wider">
                    Add Manager
                  </button>
                </form>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ─── MODAL: PRODUCT FORM ─── */}
      {showProductForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full animate-scale-in">
            <h3 className="font-heading text-2xl text-ink mb-4">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h3>
            <form onSubmit={handleProductSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase text-stone font-semibold mb-1">Product Name *</label>
                <input
                  type="text"
                  value={productForm.name}
                  onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-transparent border-b border-stone/30 py-2 text-sm focus:outline-none focus:border-forest"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase text-stone font-semibold mb-1">Variety *</label>
                  <input
                    type="text"
                    value={productForm.variety}
                    onChange={(e) => setProductForm(prev => ({ ...prev, variety: e.target.value }))}
                    placeholder="e.g. Basmati"
                    className="w-full bg-transparent border-b border-stone/30 py-2 text-sm focus:outline-none focus:border-forest"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase text-stone font-semibold mb-1">Rate (₹/kg) *</label>
                  <input
                    type="number"
                    value={productForm.ratePerKg}
                    onChange={(e) => setProductForm(prev => ({ ...prev, ratePerKg: e.target.value }))}
                    className="w-full bg-transparent border-b border-stone/30 py-2 text-sm focus:outline-none focus:border-forest"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase text-stone font-semibold mb-1">Stock Qty (kg)</label>
                  <input
                    type="number"
                    value={productForm.stockQuantity}
                    onChange={(e) => setProductForm(prev => ({ ...prev, stockQuantity: e.target.value }))}
                    className="w-full bg-transparent border-b border-stone/30 py-2 text-sm focus:outline-none focus:border-forest"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase text-stone font-semibold mb-1">Threshold</label>
                  <input
                    type="number"
                    value={productForm.lowStockThreshold}
                    onChange={(e) => setProductForm(prev => ({ ...prev, lowStockThreshold: e.target.value }))}
                    className="w-full bg-transparent border-b border-stone/30 py-2 text-sm focus:outline-none focus:border-forest"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs uppercase text-stone font-semibold mb-1">Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setProductPhoto(e.target.files[0])}
                  className="text-xs text-stone"
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowProductForm(false)} className="flex-1 py-3 border border-stone/20 rounded-full text-xs font-semibold">
                  Cancel
                </button>
                <button type="submit" className="flex-1 bg-forest text-cream py-3 rounded-full text-xs font-semibold">
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL: BILL OF SUPPLY FORM ─── */}
      {showBillForm && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-8 shadow-2xl relative my-8 animate-scale-in max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-stone/15 pb-4 mb-6">
              <div>
                <h3 className="font-heading text-2xl text-ink">Generate Bill of Supply</h3>
                <p className="text-xs text-stone">{currentCompany?.name}</p>
              </div>
              <button onClick={() => setShowBillForm(false)} className="p-2 text-stone hover:text-ink">
                <HiOutlineX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBillSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase font-bold text-stone mb-1">Buyer Name *</label>
                  <input
                    type="text"
                    value={billForm.buyerName}
                    onChange={(e) => setBillForm(prev => ({ ...prev, buyerName: e.target.value }))}
                    placeholder="M/s. ABC Traders"
                    required
                    className="w-full bg-cream p-2.5 rounded-xl border border-stone/20 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase font-bold text-stone mb-1">Buyer Address</label>
                  <input
                    type="text"
                    value={billForm.buyerAddress}
                    onChange={(e) => setBillForm(prev => ({ ...prev, buyerAddress: e.target.value }))}
                    placeholder="Dahanu, Palghar"
                    className="w-full bg-cream p-2.5 rounded-xl border border-stone/20 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs uppercase font-bold text-stone mb-1">Buyer GST (Optional)</label>
                  <input
                    type="text"
                    value={billForm.buyerGST}
                    onChange={(e) => setBillForm(prev => ({ ...prev, buyerGST: e.target.value }))}
                    placeholder="27XXXXX..."
                    className="w-full bg-cream p-2.5 rounded-xl border border-stone/20 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase font-bold text-stone mb-1">State Code</label>
                  <input
                    type="text"
                    value={billForm.buyerStateCode}
                    onChange={(e) => setBillForm(prev => ({ ...prev, buyerStateCode: e.target.value }))}
                    placeholder="27"
                    className="w-full bg-cream p-2.5 rounded-xl border border-stone/20 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase font-bold text-stone mb-1">Broker</label>
                  <input
                    type="text"
                    value={billForm.broker}
                    onChange={(e) => setBillForm(prev => ({ ...prev, broker: e.target.value }))}
                    placeholder="e.g. Ramesh"
                    className="w-full bg-cream p-2.5 rounded-xl border border-stone/20 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase font-bold text-stone mb-1">Vehicle No.</label>
                  <input
                    type="text"
                    value={billForm.vehicleNo}
                    onChange={(e) => setBillForm(prev => ({ ...prev, vehicleNo: e.target.value }))}
                    placeholder="MH-48-XX-1234"
                    className="w-full bg-cream p-2.5 rounded-xl border border-stone/20 text-xs"
                  />
                </div>
              </div>

              {/* Line Items */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs uppercase font-bold text-stone">Bill Line Items</span>
                  <button type="button" onClick={addBillLineItem} className="text-xs font-semibold text-forest hover:underline">
                    + Add Item Row
                  </button>
                </div>

                {billForm.lineItems.map((item, idx) => (
                  <div key={idx} className="grid grid-cols-12 gap-2 bg-cream/60 p-3 rounded-xl items-center text-xs">
                    <div className="col-span-4">
                      <input
                        type="text"
                        placeholder="Description (e.g. Kolam Rice)"
                        value={item.description}
                        onChange={(e) => handleBillLineItemChange(idx, 'description', e.target.value)}
                        required
                        className="w-full bg-white p-2 rounded-lg border border-stone/20"
                      />
                    </div>
                    <div className="col-span-2">
                      <input
                        type="number"
                        placeholder="Qty / Bags"
                        value={item.qty || ''}
                        onChange={(e) => handleBillLineItemChange(idx, 'qty', e.target.value)}
                        className="w-full bg-white p-2 rounded-lg border border-stone/20"
                      />
                    </div>
                    <div className="col-span-2">
                      <input
                        type="number"
                        placeholder="Weight (Kg)"
                        value={item.weightKg || ''}
                        onChange={(e) => handleBillLineItemChange(idx, 'weightKg', e.target.value)}
                        className="w-full bg-white p-2 rounded-lg border border-stone/20"
                      />
                    </div>
                    <div className="col-span-2">
                      <input
                        type="number"
                        placeholder="Rate (₹)"
                        value={item.rate || ''}
                        onChange={(e) => handleBillLineItemChange(idx, 'rate', e.target.value)}
                        required
                        className="w-full bg-white p-2 rounded-lg border border-stone/20"
                      />
                    </div>
                    <div className="col-span-2 flex items-center justify-between font-bold text-forest">
                      <span>₹{item.amount?.toLocaleString('en-IN') || 0}</span>
                      {billForm.lineItems.length > 1 && (
                        <button type="button" onClick={() => removeBillLineItem(idx)} className="text-red-500 hover:text-red-700">
                          <HiOutlineTrash className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-stone/15">
                <button type="button" onClick={() => setShowBillForm(false)} className="px-5 py-2.5 rounded-full text-xs font-semibold text-stone">
                  Cancel
                </button>
                <button type="submit" className="bg-forest text-cream px-6 py-2.5 rounded-full text-xs font-semibold hover:bg-primary-light">
                  Generate Bill & Preview
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL: GST INVOICE FORM ─── */}
      {showInvoiceForm && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-8 shadow-2xl relative my-8 animate-scale-in max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-stone/15 pb-4 mb-6">
              <h3 className="font-heading text-2xl text-ink">Create GST Tax Invoice</h3>
              <button onClick={() => setShowInvoiceForm(false)} className="p-2 text-stone hover:text-ink">
                <HiOutlineX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleInvoiceSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase font-bold text-stone mb-1">Buyer Name *</label>
                  <input
                    type="text"
                    value={invoiceForm.buyerName}
                    onChange={(e) => setInvoiceForm(prev => ({ ...prev, buyerName: e.target.value }))}
                    placeholder="M/s. ABC Enterprise"
                    required
                    className="w-full bg-cream p-2.5 rounded-xl border border-stone/20 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase font-bold text-stone mb-1">Buyer Address *</label>
                  <input
                    type="text"
                    value={invoiceForm.buyerAddress}
                    onChange={(e) => setInvoiceForm(prev => ({ ...prev, buyerAddress: e.target.value }))}
                    placeholder="Address with Pin Code"
                    required
                    className="w-full bg-cream p-2.5 rounded-xl border border-stone/20 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs uppercase font-bold text-stone mb-1">GSTIN</label>
                  <input
                    type="text"
                    value={invoiceForm.buyerGSTIN}
                    onChange={(e) => setInvoiceForm(prev => ({ ...prev, buyerGSTIN: e.target.value }))}
                    placeholder="27XXXXX..."
                    className="w-full bg-cream p-2.5 rounded-xl border border-stone/20 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase font-bold text-stone mb-1">State</label>
                  <input
                    type="text"
                    value={invoiceForm.buyerState}
                    onChange={(e) => setInvoiceForm(prev => ({ ...prev, buyerState: e.target.value }))}
                    className="w-full bg-cream p-2.5 rounded-xl border border-stone/20 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase font-bold text-stone mb-1">State Code</label>
                  <input
                    type="text"
                    value={invoiceForm.buyerStateCode}
                    onChange={(e) => setInvoiceForm(prev => ({ ...prev, buyerStateCode: e.target.value }))}
                    className="w-full bg-cream p-2.5 rounded-xl border border-stone/20 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase font-bold text-stone mb-1">Vehicle No.</label>
                  <input
                    type="text"
                    value={invoiceForm.vehicleNo}
                    onChange={(e) => setInvoiceForm(prev => ({ ...prev, vehicleNo: e.target.value }))}
                    className="w-full bg-cream p-2.5 rounded-xl border border-stone/20 text-xs"
                  />
                </div>
              </div>

              {/* Line items */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs uppercase font-bold text-stone">Invoice Line Items</span>
                  <button type="button" onClick={addLineItem} className="text-xs font-semibold text-forest hover:underline">
                    + Add Item Row
                  </button>
                </div>

                {invoiceForm.lineItems.map((item, idx) => (
                  <div key={idx} className="grid grid-cols-12 gap-2 bg-cream/60 p-3 rounded-xl items-center text-xs">
                    <div className="col-span-5">
                      <input
                        type="text"
                        placeholder="Description"
                        value={item.description}
                        onChange={(e) => handleLineItemChange(idx, 'description', e.target.value)}
                        required
                        className="w-full bg-white p-2 rounded-lg border border-stone/20"
                      />
                    </div>
                    <div className="col-span-2">
                      <input
                        type="number"
                        placeholder="Qty"
                        value={item.qty}
                        onChange={(e) => handleLineItemChange(idx, 'qty', e.target.value)}
                        required
                        className="w-full bg-white p-2 rounded-lg border border-stone/20"
                      />
                    </div>
                    <div className="col-span-2">
                      <select
                        value={item.unit}
                        onChange={(e) => handleLineItemChange(idx, 'unit', e.target.value)}
                        className="w-full bg-white p-2 rounded-lg border border-stone/20"
                      >
                        <option value="m.t.">m.t.</option>
                        <option value="kg">kg</option>
                        <option value="bag">bag</option>
                      </select>
                    </div>
                    <div className="col-span-2">
                      <input
                        type="number"
                        placeholder="Rate (₹)"
                        value={item.rate}
                        onChange={(e) => handleLineItemChange(idx, 'rate', e.target.value)}
                        required
                        className="w-full bg-white p-2 rounded-lg border border-stone/20"
                      />
                    </div>
                    <div className="col-span-1 text-center">
                      {invoiceForm.lineItems.length > 1 && (
                        <button type="button" onClick={() => removeLineItem(idx)} className="text-red-500">
                          <HiOutlineTrash className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-stone/15">
                <button type="button" onClick={() => setShowInvoiceForm(false)} className="px-5 py-2.5 rounded-full text-xs font-semibold text-stone">
                  Cancel
                </button>
                <button type="submit" className="bg-forest text-cream px-6 py-2.5 rounded-full text-xs font-semibold hover:bg-primary-light">
                  Create Invoice & Preview
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── PRINT MODALS (DYNAMIC COMPANY PASSED) ─── */}
      {printInvoice && (
        <InvoicePrintModal
          invoice={printInvoice}
          company={currentCompany}
          onClose={() => setPrintInvoice(null)}
        />
      )}

      {printBill && (
        <BillOfSupplyPrintModal
          bill={printBill}
          company={currentCompany}
          onClose={() => setPrintBill(null)}
        />
      )}

      {receiptSale && (
        <ReceiptModal
          sale={receiptSale}
          company={currentCompany}
          onClose={() => setReceiptSale(null)}
        />
      )}

      {/* ─── DELETE CONFIRM MODAL ─── */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl animate-scale-in">
            <h4 className="font-heading text-xl text-ink font-bold mb-2">Confirm Delete</h4>
            <p className="text-stone text-xs mb-6">
              Are you sure you want to delete <strong className="text-ink">{deleteConfirm.name}</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm({ show: false, type: '', id: '', name: '' })}
                className="px-4 py-2 rounded-full text-xs font-semibold text-stone hover:text-ink"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-5 py-2 rounded-full text-xs font-semibold hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
