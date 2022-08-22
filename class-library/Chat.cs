using System.ComponentModel.DataAnnotations;

namespace class_library;

public class Chat
{
    public Chat(string id)
    {
        Id = id;
        Members = new List<User>();
        Messages = new List<Message>();
    }

    public Chat()
    {
    }

    [Key] public string Id { get; set; }
    [Required] public virtual List<User> Members { get; set; }
    [Required] public virtual List<Message> Messages { get; set; }
}