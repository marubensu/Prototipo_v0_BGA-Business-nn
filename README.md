# Presupuesto de Proyecto - Prototipo Funcional

Un prototipo funcional navegable para la gestión de presupuestos de proyectos, desarrollado con React y Tailwind CSS. Esta aplicación permite crear, editar y gestionar presupuestos completos con múltiples secciones incluyendo nómina, gastos, flujo presupuestal y resúmenes financieros.

## 🚀 Características Principales

### ✅ Funcionalidades Implementadas

- **Gestión de Datos Generales**: Información básica del proyecto (empresa, nombre, duración, gerente, fechas)
- **Módulo de Nómina**: Gestión completa del personal del proyecto
  - Agregar, editar y eliminar integrantes del equipo
  - Cálculo automático de costos con comisiones
  - Roles personalizables y asignación de semanas
- **Gestión de Gastos**: Sistema completo de administración de gastos
  - Gastos generales (transporte, hospedaje, comunicación, etc.)
  - Gestión de vuelos con origen/destino y frecuencias
  - Per diems por rol y duración
  - Seguros con tipos y coberturas
- **Flujo Presupuestal**: Proyección temporal de ingresos
  - Bloques de facturación configurables
  - Cronograma visual de facturación
  - Cálculo de márgenes estimados
- **Resumen Ejecutivo**: Dashboard completo con métricas clave
  - Desglose visual de costos
  - Indicadores de rentabilidad
  - Progreso del proyecto

### 🎨 Características de UI/UX

- **Navegación por Pestañas**: Interfaz intuitiva con 4 secciones principales
- **Formularios Interactivos**: Todos los campos son editables y funcionales
- **Tablas Dinámicas**: Agregar, editar y eliminar filas en tiempo real
- **Validaciones**: Alertas y validaciones de campos requeridos
- **Diseño Responsivo**: Optimizado para desktop, tablet y móvil
- **Indicadores Visuales**: Barras de progreso, badges y alertas contextuales

## 🛠️ Tecnologías Utilizadas

- **Framework**: Next.js 14 (App Router)
- **UI Library**: React 18 con TypeScript
- **Estilos**: Tailwind CSS v4
- **Componentes**: shadcn/ui
- **Iconos**: Lucide React
- **Estado**: React Hooks (useState, useEffect)

## 📦 Instalación y Configuración

### Prerrequisitos

- Node.js 18+ 
- npm o yarn

### Pasos de Instalación

