package com.example.makore.api;

import com.example.makore.models.User;

import retrofit2.Call;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class UserAPI {
    Retrofit retrofit;
    UserServiceAPI usersServiceAPI;

    public UserAPI() {
        retrofit = new Retrofit.Builder().
                baseUrl("http://10.0.2.2:54321").
                addConverterFactory(GsonConverterFactory.create()).
                build();
        usersServiceAPI = retrofit.create(UserServiceAPI.class);
    }

    public Call<Object> signin(String username, String password) {
        return usersServiceAPI.signin(new User(username, password));
    }
}
