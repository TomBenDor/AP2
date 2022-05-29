namespace class_library;

public class OuterUser
{
    public OuterUser(string username, Chat chat)
    {
        Id = username;
        var user = chat.Members.FirstOrDefault(x => x.Username == username);
        if (user == null)
        {
            throw new Exception("User not found in chat");
        }

        Name = user.Name;
        Server = user.Server == "localhost" ? "localhost:42690" : user.Server;
        // Get last message the user sent
        var lastMessage = chat.Messages.Where(x => x.Sender == username).OrderByDescending(x => x.Timestamp)
            .FirstOrDefault();
        if (lastMessage != null)
        {
            Last = lastMessage.Text;
            LastDate = lastMessage.Timestamp.ToString();
        }
    }

    public string Id { get; }
    public string Name { get; }
    public string Server { get; }
    public string? Last { get; }
    public string? LastDate { get; }
}