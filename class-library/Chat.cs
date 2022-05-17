using System.ComponentModel.DataAnnotations;

namespace class_library;

public class Chat
{
    [Key] public string Id { get; set; }
    [Required] public ICollection<User> Members { get; set; }
    [Required] public ICollection<Message> Messages { get; set; }
}