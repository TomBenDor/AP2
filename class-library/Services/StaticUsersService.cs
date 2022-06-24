namespace class_library.Services;

public class StaticUsersService : IUsersService
{
    private static List<User> Users = new List<User> {
        new User("user123", "Coolest dude ever", "localhost", "pass123A"),
        new User("Crisr7", "Cristiano Ronaldo", "localhost", "Crisr7"),
        new User("drake6942", "Drake", "localhost", "DDdsf5"),
        new User("zuckyhomeboy", "Mark Zuckerberg", "localhost", "Markie(6)"),
        new User("OdedPaz", "Oded Paz", "localhost", "zaziBazazi12")
    };

    public User? Get(string username) 
    {
        return Users.FirstOrDefault(u => u.Username == username);
    }

    public IEnumerable<User> Get(List<string> usernames)
    {
        return Users.Where(u => usernames.Contains(u.Username));
    }

    public void Add(User user)
    {
        Users.Add(user);
    }

    public User? Update(User user)
    {
        var existingUser = Get(user.Username);
        if (existingUser != null)
        {
            existingUser.Password = user.Password;
            existingUser.Name = user.Name;
            existingUser.Server = user.Server;
            existingUser.Chats = user.Chats;
            return existingUser;
        }

        return null;
    }

    public void Delete(User user)
    {
        var existingUser = Get(user.Username);
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