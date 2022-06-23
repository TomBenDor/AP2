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

    public void deleteContacts() {
        contactsDao.deleteContacts();
        contactListData.setValue(null);
    }

    private void deleteMessages(String id) {
        contactsDao.deleteMessages(id);
        messageListData.setValue(contactsDao.getMessages());
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
                if (response.isSuccessful()) {
                    deleteContacts();
                    List<Contact> contacts = response.body();
                    if (contacts != null && !contacts.isEmpty()) {
                        for (Contact contact : contacts) {
                            insertContact(contact);

                            contactAPI.getMessages(contact.getId())
                                    .enqueue(new Callback<>() {
                                                 @Override
                                                 public void onResponse(@NonNull Call<List<Message>> call, @NonNull Response<List<Message>> response) {
                                                     if (response.isSuccessful()) {
                                                         deleteMessages(contact.getId());
                                                         List<Message> messages = response.body();
                                                         if (messages != null && !messages.isEmpty()) {
                                                             for (Message message : messages) {
                                                                 Message newMessage = new Message(message.getContent(), message.getCreated(), message.isSent(), contact.getId());
                                                                 insertMessage(newMessage);
                                                             }
                                                         }
                                                     }
                                                 }

                                                 @Override
                                                 public void onFailure(@NonNull Call<List<Message>> call, @NonNull Throwable t) {
                                                    t.printStackTrace();
                                                 }
                                             }
                                    );
                        }
                    }
                }
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
