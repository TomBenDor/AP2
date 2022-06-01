using System.ComponentModel.DataAnnotations;

namespace class_library;

public class Transfer
{
    public Transfer(string from, string to, string content)
    {
        From = from;
        To = to;
        Content = content;
    }

    [Required] public string From { get; }
    [Required] public string To { get; }
    [Required] public string Content { get; }
}