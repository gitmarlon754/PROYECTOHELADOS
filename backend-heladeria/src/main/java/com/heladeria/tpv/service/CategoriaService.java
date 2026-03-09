package com.heladeria.tpv.service;

import com.heladeria.tpv.domain.entity.Categoria;
import java.util.List;

public interface CategoriaService {

    List<Categoria> listar();

    Categoria guardar(Categoria categoria);

}