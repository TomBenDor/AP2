namespace class_library;

public class OuterMessage
{
    public OuterMessage(int i, Message message, string loggedInUsername)
    {
        Id = i;
        Content = message.Text;
        Created = message.Timestamp.ToString("MM/dd/yyyy, HH:mm:ss");
        Sent = loggedInUsername == message.Sender;
    }

    public int Id { get; }
    public string Content { get; }

    public string Created { get; }

    // True if the current logged in user is the author of this message
    public bool Sent { get; }
}