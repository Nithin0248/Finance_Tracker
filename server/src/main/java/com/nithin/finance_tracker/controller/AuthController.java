package com.nithin.finance_tracker.controller;

import com.nithin.finance_tracker.dto.AuthResponse;
import com.nithin.finance_tracker.dto.LoginRequest;
import com.nithin.finance_tracker.dto.RegisterRequest;
import com.nithin.finance_tracker.model.User;
import com.nithin.finance_tracker.repository.UserRepository;
import com.nithin.finance_tracker.security.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository repo;
    private final PasswordEncoder encoder;
    private final JwtUtil jwtUtil;

    public AuthController(UserRepository repo, PasswordEncoder encoder, JwtUtil jwtUtil) {
        this.repo = repo;
        this.encoder = encoder;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest r) {
        String email = r.email().trim().toLowerCase();
        if (repo.findByEmail(email).isPresent())
            return ResponseEntity.status(409).body(Map.of("error", "Email already registered"));
        User u = new User();
        u.setName(r.name().trim());
        u.setEmail(email);
        u.setPassword(encoder.encode(r.password()));
        repo.save(u);
        return ResponseEntity.ok(new AuthResponse(jwtUtil.generateToken(email), u.getName()));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest r) {
        String email = r.email() == null ? "" : r.email().trim().toLowerCase();
        var user = repo.findByEmail(email).orElse(null);
        if (user == null || r.password() == null || !encoder.matches(r.password(), user.getPassword()))
            return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
        return ResponseEntity.ok(new AuthResponse(jwtUtil.generateToken(email), user.getName()));
    }
}
