using class_library;
using Microsoft.EntityFrameworkCore;

namespace web_api.Context;

public class ChatsContext : DbContext
{
    public ChatsContext(DbContextOptions<ChatsContext> options) : base(options)
    {
        Users
            .Include(u => u.Chats)
            .Load();    
        Chats
            .Include(c => c.Messages)
            .Load();
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSqlite("Data Source=chats.db");
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>()
            .Property(u => u.ContactsIds)
            .HasConversion(
                v => string.Join(",", v),
                v => v.Split(',', StringSplitOptions.RemoveEmptyEntries).ToList()
            );
        modelBuilder.Entity<User>()
            .Property(u => u.ContactsNames)
            .HasConversion(
                v => string.Join(",", v),
                v => v.Split(',', StringSplitOptions.RemoveEmptyEntries).ToList()
            );
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Chat> Chats { get; set; }
}