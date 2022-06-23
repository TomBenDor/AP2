package com.example.makore.api;

import androidx.annotation.NonNull;

import com.example.makore.AppContext;
import com.example.makore.entities.Contact;
import com.example.makore.entities.Message;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import okhttp3.Interceptor;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import retrofit2.Call;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class ContactAPI {
    Retrofit retrofit;
    ContactServiceAPI contactServiceAPI;

    public ContactAPI() {
        OkHttpClient client = new OkHttpClient.Builder().addInterceptor(new Interceptor() {
            @NonNull
            @Override
            public Response intercept(@NonNull Chain chain) throws IOException {
                final String token = new AppContext().get("token");
                Request newRequest  = chain.request().newBuilder()
                        .addHeader("Authorization", "Bearer " + token)
                        .build();
                return chain.proceed(newRequest);
            }
        }).build();

        retrofit = new Retrofit.Builder().
                client(client).
                baseUrl("http://10.0.2.2:54321").
                addConverterFactory(GsonConverterFactory.create()).
                build();
        contactServiceAPI = retrofit.create(ContactServiceAPI.class);
    }

    public Call<List<Contact>> getContacts() {
        return contactServiceAPI.getContacts();
    }

    public Call<Void> addContact(String id, String name, String server) {
        return contactServiceAPI.addContact(Map.of("id", id, "name", name, "server", server));
    }

    public Call<Contact> getContact(String id) {
        return contactServiceAPI.getContact(id);
    }

    public Call<List<Message>> getMessages(String id) {
        return contactServiceAPI.getMessages(id);
    }

    public Call<Void> addMessage(String id, String content) {
        return contactServiceAPI.addMessage(id, Map.of("content", content));
    }
}
