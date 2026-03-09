package com.heladeria.tpv.service;

import java.util.List;
import com.heladeria.tpv.domain.entity.Venta;

public interface VentaService {

    List<Venta> listar();

    Venta guardar(Venta venta);
}