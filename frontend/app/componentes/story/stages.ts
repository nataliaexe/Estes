export interface StoryStage {
  id: string;
  image: string; // pode ser URL de imagem ou vídeo (.mp4, .webm, etc)
  fallbackImage?: string; // imagem de fallback para vídeos
  accent: string; // cor em formato RGB (ex: "rgb(75, 249, 141)")
  title: string;
  subtitle?: string;
  description?: string; // texto adicional para narrativa
  align?: "left" | "center" | "right";
  particles?: number;
  credit?: string; // crédito visível (obrigatório para fotos de terceiros)
}

export const STORY_STAGES: StoryStage[] = [
  {
    id: "portal",
    image: "/videos/motiondesignerspro_pindown.io_1789921835.mp4",
    fallbackImage: "https://images.pexels.com/photos/35358458/pexels-photo-35358458.jpeg?auto=compress&cs=tinysrgb&w=1920",
    accent: "rgb(75, 249, 141)",
    title: "",
    subtitle: "",
    align: "center",
    particles: 0.4,
    credit: "Video by motiondesignerspro",
  },
  {
    id: "raiz-mae",
    image: "/videos/sunlight_005_pindown.io_1789927153.mp4",
    fallbackImage: "https://images.pexels.com/photos/29382163/pexels-photo-29382163.jpeg?auto=compress&cs=tinysrgb&w=1920",
    accent: "rgb(75, 249, 141)",
    title: "These roots",
    subtitle: "know the ground.",
    description: "Deep beneath the soil, ancient networks connect every living thing.",
    align: "left",
    particles: 0.5,
    credit: "Video by sunlight_005",
  },
  {
    id: "agua",
    image: "/videos/junehuimeng_pindown.io_1789927248.mp4",
    fallbackImage: "https://images.pexels.com/photos/932638/pexels-photo-932638.jpeg?auto=compress&cs=tinysrgb&w=1920",
    accent: "rgb(41, 231, 242)",
    title: "These waters",
    subtitle: "are poisoned.",
    description: "Mercury, agrotóxicos, industrial waste — flowing through the veins of the land.",
    align: "left",
    particles: 0.6,
    credit: "Video by junehuimeng",
  },
  {
    id: "fogo",
    image: "/videos/ramonapimentels_pindown.io_1789927837.mp4",
    fallbackImage: "https://images.pexels.com/photos/1459505/pexels-photo-1459505.jpeg?auto=compress&cs=tinysrgb&w=1920",
    accent: "rgb(166, 138, 66)",
    title: "These lands",
    subtitle: "refuse to die.",
    description: "Even after the flames, life finds a way to return.",
    align: "right",
    particles: 0.7,
    credit: "Video by ramonapimentels",
  },
  {
    id: "territorios",
    image: "https://images.pexels.com/photos/975771/pexels-photo-975771.jpeg?auto=compress&cs=tinysrgb&w=1920",
    accent: "rgb(194, 107, 250)",
    title: "These peoples",
    subtitle: "protect the forest.",
    description: "Indigenous territories hold 23% of the Amazon but only 1.6% of deforestation.",
    align: "left",
    particles: 0.8,
    credit: "Aerial photo by Pixabay / Pexels",
  },
  {
    id: "doenca",
    image: "https://images.pexels.com/photos/459728/pexels-photo-459728.jpeg?auto=compress&cs=tinysrgb&w=1920",
    accent: "rgb(127, 29, 29)",
    title: "But these wounds",
    subtitle: "are real.",
    description: "The Maxakali people face 4x higher infant mortality. The Waimiri Atroari watch their river die.",
    align: "center",
    particles: 0.9,
    credit: "Photo by Pixabay / Pexels",
  },
  {
    id: "flor",
    image: "https://images.pexels.com/photos/139590/pexels-photo-139590.jpeg?auto=compress&cs=tinysrgb&w=1920",
    accent: "rgb(75, 249, 141)",
    title: "And these still",
    subtitle: "resist.",
    description: "In every leaf, in every root, in every seed — the solution waits to be discovered.",
    align: "center",
    particles: 1.0,
    credit: "Photo by Pixabay / Pexels",
  },
  {
    id: "semente",
    image: "https://images.pexels.com/photos/4311517/pexels-photo-4311517.jpeg?auto=compress&cs=tinysrgb&w=1920",
    accent: "rgb(194, 107, 250)",
    title: "These",
    subtitle: "— you.",
    description: "Your material. Your problem. Your investigation.",
    align: "center",
    particles: 0.5,
    credit: "Photo by Gioele Fazzeri / Pexels",
  },
];
