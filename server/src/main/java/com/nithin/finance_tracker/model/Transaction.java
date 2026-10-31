package com.nithin.finance_tracker.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.FieldType;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * One income or expense entry. Every transaction belongs to exactly one user
 * (identified by email, which is the subject of the JWT).
 */
@Document(collection = "transactions")
@CompoundIndex(name = "user_date_idx", def = "{'userEmail': 1, 'date': -1}")
public class Transaction {

    public enum Type { INCOME, EXPENSE }

    @Id
    private String id;
    private String userEmail;
    private Type type;
    private String category;

    // Stored as a real decimal in MongoDB (not a string) so money maths stays exact.
    @Field(targetType = FieldType.DECIMAL128)
    private BigDecimal amount;

    private String note;
    private LocalDate date;

    public Transaction() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }
    public Type getType() { return type; }
    public void setType(Type type) { this.type = type; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
}
