package com.heladeria.tpv.domain.entity;

import jakarta.persistence.*;

@Entity
@Table(
    name = "INVENTARIO",
    indexes = {
        @Index(name = "idx_inv_variante_sede", columnList = "VARIANTE_PRODUCTO_ID, SEDE_ID")
    }
)
public class Inventario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "VARIANTE_PRODUCTO_ID")
    private VarianteProducto varianteProducto;

    @ManyToOne
    @JoinColumn(name = "SEDE_ID")
    private Sede sede;

    private Integer cantidad;

    public Inventario() {}

    public Long getId() { return id; }
    public VarianteProducto getVarianteProducto() { return varianteProducto; }
    public Sede getSede() { return sede; }
    public Integer getCantidad() { return cantidad; }

    public void setId(Long id) { this.id = id; }
    public void setVarianteProducto(VarianteProducto varianteProducto) { this.varianteProducto = varianteProducto; }
    public void setSede(Sede sede) { this.sede = sede; }
    public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }
}