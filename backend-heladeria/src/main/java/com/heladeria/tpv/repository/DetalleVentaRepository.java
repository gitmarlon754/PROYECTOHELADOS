package com.heladeria.tpv.repository;

import com.heladeria.tpv.domain.entity.DetalleVenta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface DetalleVentaRepository extends JpaRepository<DetalleVenta, Long> {

    @Query("""
        SELECT d
        FROM DetalleVenta d
        WHERE d.venta.fecha BETWEEN :inicio AND :fin
    """)
    List<DetalleVenta> reporteVentas(
            @Param("inicio") LocalDateTime inicio,
            @Param("fin") LocalDateTime fin
    );
}
