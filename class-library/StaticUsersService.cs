namespace DefaultNamespace;

public class StaticUsersService : IUsersService
{
    private static List<User> Users = new List<User>();

    public User Get(string username)
    {
        return Users.FirstOrDefault(u => u.Username == username);
    }
    
    public IEnumerable<User> Get(List<string> usernames){
        return Users.Where(u => usernames.Contains(u.Username));
    }

    public void Add(User user)
    {
        Users.Add(user);
    }

    User Update(User user)
    {
        User existingUser = Get(user.Username);
        if (existingUser != null)
        {
            existingUser.Username = user.Username;
            existingUser.Password = user.Password;
            existingUser.Name = user.Name;
            existingUser.ProfilePicture = user.ProfilePicture;
            existingUser.Server = user.Server;
            existingUser.Chats = user.Chats;
            existingUser.UnreadMessages = user.UnreadMessages;
            return existingUser;
        }
        return null;
    }

    void Delete(User user)
    {
        User existingUser = Get(user.Username);
        if (existingUser != null)
        {
            Users.Remove(existingUser);
        }
    }
    
    public IEnumerable<User> GetAll()
    {
        return Users;
    }
}