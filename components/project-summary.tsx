"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { DollarSign, Users, Calendar, TrendingUp } from "lucide-react"

interface PersonnelItem {
  id: number
  role: string
  salary: number
  weeks: number
  commission: number
}

interface ExpenseItem {
  id: number
  type: string
  detail: string
  unit: string
  unitCost: number
  quantity: number
  total: number
}

interface ProjectData {
  companyName: string
  projectName: string
  duration: number
  manager: string
  startDate: string
  endDate: string
}

interface ProjectSummaryProps {
  personnel: PersonnelItem[]
  expenses: ExpenseItem[]
  projectData: ProjectData
}

export function ProjectSummary({ personnel, expenses, projectData }: ProjectSummaryProps) {
  // Calculate totals
  const personnelTotal = personnel.reduce((sum, p) => sum + p.salary * p.weeks * (1 + p.commission / 100), 0)
  const expensesTotal = expenses.reduce((sum, e) => sum + e.total, 0)

  // Mock additional costs (from the original PDF)
  const flightsTotal = 25000
  const perDiemsTotal = 25000
  const insuranceTotal = 25000
  const commissionTotal = 9000

  const totalCosts = personnelTotal + expensesTotal + flightsTotal + perDiemsTotal + insuranceTotal + commissionTotal
  const totalRevenue = 1750000 // Mock revenue from budget flow
  const estimatedProfit = totalRevenue - totalCosts
  const profitMargin = totalRevenue > 0 ? (estimatedProfit / totalRevenue) * 100 : 0

  const costBreakdown = [
    { category: "Nómina", amount: personnelTotal, color: "bg-blue-500" },
    { category: "Gastos Generales", amount: expensesTotal, color: "bg-green-500" },
    { category: "Vuelos", amount: flightsTotal, color: "bg-yellow-500" },
    { category: "Per Diems", amount: perDiemsTotal, color: "bg-purple-500" },
    { category: "Seguros", amount: insuranceTotal, color: "bg-red-500" },
    { category: "Comisiones", amount: commissionTotal, color: "bg-orange-500" },
  ]

  return (
    <div className="space-y-6">
      {/* Project Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Resumen del Proyecto
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="text-sm text-gray-500">Proyecto</div>
              <div className="font-medium">{projectData.projectName}</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-gray-500">Gerente</div>
              <div className="font-medium">{projectData.manager}</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-gray-500">Duración</div>
              <Badge variant="secondary">{projectData.duration} semanas</Badge>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-gray-500">Equipo</div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span className="font-medium">{personnel.length} integrantes</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-blue-600 font-medium">Facturación Total</div>
                <div className="text-2xl font-bold text-blue-800">${totalRevenue.toLocaleString()}</div>
              </div>
              <DollarSign className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-red-600 font-medium">Costos Totales</div>
                <div className="text-2xl font-bold text-red-800">${totalCosts.toLocaleString()}</div>
              </div>
              <TrendingUp className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-green-600 font-medium">Utilidad Estimada</div>
                <div className="text-2xl font-bold text-green-800">${estimatedProfit.toLocaleString()}</div>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-purple-600 font-medium">Margen Estimado</div>
                <div className="text-2xl font-bold text-purple-800">{profitMargin.toFixed(1)}%</div>
              </div>
              <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white text-sm font-bold">
                %
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cost Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Desglose de Costos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {costBreakdown.map((item) => (
              <div key={item.category} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{item.category}</span>
                  <span className="text-sm font-bold">${item.amount.toLocaleString()}</span>
                </div>
                <Progress
                  value={(item.amount / totalCosts) * 100}
                  className="h-2"
                  style={{
                    background: `linear-gradient(to right, ${item.color.replace("bg-", "").replace("-500", "")} 0%, ${item.color.replace("bg-", "").replace("-500", "")} ${(item.amount / totalCosts) * 100}%, #e5e7eb ${(item.amount / totalCosts) * 100}%)`,
                  }}
                />
                <div className="text-xs text-gray-500">{((item.amount / totalCosts) * 100).toFixed(1)}% del total</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Breakdown Table */}
      <Card>
        <CardHeader>
          <CardTitle>Resumen Detallado</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="text-sm text-gray-500">Nómina</div>
                <div className="font-medium">${personnelTotal.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Gastos</div>
                <div className="font-medium">${expensesTotal.toLocaleString()}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="text-sm text-gray-500">Vuelos</div>
                <div className="font-medium">${flightsTotal.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Per Diems</div>
                <div className="font-medium">${perDiemsTotal.toLocaleString()}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="text-sm text-gray-500">Seguros</div>
                <div className="font-medium">${insuranceTotal.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Comisiones</div>
                <div className="font-medium">${commissionTotal.toLocaleString()}</div>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="grid grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg">
                <div>
                  <div className="text-sm text-blue-600 font-medium">Facturación Total</div>
                  <div className="text-lg font-bold text-blue-800">${totalRevenue.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-sm text-green-600 font-medium">Utilidad Estimada</div>
                  <div className="text-lg font-bold text-green-800">${estimatedProfit.toLocaleString()}</div>
                </div>
              </div>
            </div>

            <div className="text-center p-4 bg-green-100 rounded-lg">
              <div className="text-lg font-bold text-green-800">Margen Estimado: {profitMargin.toFixed(1)}%</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
