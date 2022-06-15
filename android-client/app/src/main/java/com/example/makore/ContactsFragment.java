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

import com.example.makore.chat.AddContactActivity;
import com.example.makore.databinding.FragmentContactsBinding;

public class ContactsFragment extends Fragment {

    private FragmentContactsBinding binding;
    private SharedPreferences sharedpreferences;

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
        return binding.getRoot();

    }

    public void onViewCreated(@NonNull View view, Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        binding.buttonFirst.setOnClickListener(view1 -> NavHostFragment.findNavController(ContactsFragment.this)
                .navigate(R.id.action_ContactsFragment_to_ChatFragment));
        // Get current username
        String currentUsername = sharedpreferences.getString("username", "");
        binding.textviewFirst.setText(String.format("Contacts list of '%s'", currentUsername));
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }

}