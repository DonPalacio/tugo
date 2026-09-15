# Tugo — finanzas personales con hoja de cálculo

Aplicación web de finanzas personales para Colombia. La pantalla principal es una tabla editable tipo Excel para registrar transacciones, más dos pantallas de configuración: Bolsillos y Categorías.

## Pantalla principal: Transacciones

Tabla con estas columnas exactas:

```text
Fecha | Medio (Bolsillos) | Tipo | Categoría | Descripción | Tercero | Valor
```

- Edición en celda: clic en cualquier celda para modificarla, sin abrir ventanas.
- Fecha: selector de calendario, formato 14/04/2026.
- Medio: lista de los bolsillos creados, con su color como distintivo.
- Tipo: solo "Ingreso" o "Egreso" (verde #d4edbc para ingreso, negro para egreso).
- Categoría: lista filtrada según el tipo elegido, con el color de la categoría.
- Descripción y Tercero: texto libre.
- Valor: formato de moneda colombiana, ej. `$ 800.000,00`; se escribe solo el número y se formatea al salir de la celda.
- Botón para agregar fila al final y botón de eliminar en cada fila.
- Fila de totales al pie: ingresos, egresos y saldo neto.

En móvil cada transacción se muestra como una tarjeta apilada, igual de editable; en escritorio se ve la tabla completa.

## Bolsillos

- Crear, renombrar, elegir color y eliminar bolsillos.
- Precargados: Nequi, Daviplata, Bancolombia, Efectivo.
- Cada bolsillo muestra su saldo calculado (ingresos menos egresos de sus transacciones).
- No se puede eliminar un bolsillo con transacciones asociadas.

## Categorías

- Listas separadas de categorías de Ingreso y de Egreso.
- Crear, renombrar, elegir color y eliminar.
- Precargadas: Ingreso Laboral (ingreso); Comida, Transporte, Servicios, Ocio (egreso).

## Datos de ejemplo

1. 14/04/2026 | Nequi | Ingreso | Ingreso Laboral | Salario quincenal | Triconsi | $ 800.000,00
2. 15/04/2026 | Nequi | Egreso | Comida | Desayuno de Sofía | Sofía | $ 10.000,00

## Estilo

Limpio, confiable y moderno: fondo blanco, texto y bordes negros finos tipo hoja de cálculo, acento verde #d4edbc en cabeceras, badges de ingreso y botones principales. Tipografía sans moderna. Sin modo oscuro. Mobile-first y responsive.

## Fuera de alcance

Sin inicio de sesión, sin pagos en línea, sin reportes, sin panel de indicadores, sin modo oscuro.

## Notas técnicas

- Rutas: `/` (transacciones), `/bolsillos`, `/categorias`, con navegación superior compartida.
- Estado en React con persistencia local del navegador (los datos quedan en el dispositivo); sin base de datos por ahora.
- Tokens de color en `src/styles.css` (acento `#d4edbc` como `--accent`), componentes shadcn existentes (Popover/Calendar, Select, Input, Badge, Button).
- Formato COP con `Intl.NumberFormat("es-CO")` y parseo inverso en un helper `src/lib/currency.ts`.
- `head()` propio por ruta con títulos y descripciones de Tugo.
