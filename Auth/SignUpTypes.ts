/**
 * Define la forma de los datos del formulario de registro.
 */
export interface SignUpFormData {
  name: string;
  email: string;
  telefono: number;
  password: string;
  confirmPassword: string; // Se usa solo en el frontend para validación
}

/**
 * Define la forma de los datos que se enviarán al backend (sin el campo de confirmación).
 */
export interface SignUpPayload {
  name: string;
  email: string;
  telefono: number;
  password: string;
}