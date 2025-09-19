const shareCSV = (data: any[], filename = "shared.csv") => {
  if (!data || data.length === 0) {
    alert("No hay datos para compartir")
    return
  }

  const csvContent = [
    Object.keys(data[0]).join(","), // cabecera
    ...data.map((row) =>
      Object.values(row)
        .map((value) =>
          // Escape commas and quotes in CSV values
          typeof value === "string" && (value.includes(",") || value.includes('"'))
            ? `"${value.replace(/"/g, '""')}"`
            : value,
        )
        .join(","),
    ), // filas
  ].join("\n")

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })

  // Crear un link temporal
  const fakeLink = URL.createObjectURL(blob)

  // Copiar al portapapeles
  navigator.clipboard
    .writeText(fakeLink)
    .then(() => {
      alert("🔗 Link de archivo CSV copiado al portapapeles (simulación)")
    })
    .catch(() => {
      // Fallback if clipboard API fails
      alert("🔗 Link generado: " + fakeLink)
    })
}

export { shareCSV }
