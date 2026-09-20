export interface InterfaceHabitaciones{
    id: number | string,
    numero: string,
    tipo: string,
    capacidad: number,
    precio_noche: number,
    estado: 'Disponible'| 'Ocupada'| 'Mantenimiento',
    descripcion: string,

}