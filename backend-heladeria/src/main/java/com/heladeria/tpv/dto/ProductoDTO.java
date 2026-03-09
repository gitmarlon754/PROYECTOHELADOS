package com.heladeria.tpv.dto;

import java.math.BigDecimal;

public class ProductoDTO {

    private Long id;
    private String nombre;
    private BigDecimal precio;
    private Long categoriaId;
    private String categoriaNombre;
    private Boolean activo;
    private String imagen;

    public ProductoDTO(Long id, String nombre, BigDecimal precio,
        Long categoriaId, String categoriaNombre,
        Boolean activo, String imagen) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.categoriaId = categoriaId;
        this.categoriaNombre = categoriaNombre;
        this.activo = activo;
        this.imagen = imagen;
    }

    public Long getId() { return id; }
    public String getNombre() { return nombre; }
    public BigDecimal getPrecio() { return precio; }
    public Long getCategoriaId() { return categoriaId; }
    public String getCategoriaNombre() { return categoriaNombre; }
    public Boolean getActivo() { return activo; }
    public String getImagen() { return imagen; }
}