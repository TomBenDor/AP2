package com.example.makore.chat;

import static androidx.appcompat.app.AppCompatDelegate.MODE_NIGHT_NO;
import static androidx.appcompat.app.AppCompatDelegate.MODE_NIGHT_YES;

import android.content.SharedPreferences;
import android.os.Bundle;

import androidx.appcompat.app.ActionBar;
import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.ViewModelProvider;
import androidx.preference.PreferenceManager;

import com.example.makore.databinding.ActivityAddContactBinding;
import com.example.makore.entities.Contact;
import com.example.makore.viewmodels.ContactsViewModel;

public class AddContactActivity extends AppCompatActivity {
    private ActivityAddContactBinding binding;
    private SharedPreferences sharedpreferences;
    private SharedPreferences settingsSharedPreferences;
    private ContactsViewModel viewModel;
    private Boolean _isNightMode = null;

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
        viewModel = new ViewModelProvider(this).get(ContactsViewModel.class);

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
            if (viewModel.getContact(username) != null) {
                binding.editTextUsername.setError("Username already exists");
                return;
            }
            // Create a new contact
            viewModel.insertContact(new Contact(username, displayName, server, null, null));
            // Go back to the previous activity
            finish();
        });
        settingsSharedPreferences = PreferenceManager.getDefaultSharedPreferences(this);
    }

    @Override
    public void onResume() {
        super.onResume();
        boolean isNightMode = settingsSharedPreferences.getBoolean("dark_mode", false);
        if (_isNightMode != null && isNightMode == _isNightMode) {
            return;
        }
        if (isNightMode) {
            getDelegate().setLocalNightMode(MODE_NIGHT_YES);
        } else {
            getDelegate().setLocalNightMode(MODE_NIGHT_NO);
        }
        _isNightMode = isNightMode;
    }

    // Override back button to go back to MainActivity
    @Override
    public boolean onSupportNavigateUp() {
        onBackPressed();
        return true;
    }
}