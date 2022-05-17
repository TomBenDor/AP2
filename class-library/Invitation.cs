using System.ComponentModel.DataAnnotations;

namespace class_library;

public class Invitation
{
    [Required] public string? From { get; set; }
    [Required] public string? To { get; set; }

    [Required]
    // Server the invitation is sent from
    public string? Server { get; set; }
}