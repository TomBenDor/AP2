package com.example.makore.repositories;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.example.makore.entities.Contact;
import com.example.makore.entities.ContactsDao;
import com.example.makore.entities.Message;

import java.util.LinkedList;
import java.util.List;

public class ContactsRepository {
    private ContactsDao contactsDao;
    private ContactListData contactListData;
    private MessageListData messageListData;
    // private ContactsAPI api;

    public ContactsRepository(ContactsDao contactsDao) {
        this.contactsDao = contactsDao;
        // this.api = api;
        contactListData = new ContactListData();
        messageListData = new MessageListData();

        // Add some dummy messages
        contactsDao.insertMessage(new Message("Hello", "04/18/2022, 12:41:00", true, "0"));
        contactsDao.insertMessage(new Message("Hi there", "04/18/2022, 12:41:10", false, "0"));
        contactsDao.insertMessage(new Message("How are you?", "04/18/2022, 12:41:20", true, "0"));
        contactsDao.insertMessage(new Message("I'm fine", "04/18/2022, 12:41:30", false, "0"));
        contactsDao.insertMessage(new Message("What's up?", "04/18/2022, 12:41:40", true, "0"));
        contactsDao.insertMessage(new Message("Nothing", "04/18/2022, 12:41:50", false, "0"));
    }

    public void insertContact(Contact contact) {
        contactsDao.insertContact(contact);
    }

    public void insertMessage(Message message) {
        contactsDao.insertMessage(message);
    }

    // TODO: reload contacts from web-api
    public void reload() {
        // Reload contacts from API
    }

    // Get contact by id
    public Contact getContact(String id) {
        return contactsDao.getContact(id);
    }

    // Get contacts list
    public LiveData<List<Contact>> getContacts() {
        return contactListData;
    }

    // Get all messages
    public LiveData<List<Message>> getMessages() {
        return messageListData;
    }

    class ContactListData extends MutableLiveData<List<Contact>> {
        public ContactListData() {
            super();
            setValue(new LinkedList<>());
        }

        @Override
        protected void onActive() {
            super.onActive();

            new Thread(() -> {
                List<Contact> contacts = contactsDao.index();
                postValue(contacts);
            }).start();
        }
    }

    class MessageListData extends MutableLiveData<List<Message>> {
        public MessageListData() {
            super();
            setValue(new LinkedList<>());
        }

        @Override
        protected void onActive() {
            super.onActive();

            new Thread(() -> {
                List<Message> messages = contactsDao.getMessages();
                postValue(messages);
            }).start();
        }
    }
}
