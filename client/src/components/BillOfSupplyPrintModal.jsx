import React from 'react';
import { numberToWordsIndian } from '../utils/numberToWords';
import { HiOutlinePrinter, HiOutlineX } from 'react-icons/hi';

const BillOfSupplyPrintModal = ({ bill, company, onClose }) => {
  if (!bill) return null;

  const handlePrint = () => {
    window.print();
  };

  let formattedBillDate = 'N/A';
  try {
    const d = new Date(bill?.billDate || Date.now());
    if (!isNaN(d.getTime())) {
      formattedBillDate = d.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }
  } catch (e) {
    formattedBillDate = 'N/A';
  }

  const companyName = company?.name || 'Company';
  const companyTagline = company?.tagline || '';
  const companyMobiles = company?.mobileNumbers?.join(' / ') || '';
  const companyAddresses = company?.addresses?.join(' | ') || '';
  const companyPan = company?.panNumber || '';
  const companyBank = company?.bankName || '';
  const companyBranch = company?.bankBranch || '';
  const companyAccount = company?.accountNumber || '';
  const companyIfsc = company?.ifscCode || '';
  const companyJurisdiction = company?.jurisdiction || 'Subject to Dahanu Jurisdiction';
  const companyTerms = company?.terms || ['Goods once sold will not be taken back', 'E. & O.E.'];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full p-6 md:p-8 shadow-2xl relative animate-scale-in my-8">

        {/* Modal Controls */}
        <div className="flex items-center justify-between border-b border-stone/15 pb-4 mb-6 print:hidden">
          <div>
            <h3 className="font-heading text-xl text-ink">Bill of Supply Preview</h3>
            <p className="text-xs text-stone">{bill.billNumber}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 bg-forest text-cream px-5 py-2.5 rounded-full text-xs font-semibold hover:bg-primary-light transition-colors"
            >
              <HiOutlinePrinter className="w-4 h-4" /> Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-2 text-stone hover:text-ink rounded-full transition-colors"
            >
              <HiOutlineX className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE BILL OF SUPPLY TEMPLATE */}
        <div className="print-area font-sans text-black border-2 border-black p-6 space-y-4 text-xs">
          
          {/* TOP BAND — mobile numbers + BILL OF SUPPLY label */}
          <div className="flex justify-between items-start border-b border-black pb-2">
            <div>
              <p className="font-medium text-xs">Mobile: {companyMobiles}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-semibold tracking-wider text-stone uppercase">{companyJurisdiction}</p>
              <h2 className="font-heading font-extrabold text-xl tracking-wider text-black uppercase mt-0.5">
                BILL OF SUPPLY
              </h2>
            </div>
          </div>

          {/* COMPANY BLOCK */}
          <div className="text-center py-2 border-b border-black">
            <h1 className="font-heading text-4xl font-extrabold tracking-tight uppercase text-black mb-1">
              {companyName}
            </h1>
            {companyTagline && (
              <p className="text-sm font-medium italic text-stone mb-1">
                {companyTagline}
              </p>
            )}
            <p className="text-xs font-medium">{companyAddresses}</p>
          </div>

          {/* CASH / CREDIT MEMO label */}
          <div className="text-center py-1.5 border-b border-black bg-stone/5">
            <p className="font-bold text-sm tracking-wider uppercase">CASH / CREDIT MEMO</p>
          </div>

          {/* TWO-COLUMN DETAILS SECTION */}
          <div className="grid grid-cols-2 border-b border-black divide-x divide-black">
            {/* Left: Buyer Block */}
            <div className="p-3 space-y-1">
              <div className="grid grid-cols-2 gap-y-1 text-xs font-semibold">
                <div>Bill No.: <span className="font-bold">{bill.billNumber}</span></div>
                <div>Date: <span className="font-bold">{formattedBillDate}</span></div>
              </div>
              <div className="pt-2">
                <p className="font-bold uppercase text-[10px] text-stone tracking-wider">Buyer:</p>
                <p className="font-bold text-sm">{bill.buyerName}</p>
                {bill.buyerAddress && <p className="text-xs">{bill.buyerAddress}</p>}
              </div>
            </div>

            {/* Right: GST, Broker, Vehicle */}
            <div className="p-3 space-y-1.5 text-xs font-semibold">
              <div>GST No.: {bill.buyerGST || '—'}</div>
              <div>State Code: {bill.buyerStateCode || '—'}</div>
              <div>Broker: {bill.broker || '—'}</div>
              <div>Vehicle No.: {bill.vehicleNo || '—'}</div>
            </div>
          </div>

          {/* LINE ITEMS TABLE */}
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr className="border-b border-black font-bold text-center bg-stone/5">
                <th className="py-2 px-2 border-r border-black w-8">Sr.</th>
                <th className="py-2 px-3 border-r border-black text-left">Description of Goods</th>
                <th className="py-2 px-2 border-r border-black w-20">HSN Code</th>
                <th className="py-2 px-2 border-r border-black w-14">Qty</th>
                <th className="py-2 px-2 border-r border-black w-20">Weight Kg</th>
                <th className="py-2 px-2 border-r border-black w-24">Rate (₹)</th>
                <th className="py-2 px-3 text-right w-28">Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone/20">
              {bill.lineItems?.map((item, idx) => (
                <tr key={idx} className="text-center align-top h-10">
                  <td className="py-2 px-2 border-r border-black font-medium">{idx + 1}</td>
                  <td className="py-2 px-3 border-r border-black text-left font-bold">{item.description}</td>
                  <td className="py-2 px-2 border-r border-black">{item.hsnCode || '—'}</td>
                  <td className="py-2 px-2 border-r border-black font-semibold">{item.qty || '—'}</td>
                  <td className="py-2 px-2 border-r border-black font-semibold">{item.weightKg || '—'}</td>
                  <td className="py-2 px-2 border-r border-black">₹{item.rate}</td>
                  <td className="py-2 px-3 text-right font-bold">₹{item.amount?.toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* PAN & BANK DETAILS */}
          <div className="grid grid-cols-12 border-y border-black divide-x divide-black">
            <div className="col-span-7 p-3 space-y-3">
              <div>
                <p className="font-bold text-[10px] uppercase text-stone tracking-wider">Amount (in words):</p>
                <p className="font-bold text-xs italic">{bill.amountInWords || numberToWordsIndian(bill.total)}</p>
              </div>

              {/* PAN */}
              <div className="text-xs font-semibold">
                PAN NO.: <strong>{companyPan}</strong>
              </div>

              {/* Bank Details */}
              <div className="border border-black p-2 rounded text-[11px] space-y-0.5">
                <p className="font-bold text-xs border-b border-stone/30 pb-0.5 mb-1">Bank Details:</p>
                <p>Bank: <strong>{companyBank}</strong> (Branch: {companyBranch})</p>
                <p>A/c No.: <strong>{companyAccount}</strong> | IFSC: <strong>{companyIfsc}</strong></p>
              </div>

              {/* Terms */}
              <div>
                <p className="font-bold text-[10px] uppercase text-stone tracking-wider">Terms & Conditions:</p>
                <ol className="list-decimal list-inside text-[10px] space-y-0.5 text-stone">
                  {companyTerms.map((term, i) => <li key={i}>{term}</li>)}
                </ol>
              </div>
            </div>

            {/* Right: Total Box */}
            <div className="col-span-5 p-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex justify-between py-1 border-b border-stone/20 text-xs font-semibold">
                  <span>Total:</span>
                  <span className="font-bold">₹{bill.total?.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="border-t-2 border-black pt-2 flex justify-between items-center text-sm font-bold mt-4">
                <span>G. Total:</span>
                <span className="font-heading text-2xl text-forest font-bold">₹{bill.total?.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* SIGNATURE BLOCK */}
          <div className="pt-4 flex justify-between items-end text-xs">
            <p className="text-[10px] text-stone italic">
              {companyJurisdiction}
            </p>
            <div className="text-right">
              <p className="font-bold">For {companyName}</p>
              <div className="h-12"></div>
              <p className="font-bold border-t border-black pt-1">Proprietor / Sign.</p>
            </div>
          </div>

        </div>

      </div>

      {/* Print Styles */}
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
            padding: 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default BillOfSupplyPrintModal;
