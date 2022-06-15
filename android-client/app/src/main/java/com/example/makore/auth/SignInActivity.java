package com.example.makore.auth;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;

import androidx.appcompat.app.AppCompatActivity;

import com.example.makore.MainActivity;
import com.example.makore.databinding.ActivitySignInBinding;

public class SignInActivity extends AppCompatActivity {

    private ActivitySignInBinding binding;
    private SharedPreferences sharedpreferences;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivitySignInBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        binding.linkToSignUp.setOnClickListener(view -> {
            Intent intent = new Intent(SignInActivity.this, SignUpActivity.class);
            startActivity(intent);
        });

        sharedpreferences = getSharedPreferences("user", MODE_PRIVATE);

        binding.signInButton.setOnClickListener(view -> {
            // Get username and password from the UI
            String username = binding.editTextUsername.getText().toString();
            String password = binding.editTextPassword.getText().toString();
            if (username.isEmpty()) {
                // Show error message
                binding.editTextUsername.setError("Username is empty");
            } else if (password.isEmpty()) {
                // Show error message
                binding.editTextPassword.setError("Password is empty");
            } else {
                // Check if the username and password is correct
                if (username.equals("admin") && password.equals("admin")) {
                    // Save the username in the SharedPreferences
                    SharedPreferences.Editor editor = sharedpreferences.edit();
                    editor.putString("username", username);
                    editor.apply();
                    // Go to the main screen
                    Intent intent = new Intent(SignInActivity.this, MainActivity.class);
                    startActivity(intent);
                } else {
                    // Show error message
                    binding.editTextUsername.setError("One of the fields is invalid");
                }
            }
        });
    }

    @Override
    protected void onStart() {
        super.onStart();
        // If the user is already signed in, go to the main screen
        if (!sharedpreferences.getString("username", "").isEmpty()) {
            // Go to the main screen
            Intent intent = new Intent(SignInActivity.this, MainActivity.class);
            startActivity(intent);
        }
    }
}