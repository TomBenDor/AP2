using Microsoft.AspNetCore.Mvc;
using class_library;
using class_library.Services;

namespace web_api.Controllers;

[ApiController]
[Route("api/invitations")]
public class InvitationController : ControllerBase
{
    private readonly IUsersService _usersService;
    private readonly IChatsService _chatsService;

    public InvitationController(IUsersService usersService, IChatsService chatsService)
    {
        _usersService = usersService;
        _chatsService = chatsService;
    }

    [HttpPost]
    public IActionResult Post([FromBody] Invitation invitation)
    {
        // Create a new chat based on the invitation

        // Check if remote user already exists
        var remoteUser = _usersService.Get(invitation.From);
        var localUser = _usersService.Get(invitation.To);
        if (localUser == null)
        {
            return NotFound();
        }

        if (remoteUser == null)
        {
            // Create a new user
            remoteUser = new User(invitation.From, invitation.From, invitation.Server);
            _usersService.Add(remoteUser);
        }

        // Check if chat already exists
        var chat = localUser.Chats.ContainsKey(invitation.From) ? localUser.Chats[invitation.From] : null;
        if (chat == null)
        {
            // Create a new chat
            chat = new Chat(invitation.From + "-" + invitation.To)
            {
                Members = new List<User> { remoteUser, localUser }
            };
            _chatsService.Add(chat);
            localUser.Chats.Add(invitation.From, chat);
            remoteUser.Chats.Add(invitation.From, chat);
            _usersService.Update(localUser);
            _usersService.Update(remoteUser);
        }

        return Ok();
    }
}