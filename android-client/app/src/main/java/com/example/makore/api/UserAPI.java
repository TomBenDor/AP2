package com.example.makore.api;

import androidx.preference.PreferenceManager;

import com.example.makore.auth.SignInActivity;

import java.util.Map;

import retrofit2.Call;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class UserAPI {
    Retrofit retrofit;
    UserServiceAPI userServiceAPI;

    public UserAPI() {
        // Get server address from settings
        String apiAddress = "http://" + PreferenceManager.getDefaultSharedPreferences(SignInActivity.context).getString("server", "10.0.2.2:54321");
        retrofit = new Retrofit.Builder().
                baseUrl(apiAddress).
                addConverterFactory(GsonConverterFactory.create()).
                build();
        userServiceAPI = retrofit.create(UserServiceAPI.class);
    }

    public Call<Map<String, String>> signin(String username, String password) {
        return userServiceAPI.signin(Map.of("username", username, "password", password));
    }

    public Call<Void> signup(String username, String password, String name, String profilePicture) {
        return userServiceAPI.signup(Map.of("username", username, "password", password, "name", name, "profilePicture", profilePicture));
    }
}
