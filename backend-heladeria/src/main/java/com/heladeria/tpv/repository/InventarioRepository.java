package com.heladeria.tpv.repository;

import com.heladeria.tpv.domain.entity.Inventario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface InventarioRepository extends JpaRepository<Inventario, Long> {

    List<Inventario> findBySede_Id(Long sedeId);

    Optional<Inventario> findByProducto_IdAndSede_Id(Long productoId, Long sedeId);
}
