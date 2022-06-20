package com.example.makore.adapters;

import android.annotation.SuppressLint;
import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.example.makore.R;
import com.example.makore.chat.ContactClickListener;
import com.example.makore.entities.Contact;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;

public class ContactsListAdapter extends RecyclerView.Adapter<ContactsListAdapter.ContactViewHolder> {
    class ContactViewHolder extends RecyclerView.ViewHolder {
        private final TextView name;
        private final TextView lastMessage;
        private final TextView lastMessageTime;
        private final ImageView profilePicture;

        private ContactViewHolder(View itemView) {
            super(itemView);
            name = itemView.findViewById(R.id.contactViewContactName);
            lastMessage = itemView.findViewById(R.id.contactViewLastMessage);
            lastMessageTime = itemView.findViewById(R.id.contactViewLastMessageTime);
            profilePicture = itemView.findViewById(R.id.contactViewProfilePicture);
        }
    }

    private final LayoutInflater mInflater;
    private List<Contact> mContacts;
    private ContactClickListener mContactClickListener;

    public ContactsListAdapter(Context context, ContactClickListener listener) {
        mInflater = LayoutInflater.from(context);
        mContactClickListener = listener;
    }

    @NonNull
    @Override
    public ContactViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View mView = mInflater.inflate(R.layout.contact_view, parent, false);
        return new ContactViewHolder(mView);
    }

    @Override
    public void onBindViewHolder(@NonNull ContactViewHolder holder, int position) {
        if (mContacts != null) {
            Contact current = mContacts.get(position);
            holder.name.setText(current.getName());
            if (current.getLast() != null) {
                holder.lastMessage.setText(current.getLast());
            } else {
                holder.lastMessage.setText("");
            }
            if (current.getLastDate() != null && android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
                // Parse the string from format "MM/dd/yyyy, HH:mm:ss" to "h:mm a"
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MM/dd/yyyy, HH:mm:ss", Locale.ENGLISH);
                LocalDateTime dateTime = LocalDateTime.parse(current.getLastDate(), formatter);
                holder.lastMessageTime.setText(dateTime.format(DateTimeFormatter.ofPattern("h:mm a", Locale.US)));
            } else {
                holder.lastMessageTime.setText("");
            }
            holder.profilePicture.setImageResource(current.getProfilePicture());

            // On click listener for the contact
            holder.itemView.setOnClickListener(v -> {
                // Invoke the listener passed in the constructor
                if (mContactClickListener != null) {
                    mContactClickListener.onContactClick(v, current);
                }
            });
        }
    }

    @SuppressLint("NotifyDataSetChanged")
    public void setContacts(List<Contact> contacts) {
        mContacts = contacts;
        notifyDataSetChanged();
    }

    public int getItemCount() {
        if (mContacts != null) {
            return mContacts.size();
        }
        return 0;
    }

    public List<Contact> getContacts() {
        return mContacts;
    }
}
