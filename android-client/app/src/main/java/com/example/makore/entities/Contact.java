package com.example.makore.entities;

import androidx.room.Entity;
import androidx.room.PrimaryKey;

import java.util.Date;
import java.util.List;

@Entity
public class Contact {
    @PrimaryKey(autoGenerate = true)
    private String id;
    private String name;
    private String server;
    private String last;
    private Date lastDate;
    // TODO: Add a profile picture
    private List<Message> messages;
}
