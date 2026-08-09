import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import {
  HiOutlineCube,
  HiOutlineShoppingCart,
  HiOutlineClipboardList,
  HiOutlineCash,
  HiOutlineLogout,
  HiOutlineMenu,
  HiOutlineX,
  HiOutlinePlus,
  HiOutlineMinus,
  HiOutlineDocumentText,
  HiOutlinePrinter,
  HiOutlineDownload,
  HiOutlineSearch,
  HiOutlineUserGroup
} from 'react-icons/hi';
import InvoicePrintModal from '../components/InvoicePrintModal';
import BillOfSupplyPrintModal from '../components/BillOfSupplyPrintModal';
import LabourManagement from '../components/LabourManagement';
import { SkeletonTableRow } from '../components/ui/SkeletonLoader';

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

const ManagerDashboard = () => {
  const { user, company: authCompany, logout } = useAuth();
  const navigate = useNavigate();

  const currentCompany = authCompany || user?.companyId || {
    name: 'HIRA AGRO INDUSTRY',
    billType: 'gst_invoice'
  };

  const isBillOfSupply = currentCompany?.billType === 'bill_of_supply';

  const tabs = [
    { id: 'stock', label: 'Stock Update', icon: HiOutlineCube },
    { id: 'sale', label: 'Record Sale', icon: HiOutlineShoppingCart },
    { id: 'invoices', label: isBillOfSupply ? 'Bills of Supply' : 'GST Invoices', icon: HiOutlineDocumentText },
    { id: 'labour', label: 'Labour System', icon: HiOutlineUserGroup },
    { id: 'history', label: 'Sales History', icon: HiOutlineClipboardList },
    { id: 'expenses', label: 'Expenses', icon: HiOutlineCash },
  ];

  const [activeTab, setActiveTab] = useState('stock');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [products, setProducts] = useState([]);

  // Stock state
  const [stockForm, setStockForm] = useState({ productId: '', changeAmount: '', type: 'add', note: '' });
  const [stockLogs, setStockLogs] = useState([]);
  const [stockLoading, setStockLoading] = useState(false);

  // Sale state
  const [saleForm, setSaleForm] = useState({ productId: '', quantitySold: '', ratePerUnit: '', buyerName: '', paymentStatus: 'paid' });

  // Sales history state
  const [sales, setSales] = useState([]);
  const [salesRevenue, setSalesRevenue] = useState(0);
  const [salesFilter, setSalesFilter] = useState({ startDate: '', endDate: '' });
  const [salesLoading, setSalesLoading] = useState(false);

  // Expense state
  const [expenseForm, setExpenseForm] = useState({ category: '', amount: '', note: '', date: new Date().toISOString().split('T')[0] });
  const [expenses, setExpenses] = useState([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [expenseLoading, setExpenseLoading] = useState(false);

  // Invoices & Bills state
  const [invoices, setInvoices] = useState([]);
  const [bills, setBills] = useState([]);
  const [invoicesLoading, setInvoicesLoading] = useState(false);
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [showBillForm, setShowBillForm] = useState(false);
  const [printInvoice, setPrintInvoice] = useState(null);
  const [printBill, setPrintBill] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // GST Invoice form
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

  // Bill of Supply form
  const [billForm, setBillForm] = useState({
    buyerName: '',
    buyerAddress: '',
    buyerGST: '',
    buyerStateCode: '27',
    broker: '',
    vehicleNo: '',
    lineItems: [{ description: '', hsnCode: '', qty: 0, weightKg: 0, rate: 0, amount: 0 }]
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (activeTab === 'stock') fetchStockLogs();
    if (activeTab === 'history') fetchSales();
    if (activeTab === 'expenses') fetchExpenses();
    if (activeTab === 'invoices') {
      if (isBillOfSupply) fetchBills();
      else fetchInvoices();
    }
  }, [activeTab]);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products');
      setProducts(res.data.products || []);
    } catch (err) { /* silent catch */ }
  };

  const fetchStockLogs = async () => {
    setStockLoading(true);
    try {
      const res = await api.get('/stock');
      setStockLogs(res.data.logs || res.data.stockLogs || []);
    } catch (err) { /* silent catch */ }
    setStockLoading(false);
  };

  const fetchSales = async () => {
    setSalesLoading(true);
    try {
      const params = {};
      if (salesFilter.startDate) params.startDate = salesFilter.startDate;
      if (salesFilter.endDate) params.endDate = salesFilter.endDate;
      const res = await api.get('/sales', { params });
      setSales(res.data.sales || []);
      setSalesRevenue(res.data.totalRevenue || 0);
    } catch (err) { /* silent catch */ }
    setSalesLoading(false);
  };

  const fetchExpenses = async () => {
    setExpenseLoading(true);
    try {
      const res = await api.get('/expenses');
      setExpenses(res.data.expenses || []);
      setTotalExpenses(res.data.totalExpenses || 0);
    } catch (err) { /* silent catch */ }
    setExpenseLoading(false);
  };

  const fetchInvoices = async () => {
    setInvoicesLoading(true);
    try {
      const res = await api.get('/invoices');
      setInvoices(res.data.invoices || []);
    } catch (err) { /* silent catch */ }
    setInvoicesLoading(false);
  };

  const fetchBills = async () => {
    setInvoicesLoading(true);
    try {
      const res = await api.get('/bills');
      setBills(res.data.bills || []);
    } catch (err) { /* silent catch */ }
    setInvoicesLoading(false);
  };

  const handleStockSubmit = async (e) => {
    e.preventDefault();
    if (!stockForm.productId || !stockForm.changeAmount) {
      return toast.error('Please select a product and enter quantity');
    }
    try {
      await api.post('/stock', {
        productId: stockForm.productId,
        changeAmount: Number(stockForm.changeAmount),
        type: stockForm.type,
        note: stockForm.note,
      });
      toast.success(`Stock ${stockForm.type === 'add' ? 'added' : 'deducted'} successfully`);
      setStockForm({ productId: '', changeAmount: '', type: 'add', note: '' });
      fetchProducts();
      fetchStockLogs();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update stock');
    }
  };

  const handleSaleSubmit = async (e) => {
    e.preventDefault();
    if (!saleForm.productId || !saleForm.quantitySold || !saleForm.ratePerUnit || !saleForm.buyerName) {
      return toast.error('All fields except payment status are required');
    }
    try {
      await api.post('/sales', {
        productId: saleForm.productId,
        quantitySold: Number(saleForm.quantitySold),
        ratePerUnit: Number(saleForm.ratePerUnit),
        buyerName: saleForm.buyerName,
        paymentStatus: saleForm.paymentStatus,
      });
      toast.success('Sale recorded successfully');
      setSaleForm({ productId: '', quantitySold: '', ratePerUnit: '', buyerName: '', paymentStatus: 'paid' });
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to record sale');
    }
  };

  const handleExpenseSubmit = async (e) => {
    e.preventDefault();
    if (!expenseForm.category || !expenseForm.amount) {
      return toast.error('Category and amount are required');
    }
    try {
      await api.post('/expenses', {
        category: expenseForm.category,
        amount: Number(expenseForm.amount),
        note: expenseForm.note,
        date: expenseForm.date,
      });
      toast.success('Expense recorded');
      setExpenseForm({ category: '', amount: '', note: '', date: new Date().toISOString().split('T')[0] });
      fetchExpenses();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to record expense');
    }
  };

  // GST Invoice helpers
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

  // Bill of Supply helpers
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

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-cream flex">
      {/* SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-56 bg-forest transform transition-transform duration-300 lg:relative lg:translate-x-0 ${
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
                  <p className="text-gold text-[9px] tracking-[0.15em] uppercase font-medium">Staff Portal</p>
                </div>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white/60 hover:text-white">
                <HiOutlineX className="w-6 h-6" />
              </button>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    isSelected
                      ? 'bg-white/10 text-gold font-bold shadow-xs'
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </nav>

          <div className="p-4 border-t border-white/10 space-y-3 mt-auto">
            <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl">
              <div className="w-9 h-9 bg-gold/20 rounded-full flex items-center justify-center">
                <span className="text-gold font-bold text-sm">{user?.name?.[0]?.toUpperCase()}</span>
              </div>
              <div>
                <p className="text-white text-sm font-semibold truncate max-w-[110px]">{user?.name}</p>
                <p className="text-gold/80 text-xs font-medium uppercase tracking-wider">Manager</p>
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
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)}></div>}

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="bg-cream border-b border-stone/10 px-8 py-5 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-xl hover:bg-cream">
              <HiOutlineMenu className="w-6 h-6 text-forest" />
            </button>
            <h1 className="font-heading text-2xl sm:text-3xl text-ink">
              {tabs.find(t => t.id === activeTab)?.label}
            </h1>
          </div>
          <button onClick={handleLogout} className="hidden sm:flex items-center gap-2 text-sm font-semibold text-stone hover:text-forest transition-colors">
            <HiOutlineLogout className="w-4 h-4" /> Sign Out
          </button>
        </header>

        <main className="flex-1 p-6 md:p-8 max-w-6xl w-full mx-auto space-y-8">

          {/* ─── TAB 1: STOCK UPDATE ─── */}
          {activeTab === 'stock' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
              <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-stone/15 shadow-xs">
                <h3 className="font-heading text-2xl text-ink mb-4">Adjust Inventory</h3>
                <form onSubmit={handleStockSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs uppercase font-semibold text-stone mb-1">Select Product *</label>
                    <select
                      value={stockForm.productId}
                      onChange={(e) => setStockForm(prev => ({ ...prev, productId: e.target.value }))}
                      className="w-full bg-transparent border-b border-stone/30 py-2 text-sm focus:outline-none focus:border-forest"
                      required
                    >
                      <option value="">-- Choose Product --</option>
                      {products.map(p => (
                        <option key={p._id} value={p._id}>
                          {p.name} ({p.variety}) — Current Stock: {p.stockQuantity} kg
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase font-semibold text-stone mb-1">Quantity (kg) *</label>
                      <input
                        type="number"
                        value={stockForm.changeAmount}
                        onChange={(e) => setStockForm(prev => ({ ...prev, changeAmount: e.target.value }))}
                        className="w-full bg-transparent border-b border-stone/30 py-2 text-sm focus:outline-none focus:border-forest"
                        required
                        min="1"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase font-semibold text-stone mb-1">Action Type</label>
                      <div className="flex gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setStockForm(prev => ({ ...prev, type: 'add' }))}
                          className={`flex-1 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1 ${
                            stockForm.type === 'add' ? 'bg-green-600 text-white' : 'bg-stone/10 text-stone'
                          }`}
                        >
                          <HiOutlinePlus className="w-3.5 h-3.5" /> Add
                        </button>
                        <button
                          type="button"
                          onClick={() => setStockForm(prev => ({ ...prev, type: 'remove' }))}
                          className={`flex-1 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1 ${
                            stockForm.type === 'remove' ? 'bg-red-600 text-white' : 'bg-stone/10 text-stone'
                          }`}
                        >
                          <HiOutlineMinus className="w-3.5 h-3.5" /> Deduct
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-semibold text-stone mb-1">Note / Reason</label>
                    <input
                      type="text"
                      value={stockForm.note}
                      onChange={(e) => setStockForm(prev => ({ ...prev, note: e.target.value }))}
                      placeholder="e.g. Fresh stock arrival from mill"
                      className="w-full bg-transparent border-b border-stone/30 py-2 text-sm focus:outline-none focus:border-forest"
                    />
                  </div>

                  <button type="submit" className="w-full bg-forest text-cream py-3 rounded-full text-xs font-semibold uppercase tracking-wider">
                    Submit Stock Update
                  </button>
                </form>
              </div>

              {/* Current Stock Table */}
              <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-stone/15 shadow-xs">
                <h3 className="font-heading text-2xl text-ink mb-4">Current Warehouse Stock</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-stone/5 border-b border-stone/10 text-xs font-semibold text-stone uppercase tracking-wider">
                      <tr>
                        <th className="py-3 px-4">Product</th>
                        <th className="py-3 px-4">Variety</th>
                        <th className="py-3 px-4">Rate (₹/kg)</th>
                        <th className="py-3 px-4">Available Stock</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone/10">
                      {products.map(p => (
                        <tr key={p._id} className="hover:bg-cream/40">
                          <td className="py-3 px-4 font-bold text-ink">{p.name}</td>
                          <td className="py-3 px-4 text-stone">{p.variety}</td>
                          <td className="py-3 px-4 font-bold text-forest">₹{p.ratePerKg}</td>
                          <td className="py-3 px-4 font-bold text-ink">{p.stockQuantity} kg</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ─── TAB 2: RECORD SALE ─── */}
          {activeTab === 'sale' && (
            <div className="max-w-xl mx-auto bg-white p-8 rounded-3xl border border-stone/15 shadow-sm animate-fade-in">
              <h3 className="font-heading text-2xl text-ink mb-6">Record New Grain Sale</h3>
              <form onSubmit={handleSaleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs uppercase font-semibold text-stone mb-1">Product *</label>
                  <select
                    value={saleForm.productId}
                    onChange={(e) => {
                      const pid = e.target.value;
                      const p = products.find(prod => prod._id === pid);
                      setSaleForm(prev => ({
                        ...prev,
                        productId: pid,
                        ratePerUnit: p ? String(p.ratePerKg) : prev.ratePerUnit
                      }));
                    }}
                    className="w-full bg-cream px-3 py-2.5 rounded-xl border border-stone/20 text-xs"
                    required
                  >
                    <option value="">-- Choose Product --</option>
                    {products.map(p => (
                      <option key={p._id} value={p._id}>
                        {p.name} ({p.variety}) — Rate: ₹{p.ratePerKg}/kg | Stock: {p.stockQuantity} kg
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase font-semibold text-stone mb-1">Quantity (kg) *</label>
                    <input
                      type="number"
                      value={saleForm.quantitySold}
                      onChange={(e) => setSaleForm(prev => ({ ...prev, quantitySold: e.target.value }))}
                      placeholder="e.g. 500"
                      className="w-full bg-cream px-3 py-2.5 rounded-xl border border-stone/20 text-xs"
                      required
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase font-semibold text-stone mb-1">Rate (₹/kg) *</label>
                    <input
                      type="number"
                      value={saleForm.ratePerUnit}
                      onChange={(e) => setSaleForm(prev => ({ ...prev, ratePerUnit: e.target.value }))}
                      className="w-full bg-cream px-3 py-2.5 rounded-xl border border-stone/20 text-xs"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase font-semibold text-stone mb-1">Buyer Name *</label>
                  <input
                    type="text"
                    value={saleForm.buyerName}
                    onChange={(e) => setSaleForm(prev => ({ ...prev, buyerName: e.target.value }))}
                    placeholder="e.g. Patel Traders"
                    className="w-full bg-cream px-3 py-2.5 rounded-xl border border-stone/20 text-xs"
                    required
                  />
                </div>

                <button type="submit" className="w-full bg-forest text-cream py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-primary-light transition-colors">
                  Record Sale
                </button>
              </form>
            </div>
          )}

          {/* ─── TAB 3: INVOICES / BILLS OF SUPPLY ─── */}
          {activeTab === 'invoices' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex justify-between items-center">
                <h3 className="font-heading text-xl text-ink font-bold">
                  {isBillOfSupply ? 'Bills of Supply' : 'GST Invoices'}
                </h3>
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
                        <th className="py-4 px-6 font-bold text-forest">Total Value</th>
                        <th className="py-4 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone/10">
                      {isBillOfSupply ? (
                        bills.length === 0 ? (
                          <tr>
                            <td colSpan="5" className="py-12 text-center text-stone text-xs">No bills generated yet.</td>
                          </tr>
                        ) : (
                          bills.map(b => (
                            <tr key={b._id} className="hover:bg-cream/40">
                              <td className="py-4 px-6 text-xs text-stone">{formatDateSafe(b.billDate || b.createdAt)}</td>
                              <td className="py-4 px-6 font-mono font-bold">{b.billNumber}</td>
                              <td className="py-4 px-6 font-semibold">{b.buyerName}</td>
                              <td className="py-4 px-6 font-heading text-lg font-bold text-forest">₹{b.total?.toLocaleString('en-IN')}</td>
                              <td className="py-4 px-6 text-right">
                                <button
                                  onClick={() => setPrintBill(b)}
                                  className="inline-flex items-center gap-1 bg-forest text-cream px-3 py-1.5 rounded-full text-xs font-semibold hover:bg-primary-light"
                                >
                                  <HiOutlinePrinter className="w-3.5 h-3.5" /> Print / PDF
                                </button>
                              </td>
                            </tr>
                          ))
                        )
                      ) : (
                        invoices.length === 0 ? (
                          <tr>
                            <td colSpan="5" className="py-12 text-center text-stone text-xs">No invoices generated yet.</td>
                          </tr>
                        ) : (
                          invoices.map(inv => (
                            <tr key={inv._id} className="hover:bg-cream/40">
                              <td className="py-4 px-6 text-xs text-stone">{formatDateSafe(inv.invoiceDate || inv.createdAt)}</td>
                              <td className="py-4 px-6 font-mono font-bold">{inv.invoiceNumber}</td>
                              <td className="py-4 px-6 font-semibold">{inv.buyerName}</td>
                              <td className="py-4 px-6 font-heading text-lg font-bold text-forest">₹{inv.totalInvoiceValue?.toLocaleString('en-IN')}</td>
                              <td className="py-4 px-6 text-right">
                                <button
                                  onClick={() => setPrintInvoice(inv)}
                                  className="inline-flex items-center gap-1 bg-forest text-cream px-3 py-1.5 rounded-full text-xs font-semibold hover:bg-primary-light"
                                >
                                  <HiOutlinePrinter className="w-3.5 h-3.5" /> Print / PDF
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

          {/* ─── TAB 4: LABOUR SYSTEM (NEW) ─── */}
          {activeTab === 'labour' && (
            <div className="animate-fade-in">
              <LabourManagement userRole="manager" />
            </div>
          )}

          {/* ─── TAB 5: SALES HISTORY ─── */}
          {activeTab === 'history' && (
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
                        <th className="py-4 px-6">Total Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone/10">
                      {sales.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="py-12 text-center text-stone text-xs">No sales recorded yet.</td>
                        </tr>
                      ) : (
                        sales.map(s => (
                          <tr key={s._id} className="hover:bg-cream/40">
                            <td className="py-4 px-6 text-xs text-stone">{formatDateSafe(s.createdAt)}</td>
                            <td className="py-4 px-6 font-semibold">{s.buyerName}</td>
                            <td className="py-4 px-6 text-stone">{s.productId?.name || 'Rice'}</td>
                            <td className="py-4 px-6 font-medium">{s.quantitySold} kg</td>
                            <td className="py-4 px-6 text-stone">₹{s.ratePerUnit}</td>
                            <td className="py-4 px-6 font-heading text-lg font-bold text-forest">₹{s.totalAmount}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ─── TAB 6: EXPENSES ─── */}
          {activeTab === 'expenses' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
              <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-stone/15 shadow-xs">
                <h3 className="font-heading text-2xl text-ink mb-4">Record Operating Expense</h3>
                <form onSubmit={handleExpenseSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs uppercase font-semibold text-stone mb-1">Category *</label>
                    <input
                      type="text"
                      value={expenseForm.category}
                      onChange={(e) => setExpenseForm(prev => ({ ...prev, category: e.target.value }))}
                      placeholder="e.g. Fuel, Machine Maintenance, Electricity"
                      className="w-full bg-transparent border-b border-stone/30 py-2 text-sm focus:outline-none focus:border-forest"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase font-semibold text-stone mb-1">Amount (₹) *</label>
                    <input
                      type="number"
                      value={expenseForm.amount}
                      onChange={(e) => setExpenseForm(prev => ({ ...prev, amount: e.target.value }))}
                      className="w-full bg-transparent border-b border-stone/30 py-2 text-sm focus:outline-none focus:border-forest"
                      required
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase font-semibold text-stone mb-1">Note / Description</label>
                    <input
                      type="text"
                      value={expenseForm.note}
                      onChange={(e) => setExpenseForm(prev => ({ ...prev, note: e.target.value }))}
                      placeholder="e.g. Diesel for generator"
                      className="w-full bg-transparent border-b border-stone/30 py-2 text-sm focus:outline-none focus:border-forest"
                    />
                  </div>
                  <button type="submit" className="w-full bg-forest text-cream py-3 rounded-full text-xs font-semibold uppercase tracking-wider">
                    Save Expense
                  </button>
                </form>
              </div>

              <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-stone/15 shadow-xs">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-heading text-2xl text-ink">Recent Expenses</h3>
                  <span className="text-xs font-bold text-forest bg-green-50 px-3 py-1 rounded-full border border-green-200">
                    Total: ₹{totalExpenses.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-stone/5 border-b border-stone/10 text-xs font-semibold text-stone uppercase tracking-wider">
                      <tr>
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Amount</th>
                        <th className="py-3 px-4">Note</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone/10">
                      {expenses.map(exp => (
                        <tr key={exp._id} className="hover:bg-cream/40">
                          <td className="py-3 px-4 text-xs text-stone">{formatDateSafe(exp.date || exp.createdAt)}</td>
                          <td className="py-3 px-4 font-semibold text-ink">{exp.category}</td>
                          <td className="py-3 px-4 font-bold text-forest">₹{exp.amount}</td>
                          <td className="py-3 px-4 text-xs text-stone">{exp.note || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

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
    </div>
  );
};

export default ManagerDashboard;
