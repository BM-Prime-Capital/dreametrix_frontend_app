"use client"

import { useState } from "react"

interface Country {
  value: string
  display_name: string
}

export interface SchoolFormData {
  name: string
  school_email: string
  administrator_email: string
  phone: string
  country: string
  region: string
  city: string
  address: string
}

export interface SchoolFormErrors {
  name: string
  school_email: string
  administrator_email: string
  phone: string
  country: string
  region: string
  city: string
  address: string
}

export const useSchoolRegistration = () => {
  const [formData, setFormData] = useState<SchoolFormData>({
    name: "",
    school_email: "",
    administrator_email: "",
    phone: "",
    country: "",
    region: "",
    city: "",
    address: "",
  })

  const [errors, setErrors] = useState<SchoolFormErrors>({
    name: "",
    school_email: "",
    administrator_email: "",
    phone: "",
    country: "",
    region: "",
    city: "",
    address: "",
  })

  const [isLoading, setIsLoading] = useState(false)

  // Updated list of countries with full names as both value and display_name
  const countries: Country[] = [
    { value: "Afghanistan", display_name: "Afghanistan" },
    { value: "Albanie", display_name: "Albanie" },
    { value: "Algérie", display_name: "Algérie" },
    { value: "Andorre", display_name: "Andorre" },
    { value: "Angola", display_name: "Angola" },
    { value: "Argentine", display_name: "Argentine" },
    { value: "Arménie", display_name: "Arménie" },
    { value: "Australia", display_name: "Australia" },
    { value: "Autriche", display_name: "Autriche" },
    { value: "Azerbaïdjan", display_name: "Azerbaïdjan" },
    { value: "Bahreïn", display_name: "Bahreïn" },
    { value: "Bangladesh", display_name: "Bangladesh" },
    { value: "Biélorussie", display_name: "Biélorussie" },
    { value: "Belgique", display_name: "Belgique" },
    { value: "Bénin", display_name: "Bénin" },
    { value: "Bhoutan", display_name: "Bhoutan" },
    { value: "Bolivie", display_name: "Bolivie" },
    { value: "Bosnie-Herzégovine", display_name: "Bosnie-Herzégovine" },
    { value: "Botswana", display_name: "Botswana" },
    { value: "Brésil", display_name: "Brésil" },
    { value: "Brunei", display_name: "Brunei" },
    { value: "Bulgarie", display_name: "Bulgarie" },
    { value: "Burkina Faso", display_name: "Burkina Faso" },
    { value: "Burundi", display_name: "Burundi" },
    { value: "Cambodge", display_name: "Cambodge" },
    { value: "Cameroun", display_name: "Cameroun" },
    { value: "Canada", display_name: "Canada" },
    { value: "Cap-Vert", display_name: "Cap-Vert" },
    { value: "République centrafricaine", display_name: "République centrafricaine" },
    { value: "Tchad", display_name: "Tchad" },
    { value: "Chili", display_name: "Chili" },
    { value: "Chine", display_name: "Chine" },
    { value: "Colombie", display_name: "Colombie" },
    { value: "Comores", display_name: "Comores" },
    { value: "Congo", display_name: "Congo" },
    { value: "République démocratique du Congo", display_name: "République démocratique du Congo" },
    { value: "Costa Rica", display_name: "Costa Rica" },
    { value: "Côte d'Ivoire", display_name: "Côte d'Ivoire" },
    { value: "Croatie", display_name: "Croatie" },
    { value: "Cuba", display_name: "Cuba" },
    { value: "Chypre", display_name: "Chypre" },
    { value: "République tchèque", display_name: "République tchèque" },
    { value: "Danemark", display_name: "Danemark" },
    { value: "Djibouti", display_name: "Djibouti" },
    { value: "République dominicaine", display_name: "République dominicaine" },
    { value: "Équateur", display_name: "Équateur" },
    { value: "Égypte", display_name: "Égypte" },
    { value: "El Salvador", display_name: "El Salvador" },
    { value: "Guinée équatoriale", display_name: "Guinée équatoriale" },
    { value: "Érythrée", display_name: "Érythrée" },
    { value: "Estonie", display_name: "Estonie" },
    { value: "Éthiopie", display_name: "Éthiopie" },
    { value: "Fidji", display_name: "Fidji" },
    { value: "Finlande", display_name: "Finlande" },
    { value: "France", display_name: "France" },
    { value: "Gabon", display_name: "Gabon" },
    { value: "Gambie", display_name: "Gambie" },
    { value: "Géorgie", display_name: "Géorgie" },
    { value: "Allemagne", display_name: "Allemagne" },
    { value: "Ghana", display_name: "Ghana" },
    { value: "Grèce", display_name: "Grèce" },
    { value: "Guatemala", display_name: "Guatemala" },
    { value: "Guinée", display_name: "Guinée" },
    { value: "Guinée-Bissau", display_name: "Guinée-Bissau" },
    { value: "Guyana", display_name: "Guyana" },
    { value: "Haïti", display_name: "Haïti" },
    { value: "Honduras", display_name: "Honduras" },
    { value: "Hongrie", display_name: "Hongrie" },
    { value: "Islande", display_name: "Islande" },
    { value: "Inde", display_name: "Inde" },
    { value: "Indonésie", display_name: "Indonésie" },
    { value: "Iran", display_name: "Iran" },
    { value: "Irak", display_name: "Irak" },
    { value: "Irlande", display_name: "Irlande" },
    { value: "Israël", display_name: "Israël" },
    { value: "Italie", display_name: "Italie" },
    { value: "Jamaïque", display_name: "Jamaïque" },
    { value: "Japon", display_name: "Japon" },
    { value: "Jordanie", display_name: "Jordanie" },
    { value: "Kazakhstan", display_name: "Kazakhstan" },
    { value: "Kenya", display_name: "Kenya" },
    { value: "Kiribati", display_name: "Kiribati" },
    { value: "Corée du Nord", display_name: "Corée du Nord" },
    { value: "Corée du Sud", display_name: "Corée du Sud" },
    { value: "Koweït", display_name: "Koweït" },
    { value: "Kirghizistan", display_name: "Kirghizistan" },
    { value: "Laos", display_name: "Laos" },
    { value: "Lettonie", display_name: "Lettonie" },
    { value: "Liban", display_name: "Liban" },
    { value: "Lesotho", display_name: "Lesotho" },
    { value: "Liberia", display_name: "Liberia" },
    { value: "Libye", display_name: "Libye" },
    { value: "Liechtenstein", display_name: "Liechtenstein" },
    { value: "Lituanie", display_name: "Lituanie" },
    { value: "Luxembourg", display_name: "Luxembourg" },
    { value: "Madagascar", display_name: "Madagascar" },
    { value: "Malawi", display_name: "Malawi" },
    { value: "Malaisie", display_name: "Malaisie" },
    { value: "Maldives", display_name: "Maldives" },
    { value: "Mali", display_name: "Mali" },
    { value: "Malte", display_name: "Malte" },
    { value: "Îles Marshall", display_name: "Îles Marshall" },
    { value: "Mauritanie", display_name: "Mauritanie" },
    { value: "Maurice", display_name: "Maurice" },
    { value: "Mexique", display_name: "Mexique" },
    { value: "Micronésie", display_name: "Micronésie" },
    { value: "Moldavie", display_name: "Moldavie" },
    { value: "Monaco", display_name: "Monaco" },
    { value: "Mongolie", display_name: "Mongolie" },
    { value: "Monténégro", display_name: "Monténégro" },
    { value: "Maroc", display_name: "Maroc" },
    { value: "Mozambique", display_name: "Mozambique" },
    { value: "Myanmar", display_name: "Myanmar" },
    { value: "Namibie", display_name: "Namibie" },
    { value: "Nauru", display_name: "Nauru" },
    { value: "Népal", display_name: "Népal" },
    { value: "Pays-Bas", display_name: "Pays-Bas" },
    { value: "Nouvelle-Zélande", display_name: "Nouvelle-Zélande" },
    { value: "Nicaragua", display_name: "Nicaragua" },
    { value: "Niger", display_name: "Niger" },
    { value: "Nigeria", display_name: "Nigeria" },
    { value: "Norvège", display_name: "Norvège" },
    { value: "Oman", display_name: "Oman" },
    { value: "Pakistan", display_name: "Pakistan" },
    { value: "Palaos", display_name: "Palaos" },
    { value: "Panama", display_name: "Panama" },
    { value: "Papouasie-Nouvelle-Guinée", display_name: "Papouasie-Nouvelle-Guinée" },
    { value: "Paraguay", display_name: "Paraguay" },
    { value: "Pérou", display_name: "Pérou" },
    { value: "Philippines", display_name: "Philippines" },
    { value: "Pologne", display_name: "Pologne" },
    { value: "Portugal", display_name: "Portugal" },
    { value: "Qatar", display_name: "Qatar" },
    { value: "Roumanie", display_name: "Roumanie" },
    { value: "Russie", display_name: "Russie" },
    { value: "Rwanda", display_name: "Rwanda" },
    { value: "Saint-Kitts-et-Nevis", display_name: "Saint-Kitts-et-Nevis" },
    { value: "Sainte-Lucie", display_name: "Sainte-Lucie" },
    { value: "Saint-Vincent-et-les-Grenadines", display_name: "Saint-Vincent-et-les-Grenadines" },
    { value: "Samoa", display_name: "Samoa" },
    { value: "Saint-Marin", display_name: "Saint-Marin" },
    { value: "Sao Tomé-et-Principe", display_name: "Sao Tomé-et-Principe" },
    { value: "Arabie saoudite", display_name: "Arabie saoudite" },
    { value: "Sénégal", display_name: "Sénégal" },
    { value: "Serbie", display_name: "Serbie" },
    { value: "Seychelles", display_name: "Seychelles" },
    { value: "Sierra Leone", display_name: "Sierra Leone" },
    { value: "Singapour", display_name: "Singapour" },
    { value: "Slovaquie", display_name: "Slovaquie" },
    { value: "Slovénie", display_name: "Slovénie" },
    { value: "Îles Salomon", display_name: "Îles Salomon" },
    { value: "Somalie", display_name: "Somalie" },
    { value: "Afrique du Sud", display_name: "Afrique du Sud" },
    { value: "Soudan du Sud", display_name: "Soudan du Sud" },
    { value: "Espagne", display_name: "Espagne" },
    { value: "Sri Lanka", display_name: "Sri Lanka" },
    { value: "Soudan", display_name: "Soudan" },
    { value: "Suriname", display_name: "Suriname" },
    { value: "Eswatini", display_name: "Eswatini" },
    { value: "Suède", display_name: "Suède" },
    { value: "Suisse", display_name: "Suisse" },
    { value: "Syrie", display_name: "Syrie" },
    { value: "Taïwan", display_name: "Taïwan" },
    { value: "Tadjikistan", display_name: "Tadjikistan" },
    { value: "Tanzanie", display_name: "Tanzanie" },
    { value: "Thaïlande", display_name: "Thaïlande" },
    { value: "Timor oriental", display_name: "Timor oriental" },
    { value: "Togo", display_name: "Togo" },
    { value: "Tonga", display_name: "Tonga" },
    { value: "Trinité-et-Tobago", display_name: "Trinité-et-Tobago" },
    { value: "Tunisie", display_name: "Tunisie" },
    { value: "Turquie", display_name: "Turquie" },
    { value: "Turkménistan", display_name: "Turkménistan" },
    { value: "Tuvalu", display_name: "Tuvalu" },
    { value: "Ouganda", display_name: "Ouganda" },
    { value: "Ukraine", display_name: "Ukraine" },
    { value: "Émirats arabes unis", display_name: "Émirats arabes unis" },
    { value: "Royaume-Uni", display_name: "Royaume-Uni" },
    { value: "États-Unis", display_name: "États-Unis" },
    { value: "Uruguay", display_name: "Uruguay" },
    { value: "Ouzbékistan", display_name: "Ouzbékistan" },
    { value: "Vanuatu", display_name: "Vanuatu" },
    { value: "Vatican", display_name: "Vatican" },
    { value: "Venezuela", display_name: "Venezuela" },
    { value: "Vietnam", display_name: "Vietnam" },
    { value: "Yémen", display_name: "Yémen" },
    { value: "Zambie", display_name: "Zambie" },
    { value: "Zimbabwe", display_name: "Zimbabwe" },
  ]

  const validateForm = (): boolean => {
    const newErrors = { ...errors }
    let isValid = true

    // Required fields validation
    if (!formData.name) {
      newErrors.name = "School name is required"
      isValid = false
    } else if (formData.name.length > 255) {
      newErrors.name = "School name must be less than 255 characters"
      isValid = false
    }

    if (!formData.school_email) {
      newErrors.school_email = "School email is required"
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(formData.school_email)) {
      newErrors.school_email = "Invalid email format"
      isValid = false
    }

    if (!formData.administrator_email) {
      newErrors.administrator_email = "Administrator email is required"
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(formData.administrator_email)) {
      newErrors.administrator_email = "Invalid email format"
      isValid = false
    }

    if (!formData.phone) {
      newErrors.phone = "Phone number is required"
      isValid = false
    } else if (formData.phone.length > 20) {
      newErrors.phone = "Phone number must be less than 20 characters"
      isValid = false
    }

    if (!formData.country) {
      newErrors.country = "Country is required"
      isValid = false
    }

    if (!formData.city) {
      newErrors.city = "City is required"
      isValid = false
    } else if (formData.city.length > 255) {
      newErrors.city = "City must be less than 255 characters"
      isValid = false
    }

    if (formData.address && formData.address.length > 255) {
      newErrors.address = "Address must be less than 255 characters"
      isValid = false
    }

    if (formData.region && formData.region.length > 255) {
      newErrors.region = "Region must be less than 255 characters"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleInputChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: "" }))
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      // Basic auth credentials
      // const username = "developement@bmprimecapital.com"
      // const password = "123456789"

      // Create the Authorization header with Basic auth
      // const credentials = btoa(`${username}:${password}`)
      // const authHeader = `Basic ${credentials}`

      const response = await fetch("https://backend-dreametrix.com/school-requests/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to create school")
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("Error creating school:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return {
    formData,
    errors,
    isLoading,
    countries,
    handleInputChange,
    handleSubmit,
  }
}

