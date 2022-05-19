namespace class_library.Services;

public interface IUsersService
{
    void Add(User user);
    User? Update(User user);
    void Delete(User user);
    User? Get(string username);
    IEnumerable<User> Get(List<string> usernames);
    IEnumerable<User> GetAll();
}