export interface Service {
  id: string
  slug: string
  title: string
  description: string
  longDescription: string
  features: string[]
  image: string
  category: string
  price?: string
  isActive?: boolean
  createdAt?: Date
  updatedAt?: Date

}

export interface Product {
  id: string
  slug: string
  title: string
  description: string
  longDescription: string
  features: string[]
  images: string[]
  category: string
  price?: string
  specifications?: Record<string, string>
}

export const services: Service[] = [
  {
    id: "1",
    slug: "research-services",
    title: "Research Services",
    description: "Comprehensive research solutions for academic and commercial laboratories",
    longDescription:
      "Our research services provide comprehensive support for academic institutions, pharmaceutical companies, and biotechnology firms. We offer customized research solutions, protocol development, and technical expertise to accelerate your scientific discoveries. Our team of experienced scientists works closely with clients to design and execute research projects that meet specific objectives and regulatory requirements.",
    features: [
      "Custom research protocol development",
      "Data analysis and interpretation",
      "Regulatory compliance consulting",
      "Technical documentation",
      "Project management support",
      "Quality assurance oversight",
    ],
    image: "/placeholder.svg?height=400&width=600",
    category: "Research",
    price: "Contact for pricing",
  },
  {
    id: "2",
    slug: "diagnostic-services",
    title: "Diagnostic Services",
    description: "Advanced diagnostic testing and analysis for healthcare providers",
    longDescription:
      "Our diagnostic services division offers state-of-the-art testing capabilities for healthcare providers, clinical laboratories, and research institutions. We provide accurate, reliable, and timely diagnostic results using the latest technologies and methodologies. Our certified laboratory professionals ensure the highest standards of quality and precision in every test we perform.",
    features: [
      "Clinical chemistry analysis",
      "Molecular diagnostics",
      "Immunoassay testing",
      "Microbiology services",
      "Pathology consultation",
      "Rapid testing solutions",
    ],
    image: "/placeholder.svg?height=400&width=600",
    category: "Diagnostics",
    price: "Varies by test",
  },
  {
    id: "3",
    slug: "consulting",
    title: "Scientific Consulting",
    description: "Expert scientific consulting for regulatory compliance and product development",
    longDescription:
      "Our consulting services provide expert guidance on regulatory affairs, product development, and quality systems. Our team of seasoned professionals brings decades of experience in life sciences, helping clients navigate complex regulatory landscapes and optimize their operations. We offer strategic advice, technical expertise, and practical solutions to accelerate time-to-market and ensure compliance.",
    features: [
      "Regulatory strategy development",
      "FDA submission support",
      "Quality system implementation",
      "Risk assessment and management",
      "Technical writing services",
      "Training and education programs",
    ],
    image: "/placeholder.svg?height=400&width=600",
    category: "Consulting",
    price: "$200-500/hour",
  },
  {
    id: "4",
    slug: "quality-control",
    title: "Quality Control Services",
    description: "Comprehensive quality control and assurance programs",
    longDescription:
      "Our quality control services ensure that your products meet the highest standards of safety, efficacy, and regulatory compliance. We provide comprehensive testing, validation, and documentation services to support your quality management system. Our ISO-certified laboratory and experienced quality professionals deliver reliable results you can trust.",
    features: [
      "Method validation and verification",
      "Stability testing programs",
      "Raw material testing",
      "Finished product analysis",
      "Environmental monitoring",
      "Audit and inspection support",
    ],
    image: "/placeholder.svg?height=400&width=600",
    category: "Quality",
    price: "Custom pricing",
  },
  {
    id: "5",
    slug: "method-development",
    title: "Method Development",
    description: "Custom analytical method development and validation services",
    longDescription:
      "Our method development services help you create robust, reliable analytical methods tailored to your specific needs. From initial feasibility studies to full method validation, our experienced team ensures your methods meet regulatory requirements and industry standards.",
    features: [
      "Analytical method design",
      "Method optimization",
      "Validation protocols",
      "Regulatory compliance",
      "Documentation support",
      "Training programs",
    ],
    image: "/placeholder.svg?height=400&width=600",
    category: "Development",
    price: "Contact for pricing",
  },
  {
    id: "6",
    slug: "training-services",
    title: "Training & Education",
    description: "Professional training programs for laboratory personnel",
    longDescription:
      "Our comprehensive training programs are designed to enhance the skills and knowledge of laboratory professionals. We offer both on-site and virtual training sessions covering various aspects of laboratory operations, quality systems, and regulatory compliance.",
    features: [
      "GMP/GLP training",
      "Instrument training",
      "Quality systems",
      "Regulatory updates",
      "Custom curricula",
      "Certification programs",
    ],
    image: "/placeholder.svg?height=400&width=600",
    category: "Education",
    price: "$150-300/hour",
  },
]

