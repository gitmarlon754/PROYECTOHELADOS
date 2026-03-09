package com.heladeria.tpv.domain.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.ManyToOne;
@Entity
public class VarianteProducto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Producto producto;

    @ManyToOne
    private TipoHelado tipoHelado; // nullable

    private String sabor; // o entidad futura
    public String getSabor() {
        return sabor;
    }

    public void setSabor(String sabor) {
        this.sabor = sabor;
    }

    public Producto getProducto() {
        return producto;
    }

    public void setProducto(Producto producto) {
        this.producto = producto;
    }

    public TipoHelado getTipoHelado() {
        return tipoHelado;
    }

    public void setTipoHelado(TipoHelado tipoHelado) {
        this.tipoHelado = tipoHelado;
    }
}
