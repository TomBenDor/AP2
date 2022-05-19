using System.ComponentModel.DataAnnotations;

namespace class_library;

public class Message
{
    public Message(int id, string message, string sender, DateTime date, string type)
    {
        Id = id;
        Text = message;
        Sender = sender;
        Timestamp = date;
        Type = type;
    }

    [Key] public int Id { get; set; }
    [Required] public string Sender { get; set; }
    [Required] public string Text { get; set; }
    [Required] public DateTime Timestamp { get; set; }
    [Required] public string Type { get; set; }
}