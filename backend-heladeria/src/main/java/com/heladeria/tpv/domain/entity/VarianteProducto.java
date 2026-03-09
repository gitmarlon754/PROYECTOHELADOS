package com.heladeria.tpv.domain.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "VARIANTE_PRODUCTO")
public class VarianteProducto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "PRODUCTO_ID")
    private Producto producto;

    @ManyToOne
    @JoinColumn(name = "TIPO_HELADO_ID")
    private TipoHelado tipoHelado;

    private String sabor;

    private BigDecimal precio;

    private Boolean activo = true;

    public VarianteProducto() {}

    public Long getId() { return id; }

    public Producto getProducto() { return producto; }

    public TipoHelado getTipoHelado() { return tipoHelado; }

    public String getSabor() { return sabor; }

    public BigDecimal getPrecio() { return precio; }

    public Boolean getActivo() { return activo; }

    public void setId(Long id) { this.id = id; }

    public void setProducto(Producto producto) { this.producto = producto; }

    public void setTipoHelado(TipoHelado tipoHelado) { this.tipoHelado = tipoHelado; }

    public void setSabor(String sabor) { this.sabor = sabor; }

    public void setPrecio(BigDecimal precio) { this.precio = precio; }

    public void setActivo(Boolean activo) { this.activo = activo; }
}