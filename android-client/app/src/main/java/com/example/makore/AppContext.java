package com.example.makore;

import android.content.Context;
import android.content.SharedPreferences;

public class AppContext {
    SharedPreferences preferences;
    SharedPreferences.Editor editor;

    public AppContext() {
        preferences = MainActivity.context.getSharedPreferences("preferences", Context.MODE_PRIVATE);
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
