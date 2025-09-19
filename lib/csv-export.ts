import saveAs from "file-saver"

// Generic CSV export function
export const exportToCSV = (data: any[], filename = "export.csv") => {
  if (!data || data.length === 0) {
    console.warn("No data to export")
    return
  }

  const csvContent = [
    Object.keys(data[0]).join(","), // header
    ...data.map((row) =>
      Object.values(row)
        .map((value) =>
          // Escape commas and quotes in values
          typeof value === "string" && (value.includes(",") || value.includes('"'))
            ? `"${value.replace(/"/g, '""')}"`
            : value,
        )
        .join(","),
    ), // rows
  ].join("\n")

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  saveAs(blob, filename)
}

// Personnel data export
export const exportPersonnelToCSV = (personnel: any[]) => {
  const formattedData = personnel.map((person) => ({
    Rol: person.role,
    "Salario Base": person.salary,
    "Semanas Asignadas": person.weeks,
    "Comisión (%)": person.commission,
    "Costo Total": person.salary * person.weeks * (1 + person.commission / 100),
  }))

  exportToCSV(formattedData, "nomina-proyecto.csv")
}

// Expenses data export
export const exportExpensesToCSV = (expenses: any[]) => {
  const formattedData = expenses.map((expense) => ({
    Tipo: expense.type,
    Detalle: expense.detail,
    Unidad: expense.unit,
    "Costo Unitario": expense.unitCost,
    Cantidad: expense.quantity,
    "Total Estimado": expense.total,
  }))

  exportToCSV(formattedData, "gastos-proyecto.csv")
}

// Flights data export
export const exportFlightsToCSV = (flights: any[]) => {
  const formattedData = flights.map((flight) => ({
    Rol: flight.role,
    Origen: flight.origin,
    Destino: flight.destination,
    Frecuencia: flight.frequency,
    "Monto Autorizado": flight.authorizedAmount,
    "Monto Total": flight.totalAmount,
  }))

  exportToCSV(formattedData, "vuelos-proyecto.csv")
}

// Per diems data export
export const exportPerDiemsToCSV = (perDiems: any[]) => {
  const formattedData = perDiems.map((perDiem) => ({
    Rol: perDiem.role,
    "Monto Semanal": perDiem.weeklyAmount,
    Semanas: perDiem.weeks,
    "Costo Total": perDiem.totalCost,
  }))

  exportToCSV(formattedData, "per-diems-proyecto.csv")
}

// Insurance data export
export const exportInsuranceToCSV = (insurance: any[]) => {
  const formattedData = insurance.map((item) => ({
    Tipo: item.type,
    Rol: item.role,
    Monto: item.amount,
  }))

  exportToCSV(formattedData, "seguros-proyecto.csv")
}

// Complete project summary export
export const exportProjectSummaryToCSV = (personnel: any[], expenses: any[], projectData: any) => {
  const personnelTotal = personnel.reduce((sum, p) => sum + p.salary * p.weeks * (1 + p.commission / 100), 0)
  const expensesTotal = expenses.reduce((sum, e) => sum + e.total, 0)

  const summaryData = [
    {
      Concepto: "Nómina Total",
      Monto: personnelTotal,
      Porcentaje: "N/A",
    },
    {
      Concepto: "Gastos Total",
      Monto: expensesTotal,
      Porcentaje: "N/A",
    },
    {
      Concepto: "Total Proyecto",
      Monto: personnelTotal + expensesTotal,
      Porcentaje: "100%",
    },
  ]

  exportToCSV(summaryData, `resumen-${projectData.projectName.replace(/\s+/g, "-").toLowerCase()}.csv`)
}
