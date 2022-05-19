namespace class_library.Services;

public class StaticChatsService : IChatsService
{
    private static List<Chat> Chats = new List<Chat>();

    public void Add(Chat chat)
    {
        Chats.Add(chat);
    }

    public void Remove(Chat chat)
    {
        var existingChat = Get(chat.Id);
        if (existingChat != null)
        {
            Chats.Remove(existingChat);
        }
    }

    public Chat? Update(Chat chat)
    {
        var existingChat = Get(chat.Id);
        if (existingChat != null)
        {
            existingChat.Members = chat.Members;
            existingChat.Messages = chat.Messages;
            return existingChat;
        }

        return null;
    }

    public Chat? Get(string id)
    {
        return Chats.FirstOrDefault(c => c.Id == id);
    }

    public IEnumerable<Chat> Get(IEnumerable<string> ids)
    {
        return Chats.Where(c => ids.Contains(c.Id));
    }

    public IEnumerable<Chat> GetAll()
    {
        return Chats;
    }
}