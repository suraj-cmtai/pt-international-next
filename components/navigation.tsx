"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Menu, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Language, useLanguage } from "@/context/language-context"

const productCategories = [
  { name: "Research Products", slug: "research-products" },
  { name: "Diagnostics Products", slug: "diagnostics-products" },
  { name: "Instruments & Consumables", slug: "instruments-consumables" },
  { name: "Reagents and Chemicals", slug: "reagents-chemicals" },
  { name: "Plastic Wares & Filtration Units", slug: "plasticwaresfiltrationunits" },
  { name: "Food Testing Kits", slug: "food-testing-kits" },
  { name: "Disinfectant and Sanitizers", slug: "disinfectant-and-sanitizers" },
]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { t, language, setLanguage } = useLanguage()

  const isActive = (path: string) => {
    return path === "/" ? pathname === "/" : pathname.startsWith(path)
  }

  const isProductsActive = () => pathname.startsWith("/products")

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto container-padding">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo-bg-2.png"
              alt="PT International Lifesciences LLC"
              width={140}
              height={140}
              className="h-10 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList className="space-x-1">
              <NavigationMenuItem>
                <Link href="/" legacyBehavior passHref>
                  <NavigationMenuLink className={`nav-link px-3 py-2 ${isActive("/") ? "nav-link-active" : ""}`}>
                    {t("header.home")}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/about-us" legacyBehavior passHref>
                  <NavigationMenuLink className={`nav-link px-3 py-2 ${isActive("/about-us") ? "nav-link-active" : ""}`}>
                    {t("header.about")}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/services" legacyBehavior passHref>
                  <NavigationMenuLink className={`nav-link px-3 py-2 ${isActive("/services") ? "nav-link-active" : ""}`}>
                    {t("header.services")}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className={`nav-link nav-trigger px-3 py-2 ${isProductsActive() ? "nav-link-active" : ""}`}>
                  {t("header.products")}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-96 p-4">
                    <div className="grid grid-cols-2 gap-2">
                      {productCategories.map((category) => (
                        <Link
                          key={category.slug}
                          href={`/products/${category.slug}`}
                          className={`nav-dropdown-link block p-2 rounded-md transition-colors hover:text-black ${isActive(`/products/${category.slug}`) ? "nav-dropdown-link-active" : ""
                            }`}
                        >
                          <div className="text-sm font-medium">{category.name}</div>
                        </Link>
                      ))}
                      <Link
                        href="/products"
                        className={`nav-dropdown-link block p-2 rounded-md transition-colors col-span-2 mt-2 border-t pt-3 ${pathname === "/products" ? "nav-dropdown-link-active" : ""
                          }`}
                      >
                        <div className="text-sm font-medium text-center">{t("header.viewAllProducts")}</div>
                      </Link>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/gallery" legacyBehavior passHref>
                  <NavigationMenuLink className={`nav-link px-3 py-2 ${isActive("/gallery") ? "nav-link-active" : ""}`}>
                    {t("header.gallery")}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/contact" legacyBehavior passHref>
                  <NavigationMenuLink className={`nav-link px-3 py-2 ${isActive("/contact") ? "nav-link-active" : ""}`}>
                    {t("header.contact")}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* CTA & Language Switch */}
          <div className="hidden lg:flex items-center space-x-2">
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link href="/contact">{t("header.getQuote")}</Link>
            </Button>

            {/* Language Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="w-10 h-10 p-2 hover:bg-accent">
                  <Globe className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-32">
                {[
                  { code: "en", label: "English" },
                  { code: "ar", label: "العربية" },
                ].map(({ code, label }) => (
                  <DropdownMenuItem
                    key={code}
                    onClick={() => setLanguage(code as Language)}
                    className={language === code ? "font-semibold text-gray-600" : ""}
                  >
                    {label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Menu Toggle */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            {/* You can also apply language switcher in mobile here if needed */}
            <SheetContent side="right" className="w-80 p-0">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <div className="flex flex-col h-full">
                <div className="p-6 border-b flex justify-between items-center">
                  <Image src="/logo-bg-2.png" alt="PT International" width={120} height={40} className="h-8 w-auto" />

                  {/* Language Switcher (Mobile) */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="w-8 h-8 p-1">
                        <Globe className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-32">
                      {[
                        { code: "en", label: "English" },
                        { code: "ar", label: "العربية" },
                      ].map(({ code, label }) => (
                        <DropdownMenuItem
                          key={code}
                          onClick={() => setLanguage(code as Language)}
                          className={language === code ? "font-semibold text-gray-600" : ""}
                        >
                          {label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Rest of mobile nav remains same */}
                {/* ... */}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
