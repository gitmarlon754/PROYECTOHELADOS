package com.heladeria.tpv.repository;

import com.heladeria.tpv.domain.entity.Venta;
import org.springframework.data.jpa.repository.JpaRepository;


public interface VentaRepository extends JpaRepository<Venta, Long> {
}
