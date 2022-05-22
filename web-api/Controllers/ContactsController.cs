using System.Text.Json;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Mvc;
using class_library;
using class_library.Services;

namespace web_api.Controllers;

[ApiController]
[Route("api/contacts")]
public class ContactsController : ControllerBase
{
    private readonly IUsersService _usersService;
    private readonly IChatsService _chatsService;

    public ContactsController(IUsersService usersService, IChatsService chatsService)
    {
        _usersService = usersService;
        _chatsService = chatsService;
    }

    [HttpPost("signup")]
    public IActionResult SignUp([FromBody] JsonElement body)
    {
        // Sign up new user

        string? username, password, confirmPassword, name, profilePicture;
        try
        {
            username = body.GetProperty("username").GetString();
            password = body.GetProperty("password").GetString();
            confirmPassword = body.GetProperty("confirmPassword").GetString();
            name = body.GetProperty("name").GetString();
            profilePicture = body.GetProperty("profilePicture").GetString();
        }
        catch (Exception)
        {
            return BadRequest();
        }

        if (username == null || password == null || confirmPassword == null || name == null || profilePicture == null)
        {
            return BadRequest();
        }

        // Check regex for username
        if (username.Length < 3 || !Regex.IsMatch(username, @"^[a-zA-Z0-9-]+$"))
        {
            return BadRequest();
        }

        // Ensure passwords match
        if (password != confirmPassword)
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

        // Create new user
        User newUser = new User(username, name, "localhost", password, profilePicture);
        _usersService.Add(newUser);

        return Ok();
    }


    [HttpGet]
    public IActionResult Get()
    {
        // Get all contacts of the current user

        var currentUser = _usersService.GetAll().FirstOrDefault(); // TODO: get current user from JWT
        if (currentUser == null)
        {
            return NotFound();
        }

        List<string> contacsIds = currentUser.Chats.Keys.ToList();
        return Ok(_usersService.Get(contacsIds));
    }

    [HttpPost]
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

        var currentUser = _usersService.GetAll().FirstOrDefault(); // TODO: get current user from JWT
        if (currentUser == null)
        {
            return NotFound();
        }

        if (currentUser.Username == id)
        {
            return BadRequest();
        }

        // If the contact is already in the current user's contacts, return BadRequest
        if (currentUser.Chats.ContainsKey(id))
        {
            return BadRequest();
        }

        User? contact = _usersService.Get(id);
        // If the contact doesn't exist, create it
        if (contact == null)
        {
            if (server == "localhost")
            {
                return BadRequest();
            }

            // Create the remote contact
            contact = new User(id, name, server);
            _usersService.Add(contact);
        }

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
        else
        {
            // TODO: add new chat to contact on a remote server
        }

        return Ok();
    }

    [HttpGet("{id}")]
    public IActionResult Get(string id)
    {
        // Get a contact of the current user by id

        if (_usersService.Get(id) == null)
        {
            return NotFound();
        }

        var currentUser = _usersService.GetAll().FirstOrDefault(); // TODO: get current user from JWT
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

        return Ok(contact);
    }

    [HttpPut("{id}")]
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

        var currentUser = _usersService.GetAll().FirstOrDefault(); // TODO: get current user from JWT
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

        newContact.Name = name;
        newContact.Server = server;

        if (_usersService.Update(newContact) == null)
        {
            return NotFound();
        }

        return Ok();
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(string id)
    {
        // Delete a contact of the current user by id

        var currentUser = _usersService.GetAll().FirstOrDefault(); // TODO: get current user from JWT
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
        _usersService.Update(currentUser);
        // Delete the currentUser from the contact
        contact.Chats.Remove(currentUser.Username);
        _usersService.Update(contact);
        return Ok();
    }

    [HttpGet("{id}/messages")]
    public IActionResult GetMessages(string id)
    {
        // Get all messages between the current user and the contact by id

        if (_usersService.Get(id) == null)
        {
            return NotFound();
        }

        var currentUser = _usersService.GetAll().FirstOrDefault(); // TODO: get current user from JWT
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
    public IActionResult PostNewMessage(string id, [FromBody] string content)
    {
        // Add a new message between the current user and the contact by id

        var contact = _usersService.Get(id);
        if (contact == null)
        {
            return NotFound();
        }

        var currentUser = _usersService.GetAll().FirstOrDefault(); // TODO: get current user from JWT
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
        var message = new Message(lastMessageId + 1, content, currentUser.Username, DateTime.Now, "text");
        chat.Messages.Add(message);
        _chatsService.Update(chat);
        // Add the new message to the contact if on a remote server
        if (contact.Server != "localhost")
        {
            // TODO: add new message to contact on a remote server
            // Send transfer request
        }

        return Ok();
    }

    [HttpGet("{id}/messages/{id2}")]
    public IActionResult GetMessage(string id, int id2)
    {
        // Get a message with id2 between the current user and the contact by id

        if (_usersService.Get(id) == null)
        {
            return NotFound();
        }

        User? currentUser = _usersService.GetAll().FirstOrDefault(); // TODO: get current user from JWT
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
    public IActionResult PutMessage(string id, int id2, [FromBody] string content)
    {
        // Update a message with id2 between the current user and the contact by id

        var contact = _usersService.Get(id);
        if (contact == null)
        {
            return NotFound();
        }

        var currentUser = _usersService.GetAll().FirstOrDefault(); // TODO: get current user from JWT
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
        // Update the contact if on a remote server
        if (contact.Server != "localhost")
        {
            // TODO: update message on a remote server
        }

        return Ok();
    }

    [HttpDelete("{id}/messages/{id2}")]
    public IActionResult DeleteMessage(string id, int id2)
    {
        // Delete a message with id2 between the current user and the contact by id

        var contact = _usersService.Get(id);
        if (contact == null)
        {
            return NotFound();
        }

        User? currentUser = _usersService.GetAll().FirstOrDefault(); // TODO: get current user from JWT
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
        // Delete the message from the contact if on a remote server
        if (contact.Server != "localhost")
        {
            // TODO: delete message from contact on a remote server
        }

        return Ok();
    }
}