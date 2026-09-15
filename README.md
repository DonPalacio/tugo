# Tugo

Crea Tugo, una aplicación web de finanzas personales para Colombia con una interfaz central tipo hoja de cálculo (Excel) para registrar transacciones.

Requisitos clave:
- Tabla editable tipo Excel con columnas exactas: Fecha, Medio (Bolsillos), Tipo (únicamente 'Ingreso' o 'Egreso'), Categoría, Descripción de la transacción, Tercero (entidad) y Valor (formato de moneda colombiana COP, ej. $ 800.000,00).
- Soporte para agregar, editar y eliminar filas fácilmente, con selector de fecha, dropdowns y badges de color.
- Gestión de 'Bolsillos' personalizables (ej. Nequi, Daviplata, Bancolombia, Efectivo) con asignación de color y visualización de saldos calculados.
- Gestión de Categorías de ingresos y egresos con asignación de color personalizado.
- Datos de ejemplo precargados:
  1) 14/04/2026 | Nequi | Ingreso | Ingreso Laboral | Salario quincenal | Triconsi | $ 800.000,00
  2) 15/04/2026 | Nequi | Egreso | Comida | Desayuno de Sofía | Sofía | $ 10.000,00
- Estilo: limpio, confiable y moderno con acentos en #d4edbc, negro y blanco. Mobile-first y completamente responsive en escritorio.
- Excluir estrictamente: login, pagos en línea, reportes, dashboard y modo oscuro.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/0a81e3e5-4f83-4f3d-b1c1-2289851ee6e2).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
