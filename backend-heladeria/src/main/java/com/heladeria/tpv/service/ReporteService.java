package com.heladeria.tpv.service;

import com.heladeria.tpv.dto.ReporteVentaDTO;

import java.time.LocalDateTime;
import java.util.List;

public interface ReporteService {
    List<ReporteVentaDTO> ventasPorFecha(LocalDateTime inicio, LocalDateTime fin);
}


