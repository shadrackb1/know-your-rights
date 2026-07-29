import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Youtube, Podcast, Video, ChevronDown } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';
import AnimatedPage from '../components/AnimatedPage';
import TiltCard from '../components/TiltCard';
import { ContentCardSkeleton } from '../components/Skeleton';
import ScrollReveal from '../components/ScrollReveal';

const mockFeed = [
  {
    id: '1',
    title: "Police Encounters: What are your rights?",
    tag: "POLICE",
    desc: "Can a police officer search your bag without a warrant? What should you do at a roadblock?",
    img: "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=800&q=80",
    type: "video"
  },
  {
    id: '2',
    title: "Unfair Dismissal Basics",
    tag: "LABOR",
    desc: "Learn what constitutes an unfair dismissal and immediate steps to protect yourself.",
    img: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80",
    type: "video"
  },
  {
    id: '3',
    title: "Understanding Eviction Notices",
    tag: "TENANTS",
    desc: "A landlord cannot just lock you out. Discover the legal requirements for a valid eviction.",
    img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
    type: "podcast"
  },
  {
    id: '4',
    title: "Maternity Leave Rights",
    tag: "LABOR",
    desc: "Are you entitled to fully paid maternity leave? What happens if your contract expires?",
    img: "https://images.unsplash.com/photo-1555252113-fdfc37ceda33?auto=format&fit=crop&w=800&q=80",
    type: "video"
  }
];

const topics = ["ALL", "POLICE", "TENANTS", "LABOR", "BUSINESS"];

export default function Home() {
  const [activeTopic, setActiveTopic] = useState("ALL");
  const [sortOption, setSortOption] = useState("Newest");
  const [loading, setLoading] = useState(true);
  const heroRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const yBackground = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacityText = useTransform(scrollYProgress, [0, 1], [1, 0]);

  const filteredFeed = activeTopic === "ALL" 
    ? mockFeed 
    : mockFeed.filter(item => item.tag === activeTopic);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
    show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <AnimatedPage className="flex-1 flex flex-col items-center pt-8 md:pt-16 px-4 md:px-8">
      <div className="w-full max-w-7xl">
        
        {/* Hero Section */}
        <section ref={heroRef} className="relative flex flex-col items-center text-center mb-16 overflow-hidden">
          <motion.div 
            className="absolute inset-0 z-[-1] flex justify-center items-center opacity-30 blur-3xl pointer-events-none"
            style={{ y: yBackground }}
          >
             <motion.div 
               animate={{ x: [0, 50, -20, 0], y: [0, -30, 20, 0], rotate: [0, 10, -10, 0] }}
               transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
               className="w-[30rem] h-[30rem] bg-primary blob-shape mix-blend-screen absolute"
             ></motion.div>
             <motion.div 
               animate={{ x: [0, -50, 20, 0], y: [0, 30, -20, 0], rotate: [0, -10, 10, 0] }}
               transition={{ duration: 18, repeat: Infinity, ease: "linear", delay: 2 }}
               className="w-[30rem] h-[30rem] bg-secondary blob-shape mix-blend-screen absolute ml-[200px]"
             ></motion.div>
          </motion.div>

          <motion.h1 
            style={{ opacity: opacityText }}
            className="text-4xl md:text-6xl font-heading text-primary mb-4 leading-tight"
          >
            Justice in your pocket.
          </motion.h1>
          <motion.p 
            style={{ opacity: opacityText }}
            className="text-lg md:text-xl text-on-surface-variant max-w-2xl mb-8"
          >
            The street-legal law series breaking down everyday Kenyan rights. No jargon, just facts.
          </motion.p>
          <div className="flex items-center gap-6">
            <motion.a whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} href="#" className="text-on-background hover:text-secondary transition-colors"><span className="font-heading font-bold">TikTok</span></motion.a>
            <motion.a whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} href="#" className="text-on-background hover:text-secondary transition-colors"><Instagram size={24} /></motion.a>
            <motion.a whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} href="#" className="text-on-background hover:text-secondary transition-colors"><Youtube size={24} /></motion.a>
            <motion.a whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} href="#" className="text-on-background hover:text-secondary transition-colors"><Podcast size={24} /></motion.a>
          </div>
        </section>

        {/* Content Section */}
        <section className="mb-12">
          {/* Controls */}
          <ScrollReveal>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
              {/* Filter Pills */}
              <div className="flex overflow-x-auto gap-3 pb-2 no-scrollbar w-full sm:w-auto">
                {topics.map(topic => (
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    key={topic}
                    onClick={() => setActiveTopic(topic)}
                    className={`shrink-0 px-4 py-2 rounded-full font-heading text-sm uppercase tracking-wide transition-colors border ${
                      activeTopic === topic
                        ? 'bg-primary border-primary text-secondary'
                        : 'bg-transparent border-outline text-on-surface hover:border-primary'
                    }`}
                  >
                    {topic}
                  </motion.button>
                ))}
              </div>

              {/* Sort Toggle */}
              <div className="relative group shrink-0">
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex items-center gap-2 font-heading text-sm text-on-surface-variant group-hover:text-secondary transition-colors glass-panel px-4 py-2 rounded-lg border border-outline">
                  {sortOption} <ChevronDown size={16} />
                </motion.button>
              </div>
            </div>
          </ScrollReveal>

          {/* Grid */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <motion.div variants={itemVariants} key={`skeleton-${i}`}>
                  <ContentCardSkeleton />
                </motion.div>
              ))
            ) : (
              filteredFeed.map(item => (
                <motion.div variants={itemVariants} key={item.id}>
                  <TiltCard>
                    <Link to={`/article/${item.id}`} className="group glass-panel rounded-2xl p-4 flex flex-col gap-4 block h-full">
                      <div className="relative aspect-square w-full">
                        <div className="absolute inset-0 blob-shape border-2 border-primary overflow-hidden">
                          <img 
                            src={item.img} 
                            alt={item.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                             {item.type === 'video' ? <Video size={32} className="text-secondary" /> : <Podcast size={32} className="text-secondary" />}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2 items-start flex-1 px-2 pb-2">
                        <motion.span whileHover={{ y: -2 }} className="pill-badge">{item.tag}</motion.span>
                        <h3 className="font-heading text-xl text-on-background group-hover:text-secondary transition-colors mt-1 leading-snug">
                          {item.title}
                        </h3>
                        <p className="text-on-surface-variant text-sm line-clamp-2">
                          {item.desc}
                        </p>
                      </div>
                    </Link>
                  </TiltCard>
                </motion.div>
              ))
            )}
          </motion.div>
        </section>
        
      </div>
    </AnimatedPage>
  );
}
