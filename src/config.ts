export const BRAND = {
  name: "Herlish Clarity Store",
  tagline: "Your Crown, Our Care.",
  product: "Castor Oil",
  whatsappNumber: "+255 765 124 617",
  whatsappUrl:
    "https://wa.me/255765124617?text=" +
    encodeURIComponent("Hello Herlish Clarity Store! I'd like to order the 100% Pure Castor Oil."),
  sizes: ["120 ml", "250 ml"],
  expiry: "12/2028",
  origin: "Made in Tanzania",
} as const;

export const BENEFITS = [
  {
    title: "Nourishes Scalp",
    text: "Helps keep your scalp healthy and balanced.",
    icon: "droplet",
  },
  {
    title: "Moisturizes Hair",
    text: "Keeps hair soft, smooth and hydrated.",
    icon: "droplets",
  },
  {
    title: "Helps Reduce Breakage",
    text: "Supports stronger, healthier-looking hair.",
    icon: "shield",
  },
  {
    title: "Adds Shine & Softness",
    text: "Gives your hair a natural glow and silky feel.",
    icon: "sparkles",
  },
  {
    title: "Supports Healthy-Looking Hair",
    text: "Nourishes with natural herbs and oils.",
    icon: "leaf",
  },
] as const;

export const INGREDIENTS = [
  {
    name: "Black Castor Oil",
    text: "The hero elixir — cold-pressed and nutrient-dense, prized for scalp nourishment and hair strength.",
  },
  {
    name: "Coconut Oil",
    text: "Deep-penetrating moisture that softens strands and seals in hydration without weight.",
  },
  {
    name: "Ayurvedic Herbal Extracts",
    text: "A botanical blend rooted in tradition, supporting a balanced scalp and natural shine.",
  },
] as const;
