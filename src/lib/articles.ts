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
  {
    id: '1',
    title: "Police Encounters: What are your rights?",
    tag: "POLICE",
    summary: "Can a police officer search your bag without a warrant? What should you do at a roadblock?",
    description: "The Constitution of Kenya protects every citizen during police encounters. Under Article 49, you have the right to be informed of the reason for your arrest. Police officers must identify themselves and produce a warrant card if not in uniform. At roadblocks, officers can check your documents but cannot search your personal belongings without reasonable suspicion or a warrant.",
    imageUrl: "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=800&q=80",
    type: "video",
  },
  {
    id: '2',
    title: "Unfair Dismissal Basics",
    tag: "LABOR",
    summary: "Learn what constitutes an unfair dismissal and immediate steps to protect yourself.",
    description: "Under the Employment Act 2007, an employer cannot terminate employment without valid reason and proper procedure. You are entitled to written notice, a hearing, and severance pay if you have worked for more than 13 months. Unfair dismissal claims must be filed within 3 years at the Employment and Labour Relations Court.",
    imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80",
    type: "video",
  },
  {
    id: '3',
    title: "Understanding Eviction Notices",
    tag: "TENANTS",
    summary: "A landlord cannot just lock you out. Discover the legal requirements for a valid eviction.",
    description: "The Landlord and Tenant (Shops, Hotels and Catering Establishments) Act and the Rent Restriction Act govern evictions in Kenya. A landlord must serve a proper written notice — typically one month for monthly tenancies. Self-help evictions (changing locks, cutting utilities) are illegal. Only a court can order eviction, and only the County Commissioner or a court bailiff can enforce it.",
    imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
    type: "podcast",
  },
  {
    id: '4',
    title: "Maternity Leave Rights",
    tag: "LABOR",
    summary: "Are you entitled to fully paid maternity leave? What happens if your contract expires?",
    description: "Section 29 of the Employment Act 2007 guarantees every female employee at least 3 months (90 days) of maternity leave with full pay. Your employer cannot terminate your employment because of pregnancy. If your contract expires during maternity leave, you are still entitled to your full benefits including leave pay and any terminal benefits.",
    imageUrl: "https://images.unsplash.com/photo-1555252113-fdfc37ceda33?auto=format&fit=crop&w=800&q=80",
    type: "video",
  },
  {
    id: '5',
    title: "Consumer Rights & Defective Goods",
    tag: "BUSINESS",
    summary: "Can a shop refuse a refund? What the Consumer Protection Act says.",
    description: "The Consumer Protection Act 2012 gives you the right to return defective goods for a full refund, repair, or replacement within 30 days of purchase.",
    imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80",
    type: "article",
  },
];

function withTimeout<T>(promise: Promise<T>, fallback: T, ms = 2000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((r) => setTimeout(() => r(fallback), ms)),
  ]);
}

export async function getArticles(): Promise<Article[]> {
  if (!db) return FALLBACK;
  try {
    const q = query(collection(db, 'articles'), orderBy('createdAt', 'desc'));
    const snapshot = await withTimeout(getDocs(q), null);
    if (!snapshot || snapshot.empty) return FALLBACK;
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as Article[];
  } catch {
    return FALLBACK;
  }
}

export async function getArticleById(id: string): Promise<Article | null> {
  const local = FALLBACK.find((a) => a.id === id) || null;
  if (!db) return local;
  try {
    const ref = doc(db, 'articles', id);
    const snap = await withTimeout(getDoc(ref), null);
    if (!snap || !snap.exists()) return local;
    return { id: snap.id, ...snap.data() } as Article;
  } catch {
    return local;
  }
}

export async function submitQuestion(data: Question): Promise<string> {
  if (!db) throw new Error('Cannot submit while offline');
  const ref = await withTimeout(
    addDoc(collection(db, 'questions'), {
      ...data,
      createdAt: serverTimestamp(),
      answered: false,
    }),
    null,
    4000
  );
  if (!ref) throw new Error('Request timed out. Please try again later.');
  return ref.id;
}
