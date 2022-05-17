using System.ComponentModel.DataAnnotations;

namespace class_library;

public class Chat
{
    [Key] public string Id { get; set; }
    [Required] public IList<User> Members { get; set; }
    [Required] public IList<Message> Messages { get; set; }
}