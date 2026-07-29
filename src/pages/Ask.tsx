import { useState, type FormEvent } from 'react';
import { Send, ArrowRight, ChevronDown, ChevronUp, CheckCircle, HelpCircle, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import AnimatedPage from '../components/AnimatedPage';
import TiltCard from '../components/TiltCard';
import ScrollReveal from '../components/ScrollReveal';
import { submitQuestion } from '../lib/articles';

const FAQS = [
  { q: "How much notice does a landlord need to give for eviction?", a: "Under the Rent Restriction Act, a landlord must provide valid written notice. For month-to-month tenancies, this is typically one month's notice, but always check your specific lease agreement for details." },
  { q: "What is the legal minimum wage in Kenya?", a: "The minimum wage varies by sector and location. The latest Regulation of Wages Order publishes updated rates — general labourers in cities earn more than agricultural workers. Always refer to the most recent gazette notice." },
  { q: "Can the police search my phone without a warrant?", a: "Generally, no. The right to privacy is protected under Article 31 of the Constitution. Police need a court order or valid warrant to search your electronic devices, unless you give explicit consent." },
  { q: "What should I do if I am unfairly dismissed?", a: "You have the right to challenge an unfair dismissal through the labor office or the Employment and Labour Relations Court. You must typically file within 3 years, but taking immediate action is strongly recommended." },
  { q: "Can police search my car at a roadblock?", a: "Police can check your documents (license, insurance, ID) at a roadblock. However, they cannot search your vehicle without reasonable suspicion that you are carrying illegal items. Remain polite but firm." },
  { q: "Can my landlord keep my deposit?", a: "Only for unpaid rent or damage beyond normal wear and tear. The deposit must be returned within 30 days of the tenancy ending, with itemized receipts for any deductions. Take photos when moving in and out." },
  { q: "Do I need a license to run a small business?", a: "Yes. All businesses in Kenya require a permit from the county government. Depending on your industry, you may need additional licenses. Apply through your county's eCitizen portal." },
  { q: "Can a shop refuse to give me a refund?", a: "If goods are defective, a shop cannot refuse — 'no refund' policies are illegal for faulty products under the Consumer Protection Act 2012. You're entitled to a full refund, repair, or replacement within 30 days." },
];

const RECENTLY = [
  { id: "3", tag: "TENANTS", title: "Understanding Eviction Notices" },
  { id: "2", tag: "LABOR", title: "Unfair Dismissal Basics" },
  { id: "6", tag: "POLICE", title: "Bail & Bond in Kenya" },
  { id: "14", tag: "BUSINESS", title: "Debt Collection Rights" },
];

function FAQ({ faq }: { faq: typeof FAQS[0] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="glass border border-border rounded-xl overflow-hidden">
      <button onClick={() => setOpen(!open)}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-surface-hover transition-colors">
        <span className="font-display text-sm text-text pr-3 leading-snug">{faq.q}</span>
        <div className={`shrink-0 w-7 h-7 rounded-md flex items-center justify-center transition-colors ${open ? 'bg-secondary/10 text-secondary' : 'bg-surface text-text-dim'}`}>
          {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }} className="overflow-hidden">
            <div className="px-4 pb-4 text-text-muted text-sm leading-relaxed border-t border-border/30 pt-3">{faq.a}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Ask() {
  const [question, setQuestion] = useState("");
  const [topic, setTopic] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!question.trim()) { setError("Please enter your question."); return; }
    setSubmitting(true); setError("");
    try {
      await submitQuestion({ question: question.trim(), topic, email });
      setSubmitted(true); setQuestion(""); setTopic(""); setEmail("");
    } catch { setError("Something went wrong. Please try again."); }
    finally { setSubmitting(false); }
  };

  return (
    <AnimatedPage className="flex-1 px-4 py-10 md:px-8 max-w-6xl mx-auto w-full flex flex-col gap-10">
      {/* Header */}
      <ScrollReveal>
        <div className="flex flex-col gap-3 max-w-2xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center">
              <MessageSquare size={18} className="text-secondary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-display text-text">Ask a Question</h1>
          </div>
          <p className="text-text-muted text-sm ml-[48px]">
            No legal knowledge needed. Describe your situation and we'll point you to the facts.
          </p>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form */}
        <ScrollReveal className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
                className="glass rounded-2xl p-8 flex flex-col items-center gap-5 text-center">
                <div className="w-14 h-14 rounded-xl bg-success/10 border border-success/20 flex items-center justify-center">
                  <CheckCircle size={28} className="text-success" />
                </div>
                <h3 className="font-display text-xl text-text">Question Submitted!</h3>
                <p className="text-text-muted text-sm max-w-xs leading-relaxed">Thank you. Our team will review your question and publish a response soon.</p>
                <button onClick={() => setSubmitted(false)}
                  className="mt-1 px-7 py-2.5 rounded-xl gradient-primary text-secondary font-display font-semibold text-sm shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-shadow">
                  Ask Another
                </button>
              </motion.div>
            ) : (
              <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="glass rounded-2xl p-6 flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="q" className="text-text font-display text-sm font-semibold">What is your question? *</label>
                  <textarea id="q" rows={5} value={question} onChange={e => setQuestion(e.target.value)}
                    placeholder="Describe your situation in detail..."
                    className="w-full bg-bg-warm/60 border border-border rounded-xl p-3.5 text-text placeholder:text-text-dim focus:outline-none focus:border-secondary/40 focus:shadow-[0_0_20px_rgba(255,179,0,0.08)] transition-all resize-none text-sm leading-relaxed" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="topic" className="text-text font-display text-sm font-semibold">Topic (Optional)</label>
                  <select id="topic" value={topic} onChange={e => setTopic(e.target.value)}
                    className="w-full bg-bg-warm/60 border border-border rounded-xl p-3.5 text-text focus:outline-none focus:border-secondary/40 transition-all cursor-pointer text-sm">
                    <option value="">Choose category</option>
                    <option value="LABOR">Employment & Labor</option>
                    <option value="TENANTS">Housing & Tenant</option>
                    <option value="POLICE">Police Encounters</option>
                    <option value="BUSINESS">Consumer & Business</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="email" className="text-text font-display text-sm font-semibold">Email (Optional)</label>
                  <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full bg-bg-warm/60 border border-border rounded-xl p-3.5 text-text placeholder:text-text-dim focus:outline-none focus:border-secondary/40 transition-all text-sm" />
                </div>
                {error && <p className="text-error text-sm font-medium">{error}</p>}
                <button type="submit" disabled={submitting}
                  className="mt-1 gradient-primary text-secondary font-display font-semibold text-sm px-7 py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all w-full md:w-auto self-start disabled:opacity-50 disabled:cursor-not-allowed">
                  {submitting ? "Sending..." : "Send Question"} <Send size={16} />
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </ScrollReveal>

        {/* Sidebar */}
        <ScrollReveal delay={0.1} className="lg:col-span-5 flex flex-col gap-5">
          <h3 className="font-display text-base text-text border-b border-border pb-3">Recently Answered</h3>
          <div className="flex flex-col gap-3">
            {RECENTLY.map(item => (
              <TiltCard key={item.id}>
                <Link to={`/article/${item.id}`}
                  className="glass p-4 rounded-xl border border-border flex items-center justify-between group block hover:border-secondary/20 transition-all">
                  <div className="flex flex-col gap-1.5 min-w-0">
                    <span className="tag w-fit">{item.tag}</span>
                    <h4 className="font-display text-sm text-text group-hover:text-secondary transition-colors leading-snug">{item.title}</h4>
                  </div>
                  <ArrowRight size={14} className="text-text-dim group-hover:text-secondary transition-colors shrink-0" />
                </Link>
              </TiltCard>
            ))}
          </div>
        </ScrollReveal>
      </div>

      {/* FAQs */}
      <ScrollReveal>
        <section className="border-t border-border pt-8">
          <div className="flex items-center gap-2 mb-5">
            <HelpCircle size={18} className="text-secondary" />
            <h3 className="font-display text-lg text-text">Common Questions</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {FAQS.map((faq, i) => <FAQ key={i} faq={faq} />)}
          </div>
        </section>
      </ScrollReveal>
    </AnimatedPage>
  );
}
