package com.heladeria.tpv.service;

import com.heladeria.tpv.domain.entity.Inventario;
import com.heladeria.tpv.domain.entity.Sede;
import com.heladeria.tpv.domain.entity.VarianteProducto;

import java.util.List;

public interface InventarioService {
    void descontarStock(VarianteProducto variante, Sede sede, int cantidad);

    List<Inventario> inventarioPorSede(Long sedeId);

    Inventario actualizarStock(Long productoId, Long sedeId, Integer cantidad);
}

