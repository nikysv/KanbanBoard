export default function handler(req, res) {
  const { id } = req.query;

  // Aquí deberías obtener el documento del almacenamiento temporal
  // Por ahora, solo devolvemos un error
  res.status(404).json({ error: "Documento no encontrado" });
}
