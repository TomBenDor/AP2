﻿using System.ComponentModel.DataAnnotations;

namespace class_library;

public class User
{
    // Username must contain only letters, numbers, and hyphens
    [Key, RegularExpression(@"^[a-zA-Z0-9-]+$")]
    // Username must be at least 3 characters long
    [MinLength(3)]
    public string Username { get; set; }
    
    [Required]
    // Password must be at least 6 characters long
    [MinLength(6)]
    // Password must contain at least one number, one lowercase and one uppercase character
    [RegularExpression(@"^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$")]
    public string Password { get; set; }
    
    [Required]
    // Display name must be at least 3 characters long
    [MinLength(3)]
    // Display name can only contain letters, spaces, hyphens, periods, dots, and commas
    [RegularExpression(@"^[a-zA-Z0-9- .,]+$")]
    public string Name { get; set; }
    
    [Required]
    public string ProfilePicture { get; set; }
    
    [Required]
    public string Server { get; set; }
    
    public ICollection<Chat> Chats { get; set; }
    
    // Dictionary of Chat Id's as keys and number of unread messages as values
    public IDictionary<int, int> UnreadMessages { get; set; }
}
