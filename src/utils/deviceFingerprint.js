/**
 * Device Fingerprint Generator
 * Genera un identificador único para el dispositivo/navegador
 */

export const getDeviceFingerprint = () => {
  // Verificar si ya existe en localStorage
  const existingFingerprint = localStorage.getItem('deviceFingerprint');
  if (existingFingerprint) {
    return existingFingerprint;
  }

  // Generar nuevo fingerprint basado en características del navegador
  const components = [
    navigator.userAgent,
    navigator.language,
    new Date().getTimezoneOffset(),
    screen.width + 'x' + screen.height,
    screen.colorDepth,
    navigator.hardwareConcurrency || 'unknown',
    navigator.platform
  ];

  // Crear hash simple
  const fingerprint = btoa(components.join('|')) + '_' + Date.now();

  // Guardar en localStorage
  localStorage.setItem('deviceFingerprint', fingerprint);

  return fingerprint;
};

export const clearDeviceFingerprint = () => {
  localStorage.removeItem('deviceFingerprint');
};
