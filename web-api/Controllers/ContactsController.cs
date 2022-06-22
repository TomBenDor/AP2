using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Mvc;
using class_library;
using class_library.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;
using JwtRegisteredClaimNames = Microsoft.IdentityModel.JsonWebTokens.JwtRegisteredClaimNames;

namespace web_api.Controllers;

[ApiController]
[Route("api/contacts")]
public class ContactsController : ControllerBase
{
    private readonly IUsersService _usersService;
    private readonly IChatsService _chatsService;
    private readonly IConfiguration _configuration;
    private readonly JwtSecurityTokenHandler _tokenHandler;
    private readonly HttpClient _httpClient = new HttpClient();

    private readonly JsonSerializerOptions _jsonSerializerOptions = new JsonSerializerOptions
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase
    };

    private void _initExampleChatsAndUsers()
    {
        // Create example users and chats

        var user1 = _usersService.Get("user123");
        if (user1 == null || user1.Chats.Count > 0)
        {
            return;
        }

        var cris = _usersService.Get("Crisr7");
        var drake = _usersService.Get("drake6942");
        var ch1 = _chatsService.Get("user123-Crisr7");
        var ch2 = _chatsService.Get("user123-drake6942");
        if (cris == null || drake == null || ch1 == null || ch2 == null)
        {
            return;
        }

        ch1.Members.Add(user1);
        ch1.Members.Add(cris);
        ch2.Members.Add(user1);
        ch2.Members.Add(drake);
        ch1.Messages.Add(new Message(1, "Ayo my dude", "user123", DateTime.Now));
        ch1.Messages.Add(new Message(2, "Hi :)", "Crisr7", DateTime.Now));
        ch2.Messages.Add(new Message(1, "Yo hear my new song bro", "drake6942", DateTime.Now));
        ch2.Messages.Add(new Message(2, "Lit bro", "user123", DateTime.Now));
        _chatsService.Update(ch1);
        _chatsService.Update(ch2);
        user1.Chats["Crisr7"] = ch1;
        user1.Chats["drake6942"] = ch2;
        cris.Chats["user123"] = ch1;
        drake.Chats["user123"] = ch2;
        _usersService.Update(user1);
        _usersService.Update(cris);
        _usersService.Update(drake);
    }

    public ContactsController(IUsersService usersService, IChatsService chatsService, IConfiguration configuration)
    {
        _usersService = usersService;
        _chatsService = chatsService;
        _configuration = configuration;
        _tokenHandler = new JwtSecurityTokenHandler();
        // For testing
        _initExampleChatsAndUsers();
    }

    private User? _getCurrentUser()
    {
        var token = _tokenHandler.ReadJwtToken(Request.Headers["Authorization"].ToString().Substring("Bearer ".Length));
        return _usersService.Get(token.Claims.First(claim => claim.Type == "username").Value);
    }

    private string _createJwtToken(string username)
    {
        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, _configuration["JWTParams:Subject"]),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(JwtRegisteredClaimNames.Iat, DateTime.UtcNow.ToString()),
            new Claim("username", username)
        };
        var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWTParams:SecretKey"]));
        var mac = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);
        var token = new JwtSecurityToken(
            _configuration["JWTParams:Issuer"], _configuration["JWTParams:Audience"], claims,
            expires: DateTime.UtcNow.AddMinutes(20), signingCredentials: mac);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    [HttpPost("signin")]
    public IActionResult SignIn([FromBody] JsonElement body)
    {
        // Sign in user

        string? username, password;
        try
        {
            username = body.GetProperty("username").GetString();
            password = body.GetProperty("password").GetString();
        }
        catch (Exception)
        {
            return BadRequest();
        }

        if (username == null || password == null)
        {
            return BadRequest();
        }

        var user = _usersService.Get(username);
        if (user == null || user.Server != "localhost" || user.Password != password)
        {
            return Unauthorized();
        }

        // Return JWT token
        var token = _createJwtToken(username);
        var name = user.Name;
        return Ok(new { token, name });
    }

    [HttpPost("signup")]
    public IActionResult SignUp([FromBody] JsonElement body)
    {
        // Sign up new user

        string? username, password, name;
        try
        {
            username = body.GetProperty("username").GetString();
            password = body.GetProperty("password").GetString();
            name = body.GetProperty("name").GetString();
        }
        catch (Exception)
        {
            return BadRequest();
        }

        if (username == null || password == null || name == null)
        {
            return BadRequest();
        }

        // Check regex for username
        if (username.Length < 3 || !Regex.IsMatch(username, @"^[a-zA-Z0-9-]+$"))
        {
            return BadRequest();
        }


        // Check if password contains at least one number, one lowercase and one uppercase character
        if (password.Length < 6 || !Regex.IsMatch(password, @"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$"))
        {
            return BadRequest();
        }

        // Check regex for name (display name)
        if (name.Length < 3 || !Regex.IsMatch(name, @"^[a-zA-Z '\-.,]+$"))
        {
            return BadRequest();
        }

        if (_usersService.Get(username) != null)
        {
            return BadRequest();
        }

        string? profilePicture;
        try
        {
            profilePicture = body.GetProperty("profilePicture").GetString();
        }
        catch
        {
            profilePicture =
                "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";
        }

        // Create new user
        var newUser = new User(username, name, "localhost", password, profilePicture);
        _usersService.Add(newUser);

        return Created("", null);
    }


    [HttpGet]
    [Authorize]
    public IActionResult Get()
    {
        // Get all contacts of the current user

        var currentUser = _getCurrentUser();
        if (currentUser == null)
        {
            return NotFound();
        }

        List<string> contactsIds = currentUser.Chats.Keys.ToList();
        IEnumerable<User> contacts = _usersService.Get(contactsIds);
        // Loop over contacts and create a list of outerUsers from them
        List<OuterUser> outerContacts = new List<OuterUser>();
        foreach (User c in contacts)
        {
            string? displayName = currentUser.Names.ContainsKey(c.Username) ? currentUser.Names[c.Username] : null;
            outerContacts.Add(new OuterUser(c.Username, currentUser.Chats[c.Username], displayName));
        }

        return Ok(outerContacts);
    }

    [HttpPost]
    [Authorize]
    public IActionResult Post([FromBody] JsonElement body)
    {
        // Add contact to the current user

        string? id, name, server;
        try
        {
            id = body.GetProperty("id").GetString();
            name = body.GetProperty("name").GetString();
            server = body.GetProperty("server").GetString();
        }
        catch (Exception)
        {
            return BadRequest();
        }

        if (id == null || name == null || server == null)
        {
            return BadRequest();
        }

        var currentUser = _getCurrentUser();
        if (currentUser == null)
        {
            return NotFound();
        }

        if (currentUser.Username == id)
        {
            return BadRequest("Can't add yourself");
        }

        // If the contact is already in the current user's contacts, return BadRequest
        if (currentUser.Chats.ContainsKey(id))
        {
            return BadRequest("User is already in contacts list");
        }

        // Send an invitation first, to see if the remote server exists
        if (server != "localhost" && server != "localhost:54321")
        {
            // Send invitation to the contact on the remote server
            var invitation = new Invitation(currentUser.Username, id, "localhost:54321");
            var json = JsonSerializer.Serialize(invitation, _jsonSerializerOptions);
            var stringContent = new StringContent(json, System.Text.Encoding.UTF8, "application/json");
            try
            {
                _httpClient.PostAsync("https://" + server + "/api/invitations", stringContent).Wait();
            }
            catch (Exception)
            {
                return BadRequest("Couldn't communicate with remote server");
            }
        }

        User? contact = _usersService.Get(id);
        // If the contact doesn't exist, create it
        if (contact == null)
        {
            if (server == "localhost" || server == "localhost:54321")
            {
                return BadRequest("Contact doesn't exist");
            }

            // Create the remote contact
            contact = new User(id, name, server);
            _usersService.Add(contact);
        }

        // Add the contact to the current user's names
        currentUser.Names.Add(id, name);

        // Create a new chat between the current user and the contact
        var newChat = new Chat(currentUser.Username + "-" + contact.Username)
        {
            Members = new List<User> { currentUser, contact }
        };
        _chatsService.Add(newChat);
        // Add the new chat to the current user
        currentUser.Chats.Add(contact.Username, newChat);
        _usersService.Update(currentUser);
        // Add the new chat to the contact
        if (contact.Server == "localhost")
        {
            contact.Chats.Add(currentUser.Username, newChat);
            _usersService.Update(contact);
        }

        return Created("", null);
    }

    [HttpGet("{id}")]
    [Authorize]
    public IActionResult Get(string id)
    {
        // Get a contact of the current user by id

        if (_usersService.Get(id) == null)
        {
            return NotFound();
        }

        var currentUser = _getCurrentUser();
        if (currentUser == null)
        {
            return NotFound();
        }

        if (currentUser.Username == id)
        {
            return BadRequest();
        }

        string? contactId = currentUser.Chats.Keys.ToList().Find(username => username == id);
        if (contactId == null)
        {
            return NotFound();
        }

        var contact = _usersService.Get(contactId);
        if (contact == null)
        {
            return NotFound();
        }

        string? displayName = currentUser.Names.ContainsKey(contactId) ? currentUser.Names[contactId] : null;
        var outerContact = new OuterUser(contactId, currentUser.Chats[contactId], displayName);
        return Ok(outerContact);
    }

    [HttpPut("{id}")]
    [Authorize]
    public IActionResult Put(string id, [FromBody] JsonElement body)
    {
        // Update a contact of the current user by id

        string? name, server;
        try
        {
            name = body.GetProperty("name").GetString();
            server = body.GetProperty("server").GetString();
        }
        catch (Exception)
        {
            return BadRequest();
        }

        if (name == null || server == null)
        {
            return BadRequest();
        }

        if (_usersService.Get(id) == null)
        {
            return NotFound();
        }

        var currentUser = _getCurrentUser();
        if (currentUser == null)
        {
            return NotFound();
        }

        if (currentUser.Username == id)
        {
            return BadRequest();
        }

        var contactId = currentUser.Chats.Keys.ToList().Find(username => username == id);
        if (contactId == null)
        {
            return NotFound();
        }

        var newContact = _usersService.Get(id);
        if (newContact == null)
        {
            return NotFound();
        }

        currentUser.Names[contactId] = name;
        newContact.Server = server;

        if (_usersService.Update(newContact) == null)
        {
            return NotFound();
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize]
    public IActionResult Delete(string id)
    {
        // Delete a contact of the current user by id

        var currentUser = _getCurrentUser();
        if (currentUser == null)
        {
            return NotFound();
        }

        if (currentUser.Username == id)
        {
            return BadRequest();
        }

        var contact = _usersService.Get(id);
        if (contact == null)
        {
            return NotFound();
        }

        // Delete the chat between the current user and the contact
        var chat = currentUser.Chats.Values.ToList().Find(chatId => chatId.Id == contact.Chats.Values.ToList()[0].Id);
        if (chat == null)
        {
            return NotFound();
        }

        _chatsService.Remove(chat);
        // Delete the contact from the current user
        currentUser.Chats.Remove(contact.Username);
        // Delete the contact from Names dictionary
        if (currentUser.Names.ContainsKey(contact.Username))
        {
            currentUser.Names.Remove(contact.Username);
        }

        _usersService.Update(currentUser);
        // Delete the currentUser from the contact
        contact.Chats.Remove(currentUser.Username);
        _usersService.Update(contact);
        return NoContent();
    }

    [HttpGet("{id}/messages")]
    [Authorize]
    public IActionResult GetMessages(string id)
    {
        // Get all messages between the current user and the contact by id

        if (_usersService.Get(id) == null)
        {
            return NotFound();
        }

        var currentUser = _getCurrentUser();
        if (currentUser == null)
        {
            return NotFound();
        }

        if (currentUser.Username == id)
        {
            return BadRequest();
        }

        // If the contact is not in the current user's contacts, return NotFound
        if (!currentUser.Chats.ContainsKey(id))
        {
            return NotFound();
        }

        List<OuterMessage> outerMessages = new List<OuterMessage>();
        // Loop over currentUser.Chats[id].Messages
        foreach (var m in currentUser.Chats[id].Messages)
        {
            // Create a new OuterMessage
            OuterMessage outerMessage = new OuterMessage(m, currentUser.Username);
            outerMessages.Add(outerMessage);
        }

        return Ok(outerMessages);
    }

    [HttpPost("{id}/messages")]
    [Authorize]
    public IActionResult PostNewMessage(string id, [FromBody] JsonElement body)
    {
        // Add a new message between the current user and the contact by id

        string? content;
        try
        {
            content = body.GetProperty("content").GetString();
        }
        catch (Exception)
        {
            return BadRequest();
        }

        if (content == null)
        {
            return BadRequest();
        }

        var contact = _usersService.Get(id);
        if (contact == null)
        {
            return NotFound();
        }

        var currentUser = _getCurrentUser();
        if (currentUser == null)
        {
            return NotFound();
        }

        if (currentUser.Username == id)
        {
            return BadRequest();
        }

        // If the contact is not in the current user's contacts, return NotFound
        if (!currentUser.Chats.ContainsKey(id))
        {
            return NotFound();
        }

        // Add the new message to the chat
        Chat chat = currentUser.Chats[id];
        // Create a new message
        int lastMessageId = chat.Messages.Count > 0 ? chat.Messages.Max(m => m.Id) : 0;
        var message = new Message(lastMessageId + 1, content, currentUser.Username, DateTime.Now);
        chat.Messages.Add(message);
        _chatsService.Update(chat);
        // Add the new message to the contact if on a remote server
        if (contact.Server != "localhost")
        {
            // Send transfer request
            var transfer = new Transfer(currentUser.Username, contact.Username, content);
            var json = JsonSerializer.Serialize(transfer, _jsonSerializerOptions);
            var stringContent = new StringContent(json, System.Text.Encoding.UTF8, "application/json");
            _httpClient.PostAsync("https://" + contact.Server + "/api/transfer", stringContent).Wait();
        }

        return Created("", null);
    }

    [HttpGet("{id}/messages/{id2}")]
    [Authorize]
    public IActionResult GetMessage(string id, int id2)
    {
        // Get a message with id2 between the current user and the contact by id

        if (_usersService.Get(id) == null)
        {
            return NotFound();
        }


        var currentUser = _getCurrentUser();
        if (currentUser == null)
        {
            return NotFound();
        }

        if (currentUser.Username == id)
        {
            return BadRequest();
        }

        // If the contact is not in the current user's contacts, return NotFound
        if (!currentUser.Chats.ContainsKey(id))
        {
            return NotFound();
        }

        // If the message doesn't exist, return NotFound
        Message? message = currentUser.Chats[id].Messages.SingleOrDefault(msg => msg.Id == id2);
        if (message == null)
        {
            return NotFound();
        }

        OuterMessage outerMessage = new OuterMessage(message, currentUser.Name);
        return Ok(outerMessage);
    }

    [HttpPut("{id}/messages/{id2}")]
    [Authorize]
    public IActionResult PutMessage(string id, int id2, [FromBody] JsonElement body)
    {
        // Update a message with id2 between the current user and the contact by id

        string? content;
        try
        {
            content = body.GetProperty("content").GetString();
        }
        catch (Exception)
        {
            return BadRequest();
        }

        if (content == null)
        {
            return BadRequest();
        }

        var contact = _usersService.Get(id);
        if (contact == null)
        {
            return NotFound();
        }

        var currentUser = _getCurrentUser();
        if (currentUser == null)
        {
            return NotFound();
        }

        if (currentUser.Username == id)
        {
            return BadRequest();
        }

        // If the contact is not in the current user's contacts, return NotFound
        if (!currentUser.Chats.ContainsKey(id))
        {
            return NotFound();
        }

        // If the message doesn't exist, return NotFound
        var message = currentUser.Chats[id].Messages.SingleOrDefault(msg => msg.Id == id2);
        if (message == null)
        {
            return NotFound();
        }

        // Update the message
        message.Text = content;
        // Update the chat
        Chat chat = currentUser.Chats[id];
        _chatsService.Update(chat);
        // No API exists for updating the contact if on a remote server

        return NoContent();
    }

    [HttpDelete("{id}/messages/{id2}")]
    [Authorize]
    public IActionResult DeleteMessage(string id, int id2)
    {
        // Delete a message with id2 between the current user and the contact by id

        var contact = _usersService.Get(id);
        if (contact == null)
        {
            return NotFound();
        }


        var currentUser = _getCurrentUser();
        if (currentUser == null)
        {
            return NotFound();
        }

        if (currentUser.Username == id)
        {
            return BadRequest();
        }

        // If the contact is not in the current user's contacts, return NotFound
        if (!currentUser.Chats.ContainsKey(id))
        {
            return NotFound();
        }

        // If the message doesn't exist, return NotFound
        var message = currentUser.Chats[id].Messages.SingleOrDefault(msg => msg.Id == id2);
        if (message == null)
        {
            return NotFound();
        }

        // Delete the message from the chat
        Chat chat = currentUser.Chats[id];
        chat.Messages.Remove(message);
        _chatsService.Update(chat);
        // No API exists for deleting a message from the contact if on a remote server
        return NoContent();
    }
}