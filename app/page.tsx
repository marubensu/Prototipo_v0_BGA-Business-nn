"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PersonnelSection } from "@/components/personnel-section"
import { ExpensesSection } from "@/components/expenses-section"
import { BudgetFlowSection } from "@/components/budget-flow-section"
import { ProjectSummary } from "@/components/project-summary"
import { NavigationHeader } from "@/components/navigation-header"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { exportPersonnelToCSV, exportExpensesToCSV, exportProjectSummaryToCSV } from "@/lib/csv-export"

export default function BudgetForm() {
  const [currentTab, setCurrentTab] = useState("personnel")
  const [projectData, setProjectData] = useState({
    companyName: "",
    projectName: "Implementación Módulo Finanzas",
    duration: 12,
    manager: "Juan Pérez",
    startDate: "2025-06-01",
    endDate: "2025-06-01",
  })

  const [personnel, setPersonnel] = useState([
    { id: 1, role: "Consultor Sr", salary: 55000, weeks: 12, commission: 0 },
    { id: 2, role: "Analista Jr", salary: 30000, weeks: 12, commission: 0 },
    { id: 3, role: "Gerente OP", salary: 25000, weeks: 12, commission: 0 },
  ])

  const [expenses, setExpenses] = useState([
    {
      id: 1,
      type: "Transporte",
      detail: "Avión / Taxi / Uber",
      unit: "Viaje",
      unitCost: 5000,
      quantity: 12,
      total: 60000,
    },
    { id: 2, type: "Hospedaje", detail: "Hotel", unit: "Semana", unitCost: 8000, quantity: 20, total: 160000 },
    {
      id: 3,
      type: "Comunicación",
      detail: "Teléfono e Internet",
      unit: "Mes",
      unitCost: 2500,
      quantity: 5,
      total: 12500,
    },
  ])

  const [budgetBlocks, setBudgetBlocks] = useState([
    {
      id: 1,
      name: "Implementación Módulo Finanzas",
      weeks: 12,
      startDate: "2025-01-01",
      weeklyBilling: 218750,
      monthlyAccumulated: 875000,
      estimatedMargin: 40,
    },
    {
      id: 2,
      name: "Capacitación y Soporte",
      weeks: 12,
      startDate: "2025-01-08",
      weeklyBilling: 218750,
      monthlyAccumulated: 875000,
      estimatedMargin: 35,
    },
  ])

  const [flights, setFlights] = useState([
    {
      id: 1,
      role: "Consultor Jr",
      origin: "Ciudad A",
      destination: "Ciudad B",
      frequency: 2,
      authorizedAmount: 5000,
      totalAmount: 10000,
    },
  ])

  const [perDiems, setPerDiems] = useState([
    { id: 1, role: "Consultor Jr", weeklyAmount: 1500, weeks: 8, totalCost: 12000 },
  ])

  const [insurance, setInsurance] = useState([{ id: 1, type: "Médico", role: "Todos", amount: 25000 }])

  const [showSuccessAlert, setShowSuccessAlert] = useState(false)

  const updateProjectData = (field: string, value: string | number) => {
    setProjectData((prev) => ({ ...prev, [field]: value }))
  }

  const handleExportData = (exportType: string) => {
    switch (exportType) {
      case "current-tab":
        if (currentTab === "personnel") {
          exportPersonnelToCSV(personnel)
        } else if (currentTab === "expenses") {
          exportExpensesToCSV(expenses)
        } else if (currentTab === "summary") {
          exportProjectSummaryToCSV(personnel, expenses, projectData)
        }
        break
      case "personnel":
        exportPersonnelToCSV(personnel)
        break
      case "expenses":
        exportExpensesToCSV(expenses)
        break
      case "summary":
        exportProjectSummaryToCSV(personnel, expenses, projectData)
        break
      default:
        console.warn("Unknown export type:", exportType)
    }
  }

  // Calculate completion percentage based on filled data
  const calculateCompletionPercentage = () => {
    let completed = 0
    const total = 4 // 4 main sections

    // Check if basic project data is filled
    if (projectData.companyName && projectData.projectName && projectData.manager) completed += 1

    // Check if personnel data exists
    if (personnel.length > 0) completed += 1

    // Check if expenses data exists
    if (expenses.length > 0) completed += 1

    // Always count summary as completed since it's calculated
    completed += 1

    return Math.round((completed / total) * 100)
  }

  const handleContinue = () => {
    setShowSuccessAlert(true)
    setTimeout(() => setShowSuccessAlert(false), 3000)
  }

  const completionPercentage = calculateCompletionPercentage()

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationHeader
        currentTab={currentTab}
        projectName={projectData.projectName}
        completionPercentage={completionPercentage}
        personnel={personnel}
        expenses={expenses}
        projectData={projectData}
        onExportData={handleExportData}
        budgetBlocks={budgetBlocks}
        flights={flights}
        perDiems={perDiems}
        insurance={insurance}
      />

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Success Alert */}
        {showSuccessAlert && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Presupuesto guardado exitosamente. Los datos han sido procesados correctamente.
            </AlertDescription>
          </Alert>
        )}

        {/* Validation Alert */}
        {!projectData.companyName && (
          <Alert className="bg-yellow-50 border-yellow-200">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              Por favor complete el nombre de la empresa para continuar con el presupuesto.
            </AlertDescription>
          </Alert>
        )}

        {/* General Project Data */}
        <Card className="shadow-sm">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardTitle className="text-blue-900">Datos Generales del Proyecto</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="companyName" className="text-sm font-medium text-gray-700">
                  Nombre de la empresa *
                </Label>
                <Input
                  id="companyName"
                  value={projectData.companyName}
                  onChange={(e) => updateProjectData("companyName", e.target.value)}
                  placeholder="Ingrese nombre de la empresa"
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="projectName" className="text-sm font-medium text-gray-700">
                  Nombre del Proyecto
                </Label>
                <Input
                  id="projectName"
                  value={projectData.projectName}
                  onChange={(e) => updateProjectData("projectName", e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="duration" className="text-sm font-medium text-gray-700">
                  Duración en semanas
                </Label>
                <Input
                  id="duration"
                  type="number"
                  value={projectData.duration}
                  onChange={(e) => updateProjectData("duration", Number.parseInt(e.target.value))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="manager" className="text-sm font-medium text-gray-700">
                  Gerente Responsable
                </Label>
                <Input
                  id="manager"
                  value={projectData.manager}
                  onChange={(e) => updateProjectData("manager", e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="startDate" className="text-sm font-medium text-gray-700">
                  Fecha estimada Inicio
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={projectData.startDate}
                  onChange={(e) => updateProjectData("startDate", e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="endDate" className="text-sm font-medium text-gray-700">
                  Fecha estimada Fin
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  value={projectData.endDate}
                  onChange={(e) => updateProjectData("endDate", e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white shadow-sm">
            <TabsTrigger value="personnel" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
              Nómina
            </TabsTrigger>
            <TabsTrigger value="expenses" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
              Gastos
            </TabsTrigger>
            <TabsTrigger
              value="budget-flow"
              className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
            >
              Flujo Presupuestal
            </TabsTrigger>
            <TabsTrigger value="summary" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
              Resumen
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personnel">
            <PersonnelSection personnel={personnel} setPersonnel={setPersonnel} />
          </TabsContent>

          <TabsContent value="expenses">
            <ExpensesSection
              expenses={expenses}
              setExpenses={setExpenses}
              flights={flights}
              setFlights={setFlights}
              perDiems={perDiems}
              setPerDiems={setPerDiems}
              insurance={insurance}
              setInsurance={setInsurance}
            />
          </TabsContent>

          <TabsContent value="budget-flow">
            <BudgetFlowSection budgetBlocks={budgetBlocks} setBudgetBlocks={setBudgetBlocks} />
          </TabsContent>

          <TabsContent value="summary">
            <ProjectSummary personnel={personnel} expenses={expenses} projectData={projectData} />
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="text-sm text-gray-600">
                <span className="font-medium">Progreso del presupuesto:</span> {completionPercentage}% completado
              </div>
              <div className="flex space-x-4">
                <Button variant="outline" size="lg">
                  Guardar Borrador
                </Button>
                <Button
                  size="lg"
                  onClick={handleContinue}
                  disabled={!projectData.companyName}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Continuar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
