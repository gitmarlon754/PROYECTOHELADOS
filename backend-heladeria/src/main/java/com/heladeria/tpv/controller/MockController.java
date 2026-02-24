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
        Map<String, Object> p1 = new HashMap<>();
        p1.put("id", 1);
        p1.put("nombre", "Helado Vainilla");
        p1.put("precio", 2.5);
        p1.put("categoria", "Clásicos");
        list.add(p1);

        Map<String, Object> p2 = new HashMap<>();
        p2.put("id", 2);
        p2.put("nombre", "Helado Chocolate");
        p2.put("precio", 3.0);
        p2.put("categoria", "Clásicos");
        list.add(p2);

        return ResponseEntity.ok(list);
    }

    @GetMapping("/inventario")
    public ResponseEntity<List<Map<String, Object>>> inventario() {
        List<Map<String, Object>> list = new ArrayList<>();
        Map<String, Object> i1 = new HashMap<>();
        i1.put("productoId", 1);
        i1.put("sede", "Central");
        i1.put("stock", 25);
        list.add(i1);
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
}
