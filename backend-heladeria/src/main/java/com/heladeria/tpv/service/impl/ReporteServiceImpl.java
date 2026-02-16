package com.heladeria.tpv.service.impl;

import com.heladeria.tpv.dto.ReporteVentaDTO;
import com.heladeria.tpv.repository.DetalleVentaRepository;
import com.heladeria.tpv.service.ReporteService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReporteServiceImpl implements ReporteService {

    private final DetalleVentaRepository detalleVentaRepository;

    public ReporteServiceImpl(DetalleVentaRepository detalleVentaRepository) {
        this.detalleVentaRepository = detalleVentaRepository;
    }

    @Override
    public List<ReporteVentaDTO> ventasPorFecha(LocalDateTime inicio, LocalDateTime fin) {

        return detalleVentaRepository.findAll()
                .stream()
                .map(d -> new ReporteVentaDTO(
                        d.getProducto().getNombre(),
                        d.getCantidad(),
                        d.getPrecioUnitario(),
                        d.getCantidad() * d.getPrecioUnitario()
                ))
                .toList();
    }
}
