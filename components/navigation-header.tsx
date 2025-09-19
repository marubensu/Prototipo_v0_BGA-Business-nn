"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Save, Download, Share2, Settings, FileText, Calculator, ChevronDown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { shareCSV } from "@/lib/csv-share"

interface NavigationHeaderProps {
  currentTab: string
  projectName: string
  completionPercentage: number
  personnel?: any[]
  expenses?: any[]
  projectData?: any
  onExportData?: (type: string) => void
  budgetBlocks?: any[]
  flights?: any[]
  perDiems?: any[]
  insurance?: any[]
}

export function NavigationHeader({
  currentTab,
  projectName,
  completionPercentage,
  personnel = [],
  expenses = [],
  projectData = {},
  onExportData,
  budgetBlocks = [],
  flights = [],
  perDiems = [],
  insurance = [],
}: NavigationHeaderProps) {
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate save operation
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
  }

  const getTabDisplayName = (tab: string) => {
    const tabNames = {
      personnel: "Nómina",
      expenses: "Gastos",
      "budget-flow": "Flujo Presupuestal",
      summary: "Resumen",
    }
    return tabNames[tab as keyof typeof tabNames] || tab
  }

  const handleExport = (exportType: string) => {
    if (onExportData) {
      onExportData(exportType)
    }
  }

  const handleShare = () => {
    switch (currentTab) {
      case "personnel":
        if (personnel.length > 0) {
          const personnelData = personnel.map((p) => ({
            Rol: p.role,
            "Salario Base": p.salary,
            "Semanas Asignadas": p.weeks,
            "Comisión (%)": p.commission,
            "Costo Total": p.salary * p.weeks * (1 + p.commission / 100),
          }))
          shareCSV(personnelData, "nomina-proyecto.csv")
        } else {
          alert("No hay datos de nómina para compartir")
        }
        break
      case "expenses":
        if (expenses.length > 0) {
          const expensesData = expenses.map((e) => ({
            Tipo: e.type,
            Detalle: e.detail,
            Unidad: e.unit,
            "Costo Unitario": e.unitCost,
            Cantidad: e.quantity,
            "Total Estimado": e.total,
          }))
          shareCSV(expensesData, "gastos-proyecto.csv")
        } else {
          alert("No hay datos de gastos para compartir")
        }
        break
      case "budget-flow":
        if (budgetBlocks.length > 0) {
          const budgetData = budgetBlocks.map((b) => ({
            "Nombre del Bloque": b.name,
            Semanas: b.weeks,
            "Fecha Inicio": b.startDate,
            "Facturación Semanal": b.weeklyBilling,
            "Facturación Acumulada": b.monthlyAccumulated,
            "Margen Estimado (%)": b.estimatedMargin,
          }))
          shareCSV(budgetData, "flujo-presupuestal.csv")
        } else {
          alert("No hay datos de flujo presupuestal para compartir")
        }
        break
      case "summary":
        // Create summary data for sharing
        const summaryData = [
          {
            "Nombre del Proyecto": projectData.projectName || "Sin nombre",
            Gerente: projectData.manager || "Sin asignar",
            "Duración (semanas)": projectData.duration || 0,
            "Total Nómina": personnel.reduce((sum, p) => sum + p.salary * p.weeks * (1 + p.commission / 100), 0),
            "Total Gastos": expenses.reduce((sum, e) => sum + e.total, 0),
            "Facturación Total": 1750000,
            "Utilidad Estimada":
              1750000 -
              (personnel.reduce((sum, p) => sum + p.salary * p.weeks * (1 + p.commission / 100), 0) +
                expenses.reduce((sum, e) => sum + e.total, 0) +
                84000),
            "Margen Estimado (%)": 40,
          },
        ]
        shareCSV(summaryData, "resumen-proyecto.csv")
        break
      default:
        alert("Selecciona una sección para compartir sus datos")
    }
  }

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Calculator className="h-6 w-6 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900">Presupuesto de Proyecto</h1>
          </div>
          <Badge variant="outline" className="text-sm">
            {getTabDisplayName(currentTab)}
          </Badge>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-2">
            <span className="text-sm text-gray-500">Progreso:</span>
            <Progress value={completionPercentage} className="w-24" />
            <span className="text-sm font-medium">{completionPercentage}%</span>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleSave} disabled={isSaving}>
              <Save className="h-4 w-4 mr-1" />
              {isSaving ? "Guardando..." : "Guardar"}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-1" />
                  Exportar
                  <ChevronDown className="h-3 w-3 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => handleExport("current-tab")}>
                  <FileText className="h-4 w-4 mr-2" />
                  Exportar {getTabDisplayName(currentTab)}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("personnel")}>
                  <FileText className="h-4 w-4 mr-2" />
                  Exportar Nómina
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("expenses")}>
                  <FileText className="h-4 w-4 mr-2" />
                  Exportar Gastos
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("summary")}>
                  <FileText className="h-4 w-4 mr-2" />
                  Exportar Resumen Completo
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-1" />
              Compartir
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          <span className="font-medium">{projectName}</span>
          <span className="mx-2">•</span>
          <span>Última modificación: {new Date().toLocaleDateString("es-ES")}</span>
        </div>
        <div className="flex items-center space-x-2">
          <FileText className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-500">Borrador automático guardado</span>
        </div>
      </div>
    </div>
  )
}
