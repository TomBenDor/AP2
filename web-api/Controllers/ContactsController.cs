using Microsoft.AspNetCore.Mvc;
using class_library;
using DefaultNamespace;

namespace web_api.Controllers;

[ApiController]
[Route("api/contacts")]
public class ContactsController : ControllerBase
{
    private readonly IUsersService usersService;
    private readonly IChatsService chatsService;

    public ContactsController(IUsersService usersService, IChatsService chatsService)
    {
        this.usersService = usersService;
        this.chatsService = chatsService;
    }

    [HttpGet]
    public IActionResult Get()
    {
        // Get all contacts of the current user

        User currentUser = usersService.GetAll().FirstOrDefault(); // TODO: get current user from JWT
        if (currentUser == null)
        {
            return NotFound();
        }

        List<string> contacsIds = currentUser.Chats.Keys.ToList();
        return Ok(usersService.Get(contacsIds));
    }

    [HttpPost]
    public IActionResult Post([FromBody] User contact)
    {
        // Add contact to the current user

        if (contact == null || usersService.Get(contact.Username) == null)
        {
            return BadRequest();
        }

        User currentUser = usersService.GetAll().FirstOrDefault(); // TODO: get current user from JWT
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
        Chat newChat = new Chat();
        newChat.Id = Guid.NewGuid().ToString();
        newChat.Members.Add(currentUser);
        newChat.Members.Add(contact);
        chatsService.Add(newChat);
        // Add the new chat to the current user
        currentUser.Chats.Add(contact.Username, newChat);
        usersService.Update(currentUser);
        // Add the new chat to the contact
        if (contact.Server == "localhost")
        {
            contact.Chats.Add(currentUser.Username, newChat);
            usersService.Update(contact);
        }
        else
        {
            // TODO: add new chat to contact on a remote server
        }

        return Ok(contact);
    }

    [HttpGet("{id}")]
    public IActionResult Get(string id)
    {
        // Get a contact of the current user by id

        if (id == null || usersService.Get(id) == null)
        {
            return NotFound();
        }

        User currentUser = usersService.GetAll().FirstOrDefault(); // TODO: get current user from JWT
        if (currentUser == null)
        {
            return NotFound();
        }

        string contactId = currentUser.Chats.Keys.ToList().Find(username => username == id);
        if (contactId == null)
        {
            return NotFound();
        }

        User contact = usersService.Get(contactId);
        if (contact == null)
        {
            return NotFound();
        }

        return Ok(contact);
    }

    [HttpPut("{id}")]
    public IActionResult Put(string id, [FromBody] User newContact)
    {
        // Update a contact of the current user by id

        // If trying to cheat
        if (id != newContact.Username)
        {
            return BadRequest();
        }

        if (id == null || usersService.Get(id) == null)
        {
            return NotFound();
        }

        User currentUser = usersService.GetAll().FirstOrDefault(); // TODO: get current user from JWT
        if (currentUser == null)
        {
            return NotFound();
        }

        string contactId = currentUser.Chats.Keys.ToList().Find(username => username == id);
        if (contactId == null)
        {
            return NotFound();
        }

        User updatedContact = usersService.Update(newContact);
        if (updatedContact == null)
        {
            return NotFound();
        }

        return Ok(updatedContact);
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(string id)
    {
        // Delete a contact of the current user by id

        if (id == null)
        {
            return NotFound();
        }

        User currentUser = usersService.GetAll().FirstOrDefault(); // TODO: get current user from JWT
        if (currentUser == null)
        {
            return NotFound();
        }

        User contact = usersService.Get(id);
        if (contact == null)
        {
            return NotFound();
        }

        // Delete the chat between the current user and the contact
        Chat chat = currentUser.Chats.Values.ToList().Find(chatId => chatId.Id == contact.Chats.Values.ToList()[0].Id);
        chatsService.Remove(chat);
        // Delete the contact from the current user
        currentUser.Chats.Remove(contact.Username);
        usersService.Update(currentUser);
        // Delete the currentUser from the contact
        contact.Chats.Remove(currentUser.Username);
        usersService.Update(contact);
        return Ok();
    }

    [HttpGet("{id}/messages")]
    public IActionResult GetMessages(string id)
    {
        // Get all messages between the current user and the contact by id

        if (id == null || usersService.Get(id) == null)
        {
            return NotFound();
        }

        User currentUser = usersService.GetAll().FirstOrDefault(); // TODO: get current user from JWT
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

        if (id == null || usersService.Get(id) == null)
        {
            return NotFound();
        }

        if (message == null)
        {
            return BadRequest();
        }

        User currentUser = usersService.GetAll().FirstOrDefault(); // TODO: get current user from JWT
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
        chatsService.Update(chat);
        // Add the new message to the contact if on a remote server
        if (!(usersService.Get(id).Server == "localhost"))
        {
            // TODO: add new message to contact on a remote server
        }

        return Ok(message);
    }

    [HttpGet("{id}/messages/{id2}")]
    public IActionResult GetMessage(string id, int id2)
    {
        // Get a message with id2 between the current user and the contact by id

        if (id == null || id2 == null || usersService.Get(id) == null)
        {
            return NotFound();
        }

        User currentUser = usersService.GetAll().FirstOrDefault(); // TODO: get current user from JWT
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
        Message message = currentUser.Chats[id].Messages.SingleOrDefault(msg => msg.Id == id2);
        if (message == null)
        {
            return NotFound();
        }

        return Ok(message);
    }

    [HttpPut("{id}/messages/{id2}")]
    public IActionResult PutMessage(string id, int id2, [FromBody] Message newMessage)
    {
        // Update a message with id2 between the current user and the contact by id

        if (id == null || id2 == null || usersService.Get(id) == null)
        {
            return NotFound();
        }

        if (newMessage == null)
        {
            return BadRequest();
        }

        User currentUser = usersService.GetAll().FirstOrDefault(); // TODO: get current user from JWT
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
        Message message = currentUser.Chats[id].Messages.SingleOrDefault(msg => msg.Id == id2);
        if (message == null)
        {
            return NotFound();
        }

        // Update the message
        message.Sender = newMessage.Sender;
        message.Text = newMessage.Text;
        message.Timestamp = newMessage.Timestamp;
        message.type = newMessage.type;
        // Update the chat
        Chat chat = currentUser.Chats[id];
        chatsService.Update(chat);
        // Update the contact if on a remote server
        if (!(usersService.Get(id).Server == "localhost"))
        {
            // TODO: update message on a remote server
        }

        return Ok(message);
    }

    [HttpDelete("{id}/messages/{id2}")]
    public IActionResult DeleteMessage(string id, int id2)
    {
        // Delete a message with id2 between the current user and the contact by id

        if (id == null || id2 == null || usersService.Get(id) == null)
        {
            return NotFound();
        }

        User currentUser = usersService.GetAll().FirstOrDefault(); // TODO: get current user from JWT
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
        Message message = currentUser.Chats[id].Messages.SingleOrDefault(msg => msg.Id == id2);
        if (message == null)
        {
            return NotFound();
        }

        // Delete the message from the chat
        Chat chat = currentUser.Chats[id];
        chat.Messages.Remove(message);
        chatsService.Update(chat);
        // Delete the message from the contact if on a remote server
        if (!(usersService.Get(id).Server == "localhost"))
        {
            // TODO: delete message from contact on a remote server
        }

        return Ok();
    }
}