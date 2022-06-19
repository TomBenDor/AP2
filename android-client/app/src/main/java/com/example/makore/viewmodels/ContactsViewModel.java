package com.example.makore.viewmodels;

import androidx.lifecycle.MutableLiveData;

import com.example.makore.entities.Contact;
import com.example.makore.entities.Message;
import com.example.makore.repositories.ContactsRepository;

import java.util.List;

public class ContactsViewModel {
    private ContactsRepository contactsRepository;

    private MutableLiveData<List<Contact>> contacts;
    private MutableLiveData<List<Message>> messages;

    public ContactsViewModel(ContactsRepository contactsRepository) {
        this.contactsRepository = contactsRepository;
        contacts = contactsRepository.getContacts();
        messages = contactsRepository.getMessages();
    }

    public MutableLiveData<List<Contact>> getContacts() {
        return contacts;
    }

    public MutableLiveData<List<Message>> getMessages() {
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
