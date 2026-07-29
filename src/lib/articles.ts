import {
  collection, getDocs, doc, getDoc, query, orderBy, addDoc, serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';

export interface Article {
  id: string;
  title: string;
  tag: string;
  summary: string;
  description: string;
  imageUrl: string;
  videoUrl?: string;
  podcastUrl?: string;
  type: 'video' | 'podcast' | 'article';
  createdAt?: unknown;
}

export interface Question {
  question: string;
  topic: string;
  email?: string;
  createdAt?: unknown;
  answered?: boolean;
}

const FALLBACK: Article[] = [
  // ─── POLICE ───
  {
    id: '1', title: "Police Encounters: What are your rights?",
    tag: "POLICE",
    summary: "Can a police officer search your bag without a warrant? What should you do at a roadblock?",
    description: "The Constitution of Kenya protects every citizen during police encounters. Under Article 49, you have the right to be informed of the reason for your arrest. Police officers must identify themselves and produce a warrant card if not in uniform. At roadblocks, officers can check your documents but cannot search your personal belongings without reasonable suspicion or a warrant. If you are detained, you have the right to remain silent and to contact a lawyer or a family member. Always remain calm and respectful, and do not resist arrest even if you believe it is unlawful — note the officer's name and badge number and challenge the arrest later through legal channels.",
    imageUrl: "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=800&q=80", type: "video",
  },
  {
    id: '6', title: "Bail & Bond: Getting Out of Police Custody",
    tag: "POLICE",
    summary: "How does bail work in Kenya? What are your rights after an arrest?",
    description: "Under Article 49(1)(h) of the Constitution, an arrested person has the right to be released on bond or bail on reasonable conditions pending a charge or trial, unless there are compelling reasons to deny it. The police can grant cash bail for minor offences at the station. For serious offences, you must appear before a magistrate within 24 hours. Bail amounts vary depending on the offence, but the court must consider your ability to pay. If you cannot afford a lawyer, the state must provide one for serious offences under Article 50(6)(g).",
    imageUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80", type: "video",
  },
  {
    id: '7', title: "Your Rights at a Police Roadblock",
    tag: "POLICE",
    summary: "What can police ask for at a roadblock? Do you have to open your boot?",
    description: "Police in Kenya are allowed to set up roadblocks for purposes of checking documents, preventing crime, and ensuring road safety. At a roadblock, you must stop when signaled. The officer may ask for your driving license, insurance, logbook, and National ID. You do not have to consent to a search of your vehicle or person unless the officer has reasonable suspicion that you are carrying illegal items. If you are asked to open your boot, you may ask whether the search is based on reasonable suspicion. Remain polite but firm. If you believe your rights have been violated, note the officer's details and report the incident to the Independent Policing Oversight Authority (IPOA).",
    imageUrl: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80", type: "article",
  },
  {
    id: '8', title: "Arrest Without a Warrant: When Is It Legal?",
    tag: "POLICE",
    summary: "Police can arrest you without a warrant in certain situations. Know when it's lawful.",
    description: "Under Section 29 of the Criminal Procedure Code, a police officer may arrest without a warrant if they have reasonable suspicion that you have committed a felony (a serious crime), if you obstruct them while they are executing their duties, or if you are found in possession of stolen property. For minor offences, the police should first issue a summons rather than make an arrest. If you are arrested without a warrant, you must be told the reason for your arrest immediately. You have the right to remain silent until you have consulted a lawyer. A warrantless arrest must be followed by a court appearance within 24 hours.",
    imageUrl: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&w=800&q=80", type: "podcast",
  },

  // ─── LABOR ───
  {
    id: '2', title: "Unfair Dismissal Basics",
    tag: "LABOR",
    summary: "Learn what constitutes an unfair dismissal and immediate steps to protect yourself.",
    description: "Under the Employment Act 2007, an employer cannot terminate employment without valid reason and proper procedure. You are entitled to written notice, a hearing, and severance pay if you have worked for more than 13 months. Unfair dismissal claims must be filed within 3 years at the Employment and Labour Relations Court. Valid reasons for dismissal include misconduct, poor performance, redundancy, or medical incapacity. Your employer must follow a fair process — give you a warning, invite you to a hearing where you can defend yourself, and issue a written termination letter. If any of these steps are skipped, the dismissal may be unfair.",
    imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80", type: "video",
  },
  {
    id: '4', title: "Maternity Leave Rights",
    tag: "LABOR",
    summary: "Are you entitled to fully paid maternity leave? What happens if your contract expires?",
    description: "Section 29 of the Employment Act 2007 guarantees every female employee at least 3 months (90 days) of maternity leave with full pay. Your employer cannot terminate your employment because of pregnancy. If your contract expires during maternity leave, you are still entitled to your full benefits including leave pay and any terminal benefits. You must notify your employer at least 7 days before your leave begins. Upon return, you are entitled to the same or similar position. Fathers are entitled to 2 weeks of paternity leave under the Employment Act (Amendment) 2020.",
    imageUrl: "https://images.unsplash.com/photo-1555252113-fdfc37ceda33?auto=format&fit=crop&w=800&q=80", type: "video",
  },
  {
    id: '9', title: "Minimum Wage & Overtime Pay",
    tag: "LABOR",
    summary: "What is the current minimum wage in Kenya? Are you entitled to overtime?",
    description: "Kenya's minimum wage is set by the Regulation of Wages Order and varies by sector and location. As of the latest order, the minimum monthly wage for general labourers in Nairobi, Mombasa, and Kisumu is approximately KES 15,200. Agricultural workers earn slightly less. Overtime is payable at 1.5 times the normal hourly rate for work beyond 8 hours a day or 52 hours a week. Work on public holidays is paid at double the normal rate. Your employer must provide an itemized payslip showing hours worked, deductions, and net pay.",
    imageUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80", type: "article",
  },
  {
    id: '10', title: "Notice Periods & Final Dues",
    tag: "LABOR",
    summary: "How much notice must you give when resigning? What must your employer pay you?",
    description: "Under the Employment Act, the notice period depends on your contract and how long you have worked. By default, if you have worked for less than one month, one day's notice is required. For one month to one year, at least 7 days. For more than one year, at least 28 days. Upon termination, your employer must pay you any accrued leave, salary for days worked, and severance pay (if you were employed for more than 13 months and the termination was through no fault of your own). If you resign, you must give the notice period specified in your contract or pay salary in lieu of notice.",
    imageUrl: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=800&q=80", type: "podcast",
  },

  // ─── TENANTS ───
  {
    id: '3', title: "Understanding Eviction Notices",
    tag: "TENANTS",
    summary: "A landlord cannot just lock you out. Discover the legal requirements for a valid eviction.",
    description: "The Landlord and Tenant (Shops, Hotels and Catering Establishments) Act and the Rent Restriction Act govern evictions in Kenya. A landlord must serve a proper written notice — typically one month for monthly tenancies. Self-help evictions (changing locks, cutting utilities) are illegal. Only a court can order eviction, and only the County Commissioner or a court bailiff can enforce it. If your landlord attempts to evict you without following the proper legal process, you can report them to the Business Premises Rent Tribunal or file a case at the magistrate's court. You may also be entitled to compensation for illegal eviction.",
    imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80", type: "podcast",
  },
  {
    id: '11', title: "Rent Increases: What Is Allowed?",
    tag: "TENANTS",
    summary: "Can your landlord raise rent without notice? How much is too much?",
    description: "Under the Rent Restriction Act, a landlord cannot increase rent arbitrarily. For controlled tenancies (those with rent below a certain threshold), the landlord must apply to the Rent Restriction Tribunal for approval of any increase. For non-controlled tenancies, the lease agreement governs rent increases. If there is no specific clause, the landlord must give you at least one month's written notice of any increase. Rent increases cannot be retaliatory — if you complained about maintenance issues and your landlord immediately raises rent, that may be illegal. You have the right to challenge an unreasonable increase at the tribunal.",
    imageUrl: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80", type: "article",
  },
  {
    id: '12', title: "Deposits & House Inspections",
    tag: "TENANTS",
    summary: "Can your landlord keep your deposit? What is a move-in inspection?",
    description: "Tenancy deposits are meant to cover unpaid rent or damage beyond normal wear and tear. Your landlord must return the deposit within 30 days of the tenancy ending, minus any lawful deductions. To protect your deposit, take dated photos of the property when you move in and move out. Request a joint inspection with your landlord. If the landlord fails to return your deposit without justification, you can file a complaint with the Business Premises Rent Tribunal or the small claims court. Deductions must be itemized and supported by receipts or invoices.",
    imageUrl: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80", type: "video",
  },
  {
    id: '13', title: "Landlord Entry: When Can They Come In?",
    tag: "TENANTS",
    summary: "Does your landlord need permission to enter your rented home?",
    description: "Once you rent a property, you have the right to quiet enjoyment — meaning your landlord cannot enter without your permission except in emergencies. The landlord must give you at least 24 hours' notice before entering for inspections, repairs, or showings to prospective tenants. If your landlord enters without notice or harasses you with frequent visits, that may constitute harassment and you can report it to the rent tribunal. You have the right to refuse entry if proper notice was not given, except in genuine emergencies like a burst pipe or fire.",
    imageUrl: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80", type: "podcast",
  },

  // ─── BUSINESS ───
  {
    id: '5', title: "Consumer Rights & Defective Goods",
    tag: "BUSINESS",
    summary: "Can a shop refuse a refund? What the Consumer Protection Act says.",
    description: "The Consumer Protection Act 2012 gives you the right to return defective goods for a full refund, repair, or replacement within 30 days of purchase. If a product is faulty, the seller cannot refuse to accept it by claiming 'no refunds' — that policy is illegal for defective goods. You also have the right to be informed about the price, quality, and terms of any product or service. If a business engages in misleading advertising or sells counterfeit goods, you can report them to the Competition Authority of Kenya.",
    imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80", type: "article",
  },
  {
    id: '14', title: "Debt Collection: Your Rights as a Borrower",
    tag: "BUSINESS",
    summary: "Can debt collectors harass you? What are your protections under Kenyan law?",
    description: "Under the Data Protection Act and the Central Bank of Kenya guidelines, debt collectors must treat you with dignity and respect. They cannot call you before 6 AM or after 8 PM, disclose your debt to friends or employers, or use threatening language. If you are struggling with debt, you have the right to negotiate a repayment plan with your lender. Harassment by debt collectors can be reported to the CBK or the Office of the Data Protection Commissioner. For digital lenders, the CBK has set interest rate caps and requires transparent loan terms.",
    imageUrl: "https://images.unsplash.com/photo-1554224154-22dec7ec8818?auto=format&fit=crop&w=800&q=80", type: "video",
  },
  {
    id: '15', title: "Business Licenses & Permits",
    tag: "BUSINESS",
    summary: "What licenses do you need to start a small business in Kenya?",
    description: "All businesses in Kenya require a business permit from the county government. Depending on your industry, you may also need additional licenses — for example, a food handling license for restaurants, a public health certificate, or a liquor license. The process has been simplified through the eCitizen portal and the Business Registration Service (BRS) for registering a business name or company. Operating without the required permits can result in fines or closure of your business. Always check with your county government for the specific permits needed for your type of business.",
    imageUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80", type: "article",
  },
  {
    id: '16', title: "Partnership Disputes & Business Contracts",
    tag: "BUSINESS",
    summary: "What happens when a business partnership goes wrong? How to protect yourself.",
    description: "A partnership agreement should clearly outline each partner's rights, responsibilities, profit share, and dispute resolution mechanisms. If you don't have a written agreement, the Partnership Act of 2012 provides default rules — profits and losses are shared equally, and any partner can dissolve the partnership at any time. If disputes arise, try mediation first through the Nairobi Centre for International Arbitration or a private mediator. If mediation fails, you can file a case in the High Court (Commercial Division). To protect yourself, always have a written agreement signed by all partners and keep clear financial records.",
    imageUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80", type: "podcast",
  },
];

function withTimeout<T>(promise: Promise<T>, fallback: T, ms = 2000): Promise<T> {
  return Promise.race([promise, new Promise<T>((r) => setTimeout(() => r(fallback), ms))]);
}

export async function getArticles(): Promise<Article[]> {
  if (!db) return FALLBACK;
  try {
    const q = query(collection(db, 'articles'), orderBy('createdAt', 'desc'));
    const snap = await withTimeout(getDocs(q), null);
    if (!snap || snap.empty) return FALLBACK;
    return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Article[];
  } catch { return FALLBACK; }
}

export async function getArticleById(id: string): Promise<Article | null> {
  const local = FALLBACK.find((a) => a.id === id) || null;
  if (!db) return local;
  try {
    const snap = await withTimeout(getDoc(doc(db, 'articles', id)), null);
    if (!snap || !snap.exists()) return local;
    return { id: snap.id, ...snap.data() } as Article;
  } catch { return local; }
}

export async function submitQuestion(data: Question): Promise<string> {
  if (!db) throw new Error('Cannot submit while offline');
  const ref = await withTimeout(
    addDoc(collection(db, 'questions'), { ...data, createdAt: serverTimestamp(), answered: false }),
    null, 4000
  );
  if (!ref) throw new Error('Request timed out. Please try again later.');
  return ref.id;
}
