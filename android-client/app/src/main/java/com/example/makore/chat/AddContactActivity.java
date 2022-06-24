package com.example.makore.chat;

import static androidx.appcompat.app.AppCompatDelegate.MODE_NIGHT_NO;
import static androidx.appcompat.app.AppCompatDelegate.MODE_NIGHT_YES;

import android.content.SharedPreferences;
import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.appcompat.app.ActionBar;
import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.ViewModelProvider;
import androidx.preference.PreferenceManager;

import com.example.makore.AppContext;
import com.example.makore.R;
import com.example.makore.api.ContactAPI;
import com.example.makore.databinding.ActivityAddContactBinding;
import com.example.makore.entities.Contact;
import com.example.makore.viewmodels.ContactsViewModel;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class AddContactActivity extends AppCompatActivity {
    private ActivityAddContactBinding binding;

    private SharedPreferences settingsSharedPreferences;
    private ContactsViewModel viewModel;
    private Boolean _isNightMode = null;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityAddContactBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());
        setSupportActionBar(binding.toolbar);
        ActionBar actionBar = getSupportActionBar();
        if (actionBar != null) {
            actionBar.setDisplayHomeAsUpEnabled(true);
        }
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
            String currentUsername = new AppContext().get("username");
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
            // POST request to add the contact to the server
            new ContactAPI().addContact(username, displayName, server).enqueue(new Callback<Void>() {
                @Override
                public void onResponse(@NonNull Call<Void> call, @NonNull Response<Void> response) {
                    // If the response is successful, finish the activity
                    if (response.isSuccessful()) {

                    } else {
                        binding.editTextUsername.setError(String.format("%s can't be added", username));
                    }
                }

                @Override
                public void onFailure(@NonNull Call<Void> call, @NonNull Throwable t) {
                    // If the request fails, show an error message
                    binding.editTextUsername.setError(getString(R.string.connection_error));
                    t.printStackTrace();
                }
            });
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