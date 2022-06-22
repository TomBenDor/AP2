package com.example.makore.api;

import com.example.makore.entities.Contact;

import java.util.List;
import java.util.Map;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.POST;
import retrofit2.http.Path;

public interface ContactServiceAPI {
    @GET("/api/contacts")
    Call<List<Contact>> getContacts();

    @POST("/api/contacts")
    Call<Contact> addContact(@Body Map<String, String> contact);

    @GET("/api/contacts/{id}")
    Call<Contact> getContact(@Path("id") String id);

    @GET("/api/contacts/{id}/messages")
    Call<List<String>> getMessages(@Path("id") String id);

    @POST("/api/contacts/{id}/messages")
    Call<String> addMessage(@Path("id") String id, @Body String content);

    @POST("/api/invitations")
    Call<String> invite(@Body Map<String, String> invitation);

    @POST("/api/transfer")
    Call<String> transfer(@Body Map<String, String> transfer);
}
