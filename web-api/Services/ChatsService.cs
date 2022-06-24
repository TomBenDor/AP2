using class_library;
using class_library.Services;
using Microsoft.EntityFrameworkCore;
using web_api.Context;

namespace web_api.Services;

public class ChatsService : IChatsService
{
    private ChatsContext db;

    public ChatsService(ChatsContext context)
    {
        db = context;
    }

    public void Add(Chat chat)
    {
        db.Chats.Add(chat);
        db.SaveChanges();
    }

    public void Remove(Chat chat)
    {
        db.Chats.Remove(chat);
        db.SaveChanges();
    }

    public Chat? Update(Chat chat)
    {
        Chat? oldChat = db.Chats.Find(chat.Id);
        if (oldChat is null)
        {
            return null;
        }

        oldChat.Members = chat.Members;
        oldChat.Messages = chat.Messages;
        db.Chats.Update(oldChat);
        db.SaveChanges();
        return oldChat;
    }

    public Chat? Get(string id)
    {
        return db.Chats.Find(id);
    }

    public IEnumerable<Chat> Get(IEnumerable<string> ids)
    {
        return db.Chats.Where(chat => ids.Contains(chat.Id));
    }

    public IEnumerable<Chat> GetAll()
    {
        return db.Chats;
    }
}