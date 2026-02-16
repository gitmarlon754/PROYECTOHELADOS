package com.heladeria.tpv.controller;

import com.heladeria.tpv.dto.ReporteVentaDTO;
import com.heladeria.tpv.service.ReporteService;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/reportes")
@CrossOrigin("*")
public class ReporteController {

    private final ReporteService reporteService;

    public ReporteController(ReporteService reporteService) {
        this.reporteService = reporteService;
    }

    @GetMapping("/ventas")
    public List<ReporteVentaDTO> ventas(
            @RequestParam String inicio,
            @RequestParam String fin
    ) {
        return reporteService.ventasPorFecha(
                LocalDateTime.parse(inicio),
                LocalDateTime.parse(fin)
        );
    }
}
