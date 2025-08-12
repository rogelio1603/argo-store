// Mexican states and cities data - 32 estados completos
export const mexicanStates = [
  { id: 'AGU', name: 'Aguascalientes' },
  { id: 'BCN', name: 'Baja California' },
  { id: 'BCS', name: 'Baja California Sur' },
  { id: 'CAM', name: 'Campeche' },
  { id: 'CHP', name: 'Chiapas' },
  { id: 'CHH', name: 'Chihuahua' },
  { id: 'CDMX', name: 'Ciudad de México' },
  { id: 'COA', name: 'Coahuila' },
  { id: 'COL', name: 'Colima' },
  { id: 'DUR', name: 'Durango' },
  { id: 'MEX', name: 'Estado de México' },
  { id: 'GUA', name: 'Guanajuato' },
  { id: 'GRO', name: 'Guerrero' },
  { id: 'HID', name: 'Hidalgo' },
  { id: 'JAL', name: 'Jalisco' },
  { id: 'MIC', name: 'Michoacán' },
  { id: 'MOR', name: 'Morelos' },
  { id: 'NAY', name: 'Nayarit' },
  { id: 'NLE', name: 'Nuevo León' },
  { id: 'OAX', name: 'Oaxaca' },
  { id: 'PUE', name: 'Puebla' },
  { id: 'QUE', name: 'Querétaro' },
  { id: 'ROO', name: 'Quintana Roo' },
  { id: 'SLP', name: 'San Luis Potosí' },
  { id: 'SIN', name: 'Sinaloa' },
  { id: 'SON', name: 'Sonora' },
  { id: 'TAB', name: 'Tabasco' },
  { id: 'TAM', name: 'Tamaulipas' },
  { id: 'TLA', name: 'Tlaxcala' },
  { id: 'VER', name: 'Veracruz' },
  { id: 'YUC', name: 'Yucatán' },
  { id: 'ZAC', name: 'Zacatecas' }
]

// Validate Mexican postal code
export const isValidMexicanPostalCode = (postalCode) => {
  return /^\d{5}$/.test(postalCode)
}

// Validate Mexican phone number
export const isValidMexicanPhone = (phone) => {
  // Mexican phone numbers: 10 digits
  return /^\d{10}$/.test(phone.replace(/\s+/g, ''))
} 