using System.ComponentModel.DataAnnotations;

namespace class_library;

public class Message
{
    public Message(string message, string sender, DateTime date)
    {
        Text = message;
        Sender = sender;
        Timestamp = date;
    }

    public Message()
    {
    }

    [Key] public int Id { get; set; }
    [Required] public string Sender { get; set; }
    [Required] public string Text { get; set; }
    [Required] public DateTime Timestamp { get; set; }
}