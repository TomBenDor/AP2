package com.example.makore.entities;

import androidx.room.Database;
import androidx.room.RoomDatabase;

@Database(entities = {Contact.class, Message.class}, version = 1)
public abstract class AppDB extends RoomDatabase {
    public static final String DATABASE_NAME = "makore.db";

    public abstract ContactsDao contactsDao();
}
