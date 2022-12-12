export function extrackPoints(data: any): [number, number][] {
  if (!data) return []
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(data, "text/xml");
  const points = xmlDoc.getElementsByTagName("trkpt")
  const pointsArray = Array.from(points)
  const pointsCoordinates = pointsArray.map((point) => {
    return [parseFloat(point.getAttribute('lat') || ''), parseFloat(point.getAttribute('lon') || '')] as [number, number]
  })
  return pointsCoordinates
}
