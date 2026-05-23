import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SiteInfoState {
  aboutTitle: string;
  aboutSubtitle: string;
  aboutBody: string;
  philosophyQuote: string;
  philosophyAuthor: string;
  handmadeTitle: string;
  handmadeSubtitle: string;
  handmadeBody: string;
  timeline: { year: string; event: string }[];

  contactTitle: string;
  contactSubtitle: string;
  contactBody: string;
  locationUrl: string;
  boutiqueAddress: string[];
  correspondenceEmails: string[];
  phoneLines: string[];
  
  updateSiteInfo: (data: Partial<SiteInfoState>) => void;
}

export const useSiteInfoStore = create<SiteInfoState>()(
  persist(
    (set) => ({
      aboutTitle: "A house built on",
      aboutSubtitle: "patience",
      aboutBody: "The Scented Aura began as a single bottle, blended over three winters by a perfumer who refused to compromise on time. Today, we remain small by design — an independent house where every fragrance is conceived, composed, and finished by hand.",
      philosophyQuote: "“A fragrance should not announce itself. It should be discovered — quietly, intimately, like a secret kept in the folds of a silk scarf.”",
      philosophyAuthor: "— Hélène Marchand, Founder",
      handmadeTitle: "Made entirely",
      handmadeSubtitle: "by hand",
      handmadeBody: "From the maceration of absolutes to the wax seal on every box, there is no machine in our process — only practiced hands and unhurried time.",
      timeline: [
        { year: "2014", event: "A small atelier opens behind a wrought-iron gate in the Marais." },
        { year: "2017", event: "First signature accord — Dark Amber — released in 100 numbered bottles." },
        { year: "2020", event: "The house begins working exclusively with French botanical growers." },
        { year: "2026", event: "Today, every bottle is still macerated, poured, and labeled by hand." },
      ],

      contactTitle: "Come",
      contactSubtitle: "closer",
      contactBody: "We answer every letter personally. Visit us in Paris, or write — we delight in the slow art of conversation.",
      locationUrl: "",
      boutiqueAddress: ["18 Rue des Archives", "75004 Paris, France"],
      correspondenceEmails: ["bonjour@scentedaura.com", "press@scentedaura.com"],
      phoneLines: ["+33 1 42 76 18 04", "Tuesday — Saturday"],

      updateSiteInfo: (data) => set((state) => ({ ...state, ...data })),
    }),
    {
      name: 'scented-aura-siteinfo',
    }
  )
);
