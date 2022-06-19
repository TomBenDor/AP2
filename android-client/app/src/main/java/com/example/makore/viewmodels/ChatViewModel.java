package com.example.makore.viewmodels;

import androidx.lifecycle.LiveData;

import com.example.makore.entities.Message;
import com.example.makore.repositories.ContactsRepository;

import java.util.List;

public class ChatViewModel {
    private ContactsRepository contactsRepository;

    private LiveData<List<Message>> allMessages;
    private LiveData<List<Message>> messagesWithContact;
    private String contactId;

    public ChatViewModel(ContactsRepository contactsRepository) {
        this.contactsRepository = contactsRepository;
        allMessages = contactsRepository.getMessages();
        messagesWithContact = contactsRepository.getMessagesWithContact();
        contactId = null;
    }

    public LiveData<List<Message>> getMessagesWithContact() {
        return messagesWithContact;
    }

    // Set new contact id
    public void setContactId(String contactId) {
        this.contactId = contactId;
        // Reload messages from Repository for new contact
        if (contactId != null) {
            contactsRepository.setContactId(contactId);
            contactsRepository.getMessagesWithContact();
        }
    }

    // Get contact id
    public String getContactId() {
        return contactId;
    }

}
