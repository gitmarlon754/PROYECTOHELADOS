package com.heladeria.tpv.domain.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "DETALLE_VENTA")
public class DetalleVenta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "VENTA_ID")
    private Venta venta;

    @ManyToOne
    @JoinColumn(name = "PRODUCTO_ID")
    private Producto producto;

    private int cantidad;
    private double precioUnitario;

    public DetalleVenta() {}

    public Long getId() { return id; }
    public Venta getVenta() { return venta; }
    public Producto getProducto() { return producto; }
    public int getCantidad() { return cantidad; }
    public double getPrecioUnitario() { return precioUnitario; }

    public void setVenta(Venta venta) { this.venta = venta; }
    public void setProducto(Producto producto) { this.producto = producto; }
    public void setCantidad(int cantidad) { this.cantidad = cantidad; }
    public void setPrecioUnitario(double precioUnitario) {
        this.precioUnitario = precioUnitario;
    }
}
