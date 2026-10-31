package com.nithin.finance_tracker.repository;

import com.nithin.finance_tracker.model.Transaction;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface TransactionRepository extends MongoRepository<Transaction, String> {

    // Spring Data builds these queries from the method names.
    List<Transaction> findByUserEmailOrderByDateDescIdDesc(String userEmail);

    // Filtering by id AND owner means one user can never touch another user's data.
    Optional<Transaction> findByIdAndUserEmail(String id, String userEmail);
}
