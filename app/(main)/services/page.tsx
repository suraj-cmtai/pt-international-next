"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/lib/redux/store"
import { fetchActiveServices } from "@/lib/redux/features/serviceSlice"
import ServicesPageClient from "./ServicesPageClient"

export default function ServicesPage() {
  const dispatch = useDispatch<AppDispatch>()
  const { services, loading, error } = useSelector((state: RootState) => state.services)

  useEffect(() => {
    dispatch(fetchActiveServices())
  }, [dispatch])

  return <ServicesPageClient initialServices={services} loading={loading} error={error} />
}
