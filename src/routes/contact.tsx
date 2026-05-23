import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Instagram, Facebook, Twitter } from "lucide-react";
import { useSiteInfoStore } from "@/store/siteInfo";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — The Scented Aura" },
      { name: "description", content: "Visit our Paris boutique or write to us. We respond to every letter." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { 
    contactTitle, 
    contactSubtitle, 
    contactBody, 
    locationUrl,
    boutiqueAddress, 
    correspondenceEmails, 
    phoneLines 
  } = useSiteInfoStore();

  const cards = [
    { icon: MapPin, label: "Boutique", lines: boutiqueAddress },
    { icon: Mail, label: "Correspondence", lines: correspondenceEmails },
    { icon: Phone, label: "Téléphone", lines: phoneLines },
  ];

  return (
    <div className="pt-32 pb-24">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="text-center mb-20"
        >
          <span className="gold-divider mb-6">Contactez-nous</span>
          <h1 className="font-display text-5xl md:text-6xl text-foreground">
            {contactTitle} <em className="font-serif italic">{contactSubtitle}</em>
          </h1>
          <p className="mt-5 max-w-xl mx-auto font-serif italic text-muted-foreground">
            {contactBody}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {cards.map((c) => (
            <div
              key={c.label}
              className="bg-[var(--color-cream)] border border-border p-8 text-center"
            >
              <c.icon size={20} strokeWidth={1.2} className="mx-auto text-[var(--color-gold-hover)]" />
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-gold-deep)] mt-5 mb-4">
                {c.label}
              </p>
              {c.lines.map((l) => (
                <p key={l} className="font-serif text-muted-foreground text-base">{l}</p>
              ))}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          <form
            onSubmit={(e) => e.preventDefault()}
            className="space-y-8"
          >
            <h2 className="font-display text-3xl text-foreground">
              Write to <em className="font-serif italic">us</em>
            </h2>
            {[
              { label: "Your name", type: "text" },
              { label: "Email address", type: "email" },
              { label: "Subject", type: "text" },
            ].map((f) => (
              <div key={f.label}>
                <label className="block text-xs uppercase tracking-[0.25em] text-muted-foreground mb-2">
                  {f.label}
                </label>
                <input
                  type={f.type}
                  className="w-full bg-transparent border-b border-foreground/30 focus:border-foreground py-2 outline-none transition-colors"
                />
              </div>
            ))}
            <div>
              <label className="block text-xs uppercase tracking-[0.25em] text-muted-foreground mb-2">
                Message
              </label>
              <textarea
                rows={5}
                className="w-full bg-transparent border-b border-foreground/30 focus:border-foreground py-2 outline-none transition-colors resize-none"
              />
            </div>
            <button type="submit" className="btn-luxury">
              Send Message
            </button>
          </form>

          <div className="space-y-8">
            <div className="aspect-[4/3] bg-[var(--color-secondary)] border border-border overflow-hidden flex items-center justify-center">
              {locationUrl ? (
                <a 
                  href={locationUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="block w-full h-full flex flex-col items-center justify-center hover:bg-muted/20 transition-colors group cursor-pointer"
                >
                  <MapPin size={28} strokeWidth={1.1} className="mx-auto text-[var(--color-gold-hover)] group-hover:scale-110 transition-transform duration-300" />
                  <p className="font-display text-xl mt-3 text-foreground">View on Map</p>
                  <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-gold-deep)] mt-2 font-medium">
                    Click to open location
                  </p>
                </a>
              ) : (
                <div className="text-center">
                  <MapPin size={28} strokeWidth={1.1} className="mx-auto text-[var(--color-gold-hover)]" />
                  <p className="font-display text-xl mt-3 text-foreground">Le Marais, Paris</p>
                  <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mt-2">
                    {boutiqueAddress[0] || "18 Rue des Archives"}
                  </p>
                </div>
              )}
            </div>
            <div>
              <h3 className="font-display text-2xl text-foreground mb-5">
                Suivez-nous
              </h3>
              <div className="flex gap-5 text-foreground/80">
                <a aria-label="Instagram" className="hover:text-[var(--color-gold-hover)] transition-colors"><Instagram size={20} strokeWidth={1.3} /></a>
                <a aria-label="Facebook" className="hover:text-[var(--color-gold-hover)] transition-colors"><Facebook size={20} strokeWidth={1.3} /></a>
                <a aria-label="Twitter" className="hover:text-[var(--color-gold-hover)] transition-colors"><Twitter size={20} strokeWidth={1.3} /></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
