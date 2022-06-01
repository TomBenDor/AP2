using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using server.Models;

namespace server.Data
{
    public class serverContext : DbContext
    {
        public serverContext(DbContextOptions<serverContext> options)
            : base(options)
        {
        }

        public DbSet<server.Models.Review>? Review { get; set; }
    }
}