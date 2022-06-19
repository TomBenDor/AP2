package com.example.makore.api;

import java.util.Map;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.POST;

public interface UserServiceAPI {
    @POST("/api/contacts/signin")
    Call<Map<String, String>> signin(@Body Map<String, String> user);

    @POST("/api/contacts/signup")
    Call<Void> signup(@Body Map<String, String> user);
}
