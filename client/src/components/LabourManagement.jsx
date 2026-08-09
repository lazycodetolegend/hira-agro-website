import { useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import {
  HiOutlineUsers,
  HiOutlineCalendar,
  HiOutlineCurrencyRupee,
  HiOutlineDocumentReport,
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineCheck,
  HiOutlineDownload,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineClock
} from 'react-icons/hi';
import { exportToCsv } from '../utils/exportCsv';
import { SkeletonTableRow } from './ui/SkeletonLoader';

const LabourManagement = ({ userRole }) => {
  const [subTab, setSubTab] = useState('attendance'); // 'attendance' | 'workers' | 'payments' | 'salary'
  
  // Data states
  const [labourers, setLabourers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Attendance state
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceEntries, setAttendanceEntries] = useState({}); // { [labourerId]: 'present' | 'absent' | 'half-day' }
  const [savingAttendance, setSavingAttendance] = useState(false);

  // Worker Modal state
  const [showWorkerModal, setShowWorkerModal] = useState(false);
  const [editingWorker, setEditingWorker] = useState(null);
  const [workerForm, setWorkerForm] = useState({
    name: '',
    designation: '',
    phone: '',
    wageType: 'daily',
    wageAmount: '',
    active: true
  });

  // Payment Modal state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [payments, setPayments] = useState([]);
  const [paymentForm, setPaymentForm] = useState({
    labourerId: '',
    amount: '',
    type: 'advance',
    date: new Date().toISOString().split('T')[0],
    note: ''
  });

  // Delete Confirmation state
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, type: '', id: '', name: '' });

  // Salary Summary state
  const [salaryMonth, setSalaryMonth] = useState(new Date().getMonth() + 1);
  const [salaryYear, setSalaryYear] = useState(new Date().getFullYear());
  const [salarySummary, setSalarySummary] = useState([]);
  const [summaryLoading, setSummaryLoading] = useState(false);

  // Fetch Labourers
  const fetchLabourers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/labourers');
      setLabourers(res.data.labourers || []);
    } catch (err) {
      toast.error('Failed to load labourers');
    }
    setLoading(false);
  };

  // Fetch Attendance for Date
  const fetchAttendanceForDate = async (date) => {
    try {
      const res = await api.get(`/attendance?date=${date}`);
      const records = res.data.attendance || [];
      const entryMap = {};
      records.forEach(r => {
        const id = r.labourerId?._id || r.labourerId;
        if (id) entryMap[id] = r.status;
      });
      setAttendanceEntries(entryMap);
    } catch (err) {
      /* silent */
    }
  };

  // Fetch Payments
  const fetchPayments = async () => {
    try {
      const res = await api.get('/labour-payments');
      setPayments(res.data.payments || []);
    } catch (err) {
      /* silent */
    }
  };

  // Fetch Salary Summary
  const fetchSalarySummary = async () => {
    setSummaryLoading(true);
    try {
      const res = await api.get(`/labour/salary-summary?month=${salaryMonth}&year=${salaryYear}`);
      setSalarySummary(res.data.summary || []);
    } catch (err) {
      toast.error('Failed to generate salary report');
    }
    setSummaryLoading(false);
  };

  useEffect(() => {
    fetchLabourers();
  }, []);

  useEffect(() => {
    if (subTab === 'attendance') {
      fetchAttendanceForDate(attendanceDate);
    } else if (subTab === 'payments') {
      fetchPayments();
    } else if (subTab === 'salary') {
      fetchSalarySummary();
    }
  }, [subTab, attendanceDate, salaryMonth, salaryYear]);

  const getAttendanceStatus = (labourerId) => {
    return attendanceEntries[labourerId] || 'present';
  };

  const handleStatusChange = (labourerId, status) => {
    setAttendanceEntries(prev => ({
      ...prev,
      [labourerId]: status
    }));
  };

  const handleSaveAttendance = async () => {
    setSavingAttendance(true);
    try {
      const entries = labourers
        .filter(l => l.active)
        .map(l => ({
          labourerId: l._id,
          status: attendanceEntries[l._id] || 'present'
        }));

      await api.post('/attendance/bulk', {
        date: attendanceDate,
        entries
      });
      toast.success('Attendance saved successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save attendance');
    }
    setSavingAttendance(false);
  };

  const handleWorkerSubmit = async (e) => {
    e.preventDefault();
    if (!workerForm.name || !workerForm.wageAmount) {
      return toast.error('Worker name and wage amount are required');
    }

    try {
      if (editingWorker) {
        await api.put(`/labourers/${editingWorker._id}`, workerForm);
        toast.success('Worker details updated');
      } else {
        await api.post('/labourers', workerForm);
        toast.success('Worker added successfully');
      }
      setShowWorkerModal(false);
      setEditingWorker(null);
      fetchLabourers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save worker');
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!paymentForm.labourerId || !paymentForm.amount) {
      return toast.error('Please select worker and enter amount');
    }

    try {
      await api.post('/labour-payments', paymentForm);
      toast.success('Payment recorded successfully');
      setShowPaymentModal(false);
      setPaymentForm({
        labourerId: '',
        amount: '',
        type: 'advance',
        date: new Date().toISOString().split('T')[0],
        note: ''
      });
      fetchPayments();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to record payment');
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      if (deleteConfirm.type === 'worker') {
        await api.delete(`/labourers/${deleteConfirm.id}`);
        toast.success('Worker and related history deleted');
        fetchLabourers();
      } else if (deleteConfirm.type === 'payment') {
        await api.delete(`/labour-payments/${deleteConfirm.id}`);
        toast.success('Payment record deleted');
        fetchPayments();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete operation failed');
    }
    setDeleteConfirm({ show: false, type: '', id: '', name: '' });
  };

  const exportSalaryCsv = () => {
    const monthNames = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const columns = [
      { label: 'Worker Name', key: 'labourerName' },
      { label: 'Designation', key: 'designation' },
      { label: 'Wage Type', key: 'wageType' },
      { label: 'Wage Rate (Rs)', key: 'wageAmount' },
      { label: 'Present Days', key: 'daysPresent' },
      { label: 'Half Days', key: 'halfDays' },
      { label: 'Absent Days', key: 'daysAbsent' },
      { label: 'Gross Salary (Rs)', key: 'grossSalary' },
      { label: 'Advances / Paid (Rs)', key: 'totalPayments' },
      { label: 'Net Payable (Rs)', key: 'netPayable' },
    ];
    exportToCsv(salarySummary, `Labour_Salary_Sheet_${monthNames[salaryMonth]}_${salaryYear}.csv`, columns);
  };

  return (
    <div className="space-y-6">
      {/* Top Navigation Subtabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone/15 pb-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setSubTab('attendance')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              subTab === 'attendance'
                ? 'bg-forest text-cream shadow-sm'
                : 'bg-cream text-stone hover:text-ink hover:bg-stone/10'
            }`}
          >
            <HiOutlineCalendar className="w-4 h-4" /> Daily Attendance
          </button>

          <button
            onClick={() => setSubTab('workers')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              subTab === 'workers'
                ? 'bg-forest text-cream shadow-sm'
                : 'bg-cream text-stone hover:text-ink hover:bg-stone/10'
            }`}
          >
            <HiOutlineUsers className="w-4 h-4" /> Workers ({labourers.length})
          </button>

          <button
            onClick={() => setSubTab('payments')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              subTab === 'payments'
                ? 'bg-forest text-cream shadow-sm'
                : 'bg-cream text-stone hover:text-ink hover:bg-stone/10'
            }`}
          >
            <HiOutlineCurrencyRupee className="w-4 h-4" /> Advances & Payments
          </button>

          <button
            onClick={() => setSubTab('salary')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              subTab === 'salary'
                ? 'bg-forest text-cream shadow-sm'
                : 'bg-cream text-stone hover:text-ink hover:bg-stone/10'
            }`}
          >
            <HiOutlineDocumentReport className="w-4 h-4" /> Monthly Salary Sheet
          </button>
        </div>

        {/* Action button based on subtab */}
        {subTab === 'workers' && (
          <button
            onClick={() => {
              setEditingWorker(null);
              setWorkerForm({ name: '', designation: '', phone: '', wageType: 'daily', wageAmount: '', active: true });
              setShowWorkerModal(true);
            }}
            className="inline-flex items-center gap-2 bg-forest text-cream px-4 py-2 rounded-full text-xs font-semibold hover:bg-primary-light transition-colors"
          >
            <HiOutlinePlus className="w-4 h-4" /> Add Worker
          </button>
        )}

        {subTab === 'payments' && (
          <button
            onClick={() => setShowPaymentModal(true)}
            className="inline-flex items-center gap-2 bg-forest text-cream px-4 py-2 rounded-full text-xs font-semibold hover:bg-primary-light transition-colors"
          >
            <HiOutlinePlus className="w-4 h-4" /> Record Payment
          </button>
        )}

        {subTab === 'salary' && salarySummary.length > 0 && (
          <button
            onClick={exportSalaryCsv}
            className="inline-flex items-center gap-2 bg-cream-dark text-ink px-4 py-2 rounded-full text-xs font-semibold hover:bg-stone/20 transition-colors border border-stone/20"
          >
            <HiOutlineDownload className="w-4 h-4" /> Export CSV Sheet
          </button>
        )}
      </div>

      {/* ─── SUBTAB 1: DAILY ATTENDANCE ─── */}
      {subTab === 'attendance' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-stone/15">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-stone uppercase tracking-wider">Attendance Date:</span>
              <input
                type="date"
                value={attendanceDate}
                onChange={(e) => setAttendanceDate(e.target.value)}
                className="bg-cream px-3 py-1.5 rounded-lg border border-stone/20 text-xs font-medium text-ink focus:outline-none focus:border-forest"
              />
            </div>

            <button
              onClick={handleSaveAttendance}
              disabled={savingAttendance || labourers.length === 0}
              className="inline-flex items-center gap-2 bg-forest text-cream px-5 py-2 rounded-full text-xs font-semibold hover:bg-primary-light transition-colors disabled:opacity-50"
            >
              {savingAttendance ? 'Saving...' : <><HiOutlineCheck className="w-4 h-4" /> Save Attendance</>}
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-stone/15 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-stone/15 bg-stone/5 text-stone font-semibold">
                    <th className="py-3 px-4">#</th>
                    <th className="py-3 px-4">Worker Name</th>
                    <th className="py-3 px-4">Designation</th>
                    <th className="py-3 px-4">Wage Type</th>
                    <th className="py-3 px-4 text-center">Status / Toggle</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone/10">
                  {labourers.filter(l => l.active).length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-10 text-stone">
                        No active workers found. Add workers first under the &quot;Workers&quot; tab.
                      </td>
                    </tr>
                  ) : (
                    labourers.filter(l => l.active).map((labourer, idx) => {
                      const currentStatus = getAttendanceStatus(labourer._id);
                      return (
                        <tr key={labourer._id} className="hover:bg-cream/40 transition-colors">
                          <td className="py-3 px-4 text-stone">{idx + 1}</td>
                          <td className="py-3 px-4 font-bold text-ink">{labourer.name}</td>
                          <td className="py-3 px-4 text-stone">{labourer.designation || 'General Labour'}</td>
                          <td className="py-3 px-4 capitalize text-stone">{labourer.wageType} (₹{labourer.wageAmount})</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleStatusChange(labourer._id, 'present')}
                                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                                  currentStatus === 'present'
                                    ? 'bg-green-600 text-white shadow-sm ring-2 ring-green-600/30'
                                    : 'bg-stone/10 text-stone hover:bg-green-50 hover:text-green-700'
                                }`}
                              >
                                Present
                              </button>

                              <button
                                type="button"
                                onClick={() => handleStatusChange(labourer._id, 'half-day')}
                                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                                  currentStatus === 'half-day'
                                    ? 'bg-amber-500 text-white shadow-sm ring-2 ring-amber-500/30'
                                    : 'bg-stone/10 text-stone hover:bg-amber-50 hover:text-amber-700'
                                }`}
                              >
                                Half-Day
                              </button>

                              <button
                                type="button"
                                onClick={() => handleStatusChange(labourer._id, 'absent')}
                                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                                  currentStatus === 'absent'
                                    ? 'bg-red-600 text-white shadow-sm ring-2 ring-red-600/30'
                                    : 'bg-stone/10 text-stone hover:bg-red-50 hover:text-red-700'
                                }`}
                              >
                                Absent
                              </button>
                            </div>
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

      {/* ─── SUBTAB 2: WORKERS LIST ─── */}
      {subTab === 'workers' && (
        <div className="bg-white rounded-2xl border border-stone/15 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone/15 bg-stone/5 text-stone font-semibold">
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Designation</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Wage Type</th>
                  <th className="py-3 px-4">Rate</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone/10">
                {labourers.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-10 text-stone">
                      No workers added yet. Click &quot;Add Worker&quot; to register labourers.
                    </td>
                  </tr>
                ) : (
                  labourers.map((labourer, idx) => (
                    <tr key={labourer._id} className="hover:bg-cream/40 transition-colors">
                      <td className="py-3 px-4 text-stone">{idx + 1}</td>
                      <td className="py-3 px-4 font-bold text-ink">{labourer.name}</td>
                      <td className="py-3 px-4 text-stone">{labourer.designation || 'General Labour'}</td>
                      <td className="py-3 px-4 text-stone">{labourer.phone || '—'}</td>
                      <td className="py-3 px-4 capitalize">{labourer.wageType}</td>
                      <td className="py-3 px-4 font-bold text-forest">₹{labourer.wageAmount}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          labourer.active ? 'bg-green-100 text-green-800' : 'bg-stone/20 text-stone'
                        }`}>
                          {labourer.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-1 whitespace-nowrap">
                        <button
                          onClick={() => {
                            setEditingWorker(labourer);
                            setWorkerForm({
                              name: labourer.name,
                              designation: labourer.designation || '',
                              phone: labourer.phone || '',
                              wageType: labourer.wageType,
                              wageAmount: String(labourer.wageAmount),
                              active: labourer.active
                            });
                            setShowWorkerModal(true);
                          }}
                          className="p-1.5 text-stone hover:text-ink rounded-lg hover:bg-stone/10 transition-colors inline-block"
                          title="Edit Worker"
                        >
                          <HiOutlinePencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setDeleteConfirm({
                              show: true,
                              type: 'worker',
                              id: labourer._id,
                              name: labourer.name
                            });
                          }}
                          className="p-1.5 text-stone hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors inline-block"
                          title="Delete Worker"
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
      )}

      {/* ─── SUBTAB 3: ADVANCES & PAYMENTS ─── */}
      {subTab === 'payments' && (
        <div className="bg-white rounded-2xl border border-stone/15 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone/15 bg-stone/5 text-stone font-semibold">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Worker</th>
                  <th className="py-3 px-4">Payment Type</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Note</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone/10">
                {payments.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-10 text-stone">
                      No payment or advance records found. Click &quot;Record Payment&quot; to add one.
                    </td>
                  </tr>
                ) : (
                  payments.map((p) => (
                    <tr key={p._id} className="hover:bg-cream/40 transition-colors">
                      <td className="py-3 px-4 text-stone">{new Date(p.date).toLocaleDateString('en-IN')}</td>
                      <td className="py-3 px-4 font-bold text-ink">{p.labourerId?.name || 'Worker'}</td>
                      <td className="py-3 px-4 capitalize">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          p.type === 'advance' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {p.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-forest">₹{p.amount?.toLocaleString('en-IN')}</td>
                      <td className="py-3 px-4 text-stone">{p.note || '—'}</td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            setDeleteConfirm({
                              show: true,
                              type: 'payment',
                              id: p._id,
                              name: `Payment of ₹${p.amount} for ${p.labourerId?.name || 'Worker'}`
                            });
                          }}
                          className="p-1.5 text-stone hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors inline-block"
                          title="Delete Payment Entry"
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
      )}

      {/* ─── SUBTAB 4: MONTHLY SALARY SHEET ─── */}
      {subTab === 'salary' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-2xl border border-stone/15">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-stone uppercase tracking-wider">Month:</span>
              <select
                value={salaryMonth}
                onChange={(e) => setSalaryMonth(Number(e.target.value))}
                className="bg-cream px-3 py-1.5 rounded-lg border border-stone/20 text-xs font-medium text-ink focus:outline-none focus:border-forest"
              >
                {[
                  { m: 1, name: 'January' }, { m: 2, name: 'February' }, { m: 3, name: 'March' },
                  { m: 4, name: 'April' }, { m: 5, name: 'May' }, { m: 6, name: 'June' },
                  { m: 7, name: 'July' }, { m: 8, name: 'August' }, { m: 9, name: 'September' },
                  { m: 10, name: 'October' }, { m: 11, name: 'November' }, { m: 12, name: 'December' }
                ].map(item => (
                  <option key={item.m} value={item.m}>{item.name}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-stone uppercase tracking-wider">Year:</span>
              <select
                value={salaryYear}
                onChange={(e) => setSalaryYear(Number(e.target.value))}
                className="bg-cream px-3 py-1.5 rounded-lg border border-stone/20 text-xs font-medium text-ink focus:outline-none focus:border-forest"
              >
                {[2025, 2026, 2027, 2028].map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-stone/15 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-stone/15 bg-stone/5 text-stone font-semibold">
                    <th className="py-3 px-4">Worker</th>
                    <th className="py-3 px-4">Wage Type</th>
                    <th className="py-3 px-4 text-center">Present</th>
                    <th className="py-3 px-4 text-center">Half-Day</th>
                    <th className="py-3 px-4 text-center">Absent</th>
                    <th className="py-3 px-4 text-right">Gross Salary</th>
                    <th className="py-3 px-4 text-right">Advances / Paid</th>
                    <th className="py-3 px-4 text-right">Net Payable</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone/10">
                  {summaryLoading ? (
                    Array.from({ length: 3 }).map((_, i) => <SkeletonTableRow key={i} cols={8} />)
                  ) : salarySummary.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="text-center py-10 text-stone">
                        No salary records for selected period.
                      </td>
                    </tr>
                  ) : (
                    salarySummary.map((row) => (
                      <tr key={row.labourerId} className="hover:bg-cream/40 transition-colors">
                        <td className="py-3 px-4">
                          <span className="font-bold text-ink block">{row.labourerName}</span>
                          <span className="text-[10px] text-stone">{row.designation || 'General Labour'}</span>
                        </td>
                        <td className="py-3 px-4 capitalize text-stone">
                          {row.wageType} (₹{row.wageAmount})
                        </td>
                        <td className="py-3 px-4 text-center font-semibold text-green-700">{row.daysPresent}</td>
                        <td className="py-3 px-4 text-center font-semibold text-amber-700">{row.halfDays}</td>
                        <td className="py-3 px-4 text-center font-semibold text-red-700">{row.daysAbsent}</td>
                        <td className="py-3 px-4 text-right font-bold text-ink">₹{row.grossSalary?.toLocaleString('en-IN')}</td>
                        <td className="py-3 px-4 text-right font-medium text-amber-800">-₹{row.totalPayments?.toLocaleString('en-IN')}</td>
                        <td className="py-3 px-4 text-right font-bold text-forest text-sm">₹{row.netPayable?.toLocaleString('en-IN')}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL: ADD / EDIT WORKER ─── */}
      {showWorkerModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-scale-in">
            <h3 className="font-heading text-xl text-ink mb-4">
              {editingWorker ? 'Edit Worker' : 'Register New Worker'}
            </h3>
            <form onSubmit={handleWorkerSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone uppercase mb-1">Full Name *</label>
                <input
                  type="text"
                  value={workerForm.name}
                  onChange={(e) => setWorkerForm({ ...workerForm, name: e.target.value })}
                  placeholder="e.g. Ramesh Kumar"
                  required
                  className="w-full bg-cream px-3 py-2 rounded-xl border border-stone/20 text-xs text-ink focus:outline-none focus:border-forest"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone uppercase mb-1">Designation</label>
                <input
                  type="text"
                  value={workerForm.designation}
                  onChange={(e) => setWorkerForm({ ...workerForm, designation: e.target.value })}
                  placeholder="e.g. Grain Sorter, Miller, Loader"
                  className="w-full bg-cream px-3 py-2 rounded-xl border border-stone/20 text-xs text-ink focus:outline-none focus:border-forest"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone uppercase mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={workerForm.phone}
                  onChange={(e) => setWorkerForm({ ...workerForm, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full bg-cream px-3 py-2 rounded-xl border border-stone/20 text-xs text-ink focus:outline-none focus:border-forest"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone uppercase mb-1">Wage Type</label>
                  <select
                    value={workerForm.wageType}
                    onChange={(e) => setWorkerForm({ ...workerForm, wageType: e.target.value })}
                    className="w-full bg-cream px-3 py-2 rounded-xl border border-stone/20 text-xs text-ink focus:outline-none focus:border-forest"
                  >
                    <option value="daily">Daily Wage</option>
                    <option value="monthly">Fixed Monthly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone uppercase mb-1">Wage Amount (₹) *</label>
                  <input
                    type="number"
                    value={workerForm.wageAmount}
                    onChange={(e) => setWorkerForm({ ...workerForm, wageAmount: e.target.value })}
                    placeholder="e.g. 500"
                    required
                    min="0"
                    className="w-full bg-cream px-3 py-2 rounded-xl border border-stone/20 text-xs text-ink focus:outline-none focus:border-forest"
                  />
                </div>
              </div>

              {editingWorker && (
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="workerActive"
                    checked={workerForm.active}
                    onChange={(e) => setWorkerForm({ ...workerForm, active: e.target.checked })}
                    className="rounded text-forest focus:ring-forest"
                  />
                  <label htmlFor="workerActive" className="text-xs font-medium text-ink">Active Worker</label>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-stone/15">
                <button
                  type="button"
                  onClick={() => setShowWorkerModal(false)}
                  className="px-4 py-2 rounded-full text-xs font-semibold text-stone hover:text-ink"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-forest text-cream px-5 py-2 rounded-full text-xs font-semibold hover:bg-primary-light transition-colors"
                >
                  Save Worker
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL: RECORD PAYMENT ─── */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-scale-in">
            <h3 className="font-heading text-xl text-ink mb-4">Record Advance / Payment</h3>
            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone uppercase mb-1">Select Worker *</label>
                <select
                  value={paymentForm.labourerId}
                  onChange={(e) => setPaymentForm({ ...paymentForm, labourerId: e.target.value })}
                  required
                  className="w-full bg-cream px-3 py-2 rounded-xl border border-stone/20 text-xs text-ink focus:outline-none focus:border-forest"
                >
                  <option value="">-- Choose Labourer --</option>
                  {labourers.filter(l => l.active).map(l => (
                    <option key={l._id} value={l._id}>{l.name} ({l.designation || 'Labour'})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone uppercase mb-1">Amount (₹) *</label>
                  <input
                    type="number"
                    value={paymentForm.amount}
                    onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                    placeholder="e.g. 1000"
                    required
                    min="1"
                    className="w-full bg-cream px-3 py-2 rounded-xl border border-stone/20 text-xs text-ink focus:outline-none focus:border-forest"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone uppercase mb-1">Payment Type</label>
                  <select
                    value={paymentForm.type}
                    onChange={(e) => setPaymentForm({ ...paymentForm, type: e.target.value })}
                    className="w-full bg-cream px-3 py-2 rounded-xl border border-stone/20 text-xs text-ink focus:outline-none focus:border-forest"
                  >
                    <option value="advance">Advance</option>
                    <option value="bonus">Bonus</option>
                    <option value="extra">Extra / Overtime</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone uppercase mb-1">Payment Date</label>
                <input
                  type="date"
                  value={paymentForm.date}
                  onChange={(e) => setPaymentForm({ ...paymentForm, date: e.target.value })}
                  className="w-full bg-cream px-3 py-2 rounded-xl border border-stone/20 text-xs text-ink focus:outline-none focus:border-forest"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone uppercase mb-1">Note (Optional)</label>
                <input
                  type="text"
                  value={paymentForm.note}
                  onChange={(e) => setPaymentForm({ ...paymentForm, note: e.target.value })}
                  placeholder="e.g. Mid-month festival advance"
                  className="w-full bg-cream px-3 py-2 rounded-xl border border-stone/20 text-xs text-ink focus:outline-none focus:border-forest"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-stone/15">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="px-4 py-2 rounded-full text-xs font-semibold text-stone hover:text-ink"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-forest text-cream px-5 py-2 rounded-full text-xs font-semibold hover:bg-primary-light transition-colors"
                >
                  Record Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── DELETE CONFIRMATION MODAL ─── */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl animate-scale-in">
            <h4 className="font-heading text-xl text-ink font-bold mb-2">Confirm Delete</h4>
            <p className="text-stone text-xs mb-6">
              Are you sure you want to delete <strong className="text-ink">{deleteConfirm.name}</strong>?
              {deleteConfirm.type === 'worker' && ' This will also remove their attendance and payment logs.'}
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteConfirm({ show: false, type: '', id: '', name: '' })}
                className="px-4 py-2 rounded-full text-xs font-semibold text-stone hover:text-ink"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="bg-red-600 text-white px-5 py-2 rounded-full text-xs font-semibold hover:bg-red-700 transition-colors"
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

export default LabourManagement;
