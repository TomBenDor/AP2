package com.example.makore.viewmodels;

import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

import com.example.makore.entities.Contact;
import com.example.makore.entities.Message;
import com.example.makore.repositories.ContactsRepository;

import java.util.LinkedList;
import java.util.List;

public class ContactsViewModel extends ViewModel {
    private final ContactsRepository contactsRepository;
    private String contactId;
    private final MutableLiveData<String> contactIdLiveData;

    public ContactsViewModel() {
        contactsRepository = new ContactsRepository();
        contactIdLiveData = new MutableLiveData<>();
        contactId = null;
    }
    
    public MutableLiveData<String> getContactIdLiveData() {
        return contactIdLiveData;
    }
    
    public void setLiveContactId(String contactId) {
        contactIdLiveData.setValue(contactId);
    }

    public MutableLiveData<List<Contact>> getContacts() {
        reload();
        return contactsRepository.getContacts();
    }

    public MutableLiveData<List<Message>> getMessages() {
        return contactsRepository.getMessages();
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

    public void reload() {
        contactsRepository.reload();
    }
}
