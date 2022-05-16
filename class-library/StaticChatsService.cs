namespace DefaultNamespace;

public class StaticChatsService : IChatsService
{
    private static List<Chat> Chats = new List<User>();
    void Add(Chat chat)
    {
        Chats.Add(chat);
    }

    void Remove(Chat chat)
    {
        Chats.Remove(chat);
    }

    Chat Update(Chat chat)
    {
        Chat existingChat = Get(chat.Id);
        if (existingChat != null)
        {
            existingChat.Members = chat.Members;
            existingChat.Messages = chat.Messages;
            return existingChat;
        }
        return null;
    }

    Chat Get(int id)
    {
        return Chats.FirstOrDefault(c => c.Id == id);
    }

    IEnumerable<Chat> Get(IEnumerable<int> ids)
    {
        return Chats.Where(c => ids.Contains(c.Id));
    }

    IEnumerable<Chat> GetAll()
    {
        return Chats;
    }
}