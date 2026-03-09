package com.heladeria.tpv.service;

import com.heladeria.tpv.domain.entity.Jornada;
import com.heladeria.tpv.domain.entity.StockDiario;

import java.util.List;

public interface JornadaService {

    record StockInput(Long productoId, String nombre, String categoria, Double precio, Integer cantidad) {}

    record EstadoJornadaDTO(boolean jornadaAbierta, boolean sobrantesDisponibles, String fecha, int productosAgotados, String inicioJornada) {}

    EstadoJornadaDTO estado();

    Jornada abrir(boolean usarSobrantes, List<StockInput> stocks);

    Jornada cerrar(boolean limpiarInventario);

    List<StockDiario> listarStock();

    List<StockDiario> reponer(List<StockInput> stocks);
}
