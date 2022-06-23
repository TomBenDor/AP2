package com.example.makore.repositories;

import androidx.annotation.NonNull;
import androidx.lifecycle.MutableLiveData;
import androidx.room.Room;

import com.example.makore.api.ContactAPI;
import com.example.makore.auth.SignInActivity;
import com.example.makore.entities.AppDB;
import com.example.makore.entities.Contact;
import com.example.makore.entities.ContactsDao;
import com.example.makore.entities.Message;

import java.util.LinkedList;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class ContactsRepository {
    private final ContactsDao contactsDao;
    private final ContactListData contactListData;
    private final MessageListData messageListData;

    public ContactsRepository() {
        // Create Room database
        AppDB db = Room.databaseBuilder(SignInActivity.context,
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

    public void reload() {
        ContactAPI contactAPI = new ContactAPI();
        contactAPI.getContacts().enqueue(new Callback<>() {

            @Override
            public void onResponse(@NonNull Call<List<Contact>> call, @NonNull Response<List<Contact>> response) {
                ContactsRepository.this.contactListData.setValue(response.body());
            }

            @Override
            public void onFailure(@NonNull Call<List<Contact>> call, @NonNull Throwable t) {
                t.printStackTrace();
            }
        });
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
