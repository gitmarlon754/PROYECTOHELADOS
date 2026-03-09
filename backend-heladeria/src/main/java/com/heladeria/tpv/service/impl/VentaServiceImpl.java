package com.heladeria.tpv.service.impl;

import com.heladeria.tpv.domain.entity.DetalleVenta;
import com.heladeria.tpv.domain.entity.Jornada;
import com.heladeria.tpv.domain.entity.StockDiario;
import com.heladeria.tpv.domain.entity.Venta;
import com.heladeria.tpv.repository.JornadaRepository;
import com.heladeria.tpv.repository.StockDiarioRepository;
import com.heladeria.tpv.repository.VentaRepository;
import com.heladeria.tpv.service.VentaService;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class VentaServiceImpl implements VentaService {

    private final VentaRepository ventaRepository;
    private final JornadaRepository jornadaRepository;
    private final StockDiarioRepository stockDiarioRepository;

    public VentaServiceImpl(VentaRepository ventaRepository,
                            JornadaRepository jornadaRepository,
                            StockDiarioRepository stockDiarioRepository) {
        this.ventaRepository = ventaRepository;
        this.jornadaRepository = jornadaRepository;
        this.stockDiarioRepository = stockDiarioRepository;
    }

    @Override
    public List<Venta> listar() {
        return ventaRepository.findAll();
    }

    @Override
    @Transactional
    public Venta registrar(double total, String metodoPago, List<VentaService.LineaVenta> lineas) {
        Jornada jornada = jornadaRepository.findFirstByEstadoOrderByInicioDesc("ABIERTA")
                .orElseThrow(() -> new RuntimeException("No hay jornada abierta para registrar ventas"));

        Venta venta = new Venta();
        venta.setTotal(total);
        venta.setMetodoPago(metodoPago == null || metodoPago.isBlank() ? "cash" : metodoPago);
        venta.setFecha(java.time.LocalDateTime.now());
        venta.setSede(null);

        if (lineas != null) {
            for (VentaService.LineaVenta linea : lineas) {
                if (linea == null || linea.productoId() == null || linea.cantidad() == null || linea.cantidad() <= 0) {
                    continue;
                }

                StockDiario stock = stockDiarioRepository.findByProductoId(linea.productoId())
                        .orElseThrow(() -> new RuntimeException("Stock no encontrado para producto: " + linea.productoId()));
                int actual = stock.getStock() == null ? 0 : stock.getStock();
                if (actual < linea.cantidad()) {
                    throw new RuntimeException("Stock insuficiente para producto: " + stock.getNombre());
                }
                stock.setStock(actual - linea.cantidad());
                stockDiarioRepository.save(stock);

                DetalleVenta detalle = new DetalleVenta();
                detalle.setProductoId(linea.productoId());
                detalle.setProductoNombre(stock.getNombre());
                detalle.setCantidad(linea.cantidad());
                double precio = linea.precioUnitario() != null ? linea.precioUnitario() : stock.getPrecio();
                detalle.setPrecioUnitario(precio);
                venta.addDetalle(detalle);
            }
        }

        return ventaRepository.save(venta);
    }
}
