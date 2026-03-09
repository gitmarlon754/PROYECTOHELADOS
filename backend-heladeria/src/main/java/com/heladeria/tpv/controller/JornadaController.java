package com.heladeria.tpv.controller;

import com.heladeria.tpv.domain.entity.Jornada;
import com.heladeria.tpv.domain.entity.StockDiario;
import com.heladeria.tpv.service.JornadaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jornadas")
@CrossOrigin("*")
public class JornadaController {

    private final JornadaService jornadaService;

    public JornadaController(JornadaService jornadaService) {
        this.jornadaService = jornadaService;
    }

    @GetMapping("/estado")
    public JornadaService.EstadoJornadaDTO estado() {
        return jornadaService.estado();
    }

    @PostMapping("/abrir")
    public ResponseEntity<Jornada> abrir(@RequestBody AperturaRequest request) {
        boolean usarSobrantes = request != null && request.usarSobrantes();
        List<JornadaService.StockInput> stocks = request == null || request.stocks() == null
                ? List.of()
                : request.stocks().stream()
                    .map(i -> new JornadaService.StockInput(i.productoId(), i.nombre(), i.categoria(), i.precio(), i.cantidad()))
                    .toList();
        return ResponseEntity.ok(jornadaService.abrir(usarSobrantes, stocks));
    }

    @PostMapping("/cerrar")
    public ResponseEntity<Jornada> cerrar(@RequestBody CierreRequest request) {
        boolean limpiar = request != null && request.limpiarInventario();
        return ResponseEntity.ok(jornadaService.cerrar(limpiar));
    }

    @GetMapping("/stock")
    public List<StockDiario> stock() {
        return jornadaService.listarStock();
    }

    @PostMapping("/stock/reponer")
    public List<StockDiario> reponer(@RequestBody ReposicionRequest request) {
        List<JornadaService.StockInput> stocks = request == null || request.stocks() == null
                ? List.of()
                : request.stocks().stream()
                    .map(i -> new JornadaService.StockInput(i.productoId(), i.nombre(), i.categoria(), i.precio(), i.cantidad()))
                    .toList();
        return jornadaService.reponer(stocks);
    }

    public record AperturaRequest(boolean usarSobrantes, List<StockItemRequest> stocks) {}
    public record CierreRequest(boolean limpiarInventario) {}
    public record ReposicionRequest(List<StockItemRequest> stocks) {}

    public record StockItemRequest(Long productoId, String nombre, String categoria, Double precio, Integer cantidad) {}
}
