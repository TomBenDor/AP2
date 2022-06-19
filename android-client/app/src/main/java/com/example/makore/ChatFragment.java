package com.example.makore;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;
import androidx.recyclerview.widget.RecyclerView;

import com.example.makore.adapters.MessageListAdapter;
import com.example.makore.databinding.FragmentChatBinding;
import com.example.makore.entities.Message;
import com.example.makore.viewmodels.ContactsViewModel;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

public class ChatFragment extends Fragment {

    private FragmentChatBinding binding;
    // private ContactsListAdapter adapter;
    private ContactsViewModel viewModel;
    private MessageListAdapter adapter;
    private String contactId;

    @Override
    public View onCreateView(
            @NonNull LayoutInflater inflater, ViewGroup container,
            Bundle savedInstanceState
    ) {

        binding = FragmentChatBinding.inflate(inflater, container, false);
        return binding.getRoot();

    }

    public void onViewCreated(@NonNull View view, Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        viewModel = new ViewModelProvider(this).get(ContactsViewModel.class);
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

            viewModel.getMessages().observe(getViewLifecycleOwner(), messages -> {
                adapter.setMessages(viewModel.getMessagesWithContact());
                System.out.println("Messages: " + messages);
            });
        }
        // Set contact name
        viewModel.setContactId(contactId);

        binding.sendBtn.setOnClickListener(v -> {
            if (contactId == null) {
                return;
            }
            String messageContent = binding.messageInput.getText().toString();
            if (messageContent.length() > 0) {
                // Format timestamp in MM/dd/yyyy HH:mm:ss
                String timestamp = null;
                if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
                    timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("MM/dd/yyyy, HH:mm:ss", Locale.US));
                }
                // Create new message object
                Message newMessage = new Message(messageContent, timestamp, true, contactId);
                // Insert message into database
                viewModel.insertMessage(newMessage);
                binding.messageInput.setText("");
            }
        });
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }

}