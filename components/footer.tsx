"use client"

import Link from "next/link"
import Image from "next/image"
import { Mail, Phone, MapPin, Linkedin, Facebook, Instagram } from "lucide-react"
import { useLanguage } from "@/context/language-context" // adjust path if needed

const productLinks = [
  { nameKey: "footer.researchProducts", href: "/products/research-products" },
  { nameKey: "footer.diagnostics", href: "/products/diagnostics-products" },
  { nameKey: "footer.instruments", href: "/products/instruments-consumables" },
  { nameKey: "footer.reagents", href: "/products/reagents-chemicals" },
]

const companyLinks = [
  { nameKey: "footer.aboutUs", href: "/about-us" },
  { nameKey: "footer.services", href: "/services" },
  { nameKey: "footer.contact", href: "/contact" },
  { nameKey: "footer.gallery", href: "/gallery" },
  { nameKey: "footer.testimonials", href: "/testimonials" },
]

export function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="bg-gray-50 border-t">
      <div className="max-w-7xl mx-auto container-padding">
        {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <Image
                src="/logo.png"
                alt="PT International Lifesciences LLC"
                width={160}
                height={50}
                className="h-12 w-auto mb-4"
              />
              <p className="text-muted-foreground text-sm mb-6 max-w-md">
                {t("footer.description")}
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-2 text-primary" />
                  {t("footer.addressLine1")} <br />
                  {t("footer.addressLine2")} <br />
                  {t("footer.addressLine3")}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Phone className="h-4 w-4 mr-2 text-primary" />
                  +971562647649
                </div>
                <div className="flex flex-col text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-primary" />
                    ptinternationallifescience@gmail.com,
                  </div>
                  <div className="flex items-center ml-6"> 
                    info@ptilifesciences.com
                  </div>
                </div>


              </div>
            </div>

            {/* Products */}
            <div>
              <h3 className="font-semibold mb-4">{t("footer.products")}</h3>
              <ul className="space-y-2">
                {productLinks.map((link) => (
                  <li key={link.nameKey}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {t(link.nameKey)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="font-semibold mb-4">{t("footer.company")}</h3>
              <ul className="space-y-2">
                {companyLinks.map((link) => (
                  <li key={link.nameKey}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {t(link.nameKey)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="py-6 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} PT International Lifesciences LLC. {t("footer.rightsReserved")}
            </p>
            <div className="flex space-x-4">
              <Link href="https://www.linkedin.com/in/pt-international-6995b7379/" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link href="https://www.instagram.com/ptinternationallifesciences/" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="https://www.facebook.com/profile.php?id=61579373332041" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
