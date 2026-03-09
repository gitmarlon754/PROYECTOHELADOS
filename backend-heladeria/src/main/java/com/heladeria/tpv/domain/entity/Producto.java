package com.heladeria.tpv.domain.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "PRODUCTO")
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false)
    private BigDecimal precio;

    @ManyToOne
    @JoinColumn(name = "CATEGORIA_ID")
    private Categoria categoria;

    @ManyToOne
    @JoinColumn(name = "TIPO_HELADO_ID")
    private TipoHelado tipoHelado;

    @Column(nullable = false)
    private Boolean activo = true;

    private String imagen;

    public Producto() {}

    public Long getId() { return id; }
    public String getNombre() { return nombre; }
    public BigDecimal getPrecio() { return precio; }
    public Categoria getCategoria() { return categoria; }
    public TipoHelado getTipoHelado() { return tipoHelado; }
    public Boolean getActivo() { return activo; }
    public String getImagen() { return imagen; }

    public void setId(Long id) { this.id = id; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public void setPrecio(BigDecimal precio) { this.precio = precio; }
    public void setCategoria(Categoria categoria) { this.categoria = categoria; }
    public void setTipoHelado(TipoHelado tipoHelado) { this.tipoHelado = tipoHelado; }
    public void setActivo(Boolean activo) { this.activo = activo; }
    public void setImagen(String imagen) { this.imagen = imagen; }
}