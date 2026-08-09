import React from 'react';
import { HiOutlinePrinter, HiOutlineX } from 'react-icons/hi';

const ReceiptModal = ({ sale, company, onClose }) => {
  if (!sale) return null;

  const handlePrint = () => {
    window.print();
  };

  let formattedDate = 'N/A';
  try {
    const d = new Date(sale?.createdAt || Date.now());
    if (!isNaN(d.getTime())) {
      formattedDate = d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    }
  } catch (e) {
    formattedDate = 'N/A';
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
      {/* Modal Card */}
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 md:p-8 shadow-2xl relative animate-scale-in my-8">

        {/* Modal Controls (Hidden in print) */}
        <div className="flex items-center justify-between border-b border-stone/15 pb-4 mb-6 print:hidden">
          <h3 className="font-heading text-xl text-ink">Sale Receipt Preview</h3>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 bg-forest text-cream px-4 py-2 rounded-full text-xs font-semibold hover:bg-primary-light transition-colors"
            >
              <HiOutlinePrinter className="w-4 h-4" /> Print Receipt
            </button>
            <button
              onClick={onClose}
              className="p-2 text-stone hover:text-ink rounded-full transition-colors"
            >
              <HiOutlineX className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE RECEIPT CONTENT */}
        <div className="print-area font-sans text-ink space-y-6">
          {/* Header / Letterhead */}
          <div className="border-b border-stone/30 pb-6 text-center">
            <h1 className="font-heading text-3xl font-bold tracking-tight text-forest mb-1">
              {company?.name || ''}
            </h1>
            <p className="text-xs text-stone leading-relaxed max-w-lg mx-auto mb-2">
              {company?.addresses?.join(', ') || ''}
            </p>
            <p className="text-xs text-stone font-medium">
              Mob: +91 {company?.mobileNumbers?.join(' / ') || ''} | GSTIN: {company?.gstin || ''}
            </p>
          </div>

          {/* Receipt Title & Meta */}
          <div className="flex justify-between items-start text-xs border-b border-stone/15 pb-4">
            <div>
              <span className="font-bold text-sm uppercase tracking-wider block text-forest">SALE RECEIPT</span>
              <p className="text-stone mt-1">Receipt Date: <strong className="text-ink">{formattedDate}</strong></p>
            </div>
            <div className="text-right">
              <p className="text-stone">Payment Status:</p>
              <span className={`inline-block mt-1 px-3 py-0.5 rounded-full text-xs font-bold uppercase ${
                sale.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {sale.paymentStatus || 'Paid'}
              </span>
            </div>
          </div>

          {/* Buyer Details */}
          <div className="bg-stone/5 p-4 rounded-xl text-xs space-y-1">
            <span className="text-stone uppercase font-bold text-[10px] tracking-wider block mb-1">Buyer Details</span>
            <p className="font-bold text-sm text-ink">{sale.buyerName || 'Valued Customer'}</p>
          </div>

          {/* Item Table */}
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b-2 border-stone/30 text-stone font-bold uppercase text-[10px] tracking-wider">
                <th className="py-2.5">Product</th>
                <th className="py-2.5 text-right">Qty</th>
                <th className="py-2.5 text-right">Rate</th>
                <th className="py-2.5 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-stone/15">
                <td className="py-3 font-semibold text-ink">
                  {sale.productName || sale.productId?.name || 'Rice Product'}
                  <span className="block text-[10px] text-stone font-normal">
                    {sale.productId?.variety || 'Premium Variety'}
                  </span>
                </td>
                <td className="py-3 text-right">{sale.quantitySold} kg</td>
                <td className="py-3 text-right">₹{sale.ratePerUnit}/kg</td>
                <td className="py-3 text-right font-bold text-forest text-sm">₹{sale.totalAmount}</td>
              </tr>
            </tbody>
          </table>

          {/* Total Summary Box */}
          <div className="border-t-2 border-stone/30 pt-4 flex justify-between items-center text-sm">
            <span className="font-bold text-ink">Grand Total Amount</span>
            <span className="font-heading text-2xl text-forest font-bold">₹{sale.totalAmount}</span>
          </div>

          {/* Terms & Footer */}
          <div className="border-t border-stone/15 pt-6 text-[10px] text-stone flex justify-between items-end">
            <div>
              <p className="font-bold uppercase tracking-wider mb-1 text-ink">Terms & Conditions:</p>
              <ul className="list-disc list-inside space-y-0.5">
                {(company?.terms || []).map((t, idx) => <li key={idx}>{t}</li>)}
              </ul>
            </div>
            <div className="text-right">
              <p className="font-bold text-ink mb-8">For {company?.name || ''}</p>
              <p className="border-t border-stone/40 pt-1 font-semibold text-ink">Authorized Signatory</p>
            </div>
          </div>
        </div>

      </div>

      {/* Embedded Print CSS */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-area, .print-area * {
            visibility: visible;
          }
          .print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default ReceiptModal;
