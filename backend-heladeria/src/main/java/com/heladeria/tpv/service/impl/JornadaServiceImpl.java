package com.heladeria.tpv.service.impl;

import com.heladeria.tpv.domain.entity.Jornada;
import com.heladeria.tpv.domain.entity.StockDiario;
import com.heladeria.tpv.repository.JornadaRepository;
import com.heladeria.tpv.repository.StockDiarioRepository;
import com.heladeria.tpv.service.JornadaService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class JornadaServiceImpl implements JornadaService {

    private final JornadaRepository jornadaRepository;
    private final StockDiarioRepository stockDiarioRepository;

    public JornadaServiceImpl(JornadaRepository jornadaRepository,
                              StockDiarioRepository stockDiarioRepository) {
        this.jornadaRepository = jornadaRepository;
        this.stockDiarioRepository = stockDiarioRepository;
    }

    @Override
    public EstadoJornadaDTO estado() {
        Optional<Jornada> abierta = jornadaRepository.findFirstByEstadoOrderByInicioDesc("ABIERTA");
        boolean tieneSobrantes = stockDiarioRepository.findAll().stream().anyMatch(s -> (s.getStock() != null ? s.getStock() : 0) > 0);
        int agotados = (int) stockDiarioRepository.findAll().stream().filter(s -> (s.getStock() != null ? s.getStock() : 0) <= 0).count();
        String fecha = abierta.map(j -> j.getFecha().toString()).orElse(LocalDate.now().toString());
        String inicio = abierta.map(j -> j.getInicio() == null ? null : j.getInicio().toString()).orElse(null);
        return new EstadoJornadaDTO(abierta.isPresent(), tieneSobrantes, fecha, agotados, inicio);
    }

    @Override
    @Transactional
    public Jornada abrir(boolean usarSobrantes, List<StockInput> stocks) {
        jornadaRepository.findFirstByEstadoOrderByInicioDesc("ABIERTA").ifPresent(jornada -> {
            throw new RuntimeException("Ya existe una jornada abierta");
        });

        if (!usarSobrantes) {
            stockDiarioRepository.findAll().forEach(stock -> stock.setStock(0));
        }

        if (stocks != null) {
            for (StockInput input : stocks) {
                if (input == null || input.productoId() == null) {
                    continue;
                }
                int cantidad = input.cantidad() == null ? 0 : Math.max(0, Math.min(100, input.cantidad()));
                StockDiario stock = stockDiarioRepository.findByProductoId(input.productoId()).orElseGet(StockDiario::new);
                stock.setProductoId(input.productoId());
                if (input.nombre() != null) stock.setNombre(input.nombre());
                if (input.categoria() != null) stock.setCategoria(input.categoria());
                if (input.precio() != null) stock.setPrecio(input.precio());
                int actual = stock.getStock() == null ? 0 : stock.getStock();
                stock.setStock(actual + cantidad);
                stockDiarioRepository.save(stock);
            }
        }

        Jornada jornada = new Jornada();
        jornada.setFecha(LocalDate.now());
        jornada.setInicio(LocalDateTime.now());
        jornada.setEstado("ABIERTA");
        jornada.setUsarSobrantes(usarSobrantes ? 1 : 0);
        return jornadaRepository.save(jornada);
    }

    @Override
    @Transactional
    public Jornada cerrar(boolean limpiarInventario) {
        Jornada jornada = jornadaRepository.findFirstByEstadoOrderByInicioDesc("ABIERTA")
                .orElseThrow(() -> new RuntimeException("No hay jornada abierta para cerrar"));

        jornada.setEstado("CERRADA");
        jornada.setCierre(LocalDateTime.now());

        if (limpiarInventario) {
            stockDiarioRepository.findAll().forEach(stock -> stock.setStock(0));
        }

        return jornadaRepository.save(jornada);
    }

    @Override
    public List<StockDiario> listarStock() {
        return stockDiarioRepository.findAll().stream()
                .sorted(Comparator.comparing(StockDiario::getNombre, Comparator.nullsLast(String::compareToIgnoreCase)))
                .toList();
    }

    @Override
    @Transactional
    public List<StockDiario> reponer(List<StockInput> stocks) {
        if (stocks == null) {
            return listarStock();
        }

        for (StockInput input : stocks) {
            if (input == null || input.productoId() == null) {
                continue;
            }
            int cantidad = input.cantidad() == null ? 0 : Math.max(0, Math.min(100, input.cantidad()));
            if (cantidad == 0) {
                continue;
            }

            StockDiario stock = stockDiarioRepository.findByProductoId(input.productoId()).orElseGet(StockDiario::new);
            stock.setProductoId(input.productoId());
            if (input.nombre() != null) stock.setNombre(input.nombre());
            if (input.categoria() != null) stock.setCategoria(input.categoria());
            if (input.precio() != null) stock.setPrecio(input.precio());
            int actual = stock.getStock() == null ? 0 : stock.getStock();
            stock.setStock(Math.min(100, actual + cantidad));
            stockDiarioRepository.save(stock);
        }

        return listarStock();
    }
}
