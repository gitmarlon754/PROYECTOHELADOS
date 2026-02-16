package com.heladeria.tpv.service.impl;

import com.heladeria.tpv.domain.entity.Inventario;
import com.heladeria.tpv.repository.InventarioRepository;
import com.heladeria.tpv.service.InventarioService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InventarioServiceImpl implements InventarioService {

    private final InventarioRepository repository;

    public InventarioServiceImpl(InventarioRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<Inventario> inventarioPorSede(Long sedeId) {
        return repository.findBySede_Id(sedeId);
    }

    @Override
    public Inventario actualizarStock(Long productoId, Long sedeId, Integer cantidad) {

        Inventario inv = repository
                .findByProducto_IdAndSede_Id(productoId, sedeId)
                .orElseThrow(() -> new RuntimeException("Inventario no encontrado"));

        inv.setCantidad(cantidad);
        return repository.save(inv);
    }
}

