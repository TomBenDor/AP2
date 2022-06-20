package com.example.makore.repositories;

import androidx.lifecycle.MutableLiveData;
import androidx.room.Room;

import com.example.makore.MainActivity;
import com.example.makore.entities.AppDB;
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

    public ContactsRepository() {
        // Create Room database
        AppDB db = Room.databaseBuilder(MainActivity.context,
                AppDB.class, AppDB.DATABASE_NAME).allowMainThreadQueries().build();
        contactsDao = db.contactsDao();
        // this.api = api;
        contactListData = new ContactListData();
        messageListData = new MessageListData();
    }

    public void insertContact(Contact contact) {
        contactsDao.insertContact(contact);
        List<Contact> contactsList = contactListData.getValue();
        if (contactsList == null) {
            contactsList = new LinkedList<>();
        }
        contactsList.add(contact);
        contactListData.setValue(contactsList);
    }

    public void insertMessage(Message message) {
        contactsDao.insertMessage(message);
        List<Message> messageList = messageListData.getValue();
        if (messageList == null) {
            messageList = new LinkedList<>();
        }
        messageList.add(message);
        messageListData.setValue(messageList);
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
    public MutableLiveData<List<Contact>> getContacts() {
        return contactListData;
    }

    // Get all messages
    public MutableLiveData<List<Message>> getMessages() {
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
