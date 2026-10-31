package com.nithin.finance_tracker.dto;

import com.nithin.finance_tracker.model.Transaction;

import java.math.BigDecimal;
import java.time.LocalDate;

/** What the client receives. Deliberately omits userEmail. */
public record TransactionResponse(
        String id,
        Transaction.Type type,
        String category,
        BigDecimal amount,
        String note,
        LocalDate date) {

    public static TransactionResponse from(Transaction t) {
        return new TransactionResponse(t.getId(), t.getType(), t.getCategory(),
                t.getAmount(), t.getNote(), t.getDate());
    }
}
