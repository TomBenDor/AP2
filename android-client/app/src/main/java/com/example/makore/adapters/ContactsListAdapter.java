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
import com.example.makore.entities.Contact;

import java.util.List;

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

    public ContactsListAdapter(Context context) {
        mInflater = LayoutInflater.from(context);
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
            holder.lastMessage.setText(R.string.lastMsgPlaceholder);
            holder.lastMessageTime.setText(R.string.lastMsgTimePlaceholder);
            holder.profilePicture.setImageResource(current.getProfilePicture());
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
