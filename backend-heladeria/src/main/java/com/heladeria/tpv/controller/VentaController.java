package com.heladeria.tpv.controller;

import com.heladeria.tpv.domain.entity.Venta;
import com.heladeria.tpv.service.VentaService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

    @PostMapping
    public ResponseEntity<Venta> registrar(@RequestBody VentaRequest request) {
        if (request == null || request.total() <= 0) {
            return ResponseEntity.badRequest().build();
        }

        Venta venta = ventaService.registrar(request.total());
        return ResponseEntity.status(HttpStatus.CREATED).body(venta);
    }

    public record VentaRequest(double total) {}
}
