export interface Usuario {
  id?: number;
  id_rol: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  clave_acceso: string;
  fecha_registro: string;
}
