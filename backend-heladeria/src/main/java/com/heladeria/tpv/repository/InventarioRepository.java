package com.heladeria.tpv.repository;

import com.heladeria.tpv.domain.entity.Inventario;
import com.heladeria.tpv.domain.entity.VarianteProducto;
import com.heladeria.tpv.domain.entity.Sede;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface InventarioRepository extends JpaRepository<Inventario, Long> {

    List<Inventario> findBySede_Id(Long sedeId);

    Optional<Inventario> findByVarianteProducto_IdAndSede_Id(Long varianteId, Long sedeId);

    Optional<Inventario> findByVarianteProductoAndSede(VarianteProducto varianteProducto, Sede sede);

}