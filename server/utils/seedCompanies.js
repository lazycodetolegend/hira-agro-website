const Company = require('../models/Company');

const companies = [
  {
    slug: 'hira-agro',
    name: 'HIRA AGRO INDUSTRY',
    proprietor: 'Lalita Kalpesh Mutha',
    mobileNumbers: ['7977697797'],
    addresses: ['Jamshet, Vasantwadi, Ashagad, Tal. Dahanu, Dist. Palghar - 401602'],
    panNumber: '',
    gstin: '27BSHPM4686A1ZM',
    state: 'Maharashtra',
    stateCode: '27',
    bankName: 'IDBI Bank',
    bankBranch: 'Dahanu Road',
    accountNumber: '0331102000005852',
    ifscCode: 'IBKL0000331',
    billType: 'gst_invoice',
    jurisdiction: 'Subject to Dahanu Jurisdiction',
    invoicePrefix: 'HAI',
    paymentNote: "Pay by NEFT/RTGS, Payee's A/c Cheque only",
    terms: [
      'Goods once sold will not be taken back',
      'Any discrepancy regarding this invoice must be notified within 3 days from the date of receipt',
      'E. & O.E.'
    ],
    gstDeclaration: 'I/We hereby certify that my/our registration certificate under the GST Act 2017 is in force on the date on which the supply of goods/services specified in this tax invoice is made by me/us and that the transaction of sale covered by this tax invoice has been effected by me/us and it shall be accounted for in the turnover of sales while filing of return and the due tax, if any, payable on the sale has been paid or shall be paid.'
  },
  {
    slug: 'vishakha-kalpesh-mutha',
    name: 'VISHAKHA KALPESH MUTHA',
    proprietor: 'Kalpesh Mutha',
    mobileNumbers: ['9823958410'],
    addresses: ['Omkar City, Masoli, Dahanu, Dist. Palghar - 401602'],
    panNumber: 'IAWPM9343E',
    gstin: '',
    state: 'Maharashtra',
    stateCode: '27',
    bankName: 'IDBI Bank',
    bankBranch: 'Dahanu Branch',
    accountNumber: '0331102000007047',
    ifscCode: 'IBKL0000331',
    billType: 'bill_of_supply',
    jurisdiction: 'Subject to Dahanu Jurisdiction',
    invoicePrefix: 'VKM',
    paymentNote: "Pay by NEFT/RTGS, Payee's A/c Cheque only",
    terms: [
      'Goods once sold will not be taken back',
      'E. & O.E.'
    ]
  },
  {
    slug: 'hiraben-dilip-mutha',
    name: 'HIRABEN DILIP MUTHA',
    tagline: 'Dealers in Cattle Feeds & General Merchant',
    proprietor: 'Hiraben Dilip Mutha',
    mobileNumbers: ['9823958410', '9226376579'],
    addresses: ['Savta - Saravali, Tal. Dahanu, Dist. Palghar - 401602'],
    panNumber: 'BRFPM0814H',
    gstin: '',
    state: 'Maharashtra',
    stateCode: '27',
    bankName: 'IDBI Bank',
    bankBranch: 'Dahanu Branch',
    accountNumber: '0331102000003308',
    ifscCode: 'IBKL0000331',
    billType: 'bill_of_supply',
    jurisdiction: 'Subject to Dahanu Jurisdiction',
    invoicePrefix: 'HDM',
    paymentNote: "Pay by NEFT/RTGS, Payee's A/c Cheque only",
    terms: [
      'Goods once sold will not be taken back',
      'E. & O.E.'
    ]
  },
  {
    slug: 'vishakha-agro',
    name: 'VISHAKHA AGRO',
    proprietor: 'Kalpesh Mutha',
    mobileNumbers: ['9226376579'],
    addresses: ['565, Patilpada, Talasari, Palghar - 401606, Maharashtra'],
    panNumber: 'AAMHK6781N',
    gstin: '',
    state: 'Maharashtra',
    stateCode: '27',
    bankName: 'IDBI Bank',
    bankBranch: 'Dahanu Branch',
    accountNumber: '0331102000005838',
    ifscCode: 'IBKL0000331',
    billType: 'bill_of_supply',
    jurisdiction: 'Subject to Dahanu Jurisdiction',
    invoicePrefix: 'VA',
    paymentNote: "Pay by NEFT/RTGS, Payee's A/c Cheque only",
    terms: [
      'Goods once sold will not be taken back',
      'E. & O.E.'
    ]
  },
  {
    slug: 'vishakha-rice-mill',
    name: 'VISHAKHA RICE MILL',
    proprietor: 'Kalpesh Mutha',
    mobileNumbers: ['9823958410', '9226376579'],
    addresses: [
      '565, Patilpada, Talasari, Palghar - 401606, Maharashtra',
      '1912, Vasantwadi, Jamshet, Tal. Dahanu, Dist. Palghar - 401602, Maharashtra'
    ],
    panNumber: 'AMBPM0837E',
    gstin: '',
    state: 'Maharashtra',
    stateCode: '27',
    bankName: 'IDBI Bank',
    bankBranch: 'Dahanu Branch',
    accountNumber: '0331651100001298',
    ifscCode: 'IBKL0000331',
    billType: 'bill_of_supply',
    jurisdiction: 'Subject to Dahanu Jurisdiction',
    invoicePrefix: 'VRM',
    paymentNote: "Pay by NEFT/RTGS, Payee's A/c Cheque only",
    terms: [
      'Goods once sold will not be taken back',
      'E. & O.E.'
    ]
  }
];

const seedCompanies = async () => {
  try {
    for (const companyData of companies) {
      const existing = await Company.findOne({ slug: companyData.slug });
      if (existing) {
        // Update existing company with latest data
        Object.assign(existing, companyData);
        await existing.save();
      } else {
        await Company.create(companyData);
      }
    }
    console.log('✅ All 5 companies seeded successfully');
  } catch (error) {
    console.error('Error seeding companies:', error.message);
  }
};

module.exports = seedCompanies;
