"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/lib/redux/store"
import { fetchActiveProducts } from "@/lib/redux/features/productSlice"
import ProductsPageClient from "./ProductsPageClient"

export default function ProductsPage() {
  const dispatch = useDispatch<AppDispatch>()
  const { activeProductList, isLoading, error } = useSelector((state: RootState) => state.products)

  useEffect(() => {
    dispatch(fetchActiveProducts())
  }, [dispatch])

  return <ProductsPageClient initialProducts={activeProductList} loading={isLoading} error={error} />
}
