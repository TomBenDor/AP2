using Microsoft.AspNetCore.Mvc;
using class_library;

namespace web_api.Controllers;

[ApiController]
[Route("api/contacts")]

public class ContactsController : ControllerBase
{
    // private readonly IUsersRepository _contactRepository;
    
    // public ContactsController(IUsersRepository contactRepository)
    // {
    //     _contactRepository = contactRepository;
    // }

    [HttpGet]
    public IActionResult Get()
    {
        // return Ok(_contactRepository.GetAll());
        return Ok("All Contacts of current user");
    }
    
    [HttpPost]
    public IActionResult Post([FromBody] User contact)
    {
        // if (contact == null)
        // {
        //     return BadRequest();
        // }
        // _contactRepository.Add(contact);
        // return CreatedAtAction("Get", new { id = contact.Id }, contact);
        return Ok("Create new Contact");
    }

    [HttpGet("{id}")]
    public IActionResult Get(int id)
    {
        // var contact = _contactRepository.GetById(id);
        // if (contact == null)
        // {
        //     return NotFound();
        // }
        // return Ok(contact);
        return Ok("Get Contact with id: " + id);
    }

    [HttpPut("{id}")]
    public IActionResult Put(int id, [FromBody] User contact)
    {
        // if (contact == null || contact.Id != id)
        // {
        //     return BadRequest();
        // }
        // var contactToUpdate = _contactRepository.GetById(id);
        // if (contactToUpdate == null)
        // {
        //     return NotFound();
        // }
        // _contactRepository.Update(contactToUpdate, contact);
        // return NoContent();
        return Ok("Update Contact with id: " + id);
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        return Ok("Delete Contact with id: " + id);
    }
    
    [HttpGet("{id}/messages")]
    public IActionResult GetMessages(int id)
    {
        return Ok("Get Messages of Contact with id: " + id);
    }
    [HttpPost("{id}/messages")]
    public IActionResult PostNewMessage(int id, [FromBody] Message message)
    {
        return Ok("Create new Message sent to Contact with id: " + id);
    }
    
    [HttpGet("{id}/messages/{id2}")]
    public IActionResult GetMessage(int id, int id2)
    {
        return Ok("Get Message with id: " + id2 + " sent to Contact with id: " + id);
    }
    [HttpPut("{id}/messages/{id2}")]
    public IActionResult PutMessage(int id, int id2, [FromBody] Message message)
    {
        return Ok("Update Message with id: " + id2 + " sent to Contact with id: " + id);
    }
    [HttpDelete("{id}/messages/{id2}")]
    public IActionResult DeleteMessage(int id, int id2)
    {
        return Ok("Delete Message with id: " + id2 + " sent to Contact with id: " + id);
    }
}