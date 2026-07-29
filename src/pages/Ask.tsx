import { useState } from 'react';
import { Send, History, ArrowRight, ChevronDown, ChevronUp, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import AnimatedPage from '../components/AnimatedPage';
import TiltCard from '../components/TiltCard';
import ScrollReveal from '../components/ScrollReveal';
import { submitQuestion } from '../lib/articles';

const faqs = [
  {
    question: "How much notice does a landlord need to give for eviction?",
    answer:
      "Under the Rent Restriction Act, a landlord must provide a valid written notice. For month-to-month tenancies, this is typically one month's notice, but check your specific lease agreement.",
  },
  {
    question: "What is the legal minimum wage in Kenya?",
    answer:
      "The minimum wage varies by sector and location. Always refer to the latest Regulation of Wages Order, which publishes updated rates for general laborers in cities versus agricultural workers.",
  },
  {
    question: "Can the police search my phone without a warrant?",
    answer:
      "Generally, no. The right to privacy is protected under the Constitution. Police need a court order or a valid warrant to search your personal electronic devices, unless you give explicit consent.",
  },
  {
    question: "What should I do if I am unfairly dismissed?",
    answer:
      "You have the right to challenge an unfair dismissal through the labor office or the Employment and Labour Relations Court. You must typically file your claim within 3 years, but taking immediate action is recommended.",
  },
];

function FAQAccordion({ faq }: { faq: (typeof faqs)[0] }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-outline rounded-2xl glass-panel overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-5 flex items-center justify-between text-left hover:bg-primary/5 transition-colors focus:outline-none"
      >
        <span className="font-heading text-lg text-on-background pr-4">
          {faq.question}
        </span>
        {isOpen ? (
          <ChevronUp className="text-secondary shrink-0" />
        ) : (
          <ChevronDown className="text-on-surface-variant shrink-0" />
        )}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-5 pt-0 text-on-surface-variant mt-2 border-t border-outline/30">
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
      setQuestion("");
      setTopic("");
      setEmail("");
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
        <section className="flex flex-col gap-4 max-w-3xl">
          <h2 className="text-4xl md:text-5xl font-heading text-primary">
            Ask a Question
          </h2>
          <p className="text-lg text-on-surface-variant">
            No legal knowledge needed. Describe your situation and we'll point
            you to the facts.
          </p>
        </section>
      </ScrollReveal>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Form */}
        <ScrollReveal className="lg:col-span-7 flex flex-col">
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-panel rounded-3xl p-8 flex flex-col items-center gap-6 border border-outline text-center"
              >
                <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
                  <CheckCircle size={40} className="text-success" />
                </div>
                <h3 className="font-heading text-2xl text-primary">
                  Question Submitted!
                </h3>
                <p className="text-on-surface-variant max-w-md">
                  Thank you for your question. Our team will review it and
                  publish a response soon.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSubmitted(false)}
                  className="mt-4 bg-primary text-on-background font-heading text-lg px-8 py-4 rounded-xl hover:bg-primary/80 transition-colors hover-glow"
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
                className="glass-panel rounded-3xl p-6 md:p-8 flex flex-col gap-6 border border-outline relative overflow-hidden"
              >
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="question"
                    className="text-on-surface font-medium"
                  >
                    What is your question? *
                  </label>
                  <textarea
                    id="question"
                    rows={5}
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Describe your situation..."
                    className="w-full bg-background/50 border border-outline rounded-xl p-4 text-on-background placeholder:text-on-surface-variant input-focus-glow transition-all resize-none outline-none"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="topic"
                    className="text-on-surface font-medium"
                  >
                    Select a topic (Optional)
                  </label>
                  <select
                    id="topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full bg-background/50 border border-outline rounded-xl p-4 text-on-background input-focus-glow transition-all outline-none cursor-pointer appearance-none"
                  >
                    <option value="">Choose category</option>
                    <option value="LABOR">Employment & Labor</option>
                    <option value="TENANTS">Housing & Tenant</option>
                    <option value="POLICE">Police Encounters</option>
                    <option value="BUSINESS">Consumer & Business</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="email"
                    className="text-on-surface font-medium"
                  >
                    Email for notification (Optional)
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full bg-background/50 border border-outline rounded-xl p-4 text-on-background placeholder:text-on-surface-variant input-focus-glow transition-all outline-none"
                  />
                </div>

                {error && (
                  <p className="text-error text-sm font-medium">{error}</p>
                )}

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={submitting}
                  className="mt-4 bg-primary text-on-background font-heading text-lg px-8 py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-primary/80 transition-colors w-full md:w-auto self-start hover-glow disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Sending..." : "Send Question"}
                  <Send size={20} />
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>
        </ScrollReveal>

        {/* Recently Answered Sidebar */}
        <ScrollReveal
          delay={0.2}
          className="lg:col-span-5 flex flex-col gap-6"
        >
          <div className="flex items-center gap-2 border-b border-primary/30 pb-4">
            <History className="text-secondary" />
            <h3 className="text-2xl font-heading text-primary">
              Recently Answered
            </h3>
          </div>

          <div className="flex flex-col gap-4 py-2">
            <TiltCard>
              <Link
                to="/article/3"
                className="glass-panel p-5 rounded-2xl border border-outline flex flex-col gap-3 group block"
              >
                <div className="flex justify-between items-start">
                  <span className="pill-badge">TENANTS</span>
                  <ArrowRight
                    size={18}
                    className="text-on-surface-variant group-hover:text-secondary transition-colors"
                  />
                </div>
                <h4 className="text-lg font-heading text-on-background group-hover:text-secondary transition-colors">
                  Can a landlord lock my house for rent arrears?
                </h4>
              </Link>
            </TiltCard>

            <TiltCard>
              <Link
                to="/article/4"
                className="glass-panel p-5 rounded-2xl border border-outline flex flex-col gap-3 group block"
              >
                <div className="flex justify-between items-start">
                  <span className="pill-badge">LABOR</span>
                  <ArrowRight
                    size={18}
                    className="text-on-surface-variant group-hover:text-secondary transition-colors"
                  />
                </div>
                <h4 className="text-lg font-heading text-on-background group-hover:text-secondary transition-colors">
                  What are my rights if I'm fired without notice?
                </h4>
              </Link>
            </TiltCard>
          </div>
        </ScrollReveal>
      </div>

      <ScrollReveal>
        <section className="mt-12 pt-12 border-t border-primary/30">
          <h3 className="text-3xl font-heading text-primary mb-8 text-center md:text-left">
            Commonly Asked Legal Questions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq, index) => (
              <FAQAccordion key={index} faq={faq} />
            ))}
          </div>
        </section>
      </ScrollReveal>
    </AnimatedPage>
  );
}
