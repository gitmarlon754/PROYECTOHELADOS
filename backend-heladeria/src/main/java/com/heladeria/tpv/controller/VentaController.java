package com.heladeria.tpv.controller;

import com.heladeria.tpv.domain.entity.Venta;
import com.heladeria.tpv.service.VentaService;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/ventas")
@CrossOrigin("*")
public class VentaController {

    private final VentaService ventaService;

    public VentaController(VentaService ventaService) {
        this.ventaService = ventaService;
    }

    @GetMapping
    public List<Venta> listar() {
        return ventaService.listar();
    }
}
