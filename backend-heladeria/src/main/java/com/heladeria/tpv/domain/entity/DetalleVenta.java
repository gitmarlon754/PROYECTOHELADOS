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
    @JoinColumn(name = "VARIANTE_PRODUCTO_ID")
    private VarianteProducto varianteProducto;

    private int cantidad;
    private double precioUnitario;

    public DetalleVenta() {}

    public Long getId() { return id; }
    public Venta getVenta() { return venta; }
    public VarianteProducto getVarianteProducto() {
        return varianteProducto;
    }
    public int getCantidad() { return cantidad; }
    public double getPrecioUnitario() { return precioUnitario; }

    public void setVenta(Venta venta) { this.venta = venta; }
    public void setVarianteProducto(VarianteProducto varianteProducto) {
        this.varianteProducto = varianteProducto;
    }
    public void setCantidad(int cantidad) { this.cantidad = cantidad; }
    public void setPrecioUnitario(double precioUnitario) {
        this.precioUnitario = precioUnitario;
    }
}
