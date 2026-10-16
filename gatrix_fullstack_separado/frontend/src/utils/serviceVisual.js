const byCategory = {
  lavado: '/img/Imagen03.png',
  interior: '/img/Imagen04.png',
  detallado: '/img/Imagen05.png',
  mantenimiento: '/img/Imagen06.png',
  protección: '/img/Imagen07.png',
  proteccion: '/img/Imagen07.png'
}

export function getServiceImage(category = '') {
  return byCategory[String(category).trim().toLowerCase()] || '/img/Imagen08.png'
}
