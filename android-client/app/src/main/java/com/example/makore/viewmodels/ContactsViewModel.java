package com.example.makore.viewmodels;

import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

import com.example.makore.entities.Contact;
import com.example.makore.entities.Message;
import com.example.makore.repositories.ContactsRepository;

import java.util.LinkedList;
import java.util.List;

public class ContactsViewModel extends ViewModel {
    private ContactsRepository contactsRepository;

    private MutableLiveData<List<Contact>> contacts;
    private MutableLiveData<List<Message>> messages;
    private String contactId;

    public ContactsViewModel() {
        contactsRepository = new ContactsRepository();
        contacts = contactsRepository.getContacts();
        messages = contactsRepository.getMessages();
        contactId = null;
    }

    public MutableLiveData<List<Contact>> getContacts() {
        return contacts;
    }

    public MutableLiveData<List<Message>> getMessages() {
        return messages;
    }

    // Set new contact id
    public void setContactId(String contactId) {
        this.contactId = contactId;
    }

    public List<Message> getMessagesWithContact() {
        if (contactId == null) {
            return null;
        }

        List<Message> messages = getMessages().getValue();
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

    // TODO: reload messages from web-api
    public void reload() {
        contactsRepository.reload();
    }
}
