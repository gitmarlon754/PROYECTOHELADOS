package com.heladeria.tpv.repository;

import com.heladeria.tpv.domain.entity.Producto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductoRepository extends JpaRepository<Producto, Long> {
}
