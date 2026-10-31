package com.nithin.finance_tracker.dto;

import com.nithin.finance_tracker.model.Transaction;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;

/** What the client sends when adding a transaction. The user is never sent: it comes from the JWT. */
public record TransactionRequest(
        @NotNull(message = "Type is required") Transaction.Type type,
        @NotBlank(message = "Category is required") @Size(max = 50) String category,
        @NotNull(message = "Amount is required")
        @DecimalMin(value = "0.01", message = "Amount must be at least 0.01")
        @DecimalMax(value = "1000000000", message = "Amount is too large")
        BigDecimal amount,
        @Size(max = 200, message = "Note must be 200 characters or fewer") String note,
        @NotNull(message = "Date is required") LocalDate date) {}
