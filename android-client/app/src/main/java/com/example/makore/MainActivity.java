package com.example.makore;


import static androidx.appcompat.app.AppCompatDelegate.MODE_NIGHT_NO;
import static androidx.appcompat.app.AppCompatDelegate.MODE_NIGHT_YES;

import static com.example.makore.auth.SignInActivity.context;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.res.Configuration;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.NotificationManagerCompat;
import androidx.navigation.NavController;
import androidx.navigation.Navigation;
import androidx.navigation.ui.AppBarConfiguration;
import androidx.navigation.ui.NavigationUI;
import androidx.preference.PreferenceManager;
import androidx.room.Room;

import com.example.makore.auth.SignInActivity;
import com.example.makore.chat.SettingsActivity;
import com.example.makore.databinding.ActivityMainBinding;
import com.example.makore.entities.AppDB;

public class MainActivity extends AppCompatActivity {

    private AppBarConfiguration appBarConfiguration;
    private ActivityMainBinding binding;
    private SharedPreferences settingsSharedPreferences;
    private Boolean _isNightMode = null;
    private AppDB db;
    @SuppressLint("StaticFieldLeak")

    private void initDB() {
        // Create Room database
        db = Room.databaseBuilder(getApplicationContext(),
                AppDB.class, AppDB.DATABASE_NAME).allowMainThreadQueries().build();
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        int orientation = getResources().getConfiguration().orientation;
        if (orientation == Configuration.ORIENTATION_LANDSCAPE) {
            this.onConfigurationChanged(getResources().getConfiguration());
        }

        binding = ActivityMainBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());
        settingsSharedPreferences = PreferenceManager.getDefaultSharedPreferences(this);
        initDB();

        setSupportActionBar(binding.toolbar);

        NavController navController = Navigation.findNavController(this, R.id.nav_host_fragment_content_main);
        appBarConfiguration = new AppBarConfiguration.Builder(navController.getGraph()).build();
        NavigationUI.setupActionBarWithNavController(this, navController, appBarConfiguration);
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

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_main, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();

        //noinspection SimplifiableIfStatement
        if (id == R.id.action_settings) {
            // Navigate to the settings activity
            Intent intent = new Intent(MainActivity.this, SettingsActivity.class);
            startActivity(intent);
            return true;
        }
        if (id == R.id.action_sign_out) {
            // Sign out the user
            AppContext appContext = new AppContext();
            appContext.set("username", "");
            appContext.editor.clear();
            appContext.editor.apply();
            // Clear the database
            db.clearAllTables();
            //Clear notifications
            NotificationManagerCompat.from(context).cancelAll();
            // Navigate to the sign in activity
            Intent intent = new Intent(MainActivity.this, SignInActivity.class);
            startActivity(intent);
            finish();
            return true;
        }

        return super.onOptionsItemSelected(item);
    }

    @Override
    public boolean onSupportNavigateUp() {
        NavController navController = Navigation.findNavController(this, R.id.nav_host_fragment_content_main);
        return NavigationUI.navigateUp(navController, appBarConfiguration)
                || super.onSupportNavigateUp();
    }

    @Override
    public void onConfigurationChanged(@NonNull Configuration newConfig) {
        super.onConfigurationChanged(newConfig);
        Intent intent = new Intent(this, MainActivityLandscape.class);
        startActivity(intent);
    }
}