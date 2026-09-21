export interface Reserva {
  id?: number;
  id_usuario: number;
  id_habitacion: number;
  fecha_checkin: string;
  fecha_checkout: string;
  cantidad_huespedes: number;
  estado: string;
  precio_total: number;
}
