package com.example.makore;

import static android.content.Context.MODE_PRIVATE;

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
import com.example.makore.chat.ContactClickListener;
import com.example.makore.databinding.FragmentContactsBinding;
import com.example.makore.entities.AppDB;
import com.example.makore.entities.Contact;
import com.example.makore.repositories.ContactsRepository;
import com.example.makore.viewmodels.ContactsViewModel;

public class ContactsFragment extends Fragment implements ContactClickListener {

    private FragmentContactsBinding binding;
    private SharedPreferences sharedpreferences;
    private ContactsListAdapter adapter;
    private ContactsViewModel viewModel;

    private void initViewModel() {
        // Create Room database
        AppDB db = Room.databaseBuilder(requireContext(),
                AppDB.class, AppDB.DATABASE_NAME).allowMainThreadQueries().build();
        ContactsRepository contactsRepository = new ContactsRepository(db.contactsDao());
        viewModel = new ContactsViewModel(contactsRepository);
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
        sharedpreferences = requireActivity().getSharedPreferences("user", MODE_PRIVATE);
        initViewModel();

        return binding.getRoot();

    }

    public void onViewCreated(@NonNull View view, Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        // Get current username
        String currentUsername = sharedpreferences.getString("username", "");

        RecyclerView contactsList = binding.lstContacts;
        adapter = new ContactsListAdapter(getContext(), this);
        contactsList.setAdapter(adapter);
        contactsList.setLayoutManager(new androidx.recyclerview.widget.LinearLayoutManager(getContext()));

        viewModel.getContacts().observe(getViewLifecycleOwner(), contacts -> adapter.setContacts(contacts));
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }

    @Override
    public void onContactClick(View v, Contact contact) {
        // Navigate to chat fragment
        // Create bundle with contact info
        Bundle bundle = new Bundle();
        bundle.putString("contactId", contact.getId());
        bundle.putString("contactName", contact.getName());
        NavHostFragment.findNavController(ContactsFragment.this)
                .navigate(R.id.action_ContactsFragment_to_ChatFragment, bundle);
    }
}