"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Trash2, Edit } from "lucide-react"

interface ExpenseItem {
  id: number
  type: string
  detail: string
  unit: string
  unitCost: number
  quantity: number
  total: number
}

interface FlightItem {
  id: number
  role: string
  origin: string
  destination: string
  frequency: number
  authorizedAmount: number
  totalAmount: number
}

interface PerDiemItem {
  id: number
  role: string
  weeklyAmount: number
  weeks: number
  totalCost: number
}

interface InsuranceItem {
  id: number
  type: string
  role: string
  amount: number
}

interface ExpensesSectionProps {
  expenses: ExpenseItem[]
  setExpenses: (expenses: ExpenseItem[]) => void
  flights: FlightItem[]
  setFlights: (flights: FlightItem[]) => void
  perDiems: PerDiemItem[]
  setPerDiems: (perDiems: PerDiemItem[]) => void
  insurance: InsuranceItem[]
  setInsurance: (insurance: InsuranceItem[]) => void
}

export function ExpensesSection({
  expenses,
  setExpenses,
  flights,
  setFlights,
  perDiems,
  setPerDiems,
  insurance,
  setInsurance,
}: ExpensesSectionProps) {
  const [editingId, setEditingId] = useState<number | null>(null)

  const [newExpense, setNewExpense] = useState({
    type: "",
    detail: "",
    unit: "",
    unitCost: 0,
    quantity: 0,
  })

  const [newFlight, setNewFlight] = useState({
    role: "",
    origin: "",
    destination: "",
    frequency: 0,
    authorizedAmount: 0,
  })

  const [newPerDiem, setNewPerDiem] = useState({
    role: "",
    weeklyAmount: 0,
    weeks: 0,
  })

  const [newInsurance, setNewInsurance] = useState({
    type: "",
    role: "",
    amount: 0,
  })

  const addExpense = () => {
    if (newExpense.type && newExpense.detail && newExpense.unitCost > 0) {
      const newId = Math.max(...expenses.map((e) => e.id), 0) + 1
      const total = newExpense.unitCost * newExpense.quantity
      setExpenses([...expenses, { ...newExpense, id: newId, total }])
      setNewExpense({ type: "", detail: "", unit: "", unitCost: 0, quantity: 0 })
    }
  }

  const deleteExpense = (id: number) => {
    setExpenses(expenses.filter((e) => e.id !== id))
  }

  const updateExpense = (id: number, field: string, value: string | number) => {
    setExpenses(
      expenses.map((e) => {
        if (e.id === id) {
          const updated = { ...e, [field]: value }
          if (field === "unitCost" || field === "quantity") {
            updated.total = updated.unitCost * updated.quantity
          }
          return updated
        }
        return e
      }),
    )
  }

  const addFlight = () => {
    if (newFlight.role && newFlight.origin && newFlight.destination) {
      const newId = Math.max(...flights.map((f) => f.id), 0) + 1
      const totalAmount = newFlight.frequency * newFlight.authorizedAmount
      setFlights([...flights, { ...newFlight, id: newId, totalAmount }])
      setNewFlight({ role: "", origin: "", destination: "", frequency: 0, authorizedAmount: 0 })
    }
  }

  const addPerDiem = () => {
    if (newPerDiem.role && newPerDiem.weeklyAmount > 0) {
      const newId = Math.max(...perDiems.map((p) => p.id), 0) + 1
      const totalCost = newPerDiem.weeklyAmount * newPerDiem.weeks
      setPerDiems([...perDiems, { ...newPerDiem, id: newId, totalCost }])
      setNewPerDiem({ role: "", weeklyAmount: 0, weeks: 0 })
    }
  }

  const addInsurance = () => {
    if (newInsurance.type && newInsurance.role && newInsurance.amount > 0) {
      const newId = Math.max(...insurance.map((i) => i.id), 0) + 1
      setInsurance([...insurance, { ...newInsurance, id: newId }])
      setNewInsurance({ type: "", role: "", amount: 0 })
    }
  }

  const expensesTotal = expenses.reduce((sum, e) => sum + e.total, 0)
  const flightsTotal = flights.reduce((sum, f) => sum + f.totalAmount, 0)
  const perDiemsTotal = perDiems.reduce((sum, p) => sum + p.totalCost, 0)
  const insuranceTotal = insurance.reduce((sum, i) => sum + i.amount, 0)
  const grandTotal = expensesTotal + flightsTotal + perDiemsTotal + insuranceTotal

  return (
    <div className="space-y-6">
      <Tabs defaultValue="general-expenses" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general-expenses">Gastos Generales</TabsTrigger>
          <TabsTrigger value="flights">Vuelos</TabsTrigger>
          <TabsTrigger value="per-diems">Per Diems</TabsTrigger>
          <TabsTrigger value="insurance">Seguros</TabsTrigger>
        </TabsList>

        <TabsContent value="general-expenses">
          <Card>
            <CardHeader>
              <CardTitle>Gastos Generales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Detalle</TableHead>
                      <TableHead>Unidad</TableHead>
                      <TableHead>Costo Unitario</TableHead>
                      <TableHead>Cantidad</TableHead>
                      <TableHead>Total Estimado</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {expenses.map((expense) => (
                      <TableRow key={expense.id}>
                        <TableCell>
                          {editingId === expense.id ? (
                            <Input
                              value={expense.type}
                              onChange={(e) => updateExpense(expense.id, "type", e.target.value)}
                            />
                          ) : (
                            expense.type
                          )}
                        </TableCell>
                        <TableCell>
                          {editingId === expense.id ? (
                            <Input
                              value={expense.detail}
                              onChange={(e) => updateExpense(expense.id, "detail", e.target.value)}
                            />
                          ) : (
                            expense.detail
                          )}
                        </TableCell>
                        <TableCell>
                          {editingId === expense.id ? (
                            <Input
                              value={expense.unit}
                              onChange={(e) => updateExpense(expense.id, "unit", e.target.value)}
                            />
                          ) : (
                            expense.unit
                          )}
                        </TableCell>
                        <TableCell>
                          {editingId === expense.id ? (
                            <Input
                              type="number"
                              value={expense.unitCost}
                              onChange={(e) => updateExpense(expense.id, "unitCost", Number.parseInt(e.target.value))}
                            />
                          ) : (
                            `$${expense.unitCost.toLocaleString()}`
                          )}
                        </TableCell>
                        <TableCell>
                          {editingId === expense.id ? (
                            <Input
                              type="number"
                              value={expense.quantity}
                              onChange={(e) => updateExpense(expense.id, "quantity", Number.parseInt(e.target.value))}
                            />
                          ) : (
                            expense.quantity
                          )}
                        </TableCell>
                        <TableCell className="font-medium">${expense.total.toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            {editingId === expense.id ? (
                              <Button size="sm" onClick={() => setEditingId(null)}>
                                Guardar
                              </Button>
                            ) : (
                              <Button size="sm" variant="outline" onClick={() => setEditingId(expense.id)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                            )}
                            <Button size="sm" variant="destructive" onClick={() => deleteExpense(expense.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <Card className="bg-gray-50">
                <CardHeader>
                  <CardTitle className="text-lg">Agregar Gasto</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    <div>
                      <Label htmlFor="newType">Tipo</Label>
                      <Select
                        value={newExpense.type}
                        onValueChange={(value) => setNewExpense({ ...newExpense, type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Transporte">Transporte</SelectItem>
                          <SelectItem value="Hospedaje">Hospedaje</SelectItem>
                          <SelectItem value="Comunicación">Comunicación</SelectItem>
                          <SelectItem value="Alimentación">Alimentación</SelectItem>
                          <SelectItem value="Materiales">Materiales</SelectItem>
                          <SelectItem value="Otros">Otros</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="newDetail">Detalle</Label>
                      <Input
                        id="newDetail"
                        value={newExpense.detail}
                        onChange={(e) => setNewExpense({ ...newExpense, detail: e.target.value })}
                        placeholder="Descripción del gasto"
                      />
                    </div>
                    <div>
                      <Label htmlFor="newUnit">Unidad</Label>
                      <Input
                        id="newUnit"
                        value={newExpense.unit}
                        onChange={(e) => setNewExpense({ ...newExpense, unit: e.target.value })}
                        placeholder="Ej: Viaje, Mes, Día"
                      />
                    </div>
                    <div>
                      <Label htmlFor="newUnitCost">Costo Unitario</Label>
                      <Input
                        id="newUnitCost"
                        type="number"
                        value={newExpense.unitCost}
                        onChange={(e) => setNewExpense({ ...newExpense, unitCost: Number.parseInt(e.target.value) })}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="newQuantity">Cantidad</Label>
                      <Input
                        id="newQuantity"
                        type="number"
                        value={newExpense.quantity}
                        onChange={(e) => setNewExpense({ ...newExpense, quantity: Number.parseInt(e.target.value) })}
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <Button onClick={addExpense} className="mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar gasto
                  </Button>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-lg font-semibold">Sub Total Gastos: ${expensesTotal.toLocaleString()}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="flights">
          <Card>
            <CardHeader>
              <CardTitle>Vuelos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rol</TableHead>
                      <TableHead>Origen/Destino</TableHead>
                      <TableHead>Frecuencia</TableHead>
                      <TableHead>Monto Autorizado</TableHead>
                      <TableHead>Monto Total</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {flights.map((flight) => (
                      <TableRow key={flight.id}>
                        <TableCell>{flight.role}</TableCell>
                        <TableCell>{`${flight.origin} - ${flight.destination}`}</TableCell>
                        <TableCell>{flight.frequency}</TableCell>
                        <TableCell>${flight.authorizedAmount.toLocaleString()}</TableCell>
                        <TableCell className="font-medium">${flight.totalAmount.toLocaleString()}</TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => setFlights(flights.filter((f) => f.id !== flight.id))}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <Card className="bg-gray-50">
                <CardHeader>
                  <CardTitle className="text-lg">Agregar Vuelo</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div>
                      <Label htmlFor="flightRole">Rol</Label>
                      <Input
                        id="flightRole"
                        value={newFlight.role}
                        onChange={(e) => setNewFlight({ ...newFlight, role: e.target.value })}
                        placeholder="Rol del empleado"
                      />
                    </div>
                    <div>
                      <Label htmlFor="flightOrigin">Origen</Label>
                      <Input
                        id="flightOrigin"
                        value={newFlight.origin}
                        onChange={(e) => setNewFlight({ ...newFlight, origin: e.target.value })}
                        placeholder="Ciudad origen"
                      />
                    </div>
                    <div>
                      <Label htmlFor="flightDestination">Destino</Label>
                      <Input
                        id="flightDestination"
                        value={newFlight.destination}
                        onChange={(e) => setNewFlight({ ...newFlight, destination: e.target.value })}
                        placeholder="Ciudad destino"
                      />
                    </div>
                    <div>
                      <Label htmlFor="flightFrequency">Frecuencia</Label>
                      <Input
                        id="flightFrequency"
                        type="number"
                        value={newFlight.frequency}
                        onChange={(e) => setNewFlight({ ...newFlight, frequency: Number.parseInt(e.target.value) })}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="flightAmount">Monto Autorizado</Label>
                      <Input
                        id="flightAmount"
                        type="number"
                        value={newFlight.authorizedAmount}
                        onChange={(e) =>
                          setNewFlight({ ...newFlight, authorizedAmount: Number.parseInt(e.target.value) })
                        }
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <Button onClick={addFlight} className="mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar vuelo
                  </Button>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-lg font-semibold">Sub Total Vuelos: ${flightsTotal.toLocaleString()}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="per-diems">
          <Card>
            <CardHeader>
              <CardTitle>Per Diems</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rol</TableHead>
                      <TableHead>Monto Semanal</TableHead>
                      <TableHead>Semanas</TableHead>
                      <TableHead>Costo Total</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {perDiems.map((perDiem) => (
                      <TableRow key={perDiem.id}>
                        <TableCell>{perDiem.role}</TableCell>
                        <TableCell>${perDiem.weeklyAmount.toLocaleString()}</TableCell>
                        <TableCell>{perDiem.weeks}</TableCell>
                        <TableCell className="font-medium">${perDiem.totalCost.toLocaleString()}</TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => setPerDiems(perDiems.filter((p) => p.id !== perDiem.id))}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <Card className="bg-gray-50">
                <CardHeader>
                  <CardTitle className="text-lg">Agregar Per Diem</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="perDiemRole">Rol</Label>
                      <Input
                        id="perDiemRole"
                        value={newPerDiem.role}
                        onChange={(e) => setNewPerDiem({ ...newPerDiem, role: e.target.value })}
                        placeholder="Rol del empleado"
                      />
                    </div>
                    <div>
                      <Label htmlFor="perDiemWeekly">Monto Semanal</Label>
                      <Input
                        id="perDiemWeekly"
                        type="number"
                        value={newPerDiem.weeklyAmount}
                        onChange={(e) =>
                          setNewPerDiem({ ...newPerDiem, weeklyAmount: Number.parseInt(e.target.value) })
                        }
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="perDiemWeeks">Semanas</Label>
                      <Input
                        id="perDiemWeeks"
                        type="number"
                        value={newPerDiem.weeks}
                        onChange={(e) => setNewPerDiem({ ...newPerDiem, weeks: Number.parseInt(e.target.value) })}
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <Button onClick={addPerDiem} className="mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar per diem
                  </Button>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-lg font-semibold">Sub Total Per Diems: ${perDiemsTotal.toLocaleString()}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insurance">
          <Card>
            <CardHeader>
              <CardTitle>Seguros</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Rol</TableHead>
                      <TableHead>Monto</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {insurance.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.type}</TableCell>
                        <TableCell>{item.role}</TableCell>
                        <TableCell className="font-medium">${item.amount.toLocaleString()}</TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => setInsurance(insurance.filter((i) => i.id !== item.id))}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <Card className="bg-gray-50">
                <CardHeader>
                  <CardTitle className="text-lg">Agregar Seguro</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="insuranceType">Tipo</Label>
                      <Select
                        value={newInsurance.type}
                        onValueChange={(value) => setNewInsurance({ ...newInsurance, type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Tipo de seguro" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Médico">Médico</SelectItem>
                          <SelectItem value="Vida">Vida</SelectItem>
                          <SelectItem value="Accidentes">Accidentes</SelectItem>
                          <SelectItem value="Responsabilidad Civil">Responsabilidad Civil</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="insuranceRole">Rol</Label>
                      <Input
                        id="insuranceRole"
                        value={newInsurance.role}
                        onChange={(e) => setNewInsurance({ ...newInsurance, role: e.target.value })}
                        placeholder="Rol o 'Todos'"
                      />
                    </div>
                    <div>
                      <Label htmlFor="insuranceAmount">Monto</Label>
                      <Input
                        id="insuranceAmount"
                        type="number"
                        value={newInsurance.amount}
                        onChange={(e) => setNewInsurance({ ...newInsurance, amount: Number.parseInt(e.target.value) })}
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <Button onClick={addInsurance} className="mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar seguro
                  </Button>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-lg font-semibold">Sub Total Seguros: ${insuranceTotal.toLocaleString()}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Grand Total */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-6">
          <div className="text-xl font-bold text-green-800">
            Total General de Gastos: ${grandTotal.toLocaleString()}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
