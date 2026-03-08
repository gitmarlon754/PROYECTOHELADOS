package com.heladeria.tpv.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "DETALLE_VENTA")
public class DetalleVenta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "VENTA_ID")
    @JsonIgnore
    private Venta venta;

    private Long productoId;
    private String productoNombre;

    private int cantidad;
    private double precioUnitario;

    public DetalleVenta() {}

    public Long getId() { return id; }
    public Venta getVenta() { return venta; }
    public Long getProductoId() { return productoId; }
    public String getProductoNombre() { return productoNombre; }
    public int getCantidad() { return cantidad; }
    public double getPrecioUnitario() { return precioUnitario; }

    public void setVenta(Venta venta) { this.venta = venta; }
    public void setProductoId(Long productoId) { this.productoId = productoId; }
    public void setProductoNombre(String productoNombre) { this.productoNombre = productoNombre; }
    public void setCantidad(int cantidad) { this.cantidad = cantidad; }
    public void setPrecioUnitario(double precioUnitario) {
        this.precioUnitario = precioUnitario;
    }
}
