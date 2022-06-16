package com.example.makore.entities;

import java.util.Date;

public class Message {
    private int id;
    private String content;
    private Date created;
    // True if the message was sent by the current user
    private boolean sent;
}
