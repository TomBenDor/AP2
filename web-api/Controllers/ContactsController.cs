using Microsoft.AspNetCore.Mvc;
using class_library;
using DefaultNamespace;

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
    public IActionResult Post([FromBody] User? contact)
    {
        // Add contact to the current user

        if (contact == null || _usersService.Get(contact.Username) == null)
        {
            return BadRequest();
        }

        var currentUser = _usersService.GetAll().FirstOrDefault(); // TODO: get current user from JWT
        if (currentUser == null)
        {
            return NotFound();
        }

        // If the contact is already in the current user's contacts, return BadRequest
        if (currentUser.Chats.ContainsKey(contact.Username))
        {
            return BadRequest();
        }

        // Create a new chat between the current user and the contact
        var newChat = new Chat
        {
            Id = Guid.NewGuid().ToString(),
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

        return Ok(contact);
    }

    [HttpGet("{id}")]
    public IActionResult Get(string? id)
    {
        // Get a contact of the current user by id

        if (id == null || _usersService.Get(id) == null)
        {
            return NotFound();
        }

        var currentUser = _usersService.GetAll().FirstOrDefault(); // TODO: get current user from JWT
        if (currentUser == null)
        {
            return NotFound();
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
    public IActionResult Put(string? id, [FromBody] User newContact)
    {
        // Update a contact of the current user by id

        // If trying to cheat
        if (id == null || id != newContact.Username)
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

        var contactId = currentUser.Chats.Keys.ToList().Find(username => username == id);
        if (contactId == null)
        {
            return NotFound();
        }

        var updatedContact = _usersService.Update(newContact);
        if (updatedContact == null)
        {
            return NotFound();
        }

        return Ok(updatedContact);
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(string? id)
    {
        // Delete a contact of the current user by id

        if (id == null)
        {
            return NotFound();
        }

        var currentUser = _usersService.GetAll().FirstOrDefault(); // TODO: get current user from JWT
        if (currentUser == null)
        {
            return NotFound();
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
    public IActionResult GetMessages(string? id)
    {
        // Get all messages between the current user and the contact by id

        if (id == null || _usersService.Get(id) == null)
        {
            return NotFound();
        }

        var currentUser = _usersService.GetAll().FirstOrDefault(); // TODO: get current user from JWT
        if (currentUser == null)
        {
            return NotFound();
        }

        // If the contact is not in the current user's contacts, return NotFound
        if (currentUser.Chats.Keys.ToList().Find(username => username == id) == null)
        {
            return NotFound();
        }

        return Ok(currentUser.Chats[id].Messages);
    }

    [HttpPost("{id}/messages")]
    public IActionResult PostNewMessage(string id, [FromBody] Message message)
    {
        // Add a new message between the current user and the contact by id

        var contact = _usersService.Get(id);
        if (id == null || contact == null)
        {
            return NotFound();
        }

        if (message == null)
        {
            return BadRequest();
        }

        User? currentUser = _usersService.GetAll().FirstOrDefault(); // TODO: get current user from JWT
        if (currentUser == null)
        {
            return NotFound();
        }

        // If the contact is not in the current user's contacts, return NotFound
        if (currentUser.Chats.Keys.ToList().Find(username => username == id) == null)
        {
            return NotFound();
        }

        // Add the new message to the chat
        Chat chat = currentUser.Chats[id];
        chat.Messages.Add(message);
        _chatsService.Update(chat);
        // Add the new message to the contact if on a remote server
        if (contact.Server != "localhost")
        {
            // TODO: add new message to contact on a remote server
        }

        return Ok(message);
    }

    [HttpGet("{id}/messages/{id2}")]
    public IActionResult GetMessage(string? id, int id2)
    {
        // Get a message with id2 between the current user and the contact by id

        if (id == null || _usersService.Get(id) == null)
        {
            return NotFound();
        }

        User? currentUser = _usersService.GetAll().FirstOrDefault(); // TODO: get current user from JWT
        if (currentUser == null)
        {
            return NotFound();
        }

        // If the contact is not in the current user's contacts, return NotFound
        if (currentUser.Chats.Keys.ToList().Find(username => username == id) == null)
        {
            return NotFound();
        }

        // If the message doesn't exist, return NotFound
        Message? message = currentUser.Chats[id].Messages.SingleOrDefault(msg => msg.Id == id2);
        if (message == null)
        {
            return NotFound();
        }

        return Ok(message);
    }

    [HttpPut("{id}/messages/{id2}")]
    public IActionResult PutMessage(string? id, int id2, [FromBody] Message? newMessage)
    {
        // Update a message with id2 between the current user and the contact by id

        if (id == null)
        {
            return BadRequest();
        }

        var contact = _usersService.Get(id);
        if (contact == null)
        {
            return NotFound();
        }

        if (newMessage == null)
        {
            return BadRequest();
        }

        var currentUser = _usersService.GetAll().FirstOrDefault(); // TODO: get current user from JWT
        if (currentUser == null)
        {
            return NotFound();
        }

        // If the contact is not in the current user's contacts, return NotFound
        if (currentUser.Chats.Keys.ToList().Find(username => username == id) == null)
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
        message.Sender = newMessage.Sender;
        message.Text = newMessage.Text;
        message.Timestamp = newMessage.Timestamp;
        message.Type = newMessage.Type;
        // Update the chat
        Chat chat = currentUser.Chats[id];
        _chatsService.Update(chat);
        // Update the contact if on a remote server
        if (contact.Server != "localhost")
        {
            // TODO: update message on a remote server
        }

        return Ok(message);
    }

    [HttpDelete("{id}/messages/{id2}")]
    public IActionResult DeleteMessage(string id, int id2)
    {
        // Delete a message with id2 between the current user and the contact by id

        var contact = _usersService.Get(id);
        if (id == null || contact == null)
        {
            return NotFound();
        }

        User? currentUser = _usersService.GetAll().FirstOrDefault(); // TODO: get current user from JWT
        if (currentUser == null)
        {
            return NotFound();
        }

        // If the contact is not in the current user's contacts, return NotFound
        if (currentUser.Chats.Keys.ToList().Find(username => username == id) == null)
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