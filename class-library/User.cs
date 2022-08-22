using System.ComponentModel.DataAnnotations;

namespace class_library;

public class User
{
    public User(string username, string name, string server)
    {
        Username = username;
        Name = name;
        Server = server;
        Chats = new List<Chat>();
        ContactsIds = new List<string>();
        ContactsNames = new List<string>();
    }

    public User()
    {
    }

    public User(string username, string name, string server, string password) : this(username,
        name, server)
    {
        Password = password;
    }

    public User(string username, string name, string server, string password, String profilePicture) : this(username,
        name, server, password)
    {
        ProfilePicture = profilePicture;
    }

    // Username must contain only letters, numbers, and hyphens
    [Key, RegularExpression(@"^[a-zA-Z0-9-]+$")]
    // Username must be at least 3 characters long
    [MinLength(3)]
    public string Username { get; set; }

    [Required]
    // Password must be at least 6 characters long
    [MinLength(6)]
    // Password must contain at least one number, one lowercase and one uppercase character
    [RegularExpression(@"^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$")]
    public string? Password { get; set; }

    [Required]
    // Display name must be at least 3 characters long
    [MinLength(3)]
    // Display name can only contain letters, spaces, hyphens, periods, dots, and commas
    [RegularExpression(@"^[a-zA-Z0-9- .,]+$")]
    public string Name { get; set; }

    [Required] public string Server { get; set; }

    public virtual List<Chat> Chats { get; set; }
    
    public List<string> ContactsIds { get; set; }
    
    public List<string> ContactsNames { get; set; }

    public String ProfilePicture { get; set; }
}