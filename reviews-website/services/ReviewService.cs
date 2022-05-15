using server.Models;

namespace server.services;

public class ReviewService : IReviewService
{
    private static List<Review> _reviews = new();


    public void Create(String name, String comment, int rating)
    {
        int newId = _reviews.Count + 1;
        Review review = new Review(newId, comment, rating, name, DateTime.Now);
        _reviews.Add(review);
    }

    public Review? Get(int id)
    {
        return _reviews.FirstOrDefault(r => r.Id == id);
    }

    public List<Review> GetAll()
    {
        return _reviews;
    }

    public void Update(int id, String name, String comment, int rating)
    {
        Review review = _reviews.FirstOrDefault(r => r.Id == id);
        if (review != null)
        {
            review.Username = name;
            review.Comment = comment;
            review.Rating = rating;
            review.Date = DateTime.Now;
        }
    }

    public void Delete(int id)
    {
        var reviewToDelete = _reviews.FirstOrDefault(r => r.Id == id);
        if (reviewToDelete != null)
        {
            _reviews.Remove(reviewToDelete);
        }
    }
}