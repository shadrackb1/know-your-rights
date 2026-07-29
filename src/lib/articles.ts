import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  where,
  orderBy,
  addDoc,
  serverTimestamp,
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
  slug?: string;
}

export interface Question {
  question: string;
  topic: string;
  email?: string;
  createdAt?: unknown;
  answered?: boolean;
}

const COLLECTION = 'articles';

const fallbackArticles: Article[] = [
  {
    id: '1',
    title: "Police Encounters: What are your rights?",
    tag: "POLICE",
    summary: "Can a police officer search your bag without a warrant? What should you do at a roadblock?",
    description: "Know your rights during police encounters in Kenya.",
    imageUrl: "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=800&q=80",
    type: "video",
  },
  {
    id: '2',
    title: "Unfair Dismissal Basics",
    tag: "LABOR",
    summary: "Learn what constitutes an unfair dismissal and immediate steps to protect yourself.",
    description: "Understanding unfair dismissal under Kenyan employment law.",
    imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80",
    type: "video",
  },
  {
    id: '3',
    title: "Understanding Eviction Notices",
    tag: "TENANTS",
    summary: "A landlord cannot just lock you out. Discover the legal requirements for a valid eviction.",
    description: "Your rights as a tenant facing eviction in Kenya.",
    imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
    type: "podcast",
  },
  {
    id: '4',
    title: "Maternity Leave Rights",
    tag: "LABOR",
    summary: "Are you entitled to fully paid maternity leave? What happens if your contract expires?",
    description: "Know your maternity leave rights under Kenyan law.",
    imageUrl: "https://images.unsplash.com/photo-1555252113-fdfc37ceda33?auto=format&fit=crop&w=800&q=80",
    type: "video",
  },
];

const fallbackLibrary: Article[] = [
  {
    id: '1',
    title: "Understanding Traffic Stops & Search Rights",
    tag: "POLICE",
    summary: "Can a police officer search your car without a warrant? Know the boundaries.",
    description: "Detailed guide on traffic stop rights in Kenya.",
    imageUrl: "",
    type: "article",
  },
  {
    id: '2',
    title: "Rent Increases: What Notice is Required?",
    tag: "TENANTS",
    summary: "A landlord cannot arbitrarily raise rent without formal written notice and a waiting period.",
    description: "Your rights regarding rent increases.",
    imageUrl: "",
    type: "article",
  },
  {
    id: '3',
    title: "Overtime Pay Guidelines",
    tag: "LABOR",
    summary: "When you are entitled to overtime pay and the legal limits on working hours in Kenya.",
    description: "Understanding overtime pay laws in Kenya.",
    imageUrl: "",
    type: "article",
  },
  {
    id: '5',
    title: "Consumer Rights & Defective Goods",
    tag: "BUSINESS",
    summary: "Can a shop refuse a refund on a defective product? What the Consumer Protection Act says.",
    description: "Your rights as a consumer in Kenya.",
    imageUrl: "",
    type: "article",
  },
];

export async function getArticles(): Promise<Article[]> {
  try {
    const q = query(
      collection(db, COLLECTION),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) return fallbackArticles;
    return snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    })) as Article[];
  } catch {
    return fallbackArticles;
  }
}

export async function getArticleById(id: string): Promise<Article | null> {
  try {
    const ref = doc(db, COLLECTION, id);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      return fallbackArticles.find((a) => a.id === id) || null;
    }
    return { id: snap.id, ...snap.data() } as Article;
  } catch {
    return fallbackArticles.find((a) => a.id === id) || null;
  }
}

export async function getArticlesByTag(tag: string): Promise<Article[]> {
  try {
    const q = query(
      collection(db, COLLECTION),
      where('tag', '==', tag),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      return fallbackArticles.filter((a) => a.tag === tag);
    }
    return snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    })) as Article[];
  } catch {
    return fallbackArticles.filter((a) => a.tag === tag);
  }
}

export async function submitQuestion(data: Question): Promise<string> {
  const docRef = await addDoc(collection(db, 'questions'), {
    ...data,
    createdAt: serverTimestamp(),
    answered: false,
  });
  return docRef.id;
}

export { fallbackArticles, fallbackLibrary };
