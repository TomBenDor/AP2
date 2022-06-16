package com.example.makore.entities;

import androidx.room.Entity;
import androidx.room.PrimaryKey;

@Entity
public class Message {
    @PrimaryKey(autoGenerate = true)
    private int id;
    private String content;
    private String created;
    // True if the message was sent by the current user
    private boolean sent;
    // The contact id of the user the current user is chatting with
    public String contactId;

    public Message(int id, String content, String created, boolean sent, String contactId) {
        this.id = id;
        this.content = content;
        this.created = created;
        this.sent = sent;
        this.contactId = contactId;
    }

    public int getId() {
        return id;
    }

    public String getContent() {
        return content;
    }

    public String getCreated() {
        return created;
    }

    public boolean isSent() {
        return sent;
    }

    public String getContactId() {
        return contactId;
    }

    public void setId(int id) {
        this.id = id;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public void setCreated(String created) {
        this.created = created;
    }

    public void setSent(boolean sent) {
        this.sent = sent;
    }

    public void setContactId(String contactId) {
        this.contactId = contactId;
    }
}
