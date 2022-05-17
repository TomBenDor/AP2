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

    [Required] public string From { get; set; }
    [Required] public string To { get; set; }

    [Required]
    // Server the invitation is sent from
    public string Server { get; set; }
}