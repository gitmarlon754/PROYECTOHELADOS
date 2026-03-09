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

import java.time.LocalDateTime;
import java.util.List;

@Service
public class VentaServiceImpl implements VentaService {

    private final VentaRepository ventaRepository;
    private final JornadaRepository jornadaRepository;
    private final StockDiarioRepository stockDiarioRepository;

    public VentaServiceImpl(
            VentaRepository ventaRepository,
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

        // Buscar jornada abierta
        Jornada jornada = jornadaRepository
                .findFirstByEstadoOrderByInicioDesc("ABIERTA")
                .orElseThrow(() -> new RuntimeException("No hay jornada abierta para registrar ventas"));

        // Crear venta
        Venta venta = new Venta();
        venta.setTotal(total);
        venta.setMetodoPago((metodoPago == null || metodoPago.isBlank()) ? "cash" : metodoPago);
        venta.setFecha(LocalDateTime.now());
        venta.setSede(null);

        // Procesar productos vendidos
        if (lineas != null) {

            for (VentaService.LineaVenta linea : lineas) {

                if (linea == null ||
                        linea.productoId() == null ||
                        linea.cantidad() == null ||
                        linea.cantidad() <= 0) {
                    continue;
                }

                // Buscar stock del producto
                StockDiario stock = stockDiarioRepository
                        .findByProductoId(linea.productoId())
                        .orElseThrow(() ->
                                new RuntimeException("Stock no encontrado para producto: " + linea.productoId()));

                int stockActual = stock.getStock() == null ? 0 : stock.getStock();

                // Validar stock
                if (stockActual < linea.cantidad()) {
                    throw new RuntimeException(
                            "Stock insuficiente para producto: " + stock.getNombre());
                }

                // Descontar stock
                stock.setStock(stockActual - linea.cantidad());
                stockDiarioRepository.save(stock);

                // Crear detalle de venta
                DetalleVenta detalle = new DetalleVenta();
                detalle.setProductoId(linea.productoId());
                detalle.setProductoNombre(stock.getNombre());
                detalle.setCantidad(linea.cantidad());

                double precio = (linea.precioUnitario() != null)
                        ? linea.precioUnitario()
                        : stock.getPrecio();

                detalle.setPrecioUnitario(precio);

                // Agregar detalle a la venta
                venta.addDetalle(detalle);
            }
        }

        // Guardar venta completa
        return ventaRepository.save(venta);
    }
}