using server.Models;

namespace server.services;

public interface IReviewService
{
    public void Create(String name, String comment, int rating);
    public Review? Get(int id);
    public List<Review> GetAll();
    public void Update(int id, String name, String comment, int rating);
    public void Delete(int id);
}