package com.example.makore.api;

import com.example.makore.models.User;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.Headers;
import retrofit2.http.POST;

public interface UserServiceAPI {
    @Headers("Content-type: application/json")
    @POST("/api/contacts/signin")
    Call<Object> signin(@Body User user);
}
