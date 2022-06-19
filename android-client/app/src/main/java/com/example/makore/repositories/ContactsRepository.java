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
    private MessagesWithContactListData messagesWithContactListData;
    // private ContactsAPI api;

    public ContactsRepository(ContactsDao contactsDao) {
        this.contactsDao = contactsDao;
        // this.api = api;
        contactListData = new ContactListData();
        messageListData = new MessageListData();
        messagesWithContactListData = new MessagesWithContactListData();
    }

    public void insertContact(Contact contact) {
        contactsDao.insertContact(contact);
    }

    public void insertMessage(Message message) {
        contactsDao.insertMessage(message);
    }

    public void reload() {
        // Reload contacts from API
    }

    // Get contact by id
    public Contact getContact(String id) {
        return contactsDao.getContact(id);
    }

    public LiveData<List<Contact>> getContacts() {
        return contactListData;
    }

    public LiveData<List<Message>> getMessages() {
        return messageListData;
    }

    public LiveData<List<Message>> getMessagesWithContact() {
        return messagesWithContactListData;
    }

    public void setContactId(String contactId) {
        messagesWithContactListData.setContactId(contactId);
    }

    public String getContactId() {
        return messagesWithContactListData.getContactId();
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

    class MessagesWithContactListData extends MutableLiveData<List<Message>> {
        private String contactId;

        public MessagesWithContactListData() {
            super();
            contactId = null;
        }

        @Override
        protected void onActive() {
            super.onActive();

            new Thread(() -> {
                if (contactId != null) {
                    List<Message> messages = contactsDao.getAllMessagesWithContact(contactId);
                    postValue(messages);
                } else {
                    postValue(new LinkedList<>());
                }
            }).start();
        }

        public void setContactId(String contactId) {
            this.contactId = contactId;
        }

        public String getContactId() {
            return contactId;
        }
    }
}
