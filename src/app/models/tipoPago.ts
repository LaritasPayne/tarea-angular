export const $tipoPago: { [key: string]: string } = {
    "FA": "Factura",
    "BBVA-D": "BBVA Bancomer Depósito",
    "BBVA-T": "BBVA Bancomer Transferencia",
    "BMX-D": "CitiBanamex Depósito",
    "BMX-T": "CitiBanamex Transferencia",
    "CRE": "Crédito",
    "ACE": "Uso interno",
    "COR": "Cortesía",
    "CHG": "Cambio de equipo",
    "": ""
}

export const $tipoPagoOrden: { [key: string]: number } = {
  "FA": 4,
  "BBVA-D": 0,
  "BBVA-T": 1,
  "BMX-D": 2,
  "BMX-T": 3,
  "CRE": 5,
  "ACE": 6,
  "COR": 7,
  "CHG": 8,
  "": 99
}
