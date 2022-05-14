using System.ComponentModel.DataAnnotations;

namespace class_library;

public class Message
{
    [Key]
    public int Id { get; set; }
    [Required]
    public string Sender { get; set; }
    [Required]
    public string Text { get; set; }
    [Required]
    public DateTime Timestamp { get; set; }
    [Required]
    public string type { get; set; }
}