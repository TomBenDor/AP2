package com.example.makore.entities;

import androidx.room.Dao;
import androidx.room.Delete;
import androidx.room.Insert;
import androidx.room.Query;
import androidx.room.Update;

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

    @Update
    void updateContact(Contact... contacts);

    @Delete
    void deleteContact(Contact... contacts);

    @Insert
    void insertMessage(Message... messages);

    @Update
    void updateMessage(Message... messages);

    @Delete
    void deleteMessage(Message... messages);

    // Delete all messages
    @Query("DELETE FROM message")
    void deleteAllMessages();

    // Delete all contacts
    @Query("DELETE FROM contact")
    void deleteAllContacts();
}
