using System.ComponentModel.DataAnnotations;

namespace server.Models;

public class Review
{
    public Review(int id, String comment, int rating, String username, DateTime date)
    {
        Id = id;
        Comment = comment;
        Rating = rating;
        Username = username;
        Date = date;
    }

    public int Id { get; set; }
    [Required] public string Comment { get; set; }
    [Range(1, 5)] public int Rating { get; set; }
    [Required] public string Username { get; set; }
    [Required] public DateTime Date { get; set; }
}