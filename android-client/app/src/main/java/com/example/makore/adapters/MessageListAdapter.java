package com.example.makore.adapters;

import android.annotation.SuppressLint;
import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.example.makore.R;
import com.example.makore.entities.Message;

import java.util.List;

public class MessageListAdapter extends RecyclerView.Adapter<MessageListAdapter.MessageViewHolder> {
    class MessageViewHolder extends RecyclerView.ViewHolder {
        private final TextView content;
        private final TextView timestamp;

        private MessageViewHolder(View itemView) {
            super(itemView);
            content = itemView.findViewById(R.id.msgViewContent);
            timestamp = itemView.findViewById(R.id.msgViewTimestamp);
        }
    }

    private final LayoutInflater mInflater;
    private List<Message> mMessages;

    public MessageListAdapter(Context context) {
        mInflater = LayoutInflater.from(context);
    }

    @NonNull
    @Override
    public MessageViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View mView = mInflater.inflate(R.layout.message_view, parent, false);
        return new MessageViewHolder(mView);
    }

    @Override
    public void onBindViewHolder(@NonNull MessageViewHolder holder, int position) {
        if (mMessages != null) {
            Message current = mMessages.get(position);
            holder.content.setText(current.getContent());
            holder.timestamp.setText(current.getCreated());
        }
    }

    @SuppressLint("NotifyDataSetChanged")
    public void setMessages(List<Message> messages) {
        mMessages = messages;
        notifyDataSetChanged();
    }

    @Override
    public int getItemCount() {
        if (mMessages != null) {
            return mMessages.size();
        }
        return 0;
    }

    public List<Message> getMessages() {
        return mMessages;
    }
}
