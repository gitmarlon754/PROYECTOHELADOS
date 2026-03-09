export interface ItemVentaRequest {
    productoId: number;
    cantidad: number;
}

export interface CrearVentaRequest {
    sedeId: number;
    items: ItemVentaRequest[];
}