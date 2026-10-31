package com.nithin.finance_tracker.controller;

import com.nithin.finance_tracker.dto.TransactionRequest;
import com.nithin.finance_tracker.dto.TransactionResponse;
import com.nithin.finance_tracker.service.TransactionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService service;

    public TransactionController(TransactionService service) {
        this.service = service;
    }

    // auth.getName() is the email the JwtAuthFilter put into the security context.
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TransactionResponse add(Authentication auth, @Valid @RequestBody TransactionRequest request) {
        return service.add(auth.getName(), request);
    }

    @GetMapping
    public List<TransactionResponse> list(Authentication auth) {
        return service.list(auth.getName());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(Authentication auth, @PathVariable String id) {
        service.delete(auth.getName(), id);
    }

    @GetMapping("/export")
    public ResponseEntity<byte[]> export(Authentication auth) {
        byte[] body = service.exportCsv(auth.getName()).getBytes(StandardCharsets.UTF_8);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"transactions.csv\"")
                .contentType(MediaType.parseMediaType("text/csv; charset=UTF-8"))
                .body(body);
    }
}
