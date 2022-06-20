package com.example.makore.entities;

import androidx.annotation.NonNull;
import androidx.room.Entity;
import androidx.room.PrimaryKey;

import com.example.makore.R;

@Entity
public class Contact {
    @PrimaryKey
    @NonNull
    private String id;
    private String name;
    private String server;
    private String last;
    private String lastDate;
    private int profilePicture;

    public Contact(@NonNull String id, String name, String server, String last, String lastDate) {
        this.id = id;
        this.name = name;
        this.server = server;
        this.last = last;
        this.lastDate = lastDate;
        this.profilePicture = R.drawable.ic_default_contact_pic_light;
    }

    public @NonNull
    String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getServer() {
        return server;
    }

    public String getLast() {
        return last;
    }

    public String getLastDate() {
        return lastDate;
    }

    public int getProfilePicture() {
        return profilePicture;
    }

    public void setId(@NonNull String id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setServer(String server) {
        this.server = server;
    }

    public void setLast(String last) {
        this.last = last;
    }

    public void setLastDate(String lastDate) {
        this.lastDate = lastDate;
    }

    public void setProfilePicture(int profilePicture) {
        this.profilePicture = profilePicture;
    }

    // ToString method for debugging
    @NonNull
    @Override
    public String toString() {
        return "Contact{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                ", server='" + server + '\'' +
                ", last='" + last + '\'' +
                ", lastDate='" + lastDate + '\'' +
                '}';
    }
}
