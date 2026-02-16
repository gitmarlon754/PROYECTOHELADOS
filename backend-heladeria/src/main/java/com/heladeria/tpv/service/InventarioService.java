package com.heladeria.tpv.service;

import com.heladeria.tpv.domain.entity.Inventario;
import java.util.List;

public interface InventarioService {

    List<Inventario> inventarioPorSede(Long sedeId);

    Inventario actualizarStock(Long productoId, Long sedeId, Integer cantidad);
}

