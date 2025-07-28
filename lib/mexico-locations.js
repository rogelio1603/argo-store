// Mexican states and cities data
export const mexicanStates = [
  { id: 'AGU', name: 'Aguascalientes' },
  { id: 'BCN', name: 'Baja California' },
  { id: 'BCS', name: 'Baja California Sur' },
  { id: 'CAM', name: 'Campeche' },
  { id: 'CHP', name: 'Chiapas' },
  { id: 'CHH', name: 'Chihuahua' },
  { id: 'CMX', name: 'Ciudad de México' },
  { id: 'COA', name: 'Coahuila' },
  { id: 'COL', name: 'Colima' },
  { id: 'DUR', name: 'Durango' },
  { id: 'GUA', name: 'Guanajuato' },
  { id: 'GRO', name: 'Guerrero' },
  { id: 'HID', name: 'Hidalgo' },
  { id: 'JAL', name: 'Jalisco' },
  { id: 'MEX', name: 'México' },
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

// Cities by state (most important cities for each state)
export const citiesByState = {
  'AGU': ['Aguascalientes', 'Jesús María', 'Calvillo', 'Rincón de Romos'],
  'BCN': ['Tijuana', 'Mexicali', 'Ensenada', 'Tecate', 'Playas de Rosarito'],
  'BCS': ['La Paz', 'Los Cabos', 'Comondú', 'Mulegé', 'Loreto'],
  'CAM': ['Campeche', 'Carmen', 'Champotón', 'Escárcega'],
  'CHP': ['Tuxtla Gutiérrez', 'San Cristóbal de las Casas', 'Tapachula', 'Comitán', 'Palenque'],
  'CHH': ['Chihuahua', 'Ciudad Juárez', 'Hidalgo del Parral', 'Cuauhtémoc', 'Delicias'],
  'CMX': ['Álvaro Obregón', 'Azcapotzalco', 'Benito Juárez', 'Coyoacán', 'Cuauhtémoc', 'Gustavo A. Madero', 'Iztacalco', 'Iztapalapa', 'La Magdalena Contreras', 'Miguel Hidalgo', 'Milpa Alta', 'Tláhuac', 'Tlalpan', 'Venustiano Carranza', 'Xochimilco'],
  'COA': ['Saltillo', 'Torreón', 'Monclova', 'Piedras Negras', 'Acuña'],
  'COL': ['Colima', 'Villa de Álvarez', 'Manzanillo', 'Tecomán'],
  'DUR': ['Durango', 'Gómez Palacio', 'Lerdo', 'Santiago Papasquiaro'],
  'GUA': ['León', 'Irapuato', 'Celaya', 'Salamanca', 'Guanajuato'],
  'GRO': ['Acapulco', 'Chilpancingo', 'Iguala', 'Taxco', 'Zihuatanejo'],
  'HID': ['Pachuca', 'Tulancingo', 'Huejutla', 'Ixmiquilpan'],
  'JAL': ['Guadalajara', 'Zapopan', 'Tlaquepaque', 'Tonalá', 'Puerto Vallarta'],
  'MEX': ['Toluca', 'Ecatepec', 'Nezahualcóyotl', 'Naucalpan', 'Tlalnepantla'],
  'MIC': ['Morelia', 'Uruapan', 'Lázaro Cárdenas', 'Zamora', 'Apatzingán'],
  'MOR': ['Cuernavaca', 'Jiutepec', 'Temixco', 'Cuautla'],
  'NAY': ['Tepic', 'Bahía de Banderas', 'Compostela', 'Santiago Ixcuintla'],
  'NLE': ['Monterrey', 'Guadalupe', 'San Nicolás de los Garza', 'Apodaca', 'Santa Catarina'],
  'OAX': ['Oaxaca de Juárez', 'San Juan Bautista Tuxtepec', 'Juchitán', 'Salina Cruz'],
  'PUE': ['Puebla', 'Tehuacán', 'San Martín Texmelucan', 'Atlixco'],
  'QUE': ['Santiago de Querétaro', 'San Juan del Río', 'Corregidora', 'El Marqués'],
  'ROO': ['Cancún', 'Chetumal', 'Playa del Carmen', 'Cozumel'],
  'SLP': ['San Luis Potosí', 'Soledad de Graciano Sánchez', 'Ciudad Valles', 'Matehuala'],
  'SIN': ['Culiacán', 'Mazatlán', 'Los Mochis', 'Guasave'],
  'SON': ['Hermosillo', 'Ciudad Obregón', 'Nogales', 'San Luis Río Colorado'],
  'TAB': ['Villahermosa', 'Cárdenas', 'Comalcalco', 'Huimanguillo'],
  'TAM': ['Reynosa', 'Matamoros', 'Nuevo Laredo', 'Tampico', 'Ciudad Victoria'],
  'TLA': ['Tlaxcala', 'Apizaco', 'Huamantla', 'Chiautempan'],
  'VER': ['Veracruz', 'Xalapa', 'Coatzacoalcos', 'Córdoba', 'Orizaba'],
  'YUC': ['Mérida', 'Kanasín', 'Umán', 'Progreso'],
  'ZAC': ['Zacatecas', 'Guadalupe', 'Fresnillo', 'Río Grande']
}

// Get cities for a specific state
export const getCitiesForState = (stateId) => {
  return citiesByState[stateId] || []
}

// Validate Mexican postal code
export const isValidMexicanPostalCode = (postalCode) => {
  return /^\d{5}$/.test(postalCode)
}

// Validate Mexican phone number
export const isValidMexicanPhone = (phone) => {
  // Mexican phone numbers: 10 digits
  return /^\d{10}$/.test(phone.replace(/\s+/g, ''))
} 