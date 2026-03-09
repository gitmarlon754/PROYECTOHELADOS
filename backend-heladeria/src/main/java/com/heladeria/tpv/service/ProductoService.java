package com.heladeria.tpv.service;

import com.heladeria.tpv.domain.entity.Producto;

import java.util.List;

public interface ProductoService {

    List<Producto> listarActivos();

    List<Producto> listarPorCategoria(Long categoriaId);
    
    Producto guardar(Producto producto);


}