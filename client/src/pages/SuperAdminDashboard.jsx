import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import {
  HiOutlineOfficeBuilding,
  HiOutlineChartBar,
  HiOutlineCurrencyRupee,
  HiOutlineUsers,
  HiOutlineShoppingCart,
  HiOutlineLogout,
  HiOutlineArrowRight,
  HiOutlineDocumentText,
  HiOutlineBadgeCheck,
  HiOutlineCheckCircle
} from 'react-icons/hi';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import AdminDashboard from './AdminDashboard';
import { SkeletonCard } from '../components/ui/SkeletonLoader';

const SuperAdminDashboard = () => {
  const { user, logout, switchCompany, activeCompanyId } = useAuth();
  const [companies, setCompanies] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState(activeCompanyId || null);
  const [overviewStats, setOverviewStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch all companies list
  const fetchCompanies = async () => {
    try {
      const res = await api.get('/companies');
      setCompanies(res.data.companies || []);
    } catch (err) {
      toast.error('Failed to load companies');
    }
  };

  // Fetch Super Admin aggregate overview
  const fetchOverview = async () => {
    setLoading(true);
    try {
      const res = await api.get('/super-admin/overview');
      setOverviewStats(res.data);
    } catch (err) {
      toast.error('Failed to load aggregate overview stats');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    if (!selectedCompanyId) {
      fetchOverview();
    }
  }, [selectedCompanyId]);

  const handleSelectCompany = (companyId) => {
    setSelectedCompanyId(companyId);
    switchCompany(companyId);
  };

  const selectedCompanyObj = companies.find(c => c._id === selectedCompanyId);

  return (
    <div className="min-h-screen bg-cream">
      {/* ─── PERSISTENT SUPER ADMIN HEADER & COMPANY SWITCHER ─── */}
      <header className="bg-forest text-cream border-b border-forest/20 sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Brand & Super Admin Badge */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="font-heading text-xl font-bold tracking-tight text-cream">Hira Agro</span>
                <span className="bg-gold/20 text-gold text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full border border-gold/30">
                  Super Admin
                </span>
              </div>
            </div>

            {/* Middle: Company Switcher Dropdown */}
            <div className="flex items-center gap-2">
              <label className="text-xs text-cream/70 font-medium hidden sm:inline">Active Company:</label>
              <select
                value={selectedCompanyId || ''}
                onChange={(e) => handleSelectCompany(e.target.value || null)}
                className="bg-primary-dark/80 text-cream px-3 py-1.5 rounded-xl border border-cream/20 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-gold/50 cursor-pointer"
              >
                <option value="">📊 All Companies Overview</option>
                <optgroup label="Select Individual Business">
                  {companies.map((comp) => (
                    <option key={comp._id} value={comp._id}>
                      {comp.name} ({comp.billType === 'gst_invoice' ? 'GST' : 'Bill of Supply'})
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            {/* Right: User profile & Logout */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-cream/80 font-medium hidden md:inline">
                {user?.name || 'Sayam'}
              </span>
              <button
                onClick={logout}
                className="inline-flex items-center gap-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-200 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
              >
                <HiOutlineLogout className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ─── VIEW 1: ALL COMPANIES OVERVIEW (6TH VIEW) ─── */}
      {!selectedCompanyId ? (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-forest to-primary-light text-cream rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
            <div className="relative z-10 max-w-2xl">
              <span className="text-gold text-xs uppercase tracking-[0.2em] font-semibold block mb-2">
                Multi-Business Control Center
              </span>
              <h1 className="font-heading text-3xl sm:text-4xl font-bold mb-2">
                All Companies Overview
              </h1>
              <p className="text-cream/70 text-sm leading-relaxed">
                Centralized dashboard aggregating operations, sales revenue, GST/Supply invoices, and labour payroll across all 5 registered business entities.
              </p>
            </div>
          </div>

          {/* Aggregate Top Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white p-5 rounded-2xl border border-stone/15 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-stone">Total Revenue</span>
                <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
                  <HiOutlineCurrencyRupee className="w-5 h-5" />
                </div>
              </div>
              <p className="font-heading text-2xl sm:text-3xl font-bold text-forest">
                ₹{overviewStats?.totals?.totalRevenue?.toLocaleString('en-IN') || '0'}
              </p>
              <p className="text-xs text-stone mt-1">Across all 5 companies</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone/15 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-stone">This Month Sales</span>
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <HiOutlineChartBar className="w-5 h-5" />
                </div>
              </div>
              <p className="font-heading text-2xl sm:text-3xl font-bold text-ink">
                ₹{overviewStats?.totals?.monthlyRevenue?.toLocaleString('en-IN') || '0'}
              </p>
              <p className="text-xs text-stone mt-1">Current month turnover</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone/15 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-stone">Active Labourers</span>
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <HiOutlineUsers className="w-5 h-5" />
                </div>
              </div>
              <p className="font-heading text-2xl sm:text-3xl font-bold text-ink">
                {overviewStats?.totals?.totalLabourers || 0}
              </p>
              <p className="text-xs text-stone mt-1">Active workforce enrolled</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone/15 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-stone">Monthly Labour Paid</span>
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <HiOutlineCurrencyRupee className="w-5 h-5" />
                </div>
              </div>
              <p className="font-heading text-2xl sm:text-3xl font-bold text-ink">
                ₹{overviewStats?.totals?.monthlyLabourCost?.toLocaleString('en-IN') || '0'}
              </p>
              <p className="text-xs text-stone mt-1">Advances & wages this month</p>
            </div>
          </div>

          {/* Revenue Breakdown Chart */}
          <div className="bg-white p-6 rounded-3xl border border-stone/15 shadow-sm space-y-4">
            <h3 className="font-heading text-xl text-ink font-bold">Per-Company Revenue Breakdown</h3>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={overviewStats?.companies || []} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#78716c' }} interval={0} angle={-15} textAnchor="end" />
                  <YAxis tick={{ fontSize: 11, fill: '#78716c' }} tickFormatter={(val) => `₹${val / 1000}k`} />
                  <Tooltip
                    formatter={(value) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Total Revenue']}
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e5e5e5' }}
                  />
                  <Bar dataKey="totalRevenue" fill="#1a3d2e" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 5 Company Quick-Access Cards */}
          <div className="space-y-4">
            <h3 className="font-heading text-xl text-ink font-bold">Registered Businesses (5)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {companies.map((comp) => {
                const compStat = overviewStats?.companies?.find(c => c.companyId === comp._id) || {};
                return (
                  <div
                    key={comp._id}
                    className="bg-white rounded-3xl p-6 border border-stone/15 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          comp.billType === 'gst_invoice' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {comp.billType === 'gst_invoice' ? 'GST Invoice' : 'Bill of Supply'}
                        </span>
                        <span className="text-xs font-mono font-semibold text-stone">
                          {comp.invoicePrefix}
                        </span>
                      </div>

                      <h4 className="font-heading text-lg font-bold text-ink mb-1">{comp.name}</h4>
                      {comp.tagline && (
                        <p className="text-xs text-stone italic mb-2">{comp.tagline}</p>
                      )}

                      <p className="text-xs text-stone mb-4 line-clamp-2">
                        📍 {comp.addresses?.[0] || 'Dahanu, Maharashtra'}
                      </p>

                      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-stone/10 text-xs">
                        <div>
                          <span className="text-stone block">Revenue</span>
                          <span className="font-bold text-forest">₹{compStat.totalRevenue?.toLocaleString('en-IN') || 0}</span>
                        </div>
                        <div>
                          <span className="text-stone block">Labourers</span>
                          <span className="font-bold text-ink">{compStat.activeLabourers || 0}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleSelectCompany(comp._id)}
                      className="mt-6 w-full inline-flex items-center justify-center gap-2 bg-cream hover:bg-forest hover:text-cream text-ink text-xs font-semibold py-2.5 rounded-xl border border-stone/20 transition-all duration-200"
                    >
                      Enter Company Dashboard <HiOutlineArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      ) : (
        /* ─── VIEW 2: INDIVIDUAL COMPANY DASHBOARD (SCOPED) ─── */
        <div className="animate-fade-in">
          {/* Active Company Sub-banner */}
          <div className="bg-cream-dark border-b border-stone/20 px-6 py-2 flex items-center justify-between text-xs">
            <span className="text-stone">
              Viewing dashboard for: <strong className="text-forest font-bold text-sm">{selectedCompanyObj?.name}</strong> ({selectedCompanyObj?.billType === 'gst_invoice' ? 'GST Invoice System' : 'Bill of Supply System'})
            </span>
            <button
              onClick={() => handleSelectCompany(null)}
              className="text-stone hover:text-forest underline font-semibold"
            >
              ← Back to All Companies Overview
            </button>
          </div>

          {/* Render Full Admin Dashboard in company context */}
          <AdminDashboard superAdminMode={true} companyData={selectedCompanyObj} />
        </div>
      )}
    </div>
  );
};

export default SuperAdminDashboard;
