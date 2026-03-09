package com.heladeria.tpv.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;

@RestController
@RequestMapping("/api/mock")
public class MockController {

    @GetMapping("/productos")
    public ResponseEntity<List<Map<String, Object>>> productos() {
        List<Map<String, Object>> list = new ArrayList<>();
        list.add(producto(1, "Helado Vainilla", 2.5, "Clásicos"));
        list.add(producto(2, "Helado Chocolate", 3.0, "Clásicos"));
        list.add(producto(3, "Helado Fresa", 2.9, "Clásicos"));
        list.add(producto(4, "Helado Pistacho", 3.4, "Especiales"));
        list.add(producto(5, "Topping Oreo", 0.8, "Toppings"));
        list.add(producto(6, "Topping Chispas", 0.7, "Toppings"));
        list.add(producto(7, "Barquillo Extra", 0.6, "Extras"));
        list.add(producto(8, "Sirope Caramelo", 0.9, "Toppings"));

        return ResponseEntity.ok(list);
    }

    @GetMapping("/inventario")
    public ResponseEntity<List<Map<String, Object>>> inventario() {
        List<Map<String, Object>> list = new ArrayList<>();
        list.add(inventarioItem(1, "Central", 35));
        list.add(inventarioItem(2, "Central", 33));
        list.add(inventarioItem(3, "Central", 30));
        list.add(inventarioItem(4, "Central", 22));
        list.add(inventarioItem(5, "Central", 60));
        list.add(inventarioItem(6, "Central", 70));
        list.add(inventarioItem(7, "Central", 55));
        list.add(inventarioItem(8, "Central", 48));
        return ResponseEntity.ok(list);
    }

    @GetMapping("/ventas/recent")
    public ResponseEntity<List<Map<String, Object>>> ventasRecent() {
        List<Map<String, Object>> list = new ArrayList<>();
        Map<String, Object> v1 = new HashMap<>();
        v1.put("id", 1001);
        v1.put("total", 15.0);
        v1.put("fecha", "2026-02-23T12:34:00");
        list.add(v1);
        return ResponseEntity.ok(list);
    }

    private Map<String, Object> producto(int id, String nombre, double precio, String categoria) {
        Map<String, Object> p = new HashMap<>();
        p.put("id", id);
        p.put("nombre", nombre);
        p.put("precio", precio);
        p.put("categoria", categoria);
        return p;
    }

    private Map<String, Object> inventarioItem(int productoId, String sede, int stock) {
        Map<String, Object> item = new HashMap<>();
        item.put("productoId", productoId);
        item.put("sede", sede);
        item.put("stock", stock);
        return item;
    }
}
