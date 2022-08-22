package com.example.makore.chat;

import android.view.View;

import com.example.makore.entities.Contact;

public interface ContactClickListener {
    void onContactClick(View v, Contact contact);
}
