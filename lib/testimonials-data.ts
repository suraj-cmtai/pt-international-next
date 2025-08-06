export interface Testimonial {
  id: string
  name: string
  title: string
  company: string
  image: string
  content: string
  rating: number
  category: "research" | "diagnostics" | "consulting" | "quality"
  featured?: boolean
}

export interface WhyChooseUsFeature {
  id: string
  icon: string
  title: string
  description: string
  stats?: {
    number: string
    label: string
  }
}

export interface AboutUsSection {
  id: string
  title: string
  content: string
  image?: string
  stats?: Array<{
    number: string
    label: string
  }>
}

export const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Dr. Sarah Chen",
    title: "Research Director",
    company: "BioTech Research Institute",
    image: "/logo.png",
    content:
      "PT International has been our trusted partner for over 5 years. Their research products are consistently high-quality, and their technical support team is exceptional. The Advanced PCR Kit has significantly improved our research efficiency.",
    rating: 5,
    category: "research",
    featured: true,
  },
  {
    id: "2",
    name: "Dr. Michael Rodriguez",
    title: "Laboratory Manager",
    company: "City General Hospital",
    image: "/logo.png",
    content:
      "The diagnostic solutions from PT International have transformed our testing capabilities. Their COVID-19 rapid tests provided accurate results when we needed them most during the pandemic. Outstanding reliability and customer service.",
    rating: 5,
    category: "diagnostics",
    featured: true,
  },
  {
    id: "3",
    name: "Dr. Emily Watson",
    title: "Quality Assurance Director",
    company: "PharmaCorp Ltd",
    image: "/logo.png",
    content:
      "PT International's consulting services helped us navigate complex FDA regulations seamlessly. Their expertise in regulatory affairs saved us months of preparation time and ensured our successful product launch.",
    rating: 5,
    category: "consulting",
    featured: true,
  },
  {
    id: "4",
    name: "Prof. James Thompson",
    title: "Department Head",
    company: "University Medical Center",
    image: "/logo.png",
    content:
      "We've been using PT International's instruments for our teaching labs. The laboratory centrifuge is robust, reliable, and perfect for our educational needs. Great value for money and excellent after-sales support.",
    rating: 5,
    category: "research",
  },
  {
    id: "5",
    name: "Dr. Lisa Park",
    title: "Clinical Laboratory Director",
    company: "Regional Medical Labs",
    image: "/logo.png",
    content:
      "The quality control services from PT International ensure our lab maintains the highest standards. Their method validation expertise and comprehensive testing protocols have been invaluable to our operations.",
    rating: 5,
    category: "quality",
  },
  {
    id: "6",
    name: "Dr. Robert Kim",
    title: "Research Scientist",
    company: "Genomics Research Center",
    image: "/logo.png",
    content:
      "PT International's reagents and chemicals are of exceptional purity. The HPLC grade acetonitrile consistently delivers reliable results in our analytical work. Their technical documentation is also very thorough.",
    rating: 5,
    category: "research",
  },
]

export const whyChooseUsFeatures: WhyChooseUsFeature[] = [
  {
    id: "1",
    icon: "Award",
    title: "ISO 9001:2015 Certified",
    description:
      "Our quality management system meets international standards, ensuring consistent product quality and service excellence.",
    stats: {
      number: "15+",
      label: "Years Certified",
    },
  },
  {
    id: "2",
    icon: "Globe",
    title: "Global Reach",
    description:
      "We serve customers in over 50 countries worldwide, with established distribution networks and local support.",
    stats: {
      number: "50+",
      label: "Countries Served",
    },
  },
  {
    id: "3",
    icon: "Users",
    title: "Expert Team",
    description:
      "Our team of PhD scientists and technical experts provides unparalleled support and consultation services.",
    stats: {
      number: "25+",
      label: "PhD Scientists",
    },
  },
  {
    id: "4",
    icon: "Clock",
    title: "Fast Delivery",
    description: "Efficient logistics and inventory management ensure quick delivery times and product availability.",
    stats: {
      number: "24-48h",
      label: "Delivery Time",
    },
  },
  {
    id: "5",
    icon: "Shield",
    title: "Quality Guarantee",
    description: "All products come with our quality guarantee and comprehensive technical support.",
    stats: {
      number: "100%",
      label: "Quality Assured",
    },
  },
  {
    id: "6",
    icon: "HeadphonesIcon",
    title: "24/7 Support",
    description: "Round-the-clock technical support and customer service to address your needs promptly.",
    stats: {
      number: "24/7",
      label: "Support Available",
    },
  },
]

export const aboutUsSections: AboutUsSection[] = [
  {
    id: "company-overview",
    title: "Company Overview",
    content:
      "PT International Lifesciences LLC has grown from a small startup to a leading global provider of life science solutions. Our journey began with a simple mission: to make high-quality research products and diagnostic solutions accessible to laboratories worldwide. Today, we serve over 1,000 customers across 50+ countries, maintaining our commitment to excellence, innovation, and customer satisfaction.",
    image: "/business-center.jpg",
    stats: [
      // { number: "2008", label: "Founded" },
      { number: "1000+", label: "Customers" },
      { number: "50+", label: "Countries" },
      { number: "500+", label: "Products" },
    ],
  },
  {
    id: "our-expertise",
    title: "Our Expertise",
    content:
      "With over 15 years of experience in the life sciences industry, we have developed deep expertise across multiple domains. Our team includes PhD scientists, regulatory affairs specialists, quality assurance experts, and technical support professionals. This diverse expertise allows us to provide comprehensive solutions that meet the evolving needs of modern laboratories and research institutions.",
    image: "/front-building.jpg",
    stats: [
      { number: "15+", label: "Years Experience" },
      { number: "25+", label: "PhD Scientists" },
      { number: "10+", label: "Regulatory Experts" },
      { number: "99.5%", label: "Customer Satisfaction" },
    ],
  },
  {
    id: "innovation-commitment",
    title: "Innovation & Technology",
    content:
      "Innovation is at the heart of everything we do. We continuously invest in research and development to bring cutting-edge solutions to market. Our state-of-the-art facilities and partnerships with leading research institutions enable us to stay at the forefront of scientific advancement. We're committed to developing products that not only meet current needs but anticipate future challenges in life sciences.",
    image: "/burj-khalifa.jpg",
    stats: [
      { number: "20%", label: "Revenue in R&D" },
      { number: "50+", label: "New Products/Year" },
      { number: "5", label: "Research Partnerships" },
      { number: "100+", label: "Patents & IP" },
    ],
  },
]

export function getFeaturedTestimonials(): Testimonial[] {
  return testimonials.filter((testimonial) => testimonial.featured)
}

export function getTestimonialsByCategory(category: string): Testimonial[] {
  return testimonials.filter((testimonial) => testimonial.category === category)
}
