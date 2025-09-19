"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Trash2, Edit } from "lucide-react"

interface PersonnelItem {
  id: number
  role: string
  salary: number
  weeks: number
  commission: number
}

interface PersonnelSectionProps {
  personnel: PersonnelItem[]
  setPersonnel: (personnel: PersonnelItem[]) => void
}

export function PersonnelSection({ personnel, setPersonnel }: PersonnelSectionProps) {
  const [editingId, setEditingId] = useState<number | null>(null)
  const [newMember, setNewMember] = useState({
    role: "",
    salary: 0,
    weeks: 12,
    commission: 0,
  })

  const addMember = () => {
    if (newMember.role && newMember.salary > 0) {
      const newId = Math.max(...personnel.map((p) => p.id), 0) + 1
      setPersonnel([...personnel, { ...newMember, id: newId }])
      setNewMember({ role: "", salary: 0, weeks: 12, commission: 0 })
    }
  }

  const deleteMember = (id: number) => {
    setPersonnel(personnel.filter((p) => p.id !== id))
  }

  const updateMember = (id: number, field: string, value: string | number) => {
    setPersonnel(personnel.map((p) => (p.id === id ? { ...p, [field]: value } : p)))
  }

  const calculateTotal = (salary: number, weeks: number, commission: number) => {
    return salary * weeks * (1 + commission / 100)
  }

  const totalCost = personnel.reduce((sum, p) => sum + calculateTotal(p.salary, p.weeks, p.commission), 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nómina del Proyecto</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Personnel Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rol</TableHead>
                <TableHead>Salario Base</TableHead>
                <TableHead>Semanas asignadas</TableHead>
                <TableHead>Comisión (%)</TableHead>
                <TableHead>Costo total</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {personnel.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    {editingId === member.id ? (
                      <Input
                        value={member.role}
                        onChange={(e) => updateMember(member.id, "role", e.target.value)}
                        className="w-full"
                      />
                    ) : (
                      member.role
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === member.id ? (
                      <Input
                        type="number"
                        value={member.salary}
                        onChange={(e) => updateMember(member.id, "salary", Number.parseInt(e.target.value))}
                        className="w-full"
                      />
                    ) : (
                      `$${member.salary.toLocaleString()}`
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === member.id ? (
                      <Input
                        type="number"
                        value={member.weeks}
                        onChange={(e) => updateMember(member.id, "weeks", Number.parseInt(e.target.value))}
                        className="w-full"
                      />
                    ) : (
                      member.weeks
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === member.id ? (
                      <Input
                        type="number"
                        value={member.commission}
                        onChange={(e) => updateMember(member.id, "commission", Number.parseFloat(e.target.value))}
                        className="w-full"
                      />
                    ) : (
                      `${member.commission}%`
                    )}
                  </TableCell>
                  <TableCell className="font-medium">
                    ${calculateTotal(member.salary, member.weeks, member.commission).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      {editingId === member.id ? (
                        <Button size="sm" onClick={() => setEditingId(null)}>
                          Guardar
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline" onClick={() => setEditingId(member.id)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                      <Button size="sm" variant="destructive" onClick={() => deleteMember(member.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Add New Member Form */}
        <Card className="bg-gray-50">
          <CardHeader>
            <CardTitle className="text-lg">Agregar Integrante</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="newRole">Rol</Label>
                <Input
                  id="newRole"
                  value={newMember.role}
                  onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                  placeholder="Ej: Desarrollador Sr"
                />
              </div>
              <div>
                <Label htmlFor="newSalary">Salario Base</Label>
                <Input
                  id="newSalary"
                  type="number"
                  value={newMember.salary}
                  onChange={(e) => setNewMember({ ...newMember, salary: Number.parseInt(e.target.value) })}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="newWeeks">Semanas</Label>
                <Input
                  id="newWeeks"
                  type="number"
                  value={newMember.weeks}
                  onChange={(e) => setNewMember({ ...newMember, weeks: Number.parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="newCommission">Comisión (%)</Label>
                <Input
                  id="newCommission"
                  type="number"
                  step="0.1"
                  value={newMember.commission}
                  onChange={(e) => setNewMember({ ...newMember, commission: Number.parseFloat(e.target.value) })}
                  placeholder="0"
                />
              </div>
            </div>
            <Button onClick={addMember} className="mt-4">
              <Plus className="h-4 w-4 mr-2" />
              Agregar integrante
            </Button>
          </CardContent>
        </Card>

        {/* Subtotal */}
        <div className="flex justify-end">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-lg font-semibold">Sub Total Nómina: ${totalCost.toLocaleString()}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
