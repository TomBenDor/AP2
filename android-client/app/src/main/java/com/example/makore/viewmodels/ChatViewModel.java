package com.example.makore.viewmodels;

import androidx.lifecycle.MutableLiveData;

import com.example.makore.entities.Message;
import com.example.makore.repositories.ContactsRepository;

import java.util.LinkedList;
import java.util.List;

public class ChatViewModel {
    private ContactsRepository contactsRepository;

    private MutableLiveData<List<Message>> allMessages;
    private String contactId;

    public ChatViewModel(ContactsRepository contactsRepository) {
        this.contactsRepository = contactsRepository;
        allMessages = contactsRepository.getMessages();
        contactId = null;
    }

    public MutableLiveData<List<Message>> getMessages() {
        return allMessages;
    }

    // Set new contact id
    public void setContactId(String contactId) {
        this.contactId = contactId;
    }

    public List<Message> getMessagesWithContact() {
        if (contactId == null) {
            return null;
        }

        List<Message> messages = allMessages.getValue();
        if (messages == null) {
            return null;
        }
        List<Message> messagesWithContact = new LinkedList<>();
        for (Message message : messages) {
            if (message.getContactId().equals(contactId)) {
                messagesWithContact.add(message);
            }
        }
        return messagesWithContact;
    }

    // Insert new message
    public void insertMessage(Message message) {
        contactsRepository.insertMessage(message);
    }

    // TODO: reload messages from web-api
    public void reload() {
        contactsRepository.reload();
    }
}
