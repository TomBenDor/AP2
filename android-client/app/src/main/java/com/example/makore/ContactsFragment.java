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
import androidx.lifecycle.ViewModelProvider;
import androidx.navigation.fragment.NavHostFragment;
import androidx.recyclerview.widget.RecyclerView;
import androidx.room.Room;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;

import com.example.makore.adapters.ContactsListAdapter;
import com.example.makore.chat.AddContactActivity;
import com.example.makore.chat.ContactClickListener;
import com.example.makore.databinding.FragmentContactsBinding;
import com.example.makore.entities.Contact;
import com.example.makore.viewmodels.ContactsViewModel;

public class ContactsFragment extends Fragment implements ContactClickListener, SwipeRefreshLayout.OnRefreshListener {

    private FragmentContactsBinding binding;
    private SharedPreferences sharedpreferences;
    private ContactsListAdapter adapter;
    private ContactsViewModel viewModel;
    private SwipeRefreshLayout mSwipeRefreshLayout;

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
        viewModel = new ViewModelProvider(this).get(ContactsViewModel.class);

        return binding.getRoot();

    }

    public void onViewCreated(@NonNull View view, Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        mSwipeRefreshLayout = binding.swipeRefreshLayout;
        mSwipeRefreshLayout.setOnRefreshListener(this);

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

    @Override
    public void onRefresh() {
        // Refresh contacts list from web-api
        new Thread(() -> {
            viewModel.reload();
            mSwipeRefreshLayout.setRefreshing(false);
        }).start();
    }
}