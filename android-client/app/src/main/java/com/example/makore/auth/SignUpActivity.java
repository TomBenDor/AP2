package com.example.makore.auth;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import com.example.makore.MainActivity;
import com.example.makore.api.UserAPI;
import com.example.makore.databinding.ActivitySignUpBinding;

import java.util.Map;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class SignUpActivity extends AppCompatActivity {

    private ActivitySignUpBinding binding;
    private SharedPreferences sharedpreferences;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivitySignUpBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        binding.linkToSignIn.setOnClickListener(view -> {
            Intent intent = new Intent(SignUpActivity.this, SignInActivity.class);
            startActivity(intent);
        });

        sharedpreferences = getSharedPreferences("user", MODE_PRIVATE);

        binding.signUpButton.setOnClickListener(view -> {
            // Get username, password, confirm password, display name and profile picture from UI
            String username = binding.editTextUsername.getText().toString();
            String password = binding.editTextPassword.getText().toString();
            String confirmPassword = binding.editTextConfirmPassword.getText().toString();
            String displayName = binding.editTextDisplayName.getText().toString();
            boolean isValid = true;

            // Validate username
            if (username.isEmpty()) {
                binding.editTextUsername.setError("Username is empty");
                isValid = false;
            } else if (username.length() < 3) {
                binding.editTextUsername.setError("Username must be at least 3 characters");
                isValid = false;
            } else if (!username.matches("^[a-zA-Z0-9-]+$")) {
                binding.editTextUsername.setError("Username must contain only letters, numbers and hyphens");
                isValid = false;
            }
            // Validate password and confirm password
            if (password.isEmpty()) {
                binding.editTextPassword.setError("Password is empty");
                isValid = false;
            } else if (password.length() < 6) {
                binding.editTextPassword.setError("Password must be at least 6 characters");
                isValid = false;
            } else if (!password.matches("(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).*")) {
                binding.editTextPassword.setError("Password must contain at least one number, one lowercase and one uppercase character");
                isValid = false;
            } else if (confirmPassword.isEmpty()) {
                binding.editTextConfirmPassword.setError("Confirm password is empty");
                isValid = false;
            } else if (!password.equals(confirmPassword)) {
                binding.editTextConfirmPassword.setError("Password confirmation doesn't match");
                isValid = false;
            }
            // Validate display name
            if (displayName.isEmpty()) {
                binding.editTextDisplayName.setError("Display name is empty");
            } else if (displayName.length() < 3) {
                binding.editTextDisplayName.setError("Display name must be at least 3 characters");
            } else if (!displayName.matches("^[a-zA-Z '-.,]+$")) {
                binding.editTextDisplayName.setError("Display name can only contain letters, spaces, hyphens, periods, dots, and commas");
            }

            UserAPI userAPI = new UserAPI();
            if (isValid) {
                Call<Void> signunCall = userAPI.signup(username, password, displayName);
                signunCall.enqueue(new Callback<>() {
                    @Override
                    public void onResponse(@NonNull Call<Void> call, @NonNull retrofit2.Response<Void> response) {
                        if (response.isSuccessful()) {
                            Call<Map<String, String>> signinCall = userAPI.signin(username, password);
                            signinCall.enqueue(new Callback<>() {
                                @Override
                                public void onResponse(@NonNull Call<Map<String, String>> call, @NonNull Response<Map<String, String>> response) {
                                    if (response.isSuccessful()) {
                                        Map<String, String> body = response.body();
                                        String token = body.get("token");
                                        SharedPreferences.Editor editor = sharedpreferences.edit();
                                        editor.putString("token", token);
                                        editor.putString("username", username);
                                        editor.apply();
                                        Intent intent = new Intent(SignUpActivity.this, MainActivity.class);
                                        startActivity(intent);
                                    }
                                }

                                @Override
                                public void onFailure(@NonNull Call<Map<String, String>> call, @NonNull Throwable t) {
                                    t.printStackTrace();
                                }
                            });
                        } else {
                            binding.editTextUsername.setError("Username already exists");
                        }
                    }

                    @Override
                    public void onFailure(@NonNull Call<Void> call, @NonNull Throwable t) {

                    }
                });
            }
        });
    }

    @Override
    protected void onStart() {
        super.onStart();
        // If the user is already signed in, go to the main screen
        if (!sharedpreferences.getString("username", "").isEmpty()) {
            // Go to the main screen
            Intent intent = new Intent(SignUpActivity.this, MainActivity.class);
            startActivity(intent);
        }
    }
}