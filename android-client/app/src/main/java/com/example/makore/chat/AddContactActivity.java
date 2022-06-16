package com.example.makore.chat;

import android.content.SharedPreferences;
import android.os.Bundle;

import androidx.appcompat.app.ActionBar;
import androidx.appcompat.app.AppCompatActivity;
import androidx.room.Room;

import com.example.makore.databinding.ActivityAddContactBinding;
import com.example.makore.entities.AppDB;
import com.example.makore.entities.Contact;
import com.example.makore.entities.ContactsDao;

public class AddContactActivity extends AppCompatActivity {
    private ActivityAddContactBinding binding;
    private SharedPreferences sharedpreferences;
    private AppDB db;
    private ContactsDao contactsDao;

    private void initDB() {
        // Create Room database
        db = Room.databaseBuilder(getApplicationContext(),
                AppDB.class, AppDB.DATABASE_NAME).allowMainThreadQueries().build();
        contactsDao = db.contactsDao();
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityAddContactBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());
        ActionBar actionBar = getSupportActionBar();
        if (actionBar != null) {
            actionBar.setDisplayHomeAsUpEnabled(true);
        }
        sharedpreferences = getSharedPreferences("user", MODE_PRIVATE);

        // On click listener for the add contact button
        binding.addContactButton.setOnClickListener(v -> {
            // Get the contact username, display name, and server
            String username = binding.editTextUsername.getText().toString();
            String displayName = binding.editTextDisplayName.getText().toString();
            String server = binding.editTextServer.getText().toString();
            // Check if the username is empty
            if (username.isEmpty()) {
                binding.editTextUsername.setError("Username cannot be empty");
                return;
            }
            // Get current username
            String currentUsername = sharedpreferences.getString("username", "");
            if (username.equals(currentUsername)) {
                binding.editTextUsername.setError("You cannot add yourself");
                return;
            }
            // Check if the display name is empty
            if (displayName.isEmpty()) {
                binding.editTextDisplayName.setError("Contact name cannot be empty");
                return;
            }
            // Check if the server is empty
            if (server.isEmpty()) {
                binding.editTextServer.setError("Contact server cannot be empty");
                return;
            }
            // Check if the username is already in the database
            if (contactsDao.getContact(username) != null) {
                binding.editTextUsername.setError("Username already exists");
                return;
            }
            // Create a new contact
            contactsDao.insertContact(new Contact(username, displayName, server, null, null));
            // Go back to the previous activity
            finish();
        });

        initDB();
    }

    // Override back button to go back to MainActivity
    @Override
    public boolean onSupportNavigateUp() {
        onBackPressed();
        return true;
    }
}