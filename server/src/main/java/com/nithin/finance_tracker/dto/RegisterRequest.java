package com.nithin.finance_tracker.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank(message = "Name is required") String name,
        @Email(message = "Enter a valid email") @NotBlank(message = "Email is required") String email,
        @Size(min = 6, message = "Password must be at least 6 characters") String password) {}
