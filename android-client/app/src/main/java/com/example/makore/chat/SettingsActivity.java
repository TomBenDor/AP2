package com.example.makore.chat;

import static androidx.appcompat.app.AppCompatDelegate.MODE_NIGHT_NO;
import static androidx.appcompat.app.AppCompatDelegate.MODE_NIGHT_YES;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;

import androidx.appcompat.app.ActionBar;
import androidx.appcompat.app.AppCompatActivity;
import androidx.preference.PreferenceFragmentCompat;
import androidx.preference.PreferenceManager;
import androidx.room.Room;

import com.example.makore.AppContext;
import com.example.makore.R;
import com.example.makore.auth.SignInActivity;
import com.example.makore.entities.AppDB;

public class SettingsActivity extends AppCompatActivity {
    private SharedPreferences settingsSharedPreferences;
    private AppDB db;

    private void initDB() {
        // Create Room database
        db = Room.databaseBuilder(getApplicationContext(),
                AppDB.class, AppDB.DATABASE_NAME).allowMainThreadQueries().build();
    }

    private void changeTheme(boolean isNightMode) {
        if (isNightMode) {
            getDelegate().setLocalNightMode(MODE_NIGHT_YES);
        } else {
            getDelegate().setLocalNightMode(MODE_NIGHT_NO);
        }
    }

    private void changeServer(String server) {
        // Sign out the user
        AppContext appContext = new AppContext();
        appContext.set("username", "");
        appContext.getEditor().clear();
        appContext.getEditor().apply();
        // Clear the database
        db.clearAllTables();
        // Navigate to the sign in activity
        Intent intent = new Intent(SettingsActivity.this, SignInActivity.class);
        startActivity(intent);
        finish();
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.settings_activity);
        setSupportActionBar(findViewById(R.id.settings_toolbar));
        if (savedInstanceState == null) {
            getSupportFragmentManager()
                    .beginTransaction()
                    .replace(R.id.settings, new SettingsFragment())
                    .commit();
        }
        // Display back button
        ActionBar actionBar = getSupportActionBar();
        if (actionBar != null) {
            actionBar.setDisplayHomeAsUpEnabled(true);
        }
        settingsSharedPreferences = PreferenceManager.getDefaultSharedPreferences(this);
        // Set default values for the preferences (before creating a listener!)
        PreferenceManager.setDefaultValues(this, R.xml.root_preferences, true);
        SharedPreferences.OnSharedPreferenceChangeListener listener = (preferences, key) -> {
            if (key.equals("dark_mode")) {
                changeTheme(preferences.getBoolean(key, false));
            } else if (key.equals("server")) {
                changeServer(preferences.getString(key, getString(R.string.default_server_address)));
            }
        };
        settingsSharedPreferences.registerOnSharedPreferenceChangeListener(listener);
        initDB();
    }

    public static class SettingsFragment extends PreferenceFragmentCompat {
        @Override
        public void onCreatePreferences(Bundle savedInstanceState, String rootKey) {
            setPreferencesFromResource(R.xml.root_preferences, rootKey);
        }
    }

    @Override
    public void onResume() {
        super.onResume();
        boolean isNightMode = settingsSharedPreferences.getBoolean("dark_mode", false);
        if (isNightMode) {
            getDelegate().setLocalNightMode(MODE_NIGHT_YES);
        } else {
            getDelegate().setLocalNightMode(MODE_NIGHT_NO);
        }
    }

    // Override back button to go back to MainActivity
    @Override
    public boolean onSupportNavigateUp() {
        onBackPressed();
        return true;
    }
}