1. **Clonar o descargar el proyecto**
   \`\`\`bash
   # Si tienes acceso al repositorio
   git clone [URL_DEL_REPOSITORIO]
   cd budget-prototype
   \`\`\`

2. **Instalar dependencias**
   \`\`\`bash
   npm install
   # o
   yarn install
   \`\`\`

3. **Ejecutar en modo desarrollo**
   \`\`\`bash
   npm run dev
   # o
   yarn dev
   \`\`\`

4. **Abrir en el navegador**
   \`\`\`
   http://localhost:3000
   \`\`\`

### Scripts Disponibles

\`\`\`bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run start        # Servidor de producción
npm run lint         # Linter de código
\`\`\`

## 📁 Estructura del Proyecto

\`\`\`
budget-prototype/
├── app/
│   ├── globals.css          # Estilos globales y configuración Tailwind
│   ├── layout.tsx           # Layout principal de la aplicación
│   └── page.tsx             # Página principal con formulario de presupuesto
├── components/
│   ├── ui/                  # Componentes base de shadcn/ui
│   ├── personnel-section.tsx        # Gestión de nómina y personal
│   ├── expenses-section.tsx         # Gestión de gastos y viajes
│   ├── budget-flow-section.tsx      # Flujo presupuestal y cronograma
│   ├── project-summary.tsx          # Resumen ejecutivo y métricas
│   └── navigation-header.tsx        # Header con navegación y acciones
├── lib/
│   └── utils.ts             # Utilidades y helpers
└── README.md               # Este archivo
\`\`\`

### Componentes Principales

#### `app/page.tsx`
- Componente principal que orquesta toda la aplicación
- Maneja el estado global del proyecto
- Implementa la navegación por pestañas
- Controla validaciones y alertas

#### `components/personnel-section.tsx`
- Gestión completa del equipo del proyecto
- Tabla editable con roles, salarios y comisiones
- Formulario para agregar nuevos integrantes
- Cálculos automáticos de costos totales

#### `components/expenses-section.tsx`
- Sistema de pestañas para diferentes tipos de gastos
- Gestión de gastos generales, vuelos, per diems y seguros
- Formularios dinámicos para cada categoría
- Totalizadores automáticos por sección

#### `components/budget-flow-section.tsx`
- Creación de bloques de facturación temporal
- Cronograma visual de ingresos proyectados
- Cálculo de márgenes por bloque
- Visualización de timeline del proyecto

#### `components/project-summary.tsx`
- Dashboard ejecutivo con métricas clave
- Gráficos de barras de progreso para costos
- Indicadores de rentabilidad y márgenes
- Desglose detallado de todos los costos

#### `components/navigation-header.tsx`
- Header con información del proyecto actual
- Botones de acción (guardar, exportar, compartir)
- Indicador de progreso de completitud
- Estado de guardado automático

## 🔌 Integración con Backend

### Puntos de Conexión Recomendados

El prototipo está preparado para conectarse con un backend. Los principales endpoints que se necesitarían son:

#### API Endpoints Sugeridos

\`\`\`typescript
// Gestión de Proyectos
GET    /api/projects              # Listar proyectos
POST   /api/projects              # Crear proyecto
GET    /api/projects/:id          # Obtener proyecto específico
PUT    /api/projects/:id          # Actualizar proyecto
DELETE /api/projects/:id          # Eliminar proyecto

// Gestión de Personal
GET    /api/projects/:id/personnel    # Obtener personal del proyecto
POST   /api/projects/:id/personnel    # Agregar personal
PUT    /api/personnel/:id             # Actualizar personal
DELETE /api/personnel/:id             # Eliminar personal

// Gestión de Gastos
GET    /api/projects/:id/expenses     # Obtener gastos del proyecto
POST   /api/projects/:id/expenses     # Agregar gasto
PUT    /api/expenses/:id              # Actualizar gasto
DELETE /api/expenses/:id              # Eliminar gasto

// Reportes y Exportación
GET    /api/projects/:id/summary      # Resumen ejecutivo
GET    /api/projects/:id/export       # Exportar a PDF/Excel
\`\`\`

#### Estructura de Datos

\`\`\`typescript
// Interfaces TypeScript para el backend
interface Project {
  id: string
  companyName: string
  projectName: string
  duration: number
  manager: string
  startDate: string
  endDate: string
  createdAt: string
  updatedAt: string
}

interface PersonnelItem {
  id: number
  projectId: string
  role: string
  salary: number
  weeks: number
  commission: number
}

interface ExpenseItem {
  id: number
  projectId: string
  type: string
  detail: string
  unit: string
  unitCost: number
  quantity: number
  total: number
}
\`\`\`

### Modificaciones Necesarias para Backend

1. **Reemplazar useState con llamadas API**
   - Cambiar `useState` por `useEffect` + `fetch`
   - Implementar loading states
   - Agregar manejo de errores

2. **Implementar autenticación**
   - Sistema de login/logout
   - Protección de rutas
   - Manejo de tokens JWT

3. **Agregar persistencia**
   - Auto-guardado cada X segundos
   - Sincronización en tiempo real
   - Manejo de conflictos de concurrencia

## 🎯 Funcionalidades Adicionales Sugeridas

### Corto Plazo
- [ ] Exportación a PDF y Excel
- [ ] Sistema de plantillas de proyecto
- [ ] Historial de cambios y versiones
- [ ] Notificaciones y alertas automáticas

### Mediano Plazo
- [ ] Dashboard de múltiples proyectos
- [ ] Reportes comparativos
- [ ] Integración con sistemas contables
- [ ] API REST completa

### Largo Plazo
- [ ] Colaboración en tiempo real
- [ ] Aplicación móvil
- [ ] Inteligencia artificial para estimaciones
- [ ] Integración con herramientas de gestión de proyectos

## 🐛 Solución de Problemas

### Problemas Comunes

1. **Error de dependencias**
   \`\`\`bash
   rm -rf node_modules package-lock.json
   npm install
   \`\`\`

2. **Problemas de estilos Tailwind**
   - Verificar que `globals.css` esté importado correctamente
   - Revisar la configuración de Tailwind CSS v4

3. **Errores de TypeScript**
   - Verificar que todas las interfaces estén correctamente tipadas
   - Revisar imports de componentes

### Logs y Debugging

- Usar las herramientas de desarrollo del navegador
- Revisar la consola para errores de JavaScript
- Utilizar React Developer Tools para debugging de componentes

## 📄 Licencia

Este proyecto es un prototipo desarrollado para demostración. Consulte con el equipo de desarrollo para términos de uso y licenciamiento.

## 🤝 Contribución

Para contribuir al proyecto:

1. Fork del repositorio
2. Crear una rama para la nueva funcionalidad
3. Realizar los cambios y pruebas
4. Crear un Pull Request con descripción detallada

## 📞 Soporte

Para soporte técnico o consultas sobre el proyecto, contactar al equipo de desarrollo.

---

**Versión**: 1.0.0  
**Última actualización**: Enero 2025  
**Desarrollado con**: React + Next.js + Tailwind CSS
