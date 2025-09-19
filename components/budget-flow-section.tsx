"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Trash2, Edit, Calendar } from "lucide-react"

interface BudgetBlock {
  id: number
  name: string
  weeks: number
  startDate: string
  weeklyBilling: number
  monthlyAccumulated: number
  estimatedMargin: number
}

interface BudgetFlowSectionProps {
  budgetBlocks: BudgetBlock[]
  setBudgetBlocks: (blocks: BudgetBlock[]) => void
}

export function BudgetFlowSection({ budgetBlocks, setBudgetBlocks }: BudgetFlowSectionProps) {
  const [editingId, setEditingId] = useState<number | null>(null)
  const [newBlock, setNewBlock] = useState({
    name: "",
    weeks: 0,
    startDate: "",
    weeklyBilling: 0,
    monthlyAccumulated: 0,
    estimatedMargin: 0,
  })

  const addBlock = () => {
    if (newBlock.name && newBlock.weeks > 0 && newBlock.startDate) {
      const newId = Math.max(...budgetBlocks.map((b) => b.id), 0) + 1
      setBudgetBlocks([...budgetBlocks, { ...newBlock, id: newId }])
      setNewBlock({
        name: "",
        weeks: 0,
        startDate: "",
        weeklyBilling: 0,
        monthlyAccumulated: 0,
        estimatedMargin: 0,
      })
    }
  }

  const deleteBlock = (id: number) => {
    setBudgetBlocks(budgetBlocks.filter((b) => b.id !== id))
  }

  const updateBlock = (id: number, field: string, value: string | number) => {
    setBudgetBlocks(budgetBlocks.map((b) => (b.id === id ? { ...b, [field]: value } : b)))
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const getWeekEndDate = (startDate: string, weeks: number) => {
    const start = new Date(startDate)
    const end = new Date(start.getTime() + weeks * 7 * 24 * 60 * 60 * 1000)
    return end.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const totalWeeklyBilling = budgetBlocks.reduce((sum, block) => sum + block.weeklyBilling, 0)
  const totalMonthlyAccumulated = budgetBlocks.reduce((sum, block) => sum + block.monthlyAccumulated, 0)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Flujo Presupuestal Proyectado
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Budget Flow Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre del Bloque</TableHead>
                  <TableHead>Semanas</TableHead>
                  <TableHead>Fecha Inicio</TableHead>
                  <TableHead>Fecha Fin</TableHead>
                  <TableHead>Facturación Semanal</TableHead>
                  <TableHead>Facturación Acumulada</TableHead>
                  <TableHead>Margen Estimado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {budgetBlocks.map((block) => (
                  <TableRow key={block.id}>
                    <TableCell>
                      {editingId === block.id ? (
                        <Input
                          value={block.name}
                          onChange={(e) => updateBlock(block.id, "name", e.target.value)}
                          className="w-full"
                        />
                      ) : (
                        <div className="font-medium">{block.name}</div>
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === block.id ? (
                        <Input
                          type="number"
                          value={block.weeks}
                          onChange={(e) => updateBlock(block.id, "weeks", Number.parseInt(e.target.value))}
                          className="w-20"
                        />
                      ) : (
                        block.weeks
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === block.id ? (
                        <Input
                          type="date"
                          value={block.startDate}
                          onChange={(e) => updateBlock(block.id, "startDate", e.target.value)}
                          className="w-full"
                        />
                      ) : (
                        formatDate(block.startDate)
                      )}
                    </TableCell>
                    <TableCell>{getWeekEndDate(block.startDate, block.weeks)}</TableCell>
                    <TableCell>
                      {editingId === block.id ? (
                        <Input
                          type="number"
                          value={block.weeklyBilling}
                          onChange={(e) => updateBlock(block.id, "weeklyBilling", Number.parseInt(e.target.value))}
                          className="w-full"
                        />
                      ) : (
                        <div className="font-medium text-green-600">${block.weeklyBilling.toLocaleString()}</div>
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === block.id ? (
                        <Input
                          type="number"
                          value={block.monthlyAccumulated}
                          onChange={(e) => updateBlock(block.id, "monthlyAccumulated", Number.parseInt(e.target.value))}
                          className="w-full"
                        />
                      ) : (
                        <div className="font-medium text-blue-600">${block.monthlyAccumulated.toLocaleString()}</div>
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === block.id ? (
                        <Input
                          type="number"
                          step="0.1"
                          value={block.estimatedMargin}
                          onChange={(e) => updateBlock(block.id, "estimatedMargin", Number.parseFloat(e.target.value))}
                          className="w-20"
                        />
                      ) : (
                        <div className="font-medium text-purple-600">{block.estimatedMargin}%</div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {editingId === block.id ? (
                          <Button size="sm" onClick={() => setEditingId(null)}>
                            Guardar
                          </Button>
                        ) : (
                          <Button size="sm" variant="outline" onClick={() => setEditingId(block.id)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                        <Button size="sm" variant="destructive" onClick={() => deleteBlock(block.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Add New Block Form */}
          <Card className="bg-gray-50">
            <CardHeader>
              <CardTitle className="text-lg">Agregar Bloque</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="blockName">Nombre del Bloque</Label>
                  <Input
                    id="blockName"
                    value={newBlock.name}
                    onChange={(e) => setNewBlock({ ...newBlock, name: e.target.value })}
                    placeholder="Ej: Fase de Desarrollo"
                  />
                </div>
                <div>
                  <Label htmlFor="blockWeeks">Semanas</Label>
                  <Input
                    id="blockWeeks"
                    type="number"
                    value={newBlock.weeks}
                    onChange={(e) => setNewBlock({ ...newBlock, weeks: Number.parseInt(e.target.value) })}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="blockStartDate">Fecha Inicio</Label>
                  <Input
                    id="blockStartDate"
                    type="date"
                    value={newBlock.startDate}
                    onChange={(e) => setNewBlock({ ...newBlock, startDate: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="blockWeeklyBilling">Facturación Semanal</Label>
                  <Input
                    id="blockWeeklyBilling"
                    type="number"
                    value={newBlock.weeklyBilling}
                    onChange={(e) => setNewBlock({ ...newBlock, weeklyBilling: Number.parseInt(e.target.value) })}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="blockMonthlyAccumulated">Facturación Acumulada</Label>
                  <Input
                    id="blockMonthlyAccumulated"
                    type="number"
                    value={newBlock.monthlyAccumulated}
                    onChange={(e) => setNewBlock({ ...newBlock, monthlyAccumulated: Number.parseInt(e.target.value) })}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="blockMargin">Margen Estimado (%)</Label>
                  <Input
                    id="blockMargin"
                    type="number"
                    step="0.1"
                    value={newBlock.estimatedMargin}
                    onChange={(e) => setNewBlock({ ...newBlock, estimatedMargin: Number.parseFloat(e.target.value) })}
                    placeholder="0"
                  />
                </div>
              </div>
              <Button onClick={addBlock} className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Agregar bloque
              </Button>
            </CardContent>
          </Card>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-6">
                <div className="text-sm text-green-600 font-medium">Facturación Semanal Total</div>
                <div className="text-2xl font-bold text-green-800">${totalWeeklyBilling.toLocaleString()}</div>
              </CardContent>
            </Card>
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-6">
                <div className="text-sm text-blue-600 font-medium">Facturación Acumulada Total</div>
                <div className="text-2xl font-bold text-blue-800">${totalMonthlyAccumulated.toLocaleString()}</div>
              </CardContent>
            </Card>
          </div>

          {/* Timeline Visualization */}
          <Card>
            <CardHeader>
              <CardTitle>Cronograma de Facturación</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {budgetBlocks.map((block, index) => (
                  <div key={block.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{block.name}</div>
                      <div className="text-sm text-gray-500">
                        {formatDate(block.startDate)} - {getWeekEndDate(block.startDate, block.weeks)} ({block.weeks}{" "}
                        semanas)
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-green-600">${block.weeklyBilling.toLocaleString()}/semana</div>
                      <div className="text-sm text-gray-500">Margen: {block.estimatedMargin}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  )
}
