package com.example.makore.auth;

import static androidx.appcompat.app.AppCompatDelegate.MODE_NIGHT_YES;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.app.AppCompatDelegate;
import androidx.preference.PreferenceManager;

import com.example.makore.AppContext;
import com.example.makore.MainActivity;
import com.example.makore.api.UserAPI;
import com.example.makore.databinding.ActivitySignInBinding;

import java.util.Map;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class SignInActivity extends AppCompatActivity {

    private ActivitySignInBinding binding;
    public static Context context;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        SharedPreferences sharedPreferences1 = PreferenceManager.getDefaultSharedPreferences(this);
        boolean isNightMode = sharedPreferences1.getBoolean("dark_mode", false);
        if (isNightMode) {
            AppCompatDelegate.setDefaultNightMode(MODE_NIGHT_YES);
        }
        super.onCreate(savedInstanceState);
        context = this;
        binding = ActivitySignInBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        binding.linkToSignUp.setOnClickListener(view -> {
            Intent intent = new Intent(SignInActivity.this, SignUpActivity.class);
            startActivity(intent);
        });

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
                UserAPI userAPI = new UserAPI();
                Call<Map<String, String>> call = userAPI.signin(username, password);
                call.enqueue(new Callback<>() {
                    @Override
                    public void onResponse(@NonNull Call<Map<String, String>> call, @NonNull Response<Map<String, String>> response) {
                        boolean success = response.isSuccessful();
                        if (success) {
                            // Save username and password to shared preferences
                            AppContext appContext = new AppContext();
                            appContext.set("username", username);
                            appContext.set("token", response.body().get("token"));
                            // Go to main activity
                            Intent intent = new Intent(SignInActivity.this, MainActivity.class);
                            startActivity(intent);
                        } else {
                            // Show error message
                            binding.editTextUsername.setError("Invalid username or password");
                        }
                    }

                    @Override
                    public void onFailure(@NonNull Call<Map<String, String>> call, @NonNull Throwable t) {
                        // Show error message
                        binding.editTextUsername.setError("Error connecting to server");
                    }
                });
            }
        });
    }

    @Override
    protected void onStart() {
        super.onStart();
        // If the user is already signed in, go to the main screen
        if (!new AppContext().get("username").isEmpty()) {
            // Go to the main screen
            Intent intent = new Intent(SignInActivity.this, MainActivity.class);
            startActivity(intent);
        }
    }
}