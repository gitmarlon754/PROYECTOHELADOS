package com.heladeria.tpv.service;

import com.heladeria.tpv.domain.entity.Venta;
import java.util.List;

public interface VentaService {
    record LineaVenta(Long productoId, Integer cantidad, Double precioUnitario) {}

    List<Venta> listar();
    Venta registrar(double total, String metodoPago, List<LineaVenta> lineas);
}
