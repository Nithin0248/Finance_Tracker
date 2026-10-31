package com.nithin.finance_tracker.service;

import com.nithin.finance_tracker.dto.TransactionRequest;
import com.nithin.finance_tracker.dto.TransactionResponse;
import com.nithin.finance_tracker.model.Transaction;
import com.nithin.finance_tracker.repository.TransactionRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

/** Business logic lives here; the controller only deals with HTTP. */
@Service
public class TransactionService {

    private final TransactionRepository repo;

    public TransactionService(TransactionRepository repo) {
        this.repo = repo;
    }

    public TransactionResponse add(String userEmail, TransactionRequest r) {
        Transaction t = new Transaction();
        t.setUserEmail(userEmail);
        t.setType(r.type());
        t.setCategory(r.category().trim());
        t.setAmount(r.amount());
        t.setNote(r.note() == null ? "" : r.note().trim());
        t.setDate(r.date());
        return TransactionResponse.from(repo.save(t));
    }

    public List<TransactionResponse> list(String userEmail) {
        return repo.findByUserEmailOrderByDateDescIdDesc(userEmail)
                .stream().map(TransactionResponse::from).toList();
    }

    public void delete(String userEmail, String id) {
        Transaction t = repo.findByIdAndUserEmail(id, userEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Transaction not found"));
        repo.delete(t);
    }

    /** CSV export of all the user's transactions. */
    public String exportCsv(String userEmail) {
        StringBuilder sb = new StringBuilder("Date,Type,Category,Amount,Note\n");
        for (TransactionResponse t : list(userEmail)) {
            sb.append(t.date()).append(',')
              .append(t.type()).append(',')
              .append(csv(t.category())).append(',')
              .append(t.amount().toPlainString()).append(',')
              .append(csv(t.note())).append('\n');
        }
        return sb.toString();
    }

    private static String csv(String value) {
        if (value == null) return "";
        String v = value;
        // Stop spreadsheet formula injection (a note like =HYPERLINK(...) would run in Excel).
        if (!v.isEmpty() && "=+-@".indexOf(v.charAt(0)) >= 0) v = "'" + v;
        return "\"" + v.replace("\"", "\"\"") + "\"";
    }
}
