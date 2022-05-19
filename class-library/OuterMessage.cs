namespace class_library;

public class OuterMessage
{
    public OuterMessage(Message message, string loggedInUsername)
    {
        Id = message.Id;
        Content = message.Text;
        Created = message.Timestamp;
        Sent = loggedInUsername == message.Sender;
    }

    public int Id;
    public string Content;

    public DateTime Created;

    // True if the current logged in user is the author of this message
    public bool Sent;
}