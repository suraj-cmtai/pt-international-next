"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Menu, Globe, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Sheet, SheetContent, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet"
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

          {/* Mobile Menu Toggle & Language Switcher */}
          <div className="lg:hidden flex items-center gap-2">
            {/* Mobile Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="w-9 h-9 p-2 hover:bg-accent">
                  <Globe className="h-4 w-4" />
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

            {/* Mobile Menu Trigger */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="w-9 h-9 p-2">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 p-0 flex flex-col">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                
                {/* Mobile Header with Close Button */}
                <div className="flex items-center justify-between p-4 border-b bg-white">
                  <Image 
                    src="/logo-bg-2.png" 
                    alt="PT International" 
                    width={120} 
                    height={40} 
                    className="h-8 w-auto" 
                  />
                  <SheetClose asChild>
                    <Button variant="ghost" size="icon" className="w-8 h-8 p-1.5 hover:bg-gray-100">
                      <X className="h-4 w-4" />
                    </Button>
                  </SheetClose>
                </div>

                {/* Mobile Navigation Content */}
                <div className="flex-1 overflow-y-auto">
                  <nav className="p-6 space-y-6">
                    <Link
                      href="/"
                      className={`mobile-nav-link block text-lg font-medium transition-colors ${
                        isActive("/") ? "mobile-nav-link-active" : ""
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {t("header.home")}
                    </Link>
                    
                    <Link
                      href="/about-us"
                      className={`mobile-nav-link block text-lg font-medium transition-colors ${
                        isActive("/about-us") ? "mobile-nav-link-active" : ""
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {t("header.about")}
                    </Link>

                    <Link
                      href="/services"
                      className={`mobile-nav-link block text-lg font-medium transition-colors ${
                        isActive("/services") ? "mobile-nav-link-active" : ""
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {t("header.services")}
                    </Link>

                    {/* Mobile Products Dropdown */}
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="products" className="border-none">
                        <AccordionTrigger className={`mobile-nav-link mobile-nav-link-trigger text-lg font-medium transition-colors px-0 hover:no-underline ${
                          isProductsActive() ? "mobile-nav-link-active" : ""
                        }`}>
                          {t("header.products")}
                        </AccordionTrigger>
                        <AccordionContent className="pl-4 pb-2">
                          <div className="space-y-2">
                            {productCategories.map((category) => (
                              <Link
                                key={category.slug}
                                href={`/products/${category.slug}`}
                                className={`mobile-dropdown-link block text-sm py-2 px-2 rounded transition-colors ${
                                  isActive(`/products/${category.slug}`) ? "mobile-dropdown-link-active bg-gray-50" : "text-muted-foreground hover:text-foreground hover:bg-gray-50"
                                }`}
                                onClick={() => setIsOpen(false)}
                              >
                                {category.name}
                              </Link>
                            ))}
                            <Link
                              href="/products"
                              className={`mobile-dropdown-link block text-sm py-2 px-2 rounded font-medium transition-colors border-t mt-2 pt-3 ${
                                pathname === "/products" ? "mobile-dropdown-link-active bg-gray-50" : "hover:bg-gray-50"
                              }`}
                              onClick={() => setIsOpen(false)}
                            >
                              {t("header.viewAllProducts")} →
                            </Link>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>

                    <Link
                      href="/gallery"
                      className={`mobile-nav-link block text-lg font-medium transition-colors ${
                        isActive("/gallery") ? "mobile-nav-link-active" : ""
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {t("header.gallery")}
                    </Link>

                    <Link
                      href="/contact"
                      className={`mobile-nav-link block text-lg font-medium transition-colors ${
                        isActive("/contact") ? "mobile-nav-link-active" : ""
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {t("header.contact")}
                    </Link>
                  </nav>
                </div>

                {/* Mobile Footer CTA */}
                <div className="p-6 border-t bg-white">
                  <Button asChild className="w-full bg-primary hover:bg-primary/90">
                    <Link href="/contact" onClick={() => setIsOpen(false)}>
                      {t("header.getQuote")}
                    </Link>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}