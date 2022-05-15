using Microsoft.AspNetCore.Mvc;
using class_library;

namespace web_api.Controllers;

[ApiController]
[Route("api/transfer")]

public class TransferController : ControllerBase
{
    [HttpPost]
    public IActionResult Post([FromBody] Transfer transfer)
    {
        return Ok("Got a new message from a user on a remote server");
    }
}