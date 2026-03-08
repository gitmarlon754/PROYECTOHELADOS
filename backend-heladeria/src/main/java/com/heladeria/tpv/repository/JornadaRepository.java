package com.heladeria.tpv.repository;

import com.heladeria.tpv.domain.entity.Jornada;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface JornadaRepository extends JpaRepository<Jornada, Long> {
    Optional<Jornada> findFirstByEstadoOrderByInicioDesc(String estado);
    Optional<Jornada> findTopByOrderByInicioDesc();
}
