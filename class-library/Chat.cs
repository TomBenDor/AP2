using System.ComponentModel.DataAnnotations;

namespace class_library;

public class Chat
{
    [Key]
    public int Id { get; set; }
    public const string Type = "one-to-one";
    [Required]
    public  ICollection<User> Members { get; set; }
    [Required]
    public ICollection<Message> Messages { get; set; }
}