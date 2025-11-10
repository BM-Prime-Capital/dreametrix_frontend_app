"use client"

import { useState, useEffect } from "react"

export function useBaseUrl() {
  const [baseUrl, setBaseUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      const tenantData = localStorage.getItem("tenantData")
      if (tenantData) {
        const { primary_domain } = JSON.parse(tenantData)
        if (primary_domain) {
          if (primary_domain.includes("localhost")) {
            setBaseUrl(primary_domain)
          } else {
            setBaseUrl(`https://${primary_domain}`)
          }
        } else {
          setError("Domaine principal non trouvé. Veuillez vous reconnecter.")
        }
      } else {
        setError("Données du tenant non trouvées. Veuillez vous reconnecter.")
      }
    } catch (err) {
      setError("Erreur lors de la récupération des données du tenant.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { baseUrl, error, isLoading }
}

