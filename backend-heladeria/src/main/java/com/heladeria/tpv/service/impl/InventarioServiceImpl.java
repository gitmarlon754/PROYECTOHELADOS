package com.heladeria.tpv.service.impl;

import com.heladeria.tpv.domain.entity.Inventario;
import com.heladeria.tpv.domain.entity.Sede;
import com.heladeria.tpv.domain.entity.VarianteProducto;
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
    public Inventario actualizarStock(Long varianteId, Long sedeId, Integer cantidad) {

        Inventario inv = repository
                .findByVarianteProducto_IdAndSede_Id(varianteId, sedeId)
                .orElseThrow(() -> new RuntimeException("Inventario no encontrado"));

        inv.setCantidad(cantidad);
        return repository.save(inv);
    }

    @Override
    public void descontarStock(VarianteProducto variante, Sede sede, int cantidad) {

        Inventario inventario = repository
                .findByVarianteProductoAndSede(variante, sede)
                .orElseThrow(() -> new RuntimeException("No hay stock registrado para esta variante en esta sede"));

        if (inventario.getCantidad() < cantidad) {
            throw new RuntimeException("Stock insuficiente");
        }

        inventario.setCantidad(inventario.getCantidad() - cantidad);

        repository.save(inventario);
    }
}