package com.example.makore;

import static android.content.Context.MODE_PRIVATE;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.navigation.fragment.NavHostFragment;
import androidx.room.Room;

import com.example.makore.chat.AddContactActivity;
import com.example.makore.databinding.FragmentContactsBinding;
import com.example.makore.entities.AppDB;
import com.example.makore.entities.Contact;
import com.example.makore.entities.ContactsDao;

import java.util.ArrayList;
import java.util.List;

public class ContactsFragment extends Fragment {

    private FragmentContactsBinding binding;
    private SharedPreferences sharedpreferences;
    private AppDB db;
    private ContactsDao contactsDao;
    private ArrayAdapter<Contact> adapter;
    private List<Contact> contacts;

    private void initDB() {
        // Create Room database
        db = Room.databaseBuilder(getContext(),
                AppDB.class, AppDB.DATABASE_NAME).allowMainThreadQueries().build();
        contactsDao = db.contactsDao();
    }

    @Override
    public View onCreateView(
            @NonNull LayoutInflater inflater, ViewGroup container,
            Bundle savedInstanceState
    ) {

        binding = FragmentContactsBinding.inflate(inflater, container, false);
        binding.fab.setOnClickListener(view -> {
            Intent intent = new Intent(getActivity(), AddContactActivity.class);
            startActivity(intent);
        });
        sharedpreferences = getActivity().getSharedPreferences("user", MODE_PRIVATE);
        initDB();

        return binding.getRoot();

    }

    public void onViewCreated(@NonNull View view, Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        binding.buttonFirst.setOnClickListener(view1 -> NavHostFragment.findNavController(ContactsFragment.this)
                .navigate(R.id.action_ContactsFragment_to_ChatFragment));
        // Get current username
        String currentUsername = sharedpreferences.getString("username", "");
        binding.textviewFirst.setText(String.format("Contacts list of '%s'", currentUsername));

        contacts = new ArrayList<>();
        adapter = new ArrayAdapter<>(getContext(), android.R.layout.simple_list_item_1, contacts);
        binding.listviewFirst.setAdapter(adapter);
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }

    @Override
    public void onResume() {
        super.onResume();
        // Get contacts from database and update the listview
        contacts.clear();
        contacts.addAll(contactsDao.index());
        adapter.notifyDataSetChanged();
    }

}