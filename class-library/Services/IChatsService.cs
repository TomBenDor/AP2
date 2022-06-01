namespace class_library.Services;

public interface IChatsService
{
    void Add(Chat chat);
    void Remove(Chat chat);
    Chat? Update(Chat chat);
    Chat? Get(string id);
    IEnumerable<Chat> Get(IEnumerable<string> ids);
    IEnumerable<Chat> GetAll();
}