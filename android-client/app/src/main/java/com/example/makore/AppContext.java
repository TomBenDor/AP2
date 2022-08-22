package com.example.makore;

import android.content.Context;
import android.content.SharedPreferences;

import com.example.makore.auth.SignInActivity;

public class AppContext {
    SharedPreferences preferences;
    SharedPreferences.Editor editor;

    public SharedPreferences.Editor getEditor() {
        return editor;
    }

    public AppContext() {
        preferences = SignInActivity.context.getSharedPreferences("preferences", Context.MODE_PRIVATE);
        editor = preferences.edit();
    }

    public void set(String key, String value) {
        editor.putString(key, value);
        editor.apply();
    }

    public String get(String key) {
        return preferences.getString(key, "");
    }
}
