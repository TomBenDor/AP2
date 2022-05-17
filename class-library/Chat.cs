using System.ComponentModel.DataAnnotations;

namespace class_library;

public class Chat
{
    public Chat()
    {
        Members = new List<User>();
        Messages = new List<Message>();
    }

    public Chat(string id)
    {
        Id = id;
        Members = new List<User>();
        Messages = new List<Message>();
    }

    [Key] public string? Id { get; set; }
    [Required] public IList<User> Members { get; set; }
    [Required] public IList<Message> Messages { get; set; }
}