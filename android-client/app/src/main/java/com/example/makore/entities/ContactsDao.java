package com.example.makore.entities;

import androidx.room.Dao;
import androidx.room.Insert;
import androidx.room.Query;

import java.util.List;

@Dao
public interface ContactsDao {
    @Query("SELECT * FROM contact")
    List<Contact> index();

    // Get contact by id
    @Query("SELECT * FROM contact WHERE id = :id")
    Contact getContact(String id);

    // Get all messages between contact and current user
    @Query("SELECT * FROM message WHERE contactId = :id ORDER BY id")
    List<Message> getAllMessagesWithContact(String id);

    @Insert
    void insertContact(Contact... contacts);

    @Insert
    void insertMessage(Message... messages);
}