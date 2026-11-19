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
    image: "/benefits/scalp.jpg",
    alt: "Fingertips massaging golden castor oil into the scalp at the hair roots",
  },
  {
    title: "Moisturizes Hair",
    text: "Keeps hair soft, smooth and hydrated.",
    icon: "droplets",
    image: "/benefits/moisture.jpg",
    alt: "Macro shot of curly hair strands coated in glistening golden oil droplets",
  },
  {
    title: "Helps Reduce Breakage",
    text: "Supports stronger, healthier-looking hair.",
    icon: "shield",
    image: "/benefits/breakage.jpg",
    alt: "Strong healthy braid of dark hair with a golden oil sheen",
  },
  {
    title: "Adds Shine & Softness",
    text: "Gives your hair a natural glow and silky feel.",
    icon: "sparkles",
    image: "/benefits/shine.jpg",
    alt: "Flowing silky hair catching golden light beside a bottle of castor oil",
  },
  {
    title: "Supports Healthy-Looking Hair",
    text: "Nourishes with natural herbs and oils.",
    icon: "leaf",
    image: "/benefits/healthy.jpg",
    alt: "Woman with radiant natural hair surrounded by botanicals and golden oil mist",
  },
] as const;

export const REVIEWS = [
  {
    name: "Halima M.",
    location: "Dar es Salaam",
    rating: 5,
    text: "My edges were thinning for years. Three months with this oil and my hairline is finally filling back in. I massage it in every night before bed.",
  },
  {
    name: "Neema K.",
    location: "Arusha",
    rating: 5,
    text: "The shine is unreal. My twists stay moisturized for days and my scalp stopped itching completely. This is now a permanent part of my routine.",
  },
  {
    name: "Zawadi J.",
    location: "Mwanza",
    rating: 5,
    text: "I was skeptical because I've tried so many oils, but this one is different — thick, pure, no weird smell. My breakage reduced within weeks.",
  },
  {
    name: "Rehema S.",
    location: "Dodoma",
    rating: 4,
    text: "Beautiful packaging and the oil itself feels luxurious. A little goes a long way. My only wish is a bigger bottle — the 250 ml runs out fast!",
  },
  {
    name: "Aisha B.",
    location: "Zanzibar",
    rating: 5,
    text: "Used it on my daughter's hair too — so gentle and natural. Her curls are softer and so much easier to detangle now. Asante sana!",
  },
  {
    name: "Wema T.",
    location: "Mbeya",
    rating: 5,
    text: "Ordered on WhatsApp and it arrived in two days. The herbal blend smells earthy and real. My hair feels stronger from root to tip.",
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
