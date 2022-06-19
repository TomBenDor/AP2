package com.example.makore;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.RecyclerView;
import androidx.room.Room;

import com.example.makore.adapters.MessageListAdapter;
import com.example.makore.databinding.FragmentChatBinding;
import com.example.makore.entities.AppDB;
import com.example.makore.repositories.ContactsRepository;
import com.example.makore.viewmodels.ChatViewModel;

public class ChatFragment extends Fragment {

    private FragmentChatBinding binding;
    // private ContactsListAdapter adapter;
    private ChatViewModel viewModel;
    private MessageListAdapter adapter;
    private String contactId;

    private void initViewModel() {
        // Create Room database
        AppDB db = Room.databaseBuilder(requireContext(),
                AppDB.class, AppDB.DATABASE_NAME).allowMainThreadQueries().build();
        ContactsRepository contactsRepository = new ContactsRepository(db.contactsDao());
        viewModel = new ChatViewModel(contactsRepository);
    }

    @Override
    public View onCreateView(
            @NonNull LayoutInflater inflater, ViewGroup container,
            Bundle savedInstanceState
    ) {

        binding = FragmentChatBinding.inflate(inflater, container, false);
        initViewModel();
        return binding.getRoot();

    }

    public void onViewCreated(@NonNull View view, Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        contactId = null;
        // Get bundle from previous fragment
        Bundle bundle = getArguments();
        if (bundle != null) {
            contactId = bundle.getString("contactId");
            String name = bundle.getString("contactName");
        }
        if (contactId != null) {
            RecyclerView messagesRecyclerView = binding.lstMessages;
            adapter = new MessageListAdapter(getContext());
            messagesRecyclerView.setAdapter(adapter);
            messagesRecyclerView.setLayoutManager(new androidx.recyclerview.widget.LinearLayoutManager(getContext()));

            viewModel.getMessagesWithContact().observe(getViewLifecycleOwner(), messages -> adapter.setMessages(messages));
        }
        // Set contact name
        viewModel.setContactId(contactId);
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }

}