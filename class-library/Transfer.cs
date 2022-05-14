using System.ComponentModel.DataAnnotations;

namespace class_library;

public class Transfer
{
    [Required]
    public string From { get; set; }
    [Required]
    public string To { get; set; }
    [Required]
    public string Content { get; set; }
}