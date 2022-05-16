namespace DefaultNamespace;

public interface IUsersService
{
    void Add(User user);
    void Update(User user);
    void Delete(User user);
    User Get(string username);
    IEnumerable<User> GetAll();
}