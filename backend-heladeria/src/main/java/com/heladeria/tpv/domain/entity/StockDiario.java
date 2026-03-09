package com.heladeria.tpv.domain.entity;

import jakarta.persistence.*;

@Entity
@Table(
    name = "stock_diario",
    indexes = {
        @Index(name = "idx_stock_producto", columnList = "producto_id")
    }
)
public class StockDiario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "producto_id", unique = true)
    private Long productoId;

    private String nombre;
    private String categoria;
    private double precio;
    private Integer stock;

    public StockDiario() {}

    public Long getId() { return id; }
    public Long getProductoId() { return productoId; }
    public String getNombre() { return nombre; }
    public String getCategoria() { return categoria; }
    public double getPrecio() { return precio; }
    public Integer getStock() { return stock; }

    public void setId(Long id) { this.id = id; }
    public void setProductoId(Long productoId) { this.productoId = productoId; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public void setCategoria(String categoria) { this.categoria = categoria; }
    public void setPrecio(double precio) { this.precio = precio; }
    public void setStock(Integer stock) { this.stock = stock; }
}