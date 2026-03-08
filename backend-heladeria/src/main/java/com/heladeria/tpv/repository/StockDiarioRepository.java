package com.heladeria.tpv.repository;

import com.heladeria.tpv.domain.entity.StockDiario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StockDiarioRepository extends JpaRepository<StockDiario, Long> {
    Optional<StockDiario> findByProductoId(Long productoId);
    List<StockDiario> findByStockLessThanEqual(Integer stock);
}