export const productCategories = [
  {
    slug: "research-products",
    name: "Research Products",
    description: "Advanced tools and reagents for cutting-edge research",
  },
  {
    slug: "diagnostics-products",
    name: "Diagnostics Products",
    description: "Reliable diagnostic kits and testing solutions",
  },
  {
    slug: "instruments-consumables",
    name: "Instruments & Consumables",
    description: "High-quality instruments and laboratory consumables",
  },
  {
    slug: "reagents-chemicals",
    name: "Reagents and Chemicals",
    description: "Pure reagents and chemicals for laboratory use",
  },
  {
    slug: "plasticwaresfiltrationunits",
    name: "Plastic Wares & Filtration Units",
    description: "Laboratory plasticware and filtration systems",
  },
  {
    slug: "food-testing-kits",
    name: "Food Testing Kits",
    description: "Comprehensive food safety testing solutions",
  },
  {
    slug: "disinfectant-and-sanitizers",
    name: "Disinfectant and Sanitizers",
    description: "Professional cleaning and sanitization products",
  },
]

export const products: Product[] = [
  // Research Products
  {
    id: "1",
    slug: "advanced-pcr-kit",
    title: "Advanced PCR Kit",
    description: "High-performance PCR amplification kit for research applications",
    longDescription:
      "Our Advanced PCR Kit provides superior amplification performance for a wide range of research applications. Featuring optimized buffer systems and high-fidelity polymerase, this kit delivers consistent, reliable results for both routine and challenging PCR reactions. Ideal for gene expression analysis, genotyping, and molecular cloning applications.",
    features: [
      "High-fidelity DNA polymerase",
      "Optimized buffer system",
      "Wide temperature range compatibility",
      "Suitable for GC-rich templates",
      "Ready-to-use master mix",
      "Compatible with most thermal cyclers",
    ],
    images: [
      "/placeholder.svg?height=300&width=300",
      "/placeholder.svg?height=300&width=300",
      "/placeholder.svg?height=300&width=300",
    ],
    category: "research-products",
    price: "$299.99",
    specifications: {
      "Kit Size": "100 reactions",
      Storage: "-20°C",
      "Shelf Life": "24 months",
      "Amplicon Size": "Up to 10 kb",
    },
  },
  {
    id: "2",
    slug: "protein-extraction-kit",
    title: "Protein Extraction Kit",
    description: "Complete protein extraction solution for various sample types",
    longDescription:
      "This comprehensive protein extraction kit provides efficient and reliable protein isolation from various biological samples including tissues, cells, and bacteria. The kit includes optimized lysis buffers and protease inhibitors to ensure maximum protein yield while maintaining protein integrity and activity.",
    features: [
      "Multiple lysis buffer options",
      "Protease inhibitor cocktail included",
      "Compatible with various sample types",
      "High protein yield and purity",
      "Maintains protein activity",
      "Easy-to-follow protocol",
    ],
    images: [
      "/placeholder.svg?height=300&width=300",
      "/placeholder.svg?height=300&width=300",
      "/placeholder.svg?height=300&width=300",
    ],
    category: "research-products",
    price: "$189.99",
    specifications: {
      "Kit Size": "50 extractions",
      "Sample Types": "Tissue, cells, bacteria",
      Storage: "4°C",
      "Protocol Time": "30-45 minutes",
    },
  },
  // Diagnostics Products
  {
    id: "3",
    slug: "covid-19-rapid-test",
    title: "COVID-19 Rapid Antigen Test",
    description: "Fast and accurate COVID-19 antigen detection test",
    longDescription:
      "Our COVID-19 Rapid Antigen Test provides quick and reliable detection of SARS-CoV-2 antigens in nasal swab samples. This FDA-authorized test delivers results in just 15 minutes with high sensitivity and specificity, making it ideal for point-of-care testing, screening programs, and home use.",
    features: [
      "15-minute results",
      "High sensitivity and specificity",
      "Easy-to-read results",
      "No equipment required",
      "FDA Emergency Use Authorization",
      "Suitable for professional and home use",
    ],
    images: [
      "/placeholder.svg?height=300&width=300",
      "/placeholder.svg?height=300&width=300",
      "/placeholder.svg?height=300&width=300",
    ],
    category: "diagnostics-products",
    price: "$15.99",
    specifications: {
      "Test Type": "Lateral flow immunoassay",
      "Sample Type": "Nasal swab",
      "Result Time": "15 minutes",
      Sensitivity: "95.2%",
      Specificity: "99.1%",
    },
  },
  // Instruments & Consumables
  {
    id: "4",
    slug: "laboratory-centrifuge",
    title: "High-Speed Laboratory Centrifuge",
    description: "Benchtop centrifuge for sample preparation and analysis",
    longDescription:
      "This high-performance benchtop centrifuge offers exceptional versatility and reliability for routine laboratory applications. Featuring variable speed control, multiple rotor options, and advanced safety features, it's perfect for cell culture, protein purification, and general sample preparation tasks.",
    features: [
      "Variable speed: 500-15,000 RPM",
      "Multiple rotor configurations",
      "Digital display and controls",
      "Automatic rotor recognition",
      "Safety lid lock system",
      "Quiet operation",
    ],
    images: [
      "/placeholder.svg?height=300&width=300",
      "/placeholder.svg?height=300&width=300",
      "/placeholder.svg?height=300&width=300",
    ],
    category: "instruments-consumables",
    price: "$2,499.99",
    specifications: {
      "Max Speed": "15,000 RPM",
      "Max RCF": "21,380 x g",
      Capacity: "24 x 1.5/2.0 mL tubes",
      Dimensions: "35 x 28 x 25 cm",
      Weight: "18 kg",
    },
  },
  // Add more products for other categories...
  {
    id: "5",
    slug: "hplc-grade-acetonitrile",
    title: "HPLC Grade Acetonitrile",
    description: "Ultra-pure acetonitrile for HPLC and LC-MS applications",
    longDescription:
      "Our HPLC grade acetonitrile meets the highest purity standards for liquid chromatography applications. This solvent is specially purified and tested to ensure low UV absorbance, minimal water content, and absence of interfering impurities, making it ideal for HPLC, UHPLC, and LC-MS analyses.",
    features: [
      "HPLC grade purity",
      "Low UV absorbance",
      "Minimal water content",
      "Batch-to-batch consistency",
      "Suitable for LC-MS",
      "Amber glass bottles",
    ],
    images: [
      "/placeholder.svg?height=300&width=300",
      "/placeholder.svg?height=300&width=300",
      "/placeholder.svg?height=300&width=300",
    ],
    category: "reagents-chemicals",
    price: "$89.99",
    specifications: {
      Purity: "≥99.9%",
      "Water Content": "≤0.02%",
      "UV Absorbance": "≤0.04 at 254nm",
      "Bottle Size": "4L",
      Storage: "Room temperature",
    },
  },
]

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((service) => service.slug === slug)
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug)
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter((product) => product.category === category)
}

export function getCategoryBySlug(slug: string) {
  return productCategories.find((cat) => cat.slug === slug)
}

export function getFeaturedServices(limit = 4): Service[] {
  return services.slice(0, limit)
}

export function getFeaturedProducts(limit = 6): Product[] {
  return products.slice(0, limit)
}
