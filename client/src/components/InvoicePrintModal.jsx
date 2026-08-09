import React from 'react';
import { numberToWordsIndian } from '../utils/numberToWords';
import { HiOutlinePrinter, HiOutlineX } from 'react-icons/hi';

const InvoicePrintModal = ({ invoice, company, onClose }) => {
  if (!invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  let formattedInvoiceDate = 'N/A';
  try {
    const d = new Date(invoice?.invoiceDate || Date.now());
    if (!isNaN(d.getTime())) {
      formattedInvoiceDate = d.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }
  } catch (e) {
    formattedInvoiceDate = 'N/A';
  }

  let formattedPoDate = '-';
  if (invoice?.poDate) {
    try {
      const d = new Date(invoice.poDate);
      if (!isNaN(d.getTime())) {
        formattedPoDate = d.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });
      }
    } catch (e) {
      formattedPoDate = '-';
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full p-6 md:p-8 shadow-2xl relative animate-scale-in my-8">

        {/* Modal Controls */}
        <div className="flex items-center justify-between border-b border-stone/15 pb-4 mb-6 print:hidden">
          <div>
            <h3 className="font-heading text-xl text-ink">GST Tax Invoice Preview</h3>
            <p className="text-xs text-stone">{invoice.invoiceNumber}</p>
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

        {/* PRINTABLE INVOICE TEMPLATE (Exact Letterhead Layout) */}
        <div className="print-area font-sans text-black border-2 border-black p-6 space-y-4 text-xs">
          
          {/* TOP BAND */}
          <div className="flex justify-between items-start border-b border-black pb-2">
            <div>
              <p className="font-bold text-sm">Proprietor: {company?.proprietor || ''}</p>
              <p className="font-medium text-xs">Mobile: {company?.mobileNumbers?.join(' / ') || ''}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-semibold tracking-wider text-stone uppercase">{company?.jurisdiction || ''}</p>
              <h2 className="font-heading font-extrabold text-xl tracking-wider text-black uppercase mt-0.5">
                TAX INVOICE
              </h2>
            </div>
          </div>

          {/* COMPANY BLOCK */}
          <div className="text-center py-2 border-b border-black">
            <h1 className="font-heading text-4xl font-extrabold tracking-tight uppercase text-black mb-1">
              {company?.name || ''}
            </h1>
            <p className="text-xs font-medium">
              {company?.addresses?.join(', ') || ''}
            </p>
          </div>

          {/* REGISTRATION ROW */}
          <div className="grid grid-cols-3 text-center font-bold border-b border-black py-1.5 bg-stone/5">
            <div>GSTIN No. : {company?.gstin || ''}</div>
            <div>State : {company?.state || ''}</div>
            <div>State Code : {company?.stateCode || ''}</div>
          </div>

          {/* TWO-COLUMN DETAILS SECTION */}
          <div className="grid grid-cols-2 border-b border-black divide-x divide-black">
            {/* Left: Buyer Block */}
            <div className="p-3 space-y-1">
              <p className="font-bold uppercase text-[10px] text-stone tracking-wider">Details of Receiver (Billed To):</p>
              <p className="font-bold text-sm">M/s. {invoice.buyerName}</p>
              <p className="whitespace-pre-line text-xs">{invoice.buyerAddress}</p>
              <div className="pt-2 text-[11px] font-semibold space-y-0.5">
                <p>GSTIN / Unique ID: {invoice.buyerGSTIN || 'Unregistered'}</p>
                <p>State: {invoice.buyerState || 'Maharashtra'} | State Code: {invoice.buyerStateCode || '27'}</p>
              </div>
            </div>

            {/* Right: Invoice & Delivery Metadata */}
            <div className="p-3 grid grid-cols-2 gap-y-1.5 text-xs font-semibold">
              <div>Invoice No.: <span className="font-bold">{invoice.invoiceNumber}</span></div>
              <div>Date: <span className="font-bold">{formattedInvoiceDate}</span></div>
              <div>P.O. No.: {invoice.poNumber || '-'}</div>
              <div>P.O. Date: {formattedPoDate}</div>
              <div className="col-span-2">E-Way Bill No.: {invoice.eWayBillNo || '-'}</div>
            </div>
          </div>

          {/* LINE ITEMS TABLE */}
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr className="border-b border-black font-bold text-center bg-stone/5">
                <th className="py-2 px-2 border-r border-black w-8">Sr.</th>
                <th className="py-2 px-3 border-r border-black text-left">Description of Goods</th>
                <th className="py-2 px-2 border-r border-black w-20">HSN Code</th>
                <th className="py-2 px-2 border-r border-black w-14">GST %</th>
                <th className="py-2 px-2 border-r border-black w-24">Qty ({invoice.lineItems?.[0]?.unit || 'm.t.'})</th>
                <th className="py-2 px-2 border-r border-black w-24">Rate (₹)</th>
                <th className="py-2 px-3 text-right w-32">Taxable Value (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone/20">
              {invoice.lineItems?.map((item, idx) => (
                <tr key={idx} className="text-center align-top h-10">
                  <td className="py-2 px-2 border-r border-black font-medium">{idx + 1}</td>
                  <td className="py-2 px-3 border-r border-black text-left font-bold">{item.description}</td>
                  <td className="py-2 px-2 border-r border-black">{item.hsnCode}</td>
                  <td className="py-2 px-2 border-r border-black">{item.gstPercent}%</td>
                  <td className="py-2 px-2 border-r border-black font-semibold">{item.qty} {item.unit}</td>
                  <td className="py-2 px-2 border-r border-black">₹{item.rate}</td>
                  <td className="py-2 px-3 text-right font-bold">₹{item.taxableValue?.toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* TRANSPORTER ROW */}
          <div className="border-y border-black py-1.5 px-3 flex justify-between items-center text-xs font-semibold bg-stone/5">
            <span>Transporter: {invoice.transporterName || 'N/A'}</span>
            <span>Vehicle No.: {invoice.vehicleNo || 'N/A'}</span>
            <span>Place of Supply: {invoice.placeOfSupply || invoice.buyerState}</span>
          </div>

          {/* BOTTOM SECTION (TWO COLUMNS) */}
          <div className="grid grid-cols-12 border-b border-black divide-x divide-black">
            {/* Left: Words, Bank Info, Terms & GST Declaration */}
            <div className="col-span-7 p-3 space-y-3">
              <div>
                <p className="font-bold text-[10px] uppercase text-stone tracking-wider">Amount Chargeable (in words):</p>
                <p className="font-bold text-xs italic">{invoice.amountInWords || numberToWordsIndian(invoice.totalInvoiceValue)}</p>
              </div>

              {/* Bank Details */}
              <div className="border border-black p-2 rounded text-[11px] space-y-0.5">
                <p className="font-bold text-xs border-b border-stone/30 pb-0.5 mb-1">Company&apos;s Bank Details:</p>
                <p>Bank: <strong>{company?.bankName || ''}</strong> (Branch: {company?.bankBranch || ''})</p>
                <p>A/c No.: <strong>{company?.accountNumber || ''}</strong> | IFSC: <strong>{company?.ifscCode || ''}</strong></p>
                <p className="text-[10px] text-stone italic">{company?.paymentNote || ''}</p>
              </div>

              {/* Terms */}
              <div>
                <p className="font-bold text-[10px] uppercase text-stone tracking-wider">Terms & Conditions:</p>
                <ol className="list-decimal list-inside text-[10px] space-y-0.5 text-stone">
                  {(company?.terms || []).map((term, i) => <li key={i}>{term}</li>)}
                </ol>
              </div>

              {/* GST Declaration */}
              <p className="text-[9px] text-stone leading-tight border-t border-stone/30 pt-1.5 italic">
                {company?.gstDeclaration || ''}
              </p>
            </div>

            {/* Right: Tax Summary Box */}
            <div className="col-span-5 p-3 space-y-2 text-xs font-semibold flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="flex justify-between py-1 border-b border-stone/20">
                  <span>Total Taxable Value:</span>
                  <span className="font-bold">₹{invoice.totalTaxableValue?.toLocaleString('en-IN')}</span>
                </div>

                {invoice.buyerStateCode === '27' ? (
                  <>
                    <div className="flex justify-between py-0.5 text-stone">
                      <span>CGST @ {invoice.cgstPercent}%:</span>
                      <span>₹{invoice.cgstAmount?.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between py-0.5 text-stone">
                      <span>SGST @ {invoice.sgstPercent}%:</span>
                      <span>₹{invoice.sgstAmount?.toLocaleString('en-IN')}</span>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between py-0.5 text-stone">
                    <span>IGST @ {invoice.igstPercent}%:</span>
                    <span>₹{invoice.igstAmount?.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex justify-between py-0.5 text-stone">
                  <span>Round Off Adjustment:</span>
                  <span>{invoice.roundOff >= 0 ? `+₹${invoice.roundOff}` : `-₹${Math.abs(invoice.roundOff)}`}</span>
                </div>
              </div>

              <div className="border-t-2 border-black pt-2 flex justify-between items-center text-sm font-bold">
                <span>Total Invoice Value:</span>
                <span className="font-heading text-2xl text-forest font-bold">₹{invoice.totalInvoiceValue?.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* SIGNATURE BLOCK */}
          <div className="pt-4 flex justify-between items-end text-xs">
            <p className="text-[10px] text-stone italic">
              Certified that the particulars given above are true & correct.
            </p>
            <div className="text-right">
              <p className="font-bold">For {company?.name || ''}</p>
              <div className="h-12"></div>
              <p className="font-bold border-t border-black pt-1">Proprietor / Auth. Signatory</p>
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

export default InvoicePrintModal;
