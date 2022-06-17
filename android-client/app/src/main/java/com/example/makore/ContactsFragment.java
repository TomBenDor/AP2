package com.example.makore;

import static android.content.Context.MODE_PRIVATE;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.navigation.fragment.NavHostFragment;
import androidx.recyclerview.widget.RecyclerView;
import androidx.room.Room;

import com.example.makore.adapters.ContactsListAdapter;
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
    private ContactsListAdapter adapter;
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

        RecyclerView contactsList = binding.lstContacts;
        adapter = new ContactsListAdapter(getContext());
        contactsList.setAdapter(adapter);
        contactsList.setLayoutManager(new androidx.recyclerview.widget.LinearLayoutManager(getContext()));

        // Initialize contacts as an empty list
        // Getting contacts from database happens in onResume()
        contacts = new ArrayList<>();
        adapter.setContacts(contacts);
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }

    @SuppressLint("NotifyDataSetChanged")
    @Override
    public void onResume() {
        super.onResume();
        // Get contacts from database and update the listview
        contacts.clear();
        contacts.addAll(contactsDao.index());
        System.out.println("Resume contacts: " + contacts);
        adapter.notifyDataSetChanged();
    }

}