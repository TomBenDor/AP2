using class_library;

namespace DefaultNamespace;

public interface IChatsService
{
    void Add(Chat chat);
    void Remove(Chat chat);
    Chat Update(Chat chat);
    Chat Get(string id);
    IEnumerable<Chat> Get(IEnumerable<string> ids);
    IEnumerable<Chat> GetAll();
}