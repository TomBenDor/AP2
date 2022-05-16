namespace DefaultNamespace;

public class IChatsService
{
    void Add(Chat chat);
    void Remove(Chat chat);
    Chat Update(Chat chat);
    Chat Get(int id);
    IEnumerable<Chat> Get(IEnumerable<int> ids);
    IEnumerable<Chat> GetAll();
}