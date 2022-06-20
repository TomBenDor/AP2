package com.example.makore.viewmodels;

import androidx.lifecycle.LiveData;

import com.example.makore.entities.Contact;
import com.example.makore.entities.Message;
import com.example.makore.repositories.ContactsRepository;

import java.util.List;

public class ContactsViewModel {
    private ContactsRepository contactsRepository;

    private LiveData<List<Contact>> contacts;
    private LiveData<List<Message>> messages;

    public ContactsViewModel(ContactsRepository contactsRepository) {
        this.contactsRepository = contactsRepository;
        contacts = contactsRepository.getContacts();
        messages = contactsRepository.getMessages();
    }

    public LiveData<List<Contact>> getContacts() {
        return contacts;
    }

    public LiveData<List<Message>> getMessages() {
        return messages;
    }

    // Get contact by id
    public Contact getContact(String id) {
        return contactsRepository.getContact(id);
    }

    public void insertContact(Contact contact) {
        contactsRepository.insertContact(contact);
    }

    public void insertMessage(Message message) {
        contactsRepository.insertMessage(message);
    }

    public void reload() {
        contactsRepository.reload();
    }
}
