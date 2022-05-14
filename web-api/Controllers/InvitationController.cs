using Microsoft.AspNetCore.Mvc;
using class_library;

namespace web_api.Controllers;

[ApiController]
[Route("api/invitations")]

public class InvitationController : ControllerBase
{
    [HttpPost]
    public IActionResult Post([FromBody] Invitation invitation)
    {
        return Ok("Create new Invitation");
    }
}