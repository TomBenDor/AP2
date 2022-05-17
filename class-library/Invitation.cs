using System.ComponentModel.DataAnnotations;

namespace class_library;

public class Invitation
{
    public Invitation(string from, string to, string server)
    {
        From = from;
        To = to;
        Server = server;
    }

    [Required] public string From { get; }
    [Required] public string To { get; }

    [Required]
    // Server the invitation is sent from
    public string Server { get; }
}