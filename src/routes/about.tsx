import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import aboutImg from "@/assets/about-hero.jpg";
import storyImg from "@/assets/brand-story.jpg";
import { useSiteInfoStore } from "@/store/siteInfo";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — The Scented Aura" },
      { name: "description", content: "The story of an independent maison crafting fragrances by hand in Paris." },
    ],
  }),
  component: AboutPage,
});

export default function AboutPage() {
  const { 
    aboutTitle, 
    aboutSubtitle, 
    aboutBody, 
    philosophyQuote, 
    philosophyAuthor, 
    handmadeTitle, 
    handmadeSubtitle, 
    handmadeBody, 
    timeline 
  } = useSiteInfoStore();

  return (
    <div className="pt-32">
      <section className="mx-auto max-w-[1400px] px-6 lg:px-12 grid lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <span className="gold-divider mb-6">Our House</span>
          <h1 className="font-display text-5xl md:text-7xl leading-[1.05] text-foreground">
            {aboutTitle}
            <br />
            <em className="font-serif italic text-[var(--color-gold-hover)]">
              {aboutSubtitle}
            </em>
          </h1>
          <p className="mt-8 text-lg font-serif text-muted-foreground leading-loose">
            {aboutBody}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2 }}
          className="aspect-[4/5] overflow-hidden"
        >
          <img src={aboutImg} alt="Founder" width={1280} height={1536} className="w-full h-full object-cover" />
        </motion.div>
      </section>

      {/* Philosophy */}
      <section className="py-32">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <span className="gold-divider mb-6">Our Philosophy</span>
          <p className="font-display text-3xl md:text-4xl italic leading-snug text-foreground">
            {philosophyQuote}
          </p>
          <p className="mt-6 text-xs tracking-[0.3em] uppercase text-[var(--color-gold-deep)]">
            {philosophyAuthor}
          </p>
        </div>
      </section>

      {/* Image split */}
      <section className="bg-[var(--color-secondary)] py-32">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12 grid lg:grid-cols-2 gap-16 items-center">
          <motion.img
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            src={storyImg}
            alt="Atelier"
            loading="lazy"
            width={1080}
            height={1536}
            className="aspect-[4/5] w-full object-cover"
          />
          <div>
            <h2 className="font-display text-4xl md:text-5xl text-foreground">
              {handmadeTitle}
              <br />
              <em className="font-serif italic">{handmadeSubtitle}</em>
            </h2>
            <p className="mt-6 font-serif text-lg text-muted-foreground leading-loose">
              {handmadeBody}
            </p>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-32">
        <div className="mx-auto max-w-3xl px-6">
          <div className="text-center mb-16">
            <span className="gold-divider mb-6">Timeline</span>
            <h2 className="font-display text-4xl md:text-5xl text-foreground">
              A quiet <em className="font-serif italic">history</em>
            </h2>
          </div>
          <div className="space-y-12">
            {timeline.map((t, i) => (
              <motion.div
                key={t.year}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.1 }}
                className="grid grid-cols-[100px_1fr] gap-8 items-start pb-12 border-b border-border last:border-0"
              >
                <p className="font-display text-3xl text-[var(--color-gold-hover)]">
                  {t.year}
                </p>
                <p className="font-serif text-lg text-muted-foreground leading-relaxed pt-2">
                  {t.event}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
