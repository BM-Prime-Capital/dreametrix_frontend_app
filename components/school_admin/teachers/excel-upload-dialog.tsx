"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../ui/dialog"
import { Button } from "../../ui/button"
import { FileUp, Upload, AlertCircle } from "lucide-react"
import { Loader } from "../../ui/loader"
import { toast } from "react-toastify"
import { Alert, AlertDescription } from "../../ui/alert"

export function ExcelUploadDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [fileName, setFileName] = useState("")
  const [showSuccess, setShowSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [baseUrl, setBaseUrl] = useState<string | null>(null)

  useEffect(() => {
    const userDataString = localStorage.getItem("userData")
    if (userDataString) {
      try {
        const userData = JSON.parse(userDataString)
        if (userData.tenant && userData.tenant.primary_domain) {
          setBaseUrl(`https://${userData.tenant.primary_domain}`)
        } else {
          setError("Domaine principal non trouvé. Veuillez vous reconnecter.")
        }
      } catch (error) {
        console.error("Error parsing user data:", error)
        setError("Erreur lors de la récupération des données utilisateur")
      }
    } else {
      setError("Données utilisateur non trouvées. Veuillez vous reconnecter.")
    }
  }, [])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const validTypes = ["application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"]

    if (!validTypes.includes(file.type)) {
      setError("Veuillez télécharger un fichier Excel valide (.xls ou .xlsx)")
      toast.error("Format de fichier non valide. Utilisez .xls ou .xlsx")
      return
    }

    setFileName(file.name)
    setIsLoading(true)
    setError(null)

    const formData = new FormData()
    formData.append("excel_file", file)

    try {
      const accessToken = localStorage.getItem("accessToken")

      if (!accessToken) {
        throw new Error("Vous n'êtes pas connecté. Veuillez vous reconnecter.")
      }

      if (!baseUrl) {
        throw new Error("URL de base non disponible. Veuillez vous reconnecter.")
      }

      const uploadUrl = `${baseUrl}/school-admin/upload-users/`

      console.log("Uploading to:", uploadUrl)

      const response = await fetch(uploadUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Votre session a expiré. Veuillez vous reconnecter.")
        } else if (response.status === 403) {
          throw new Error("Vous n'avez pas la permission d'uploader des utilisateurs.")
        } else if (response.status === 400) {
          throw new Error(
            data.message || "Le fichier Excel contient des données invalides. Veuillez vérifier le format.",
          )
        } else {
          throw new Error(data.message || "Une erreur s'est produite lors de l'upload du fichier.")
        }
      }

      console.log("Upload response:", data)
      setShowSuccess(true)
      toast.success("Utilisateurs créés avec succès!")

      setTimeout(() => {
        setIsOpen(false)
        setShowSuccess(false)
        setFileName("")
      }, 2000)
    } catch (error) {
      console.error("Upload error:", error)
      const errorMessage = error instanceof Error ? error.message : "Échec de l'upload du fichier. Veuillez réessayer."
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button onClick={() => setIsOpen(true)} className="bg-blue-600 hover:bg-blue-700">
        <FileUp className="mr-2 h-4 w-4" />
        Ajouter Plusieurs Utilisateurs
      </Button>
      <DialogContent>
        {!isLoading && !showSuccess && (
          <>
            <DialogHeader>
              <DialogTitle>Télécharger le fichier Excel pour créer des utilisateurs</DialogTitle>
              <DialogDescription className="mt-4">
                <div className="space-y-4">
                  <p>Votre fichier Excel doit contenir les colonnes suivantes:</p>
                  <p className="text-sm italic">username, email, first name, last name, role, grade</p>
                  <p>
                    Pour la colonne <span className="font-medium">&quot;role&quot;</span>, l&apos;entrée doit être{" "}
                    <span className="font-medium">teacher</span> ou <span className="font-medium">student</span>.
                  </p>
                </div>
              </DialogDescription>
            </DialogHeader>

            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="mt-4">
              <label
                htmlFor="excel-upload"
                className="flex cursor-pointer items-center justify-center gap-2 rounded-md border-2 border-dashed border-slate-300 p-6 hover:border-slate-400"
              >
                <Upload className="h-6 w-6 text-slate-500" />
                <span className="text-sm text-slate-600">
                  {fileName || "Cliquez pour télécharger un fichier Excel"}
                </span>
                <input
                  id="excel-upload"
                  type="file"
                  className="hidden"
                  accept=".xlsx,.xls"
                  onChange={handleFileUpload}
                />
              </label>
            </div>
          </>
        )}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="mb-4 h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center">
              <FileUp className="h-6 w-6 text-white" />
            </div>
            <Loader className="text-blue-600" />
            <p className="mt-4 text-sm text-slate-500">Téléchargement et traitement en cours...</p>
          </div>
        )}
        {showSuccess && (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="mb-4 h-16 w-16 rounded-full bg-green-500 p-4">
              <svg className="h-full w-full text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold">Félicitations!</h3>
            <p className="text-sm text-slate-500">Utilisateurs créés avec succès 🎉</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

