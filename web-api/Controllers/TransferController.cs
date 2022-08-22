using Microsoft.AspNetCore.Mvc;
using class_library;
using class_library.Services;

namespace web_api.Controllers;

[ApiController]
[Route("api/transfer")]
public class TransferController : ControllerBase
{
    private readonly IUsersService _usersService;
    private readonly IChatsService _chatsService;

    public TransferController(IUsersService usersService, IChatsService chatsService)
    {
        _usersService = usersService;
        _chatsService = chatsService;
    }

    [HttpPost]
    public IActionResult Post([FromBody] Transfer transfer)
    {
        // Get a new message from a remote user

        var localUser = _usersService.Get(transfer.To);
        if (localUser == null)
        {
            return NotFound();
        }

        var chat = localUser.ContactsIds.Contains(transfer.From) ? localUser.Chats[localUser.ContactsIds.IndexOf(transfer.From)] : null;
        // If the chat between the two doesn't exist
        if (chat == null)
        {
            return NotFound();
        }

        // Create a new message
        var message = new Message(transfer.Content, transfer.From, DateTime.Now);
        chat.Messages.Add(message);
        _chatsService.Update(chat);

        return Created("", null);
    }
}