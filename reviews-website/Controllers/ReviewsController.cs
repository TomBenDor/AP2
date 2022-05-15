using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Models;
using server.services;

namespace server.Controllers
{
    public class ReviewsController : Controller
    {
        private IReviewService _reviewService;

        public ReviewsController()
        {
            _reviewService = new ReviewService();
        }

        // GET: Reviews
        public IActionResult Index()
        {
            return View(_reviewService.GetAll());
        }

        // GET: Reviews/Details/5
        public IActionResult Details(int id)
        {
            return View(_reviewService.Get(id));
        }

        // GET: Reviews/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: Reviews/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Create(int rating, string comment, string username)
        {
            if (ModelState.IsValid)
            {
                _reviewService.Create(username, comment, rating);
            }

            return View(viewName: "Index", model: _reviewService.GetAll());
        }

        // GET: Reviews/Edit/5
        public IActionResult Edit(int id)
        {
            if (id == null || this._reviewService.Get(id) == null)
            {
                return NotFound();
            }

            Review review = this._reviewService.Get(id);

            return View(review);
        }

        // POST: Reviews/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Edit(int id, int rating, String comment, String username)
        {
            if (ModelState.IsValid)
            {
                this._reviewService.Update(id, username, comment, rating);
                return RedirectToAction(nameof(Index));
            }

            return View();
        }

        // GET: Reviews/Delete/5
        public IActionResult Delete(int id)
        {
            if (id == null || this._reviewService.Get(id) == null)
            {
                return NotFound();
            }

            Review review = this._reviewService.Get(id);
            if (review == null)
            {
                return NotFound();
            }

            return View(review);
        }

        // POST: Reviews/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public IActionResult DeleteConfirmed(int id)
        {
            if (this._reviewService.Get(id) == null)
            {
                return Problem("Entity set 'serverContext.Review'  is null.");
            }

            Review review = this._reviewService.Get(id);
            if (review != null)
            {
                this._reviewService.Delete(id);
            }

            return RedirectToAction(nameof(Index));
        }

        private bool ReviewExists(int id)
        {
            return this._reviewService.Get(id) != null;
        }
    }
}