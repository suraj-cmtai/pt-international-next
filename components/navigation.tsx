"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, ChevronDown } from "lucide-react"
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

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
                  <NavigationMenuLink className="nav-link px-3 py-2">Home</NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/about-us" legacyBehavior passHref>
                  <NavigationMenuLink className="nav-link px-3 py-2">About</NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/services" legacyBehavior passHref>
                  <NavigationMenuLink className="nav-link px-3 py-2">Services</NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="nav-link px-3 py-2 bg-transparent hover:bg-transparent data-[state=open]:bg-transparent">
                  Products
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  
                  <div className="w-96 p-4">
                    <h3 className="text-lg font-medium mb-3 sr-only">Products</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {productCategories.map((category) => (
                        <Link
                          key={category.slug}
                          href={`/products/${category.slug}`}
                          className="block p-2 rounded-md hover:bg-gray-50 transition-colors"
                        >
                          <div className="text-sm font-medium">{category.name}</div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/testimonials" legacyBehavior passHref>
                  <NavigationMenuLink className="nav-link px-3 py-2">Testimonials</NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/contact" legacyBehavior passHref>
                  <NavigationMenuLink className="nav-link px-3 py-2">Contact</NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* CTA Button */}
          <div className="hidden lg:flex">
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link href="/contact">Get Quote</Link>
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 p-0">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <div className="flex flex-col h-full">
                <div className="p-6 border-b">
                  <Image src="/logo-bg-2.png" alt="PT International" width={120} height={40} className="h-8 w-auto" />
                </div>
                <nav className="flex-1 p-6 space-y-6">
                  <Link
                    href="/"
                    className="block text-lg font-medium hover:text-primary transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Home
                  </Link>
                  <Link
                    href="/about-us"
                    className="block text-lg font-medium hover:text-primary transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    About
                  </Link>

                  <Link
                    href="/services"
                    className="block text-lg font-medium hover:text-primary transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Services
                  </Link>

                  {/* Mobile Products Dropdown using shadcn Accordion */}
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="products">
                      <AccordionTrigger className="text-lg font-medium hover:text-primary transition-colors px-0">
                        Products
                      </AccordionTrigger>
                      <AccordionContent className="pl-4">
                        <h3 className="text-base font-semibold px-1 py-2 sr-only">Products</h3>
                        <div className="space-y-2">
                          {productCategories.map((category) => (
                            <Link
                              key={category.slug}
                              href={`/products/${category.slug}`}
                              className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                              onClick={() => setIsOpen(false)}
                            >
                              {category.name}
                            </Link>
                          ))}
                          <Link
                            href="/products"
                            className="block text-sm text-primary font-medium"
                            onClick={() => setIsOpen(false)}
                          >
                            View All Products →
                          </Link>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>

                  <Link
                    href="/testimonials"
                    className="block text-lg font-medium hover:text-primary transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Testimonials
                  </Link>

                  <Link
                    href="/contact"
                    className="block text-lg font-medium hover:text-primary transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Contact
                  </Link>
                </nav>
                <div className="p-6 border-t">
                  <Button asChild className="w-full">
                    <Link href="/contact" onClick={() => setIsOpen(false)}>
                      Get Quote
                    </Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
