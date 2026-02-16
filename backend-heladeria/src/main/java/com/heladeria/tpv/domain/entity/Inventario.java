package com.heladeria.tpv.domain.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "INVENTARIO")
public class Inventario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "PRODUCTO_ID")
    private Producto producto;

    @ManyToOne
    @JoinColumn(name = "SEDE_ID")
    private Sede sede;

    private Integer cantidad;

    public Inventario() {}

    public Long getId() { return id; }
    public Producto getProducto() { return producto; }
    public Sede getSede() { return sede; }
    public Integer getCantidad() { return cantidad; }

    public void setId(Long id) { this.id = id; }
    public void setProducto(Producto producto) { this.producto = producto; }
    public void setSede(Sede sede) { this.sede = sede; }
    public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }
}

