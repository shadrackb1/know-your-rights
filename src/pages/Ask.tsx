import { useState } from 'react';
import { Send, History, ArrowRight, ChevronDown, ChevronUp, CheckCircle, HelpCircle, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import AnimatedPage from '../components/AnimatedPage';
import TiltCard from '../components/TiltCard';
import ScrollReveal from '../components/ScrollReveal';
import { submitQuestion } from '../lib/articles';

const faqs = [
  {
    question: "How much notice does a landlord need to give for eviction?",
    answer: "Under the Rent Restriction Act, a landlord must provide a valid written notice. For month-to-month tenancies, this is typically one month's notice, but check your specific lease agreement.",
  },
  {
    question: "What is the legal minimum wage in Kenya?",
    answer: "The minimum wage varies by sector and location. Always refer to the latest Regulation of Wages Order, which publishes updated rates for general laborers in cities versus agricultural workers.",
  },
  {
    question: "Can the police search my phone without a warrant?",
    answer: "Generally, no. The right to privacy is protected under the Constitution. Police need a court order or a valid warrant to search your personal electronic devices, unless you give explicit consent.",
  },
  {
    question: "What should I do if I am unfairly dismissed?",
    answer: "You have the right to challenge an unfair dismissal through the labor office or the Employment and Labour Relations Court. You must typically file your claim within 3 years, but taking immediate action is recommended.",
  },
];

function FAQAccordion({ faq }: { faq: (typeof faqs)[0] }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="glass-panel border border-outline rounded-2xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-5 flex items-center justify-between text-left hover:bg-surface-hover transition-colors focus:outline-none"
      >
        <span className="font-heading text-base text-on-background pr-4">{faq.question}</span>
        <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${isOpen ? 'bg-secondary/10 text-secondary' : 'bg-surface text-on-surface-variant'}`}>
          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-5 pt-0 text-on-surface-variant text-sm leading-relaxed border-t border-outline/30 mt-1">
              {faq.answer}
            </div>
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) {
      setError("Please enter your question.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await submitQuestion({ question: question.trim(), topic, email });
      setSubmitted(true);
      setQuestion(""); setTopic(""); setEmail("");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatedPage className="flex-1 px-4 py-12 md:px-8 max-w-6xl mx-auto w-full flex flex-col gap-12">
      {/* Header */}
      <ScrollReveal>
        <div className="flex flex-col gap-4 max-w-3xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <MessageSquare size={20} className="text-secondary" />
            </div>
            <h2 className="text-4xl md:text-5xl font-heading text-on-background">Ask a Question</h2>
          </div>
          <p className="text-on-surface-variant text-base ml-[52px]">
            No legal knowledge needed. Describe your situation and we'll point you to the facts.
          </p>
        </div>
      </ScrollReveal>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Form */}
        <ScrollReveal className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-panel rounded-3xl p-10 flex flex-col items-center gap-6 text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-success/10 border border-success/20 flex items-center justify-center">
                  <CheckCircle size={32} className="text-success" />
                </div>
                <h3 className="font-heading text-2xl text-on-background">Question Submitted!</h3>
                <p className="text-on-surface-variant max-w-sm text-sm leading-relaxed">
                  Thank you. Our team will review your question and publish a response soon.
                </p>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSubmitted(false)}
                  className="mt-2 px-8 py-3 rounded-xl gradient-primary text-secondary font-heading font-semibold text-sm shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-shadow"
                >
                  Ask Another Question
                </motion.button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="glass-panel rounded-3xl p-6 md:p-8 flex flex-col gap-5"
              >
                <div className="flex flex-col gap-2">
                  <label htmlFor="question" className="text-on-surface font-heading text-sm font-semibold">
                    What is your question? *
                  </label>
                  <textarea
                    id="question"
                    rows={5}
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Describe your situation in detail..."
                    className="w-full bg-background-warm/60 border border-outline rounded-xl p-4 text-on-background placeholder:text-on-surface-variant/50 input-focus-glow transition-all resize-none outline-none text-sm leading-relaxed"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="topic" className="text-on-surface font-heading text-sm font-semibold">
                    Topic (Optional)
                  </label>
                  <select
                    id="topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full bg-background-warm/60 border border-outline rounded-xl p-4 text-on-background input-focus-glow transition-all outline-none cursor-pointer text-sm"
                  >
                    <option value="">Choose category</option>
                    <option value="LABOR">Employment & Labor</option>
                    <option value="TENANTS">Housing & Tenant</option>
                    <option value="POLICE">Police Encounters</option>
                    <option value="BUSINESS">Consumer & Business</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="text-on-surface font-heading text-sm font-semibold">
                    Email for notification (Optional)
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full bg-background-warm/60 border border-outline rounded-xl p-4 text-on-background placeholder:text-on-surface-variant/50 input-focus-glow transition-all outline-none text-sm"
                  />
                </div>

                {error && <p className="text-error text-sm font-medium">{error}</p>}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={submitting}
                  className="mt-2 gradient-primary text-secondary font-heading font-semibold text-base px-8 py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all w-full md:w-auto self-start disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Sending..." : "Send Question"}
                  <Send size={18} />
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>
        </ScrollReveal>

        {/* Sidebar */}
        <ScrollReveal delay={0.15} className="lg:col-span-5 flex flex-col gap-6">
          <div className="flex items-center gap-2 pb-3 border-b border-outline">
            <History size={18} className="text-secondary" />
            <h3 className="text-lg font-heading text-on-background">Recently Answered</h3>
          </div>

          <div className="flex flex-col gap-3">
            {[
              { id: "3", tag: "TENANTS", title: "Can a landlord lock my house for rent arrears?" },
              { id: "4", tag: "LABOR", title: "What are my rights if I'm fired without notice?" },
            ].map((item) => (
              <TiltCard key={item.id}>
                <Link
                  to={`/article/${item.id}`}
                  className="glass-panel p-4 rounded-2xl border border-outline flex flex-col gap-2 group hover-glow block"
                >
                  <div className="flex justify-between items-start">
                    <span className="tag-chip">{item.tag}</span>
                    <ArrowRight size={16} className="text-on-surface-variant group-hover:text-secondary transition-colors mt-0.5" />
                  </div>
                  <h4 className="text-base font-heading text-on-background group-hover:text-secondary transition-colors leading-snug">
                    {item.title}
                  </h4>
                </Link>
              </TiltCard>
            ))}
          </div>
        </ScrollReveal>
      </div>

      {/* FAQs */}
      <ScrollReveal>
        <section className="border-t border-outline pt-10">
          <div className="flex items-center gap-2 mb-6">
            <HelpCircle size={20} className="text-secondary" />
            <h3 className="text-xl font-heading text-on-background">Commonly Asked Legal Questions</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {faqs.map((faq, index) => (
              <FAQAccordion key={index} faq={faq} />
            ))}
          </div>
        </section>
      </ScrollReveal>
    </AnimatedPage>
  );
}
