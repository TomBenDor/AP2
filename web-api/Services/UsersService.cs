using class_library;
using class_library.Services;
using Microsoft.EntityFrameworkCore;
using web_api.Context;

namespace web_api.Services;

public class UsersService: IUsersService
{
    private ChatsContext db;

    public UsersService(ChatsContext context)
    {
        db = context;
    }

    public void Add(User user)
    {
        db.Users.Add(user);
        db.SaveChanges();
    }

    public User? Update(User user)
    {
        var userToUpdate = db.Users.FirstOrDefault(u => u.Username == user.Username);
        if (userToUpdate == null)
        {
            return null;
        }
        userToUpdate.Name = user.Name;
        userToUpdate.Password = user.Password;
        userToUpdate.Chats = user.Chats;
        userToUpdate.ContactsIds = user.ContactsIds;
        userToUpdate.ContactsNames = user.ContactsNames;
        userToUpdate.ProfilePicture = user.ProfilePicture;
        db.Users.Update(userToUpdate);
        db.SaveChanges();
        return userToUpdate;
    }

    public void Delete(User user)
    {
        var userToDelete = db.Users.FirstOrDefault(u => u.Username == user.Username);
        if (userToDelete == null)
        {
            return;
        }
        db.Users.Remove(userToDelete);
        db.SaveChanges();
    }

    public User? Get(string username)
    {
        return db.Users.FirstOrDefault(u => u.Username == username);
    }

    public IEnumerable<User> Get(List<string> usernames)
    {
        return db.Users.Where(u => usernames.Contains(u.Username));
    }

    public IEnumerable<User> GetAll()
    {
        return db.Users;
    }
}