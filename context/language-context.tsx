"use client"

import {
    createContext,
    useContext,
    useState,
    useEffect,
    type ReactNode,
} from "react"

export type Language = "en" | "ar"

interface LanguageContextType {
    language: Language
    setLanguage: (language: Language) => void
    t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(
    undefined
)

// ✅ English Translations
const enTranslations: Record<string, string> = {
    "header.home": "Home",
    "header.about": "About Us",
    "header.services": "Services",
    "header.products": "Products",
    "header.gallery": "Gallery",
    "header.contact": "Contact",
    "header.getQuote": "Get a Quote",
    "header.viewAllProducts": "View All Products",
    "header.testimonials": "Testimonials",
    "products.categories.research-products": "Research Products",
    "products.categories.diagnostics-products": "Diagnostics Products",
    "products.categories.instruments-consumables": "Instruments & Consumables",
    "products.categories.reagents-chemicals": "Reagents and Chemicals",
    "products.categories.plasticwaresfiltrationunits": "Plastic Wares & Filtration Units",
    "products.categories.food-testing-kits": "Food Testing Kits",
    "products.categories.disinfectant-and-sanitizers": "Disinfectant and Sanitizers",

    //home hero
    "hero.badge": "Leading Life Sciences Solutions",
    "hero.title.line1": "Advancing Science,",
    "hero.title.line2": "Improving Lives",
    "hero.description": "PT International Lifesciences LLC provides cutting-edge research products, diagnostic solutions, and scientific instruments to laboratories worldwide.",
    "hero.cta.explore": "Explore Products",
    "hero.cta.quote": "Get Quote",

    //about
    "about.intro.title": "Who We Are",
    "about.intro.content": "We are dedicated to advancing life sciences through high-quality products.",
    "about.intro.statYears": "Years of Experience",
    "about.intro.statClients": "Happy Clients",

    //product 
    "products.title": "Comprehensive Product Catalog",
    "products.description": "Explore our extensive range of life science products designed to meet your research and diagnostic needs.",
    "products.cta": "Browse All Products",
    //product card
    "products.features": "features",
    "products.details": "View Details",
    "products.cta1":"view Details",

    //service card
    "services.startingAt": "Starting at",
    "services.keyFeatures": "Key Features:",
    "services.learnMore": "Learn More",
    "services.getQuote": "Get Quote",

    //why choose us
    // whyChoose
    "whyChoose.title": "Why Choose PT International?",
    "whyChoose.subtitle": "We combine scientific expertise with innovative solutions to deliver exceptional value",

    "whyChoose.features.1.title": "ISO 9001:2015 Certified",
    "whyChoose.features.1.description": "Our quality management system meets international standards, ensuring consistent product quality and service excellence.",
    "whyChoose.features.1.label": "Years Certified",

    "whyChoose.features.2.title": "Global Reach",
    "whyChoose.features.2.description": "We serve customers in over 50 countries worldwide, with established distribution networks and local support.",
    "whyChoose.features.2.label": "Countries Served",

    "whyChoose.features.3.title": "Expert Team",
    "whyChoose.features.3.description": "Our team of PhD scientists and technical experts provides unparalleled support and consultation services.",
    "whyChoose.features.3.label": "PhD Scientists",

    "whyChoose.features.4.title": "Fast Delivery",
    "whyChoose.features.4.description": "Efficient logistics and inventory management ensure quick delivery times and product availability.",
    "whyChoose.features.4.label": "Delivery Time",

    "whyChoose.features.5.title": "Quality Guarantee",
    "whyChoose.features.5.description": "All products come with our quality guarantee and comprehensive technical support.",
    "whyChoose.features.5.label": "Quality Assured",

    "whyChoose.features.6.title": "24/7 Support",
    "whyChoose.features.6.description": "Round-the-clock technical support and customer service to address your needs promptly.",
    "whyChoose.features.6.label": "Support Available",

    //about section
    "about.company-overview.title": "Company Overview",
    "about.company-overview.content": "PT International Lifesciences LLC has grown from a small startup to a leading global provider of life science solutions. Our journey began with a simple mission: to make high-quality research products and diagnostic solutions accessible to laboratories worldwide. Today, we serve over 1,000 customers across 50+ countries, maintaining our commitment to excellence, innovation, and customer satisfaction.",
    "about.company-overview.stats.customers": "Customers",
    "about.company-overview.stats.countries": "Countries",
    "about.company-overview.stats.products": "Products",

    "about.our-expertise.title": "Our Expertise",
    "about.our-expertise.content": "With over 15 years of experience in the life sciences industry, we have developed deep expertise across multiple domains. Our team includes PhD scientists, regulatory affairs specialists, quality assurance experts, and technical support professionals. This diverse expertise allows us to provide comprehensive solutions that meet the evolving needs of modern laboratories and research institutions.",
    "about.our-expertise.stats.years": "Years Experience",
    "about.our-expertise.stats.scientists": "PhD Scientists",
    "about.our-expertise.stats.regulatory": "Regulatory Experts",
    "about.our-expertise.stats.satisfaction": "Customer Satisfaction",

    "about.innovation-commitment.title": "Innovation & Technology",
    "about.innovation-commitment.content": "Innovation is at the heart of everything we do. We continuously invest in research and development to bring cutting-edge solutions to market. Our state-of-the-art facilities and partnerships with leading research institutions enable us to stay at the forefront of scientific advancement. We're committed to developing products that not only meet current needs but anticipate future challenges in life sciences.",
    "about.innovation-commitment.stats.rnd": "Revenue in R&D",
    "about.innovation-commitment.stats.new-products": "New Products/Year",
    "about.innovation-commitment.stats.partnerships": "Research Partnerships",
    "about.innovation-commitment.stats.patents": "Patents & IP",

    //service
    "services.title": "Our Professional Services",
    "services.description": "Comprehensive scientific services designed to support your research, development, and quality assurance needs.",
    "services.button": "View All Services",

    //gallery
    "gallery.title": "Our Gallery",
    "gallery.description": "Explore our state-of-the-art facilities, products, and scientific achievements through our image gallery.",
    "gallery.lightbox.title": "Image Lightbox",
    "gallery.button": "View Full Gallery",

    //products 
    "stats.products": "Products",
    "stats.countries": "Countries",
    "stats.clients": "Clients",
    "stats.experience": "Years Experience",

    "about.hero.badge": "About PT International",
    "about.hero.title": "Pioneering Life Sciences Solutions",
    "about.hero.description": "For over 15 years, PT International Lifesciences LLC has been at the forefront of providing innovative research products, diagnostic solutions, and scientific instruments to laboratories worldwide.",

    "about.values.excellence.title": "Excellence",
    "about.values.excellence.description": "We strive for excellence in everything we do, from product quality to customer service.",
    "about.values.collaboration.title": "Collaboration",
    "about.values.collaboration.description": "We believe in the power of collaboration to drive scientific advancement and innovation.",
    "about.values.globalImpact.title": "Global Impact",
    "about.values.globalImpact.description": "Our solutions reach laboratories worldwide, contributing to global health and research.",
    "about.values.integrity.title": "Integrity",
    "about.values.integrity.description": "We maintain the highest standards of integrity and ethical practices in all our operations.",

    "about.milestones.2012.title": "Global Expansion",
    "about.milestones.2012.description": "Expanded operations to serve 25+ countries",
    "about.milestones.2016.title": "Product Innovation",
    "about.milestones.2016.description": "Launched advanced diagnostic solutions",
    "about.milestones.2020.title": "Digital Transformation",
    "about.milestones.2020.description": "Implemented cutting-edge digital platforms",
    "about.milestones.2024.title": "Sustainability Initiative",
    "about.milestones.2024.description": "Launched comprehensive sustainability program",

    "whyChoose.title1": "Our Competitive Advantages",
    "whyChoose.subtitle1": "What sets us apart in the life sciences industry",

    "testimonials.title": "What Our Customers Say",
    "testimonials.subtitle": "Trusted by leading institutions and researchers worldwide",

    "home.setsApart.title": "What Sets Us Apart",
    "home.setsApart.description": "We combine scientific expertise with innovative solutions to deliver exceptional products and services.",
    "home.features.0.title": "Research Excellence",
    "home.features.0.description": "Cutting-edge research products and solutions for scientific advancement",
    "home.features.1.title": "Diagnostic Solutions",
    "home.features.1.description": "Comprehensive diagnostic tools and testing kits for accurate results",
    "home.features.2.title": "Quality Assurance",
    "home.features.2.description": "Rigorous quality control processes ensuring reliable products",
    "home.features.3.title": "Industry Recognition",
    "home.features.3.description": "Trusted by leading institutions and research facilities worldwide",
    "home.benefits.title": "Trusted by Scientists Worldwide",
    "home.benefits.description": "With over 15 years of experience, we've built a reputation for excellence in the life sciences industry. Our commitment to quality and innovation has made us a preferred partner for researchers globally.",
    "home.benefits.0": "ISO 9001:2015 Certified Quality",
    "home.benefits.1": "Global Shipping & Support",
    "home.benefits.2": "Expert Technical Assistance",
    "home.benefits.3": "Competitive Pricing",
    "home.recognition.title": "Industry Recognition",
    "home.recognition.description": "Our commitment to excellence has earned us recognition from leading industry organizations.",
    "home.recognition.iso": "Quality Management",
    "home.recognition.fda": "Medical Devices",
    "home.recognition.ce": "European Conformity",
    "home.recognition.gmp": "Good Manufacturing",

    "products.detail.backToCategory":"Back to category",
    "products.detail.priceLabel":"Product Price",
    "products.detail.featuresTitle":"Product Features",
    "products.detail.enquireButton":"Enquiry Now",
    "products.categories.research-products.title":"Research Products",
    "products.categories.research-products.description": "Advanced tools and kits for cutting-edge research applications",
    "products.categories.diagnostics-products.title":"Diagonastics Products",
    "products.categories.diagnostics-products.description": "Reliable diagnostic solutions for clinical and laboratory use",
    "products.categories.instruments-consumables.title":"Instruments Consumables",
    "products.categories.instruments-consumables.description": "High-quality laboratory instruments and consumable supplies",
    "products.categories.reagents-chemicals.title":"Reagents Chemicals",
    "products.categories.reagents-chemicals.description": "Pure reagents and chemicals for various applications",
    "products.categories.plasticwaresfiltrationunits.title":"Plastic Wares Filtration Units",
    "products.categories.plasticwaresfiltrationunits.description": "Laboratory plasticware and filtration solutions",
    "products.categories.food - testing - kits.title":"Food Testing Kits ",
    "products.categories.food - testing - kits.description": "Comprehensive kits for food safety and quality testing ",
    "products.categories.disinfectant-and-sanitizers.title":"Disinfectant And Sanitizers",
    "products.categories.disinfectant-and-sanitizers.description": "Professional-grade disinfection and sanitization products",
    "products.detail.descriptionTitle":"Product Description",
    "products.detail.tabs.description":"Product Detail Description",
    "products.detail.tabs.specifications": "Product Specifications",
    "products.detail.tabs.support":"Support",


    //product
    "products.badge": "Our Products",
    "products.title1": "Comprehensive Product Catalog",
    "products.description1": "Explore our extensive range of life science products designed to meet your research and diagnostic needs.",
    "products.search.placeholder": "Search product categories...",
    "products.search.clear": "Clear Search",
    "products.search.resultLabel": "{{count}} categor{{count !== 1 ? 'ies' : 'y'}} found",
    "products.error.title": "Something went wrong",
    "products.error.message": "We couldn't load the products. Please try again.",
    "products.error.label": "Error",
    "products.error.refresh": "Refresh Page",
    "products.empty": "No categories found matching your search",
    "products.cta.title": "Can't Find What You're Looking For?",
    "products.cta.description": "Our product catalog is constantly expanding. Contact us for custom products or special requests.",
    "products.cta.request": "Browse Product",
    "products.cta.services": "View Services",
    "products.search.resultLabel.single": "category found",
    "products.search.resultLabel.plural": "categories found",

    "product.breadcrumb.home": "Home",
    "product.breadcrumb.products": "Products",
    "product.breadcrumb.back": "Back to {{category}}",
    "product.image.noImage": "No image",
    "product.features.title": "Key Features",
    "product.datasheet.view": "View Datasheet",
    "product.datasheet.hide": "Hide Datasheet",
    "product.datasheet.download": "Download Datasheet",
    "product.tabs.description": "Description",
    "product.tabs.specifications": "Specifications",
    "product.tabs.support": "Support",
    "product.description.title": "Product Description",
    "product.specifications.title": "Technical Specifications",
    "product.specifications.notAvailable": "Detailed specifications are available upon request. Contact our technical team for more information.",
    "product.support.title": "Support & Resources",
    "product.support.resourcesTitle": "Available Resources:",
    "product.support.resources.0": "Product datasheet and technical specifications",
    "product.support.resources.1": "User manual and installation guide",
    "product.support.resources.2": "Safety data sheet (SDS)",
    "product.support.resources.3": "Certificate of analysis (COA)",
    "product.support.resources.4": "Technical support documentation",
    "product.support.contact": "Contact Technical Support",
    "product.Go to image {{idx}}": "Go to image {{idx}}",

    //contact
    "contact.hero.badge": "Get In Touch",
    "contact.hero.title": "Contact Our Expert Team",
    "contact.hero.description": "Have questions about our products or services? We're here to help. Reach out to our team of life science experts.",
    "contact.form.title": "Send us a Message",
    "contact.form.description": "Fill out the form below and we'll get back to you as soon as possible.",
    "contact.form.name": "Full Name",
    "contact.form.email": "Email Address",
    "contact.form.phone": "Phone Number",
    "contact.form.subject": "Subject",
    "contact.form.message": "Message",
    "contact.form.namePlaceholder": "Your full name",
    "contact.form.emailPlaceholder": "your.email@example.com",
    "contact.form.phonePlaceholder": "+1 (555) 123-4567",
    "contact.form.subjectPlaceholder": "What is this regarding?",
    "contact.form.messagePlaceholder": "Tell us about your inquiry...",
    "contact.form.send": "Send Message",
    "contact.form.sending": "Sending...",
    "contact.info.title": "Get in Touch",
    "contact.info.description": "Our team is ready to assist you with any questions about our products, services, or partnership opportunities.",
    "contact.info.email": "Email Us",
    "contact.info.phone": "Call Us",
    "contact.info.address": "Visit Us",
    "contact.info.hours": "Business Hours",
    "contact.info.weekdays": "Mon-Fri: 8:00 AM - 6:00 PM EST",
    "contact.info.saturday": "Sat: 9:00 AM - 2:00 PM EST",
    "contact.toast.successTitle": "Message Sent Successfully!",
    "contact.toast.successDescription": "Thank you for contacting us. We'll get back to you within 24 hours.",
    "contact.toast.errorTitle": "Error",
    "contact.toast.errorDefault": "Failed to send message. Please try again.",

    //services
    "services.hero.badge": "Our Services",
    "services.hero.title": "Professional Life Science Services",
    "services.hero.description": "Comprehensive solutions for your research, diagnostic, and analytical needs with expert consultation and support.",
    "services.search.placeholder": "Search services...",
    "services.category.placeholder": "Category",
    "services.count.label": "service(s) found",
    "services.error.title": "Something went wrong",
    "services.error.description": "We couldn't load the services. Please try again.",
    "services.error.label": "Error:",
    "services.error.button": "Refresh Page",
    "services.noResults": "No services found matching your search",
    "services.button.clearSearch": "Clear Search",
    "services.button.learnMore": "Learn More",
    "services.price.startingAt": "Starting at",
    "services.cta.title": "Ready to Get Started?",
    "services.cta.description": "Contact our team to discuss your specific requirements and learn how we can help you achieve your goals.",
    "services.cta.primary": "Request Quote",
    "services.cta.secondary": "Call Now",
    "services.cta.button.primary": "Contact Us",
    "services.cta.button.secondary": "Explore Products",
    "breadcrumb.home": "Home",
    "breadcrumb.services": "Services",
    "services.hero.back": "Back to Services",
    "services.hero.quoteButton": "Get Quote",
    "services.hero.callUs": "Call Us",
    "services.detail.overviewTitle": "Service Overview",
    "services.detail.featuresTitle": "Key Features",
    "services.detail.featuresDescription": "What's included in this service",
    //testimonials

    "testimonials.filter.label": "Filter by Category",
    "testimonials.cta.title": "Join Our Satisfied Customers",
    "testimonials.cta.description": "Experience the PT International difference. Contact us today to discuss your requirements and see why we're trusted by industry leaders.",
    "testimonials.cta.primary": "Get Started Today",
    "testimonials.cta.secondary": "Browse Products",
    "testimonials.results.label": "{{count}} testimonial{{plural}} found",
    "testimonials.badge": "Customer Testimonials",
    "testimonials.hero.title": "What Our Customers Say",
    "testimonials.hero.subtitle": "Discover why leading institutions and researchers worldwide trust PT International for their life science needs.",
    "testimonials.averageRating": "Average Rating",
    "testimonials.reviewCount": "Customer Reviews",
    "testimonials.countriesServed": "Countries Served",
    "testimonials.filter.all": "All Categories",
    "testimonials.filter.research": "Research",
    "testimonials.filter.diagnostics": "Diagnostics",
    "testimonials.filter.consulting": "Consulting",
    "testimonials.filter.quality": "Quality",
    "testimonials.category.research": "Research",
    "testimonials.category.diagnostics": "Diagnostics",
    "testimonials.category.consulting": "Consulting",
    "testimonials.category.quality": "Quality",
    "testimonials.content.1": "PT International has been our trusted partner for over 5 years. Their research products are consistently high-quality, and their technical support team is exceptional. The Advanced PCR Kit has significantly improved our research efficiency.",
    "testimonials.content.2": "The diagnostic solutions from PT International have transformed our testing capabilities. Their COVID-19 rapid tests provided accurate results when we needed them most during the pandemic. Outstanding reliability and customer service.",
    "testimonials.content.3": "PT International's consulting services helped us navigate complex FDA regulations seamlessly. Their expertise in regulatory affairs saved us months of preparation time and ensured our successful product launch.",
    "testimonials.content.4": "We've been using PT International's instruments for our teaching labs. The laboratory centrifuge is robust, reliable, and perfect for our educational needs. Great value for money and excellent after-sales support.",
    "testimonials.content.5": "The quality control services from PT International ensure our lab maintains the highest standards. Their method validation expertise and comprehensive testing protocols have been invaluable to our operations.",
    "testimonials.content.6": "PT International's reagents and chemicals are of exceptional purity. The HPLC grade acetonitrile consistently delivers reliable results in our analytical work. Their technical documentation is also very thorough.",


    //gallery
    "gallery.badge": "Gallery",
    "gallery.title1": "Memorable Moments",
    "gallery.description1": "Explore our collection of achievements, highlights, and memorable moments from PT International Lifesciences.",
    "gallery.searchPlaceholder": "Search gallery...",
    "gallery.allCategories": "All Categories",
    "gallery.noResults": "No images found matching your criteria.",
    "gallery.lightbox.index": "{{current}} / {{total}}",
    "gallery.error.title": "Something went wrong",
    "gallery.error.message": "We couldn't load the gallery images. Showing sample gallery below.",
    "gallery.error.errorLabel": "Error",
    "gallery.error.refresh": "Refresh Page",


    "Home": "Home",
    "Products": "Products",
    "Product category": "Product category",
    "Search products...": "Search products...",
    "product": "product",
    "products": "products",
    "found": "found",
    "Back to Products": "Back to Products",
    "View Details": "View Details",
    "more": "more",
    "features": "features",
    "No products found in this category": "No products found in this category",
    "Clear Search": "Clear Search",
    "Need Help Choosing?": "Need Help Choosing?",
    "Our experts can help you select the right products for your specific needs. Contact us for personalized recommendations.": "Our experts can help you select the right products for your specific needs. Contact us for personalized recommendations.",
    "Get Expert Advice": "Get Expert Advice",
    "View Services": "View Services",
    "Previous image": "Previous image",
    "Next image": "Next image",
    "Go to image {{idx}}": "Go to image {{idx}}",

    "Research Products": "Research Products",
    "Advanced tools and kits for cutting-edge research applications": "Advanced tools and kits for cutting-edge research applications",

    "Diagnostics Products": "Diagnostics Products",
    "Reliable diagnostic solutions for clinical and laboratory use": "Reliable diagnostic solutions for clinical and laboratory use",

    "Instruments & Consumables": "Instruments & Consumables",
    "High-quality laboratory instruments and consumable supplies": "High-quality laboratory instruments and consumable supplies",

    "Reagents & Chemicals": "Reagents & Chemicals",
    "Pure reagents and chemicals for various applications": "Pure reagents and chemicals for various applications",

    "Plasticwares & Filtration Units": "Plasticwares & Filtration Units",
    "Laboratory plasticware and filtration solutions": "Laboratory plasticware and filtration solutions",

    "Food Testing Kits": "Food Testing Kits",
    "Comprehensive kits for food safety and quality testing": "Comprehensive kits for food safety and quality testing",

    "Disinfectant & Sanitizers": "Disinfectant & Sanitizers",
    "Professional-grade disinfection and sanitization products": "Professional-grade disinfection and sanitization products",

    // Footer
    "footer.products": "Products",
    "footer.company": "Company",
    "footer.aboutUs": "About Us",
    "footer.services": "Services",
    "footer.contact": "Contact",
    "footer.gallery": "Gallery",
    "footer.testimonials": "Testimonials",
    "footer.researchProducts": "Research Products",
    "footer.diagnostics": "Diagnostics",
    "footer.instruments": "Instruments",
    "footer.reagents": "Reagents",
    "footer.description": "Leading provider of research products, diagnostics, and life science solutions to laboratories worldwide.",
    "footer.addressLine1": "PT INTERNATIONAL LIFESCIENCES LLC",
    "footer.addressLine2": "Sharjah Media City, Sharjah,",
    "footer.addressLine3": "UAE P.O Box 839- Sharjah",
    "footer.rightsReserved": "All rights reserved.",

}

// ✅ Arabic Translations
const arTranslations: Record<string, string> = {
    "header.home": "الرئيسية",
    "header.about": "من نحن",
    "header.services": "الخدمات",
    "header.products": "المنتجات",
    "header.gallery": "المعرض",
    "header.contact": "اتصل بنا",
    "header.getQuote": "احصل على عرض سعر",
    "header.viewAllProducts": "عرض جميع المنتجات",
    "header.testimonials": "آراء العملاء",
    "products.categories.research-products": "منتجات البحث",
    "products.categories.diagnostics-products": "منتجات التشخيص",
    "products.categories.instruments-consumables": "الأدوات والمواد الاستهلاكية",
    "products.categories.reagents-chemicals": "الكواشف والمواد الكيميائية",
    "products.categories.plasticwaresfiltrationunits": "العبوات البلاستيكية ووحدات الترشيح",
    "products.categories.food-testing-kits": "أطقم اختبار الأغذية",
    "products.categories.disinfectant-and-sanitizers": "المطهرات والمعقمات",

    //home hero
    "hero.badge": "حلول رائدة في علوم الحياة",
    "hero.title.line1": "ندفع العلم إلى الأمام،",
    "hero.title.line2": "ونحسّن الحياة",
    "hero.description":
        "تقدم شركة PT International Lifesciences LLC منتجات بحثية مبتكرة وحلول تشخيصية وأجهزة علمية للمختبرات في جميع أنحاء العالم.",
    "hero.cta.explore": "استعرض المنتجات",
    "hero.cta.quote": "طلب عرض سعر",

    "home.setsApart.title": "ما يميزنا",
    "home.setsApart.description": "نحن نمزج بين الخبرة العلمية والحلول المبتكرة لتقديم منتجات وخدمات استثنائية.",

    "home.features.0.title": "التميز في البحث",
    "home.features.0.description": "منتجات وحلول بحثية متطورة لتعزيز التقدم العلمي",

    "home.features.1.title": "حلول التشخيص",
    "home.features.1.description": "أدوات تشخيصية شاملة ومجموعات اختبار لنتائج دقيقة",

    "home.features.2.title": "ضمان الجودة",
    "home.features.2.description": "عمليات مراقبة جودة صارمة لضمان منتجات موثوقة",

    "home.features.3.title": "الاعتراف الصناعي",
    "home.features.3.description": "موثوق به من قبل المؤسسات والمراكز البحثية الرائدة عالميًا",

    "home.benefits.title": "موثوق به من قبل العلماء حول العالم",
    "home.benefits.description": "مع أكثر من 15 عامًا من الخبرة، بنينا سمعة متميزة في صناعة علوم الحياة. التزامنا بالجودة والابتكار جعلنا شريكًا مفضلًا للباحثين عالميًا.",

    "home.benefits.0": "شهادة جودة ISO 9001:2015",
    "home.benefits.1": "شحن ودعم عالمي",
    "home.benefits.2": "مساعدة فنية من الخبراء",
    "home.benefits.3": "أسعار تنافسية",

    "home.recognition.title": "الاعتراف الصناعي",
    "home.recognition.description": "لقد أكسبنا التزامنا بالتميز اعترافًا من منظمات صناعية رائدة.",

    "home.recognition.iso": "إدارة الجودة",
    "home.recognition.fda": "الأجهزة الطبية",
    "home.recognition.ce": "المطابقة الأوروبية",
    "home.recognition.gmp": "ممارسات التصنيع الجيد",
    

    //about
    "about.intro.title": "من نحن",
    "about.intro.content": "نحن ملتزمون بتطوير علوم الحياة من خلال منتجات عالية الجودة.",
    "about.intro.statYears": "سنوات الخبرة",
    "about.intro.statClients": "عملاء سعداء",

    //product detail
    "products.title": "المنتجات المميزة",
    "products.description": "اكتشف أكثر منتجات علوم الحياة شهرة لدينا المصممة لتلبية احتياجاتك البحثية والتشخيصية.",
    "products.cta": "عرض جميع المنتجات",
    "products.cta1": "عرض التفاصيل",

    //product card
    "products.features": "ميزات",
    "products.details": "عرض التفاصيل",

    "products.badge": "منتجاتنا",
    "products.title1": "دليل المنتجات الشامل",
    "products.description1": "استكشف مجموعتنا الواسعة من منتجات علوم الحياة المصممة لتلبية احتياجاتك البحثية والتشخيصية.",
    "products.search.placeholder": "ابحث في فئات المنتجات...",
    "products.search.clear": "مسح البحث",
    "products.search.resultLabel": "{{count}} فئة {{count !== 1 ? 'تم العثور عليها' : 'تم العثور عليها'}}",
    "products.error.title": "حدث خطأ ما",
    "products.error.message": "تعذر تحميل المنتجات. يرجى المحاولة مرة أخرى.",
    "products.error.label": "خطأ",
    "products.error.refresh": "تحديث الصفحة",
    "products.empty": "لم يتم العثور على فئات تطابق البحث",
    "products.cta.title": "لا يمكنك العثور على ما تبحث عنه؟",
    "products.cta.description": "نقوم بتوسيع كتالوج المنتجات باستمرار. تواصل معنا لمنتجات مخصصة أو طلبات خاصة.",
    "products.cta.request": "طلب منتج",
    "products.cta.services": "عرض الخدمات",
    "products.search.resultLabel.single": "فئة تم العثور عليها",
    "products.search.resultLabel.plural": "فئات تم العثور عليها",

    "products.detail.backToCategory": "العودة إلى الفئة",
    "products.detail.priceLabel": "سعر المنتج",
    "products.detail.featuresTitle": "مميزات المنتج",
    "products.detail.enquireButton": "استفسر الآن",
    "products.categories.research-products.title": "منتجات البحث",
    "products.categories.research-products.description": "أدوات ومجموعات متقدمة للتطبيقات البحثية الرائدة",
    "products.categories.diagnostics-products.title": "منتجات التشخيص",
    "products.categories.diagnostics-products.description": "حلول تشخيصية موثوقة للاستخدام السريري والمخبري",
    "products.categories.instruments-consumables.title": "الأدوات والمواد الاستهلاكية",
    "products.categories.instruments-consumables.description": "أدوات مخبرية عالية الجودة ولوازم استهلاكية",
    "products.categories.reagents-chemicals.title": "الكواشف والمواد الكيميائية",
    "products.categories.reagents-chemicals.description": "كواشف ومواد كيميائية نقية لمختلف التطبيقات",
    "products.categories.plasticwaresfiltrationunits.title": "الأدوات البلاستيكية ووحدات الترشيح",
    "products.categories.plasticwaresfiltrationunits.description": "أدوات بلاستيكية مخبرية وحلول ترشيح",
    "products.categories.food - testing - kits.title": "مجموعات اختبار الغذاء",
    "products.categories.food - testing - kits.description": "مجموعات شاملة لفحص سلامة وجودة الغذاء",
    "products.categories.disinfectant-and-sanitizers.title": "المطهرات والمعقمات",
    "products.categories.disinfectant-and-sanitizers.description": "منتجات تعقيم وتطهير عالية الجودة للاستخدام المهني",
    "products.detail.descriptionTitle": "وصف المنتج",
    "products.detail.tabs.description": "وصف تفصيلي للمنتج",
    "products.detail.tabs.specifications": "مواصفات المنتج",
    "products.detail.tabs.support": "الدعم",

    //service card
    "services.startingAt": "البدء من",
    "services.keyFeatures": "الميزات الرئيسية:",
    "services.learnMore": "اقرأ المزيد",
    "services.getQuote": "احصل على عرض سعر",

    "product.breadcrumb.home": "الرئيسية",
    "product.breadcrumb.products": "المنتجات",
    "product.breadcrumb.back": "العودة إلى {{category}}",
    "product.image.noImage": "لا توجد صورة",
    "product.features.title": "الميزات الرئيسية",
    "product.datasheet.view": "عرض ورقة البيانات",
    "product.datasheet.hide": "إخفاء ورقة البيانات",
    "product.datasheet.download": "تحميل ورقة البيانات",
    "product.tabs.description": "الوصف",
    "product.tabs.specifications": "المواصفات",
    "product.tabs.support": "الدعم",
    "product.description.title": "وصف المنتج",
    "product.specifications.title": "المواصفات الفنية",
    "product.specifications.notAvailable": "تتوفر المواصفات التفصيلية عند الطلب. يرجى الاتصال بفريقنا الفني لمزيد من المعلومات.",
    "product.support.title": "الدعم والموارد",
    "product.support.resourcesTitle": "الموارد المتاحة:",
    "product.support.resources.0": "ورقة بيانات المنتج والمواصفات الفنية",
    "product.support.resources.1": "دليل المستخدم ودليل التثبيت",
    "product.support.resources.2": "ورقة بيانات السلامة (SDS)",
    "product.support.resources.3": "شهادة التحليل (COA)",
    "product.support.resources.4": "وثائق الدعم الفني",
    "product.support.contact": "اتصل بالدعم الفني",
    "product.Go to image {{idx}}": "اذهب إلى الصورة رقم {{idx}}",

    //products
    "stats.products": "منتجات",
    "stats.countries": "دول",
    "stats.clients": "عملاء",
    "stats.experience": "سنوات الخبرة",

    //about 
    "about.hero.badge": "عن PT International",
    "about.hero.title": "ريادة حلول علوم الحياة",
    "about.hero.description": "لأكثر من 15 عامًا، كانت شركة PT International Lifesciences LLC في طليعة تقديم منتجات بحثية مبتكرة، وحلول تشخيصية، وأجهزة علمية للمختبرات حول العالم.",

    "about.values.excellence.title": "التميّز",
    "about.values.excellence.description": "نسعى لتحقيق التميّز في كل ما نقوم به، من جودة المنتجات إلى خدمة العملاء.",
    "about.values.collaboration.title": "التعاون",
    "about.values.collaboration.description": "نؤمن بقوة التعاون لدفع التقدم العلمي والابتكار.",
    "about.values.globalImpact.title": "الأثر العالمي",
    "about.values.globalImpact.description": "تصل حلولنا إلى مختبرات حول العالم، وتسهم في الصحة العالمية والبحث العلمي.",
    "about.values.integrity.title": "النزاهة",
    "about.values.integrity.description": "نلتزم بأعلى معايير النزاهة والممارسات الأخلاقية في جميع عملياتنا.",

    "about.milestones.2012.title": "التوسع العالمي",
    "about.milestones.2012.description": "قمنا بتوسيع عملياتنا لخدمة أكثر من 25 دولة",
    "about.milestones.2016.title": "الابتكار في المنتجات",
    "about.milestones.2016.description": "أطلقنا حلول تشخيصية متقدمة",
    "about.milestones.2020.title": "التحول الرقمي",
    "about.milestones.2020.description": "طبقنا منصات رقمية متطورة",
    "about.milestones.2024.title": "مبادرة الاستدامة",
    "about.milestones.2024.description": "أطلقنا برنامجًا شاملاً للاستدامة",

    "whyChoose.title1": "مزايا تنافسية",
    "whyChoose.subtitle1": "ما الذي يميزنا في صناعة علوم الحياة",

    "testimonials.title": "ماذا يقول عملاؤنا",
    "testimonials.subtitle": "موثوق من قبل المؤسسات الرائدة والباحثين حول العالم",
    "testimonials.content.1": "كانت شركة PT International شريكنا الموثوق لأكثر من 5 سنوات. منتجاتهم البحثية عالية الجودة باستمرار، وفريق الدعم الفني لديهم استثنائي. لقد حسّن طقم PCR المتقدم بشكل كبير من كفاءة أبحاثنا.",
    "testimonials.content.2": "لقد غيّرت حلول التشخيص من PT International قدراتنا في الاختبارات. قدمت اختبارات COVID-19 السريعة نتائج دقيقة عندما كنا في أمسّ الحاجة إليها خلال الجائحة. موثوقية رائعة وخدمة عملاء متميزة.",
    "testimonials.content.3": "ساعدتنا خدمات الاستشارات من PT International في تجاوز تعقيدات لوائح إدارة الغذاء والدواء (FDA) بسلاسة. أنقذتنا خبرتهم في الشؤون التنظيمية من شهور من التحضير وضمنت إطلاق منتجنا بنجاح.",
    "testimonials.content.4": "نستخدم أجهزة PT International في مختبرات التعليم لدينا. جهاز الطرد المركزي المختبري قوي وموثوق ومثالي لاحتياجاتنا التعليمية. قيمة رائعة مقابل المال ودعم ما بعد البيع ممتاز.",
    "testimonials.content.5": "تضمن خدمات مراقبة الجودة من PT International أن يحافظ مختبرنا على أعلى المعايير. كانت خبرتهم في التحقق من صحة الأساليب وبروتوكولات الاختبار الشاملة لا تقدر بثمن لعملياتنا.",
    "testimonials.content.6": "المواد الكيميائية والكواشف من PT International نقية بشكل استثنائي. يوفر الأسيتونتريل بدرجة HPLC نتائج موثوقة باستمرار في عملنا التحليلي. كما أن الوثائق الفنية الخاصة بهم شاملة للغاية.",


    //service
    "services.title": "خدماتنا المهنية",
    "services.description": "خدمات علمية شاملة مصممة لدعم أبحاثكم وتطويركم وضمان الجودة.",
    "services.button": "عرض جميع الخدمات",

    "services.hero.badge": "خدماتنا",
    "services.hero.title": "خدمات علوم الحياة الاحترافية",
    "services.hero.description": "حلول شاملة لاحتياجاتك البحثية والتشخيصية والتحليلية مع استشارات ودعم من خبراء.",
    "services.search.placeholder": "ابحث عن الخدمات...",
    "services.category.placeholder": "الفئة",
    "services.count.label": "خدمة/خدمات تم العثور عليها",
    "services.error.title": "حدث خطأ ما",
    "services.error.description": "تعذر تحميل الخدمات. يرجى المحاولة مرة أخرى.",
    "services.error.label": "خطأ:",
    "services.error.button": "إعادة تحميل الصفحة",
    "services.noResults": "لم يتم العثور على خدمات مطابقة لبحثك",
    "services.button.clearSearch": "مسح البحث",
    "services.button.learnMore": "اعرف المزيد",
    "services.price.startingAt": "تبدأ من",
    "services.cta.title": "هل أنت مستعد للبدء؟",
    "services.cta.description": "تواصل مع فريقنا لمناقشة متطلباتك الخاصة ومعرفة كيف يمكننا مساعدتك في تحقيق أهدافك.",
    "services.cta.primary": "اطلب عرض سعر",
    "services.cta.secondary": "اتصل الآن",
    "services.cta.button.primary": "تواصل معنا",
    "services.cta.button.secondary": "استعرض المنتجات",
    "breadcrumb.home": "الرئيسية",
    "breadcrumb.services": "الخدمات",
    "services.hero.back": "العودة إلى الخدمات",
    "services.hero.quoteButton": "احصل على عرض سعر",
    "services.hero.callUs": "اتصل بنا",
    "services.detail.overviewTitle": "نظرة عامة على الخدمة",
    "services.detail.featuresTitle": "الميزات الرئيسية",
    "services.detail.featuresDescription": "ما الذي تتضمنه هذه الخدمة",


    //why choose us 
    "whyChoose.title": "لماذا تختار بي تي إنترناشيونال؟",
    "whyChoose.subtitle": "نحن نجمع بين الخبرة العلمية والحلول المبتكرة لتقديم قيمة استثنائية",
    "whyChoose.features.1.title": "حاصلون على شهادة ISO 9001:2015",
    "whyChoose.features.1.description": "نظام إدارة الجودة لدينا يلتزم بالمعايير الدولية، مما يضمن جودة المنتجات وتفوق الخدمات بشكل مستمر.",
    "whyChoose.features.1.label": "سنوات الشهادة",

    "whyChoose.features.2.title": "انتشار عالمي",
    "whyChoose.features.2.description": "نخدم عملاء في أكثر من 50 دولة حول العالم من خلال شبكات توزيع راسخة ودعم محلي.",
    "whyChoose.features.2.label": "الدول المخدومة",

    "whyChoose.features.3.title": "فريق خبراء",
    "whyChoose.features.3.description": "يضم فريقنا علماء حاصلين على درجة الدكتوراه وخبراء تقنيين يقدمون دعمًا واستشارات لا مثيل لها.",
    "whyChoose.features.3.label": "علماء دكتوراه",

    "whyChoose.features.4.title": "توصيل سريع",
    "whyChoose.features.4.description": "نضمن أوقات تسليم سريعة وتوفر المنتجات من خلال إدارة فعالة للوجستيات والمخزون.",
    "whyChoose.features.4.label": "مدة التوصيل",

    "whyChoose.features.5.title": "ضمان الجودة",
    "whyChoose.features.5.description": "جميع المنتجات تأتي بضمان الجودة لدينا ودعم فني شامل.",
    "whyChoose.features.5.label": "جودة مضمونة",

    "whyChoose.features.6.title": "دعم على مدار الساعة",
    "whyChoose.features.6.description": "دعم فني وخدمة عملاء على مدار 24/7 لتلبية احتياجاتكم بسرعة.",
    "whyChoose.features.6.label": "الدعم متاح",

    //gallery
    "gallery.title": "معرض الصور",
    "gallery.description": "استكشف منشآتنا الحديثة ومنتجاتنا وإنجازاتنا العلمية من خلال معرض الصور.",
    "gallery.lightbox.title": "معرض الصور",
    "gallery.button": "عرض المعرض الكامل",


    //about section
    "about.company-overview.title": "نظرة عامة على الشركة",
    "about.company-overview.content": "نمت شركة PT International Lifesciences LLC من شركة ناشئة صغيرة إلى مزود عالمي رائد لحلول علوم الحياة. بدأت رحلتنا بمهمة بسيطة: جعل منتجات البحث عالية الجودة والحلول التشخيصية في متناول المختبرات حول العالم. نحن نخدم اليوم أكثر من 1000 عميل في أكثر من 50 دولة، مع الحفاظ على التزامنا بالتميز والابتكار ورضا العملاء.",
    "about.company-overview.stats.customers": "العملاء",
    "about.company-overview.stats.countries": "الدول",
    "about.company-overview.stats.products": "المنتجات",

    "about.our-expertise.title": "خبراتنا",
    "about.our-expertise.content": "مع أكثر من 15 عامًا من الخبرة في صناعة علوم الحياة، طورنا خبرات عميقة في مجالات متعددة. يضم فريقنا علماء حاصلين على درجة الدكتوراه، ومتخصصين في الشؤون التنظيمية، وخبراء في ضمان الجودة، وفنيي دعم تقني. تتيح لنا هذه الخبرات المتنوعة تقديم حلول شاملة تلبي الاحتياجات المتغيرة للمختبرات الحديثة ومؤسسات البحث.",
    "about.our-expertise.stats.years": "سنوات الخبرة",
    "about.our-expertise.stats.scientists": "علماء دكتوراه",
    "about.our-expertise.stats.regulatory": "خبراء تنظيميون",
    "about.our-expertise.stats.satisfaction": "رضا العملاء",

    "about.innovation-commitment.title": "الابتكار والتكنولوجيا",
    "about.innovation-commitment.content": "الابتكار هو جوهر كل ما نقوم به. نستثمر باستمرار في البحث والتطوير لتقديم حلول متطورة للسوق. تتيح لنا منشآتنا الحديثة وشراكاتنا مع المؤسسات البحثية الرائدة أن نظل في طليعة التقدم العلمي. نحن ملتزمون بتطوير منتجات لا تلبي الاحتياجات الحالية فحسب، بل تتوقع أيضًا التحديات المستقبلية في مجال علوم الحياة.",
    "about.innovation-commitment.stats.rnd": "الإيرادات في البحث والتطوير",
    "about.innovation-commitment.stats.new-products": "منتجات جديدة/سنة",
    "about.innovation-commitment.stats.partnerships": "شراكات بحثية",
    "about.innovation-commitment.stats.patents": "براءات الاختراع والملكية الفكرية",

    //galery
    "gallery.badge": "المعرض",
    "gallery.title1": "لحظات لا تُنسى",
    "gallery.description1": "استعرض مجموعتنا من الإنجازات واللحظات البارزة من PT International Lifesciences.",
    "gallery.searchPlaceholder": "ابحث في المعرض...",
    "gallery.allCategories": "جميع الفئات",
    "gallery.noResults": "لم يتم العثور على صور مطابقة للمعايير.",
    "gallery.lightbox.index": "{{current}} / {{total}}",
    "gallery.error.title": "حدث خطأ ما",
    "gallery.error.message": "تعذر تحميل صور المعرض. سيتم عرض معرض تجريبي بدلاً من ذلك.",
    "gallery.error.errorLabel": "الخطأ",
    "gallery.error.refresh": "تحديث الصفحة",

    //contact
    "contact.hero.badge": "تواصل معنا",
    "contact.hero.title": "تواصل مع فريق الخبراء لدينا",
    "contact.hero.description": "هل لديك أسئلة حول منتجاتنا أو خدماتنا؟ نحن هنا لمساعدتك. تواصل مع فريق خبراء علوم الحياة لدينا.",
    "contact.form.title": "أرسل لنا رسالة",
    "contact.form.description": "املأ النموذج أدناه وسنعاود الاتصال بك في أقرب وقت ممكن.",
    "contact.form.name": "الاسم الكامل",
    "contact.form.email": "عنوان البريد الإلكتروني",
    "contact.form.phone": "رقم الهاتف",
    "contact.form.subject": "الموضوع",
    "contact.form.message": "الرسالة",
    "contact.form.namePlaceholder": "أدخل اسمك الكامل",
    "contact.form.emailPlaceholder": "example@email.com",
    "contact.form.phonePlaceholder": "+971...",
    "contact.form.subjectPlaceholder": "ما الموضوع؟",
    "contact.form.messagePlaceholder": "اكتب استفسارك أو سؤالك هنا...",
    "contact.form.send": "إرسال الرسالة",
    "contact.form.sending": "جارٍ الإرسال...",
    "contact.info.title": "ابقَ على تواصل",
    "contact.info.description": "فريقنا جاهز لمساعدتك في أي استفسارات حول منتجاتنا أو شراكاتنا.",
    "contact.info.email": "راسلنا عبر البريد",
    "contact.info.phone": "اتصل بنا",
    "contact.info.address": "زرنا",
    "contact.info.hours": "ساعات العمل",
    "contact.info.weekdays": "الإثنين-الجمعة: 8:00 صباحًا - 6:00 مساءً",
    "contact.info.saturday": "السبت: 9:00 صباحًا - 2:00 مساءً",
    "contact.toast.successTitle": "تم إرسال الرسالة بنجاح!",
    "contact.toast.successDescription": "شكرًا لتواصلك معنا. سنعود إليك خلال 24 ساعة.",
    "contact.toast.errorTitle": "حدث خطأ",
    "contact.toast.errorDefault": "فشل إرسال الرسالة. يرجى المحاولة مرة أخرى.",

    "Home": "الرئيسية",
    "Products": "المنتجات",
    "Product category": "فئة المنتج",
    "Search products...": "ابحث عن المنتجات...",
    "product": "منتج",
    "products": "منتجات",
    "found": "تم العثور عليها",
    "Back to Products": "العودة إلى المنتجات",
    "View Details": "عرض التفاصيل",
    "more": "أخرى",
    "features": "ميزات",
    "No products found in this category": "لم يتم العثور على منتجات في هذه الفئة",
    "Clear Search": "مسح البحث",
    "Need Help Choosing?": "تحتاج مساعدة في الاختيار؟",
    "Our experts can help you select the right products for your specific needs. Contact us for personalized recommendations.": "يمكن لخبرائنا مساعدتك في اختيار المنتجات المناسبة لاحتياجاتك. تواصل معنا للحصول على توصيات مخصصة.",
    "Get Expert Advice": "احصل على نصيحة الخبراء",
    "View Services": "عرض الخدمات",
    "Previous image": "الصورة السابقة",
    "Next image": "الصورة التالية",
    "Go to image {{idx}}": "انتقل إلى الصورة {{idx}}",

    "Research Products": "منتجات البحث",
    "Advanced tools and kits for cutting-edge research applications": "أدوات ومجموعات متقدمة لتطبيقات البحث الحديثة",

    "Diagnostics Products": "منتجات التشخيص",
    "Reliable diagnostic solutions for clinical and laboratory use": "حلول تشخيص موثوقة للاستخدام السريري والمخبري",

    "Instruments & Consumables": "أدوات ومستهلكات",
    "High-quality laboratory instruments and consumable supplies": "أدوات مخبرية عالية الجودة ولوازم مستهلكة",

    "Reagents & Chemicals": "الكواشف والمواد الكيميائية",
    "Pure reagents and chemicals for various applications": "كواشف ومواد كيميائية نقية لمختلف التطبيقات",

    "Plasticwares & Filtration Units": "الأدوات البلاستيكية ووحدات الترشيح",
    "Laboratory plasticware and filtration solutions": "أدوات بلاستيكية وحلول ترشيح للمختبرات",

    "Food Testing Kits": "مجموعات اختبار الأغذية",
    "Comprehensive kits for food safety and quality testing": "مجموعات شاملة لاختبار سلامة وجودة الأغذية",

    "Disinfectant & Sanitizers": "المطهرات والمعقمات",
    "Professional-grade disinfection and sanitization products": "منتجات تعقيم وتطهير احترافية",

    //testimonials 

    "testimonials.filter.label": "تصفية حسب الفئة",
    "testimonials.cta.title": "انضم إلى عملائنا الراضين",
    "testimonials.cta.description": "اختبر الفرق مع PT International. تواصل معنا اليوم لمناقشة متطلباتك ومعرفة سبب ثقة قادة الصناعة بنا.",
    "testimonials.cta.primary": "ابدأ اليوم",
    "testimonials.cta.secondary": "تصفح المنتجات",
    "testimonials.results.label": "{{count}} من التقييمات {{plural}} تم العثور عليها",
    "testimonials.badge": "آراء العملاء",
    "testimonials.hero.title": "ماذا يقول عملاؤنا",
    "testimonials.hero.subtitle": "اكتشف لماذا تثق المؤسسات والباحثون الرائدون حول العالم بشركة PT International لتلبية احتياجاتهم في علوم الحياة.",
    "testimonials.averageRating": "متوسط التقييم",
    "testimonials.reviewCount": "تقييمات العملاء",
    "testimonials.countriesServed": "الدول المخدومة",
    "testimonials.filter.all": "كل الفئات",
    "testimonials.filter.research": "البحث",
    "testimonials.filter.diagnostics": "التشخيص",
    "testimonials.filter.consulting": "الاستشارات",
    "testimonials.filter.quality": "الجودة",

    // Footer
    "footer.products": "المنتجات",
    "footer.company": "الشركة",
    "footer.aboutUs": "من نحن",
    "footer.services": "الخدمات",
    "footer.contact": "تواصل معنا",
    "footer.gallery": "المعرض",
    "footer.testimonials": "الشهادات",
    "footer.researchProducts": "منتجات البحث",
    "footer.diagnostics": "التشخيص",
    "footer.instruments": "الأدوات",
    "footer.reagents": "الكواشف",
    "footer.description": "مزود رائد لمنتجات البحث والتشخيص وحلول علوم الحياة للمختبرات حول العالم.",
    "footer.addressLine1": "شركة بي تي إنترناشيونال لعلوم الحياة ذ.م.م",
    "footer.addressLine2": "مدينة الشارقة للإعلام، الشارقة،",
    "footer.addressLine3": "الإمارات العربية المتحدة، ص.ب 839، الشارقة",
    "footer.rightsReserved": "جميع الحقوق محفوظة.",

}

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
    const [language, setLanguageState] = useState<Language>("en")

    useEffect(() => {
        const savedLanguage = localStorage.getItem("language") as Language
        if (savedLanguage) {
            setLanguageState(savedLanguage)
        }
    }, [])

    const setLanguage = (newLanguage: Language) => {
        setLanguageState(newLanguage)
        localStorage.setItem("language", newLanguage)
    }

    const t = (key: string): string => {
        const translations = {
            en: enTranslations,
            ar: arTranslations,
        }

        return translations[language]?.[key] || key
    }

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    )
}

export const useLanguage = () => {
    const context = useContext(LanguageContext)
    if (context === undefined) {
        throw new Error("useLanguage must be used within a LanguageProvider")
    }
    return context
}
