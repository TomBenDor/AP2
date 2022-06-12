package com.example.makore.chat;

import android.os.Bundle;

import androidx.appcompat.app.AppCompatActivity;

import com.example.makore.databinding.ActivityAddContactBinding;

public class AddContactActivity extends AppCompatActivity {
    private ActivityAddContactBinding binding;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityAddContactBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());
    }

    // Override back button to go back to MainActivity
    @Override
    public boolean onSupportNavigateUp() {
        onBackPressed();
        return true;
    }
}