using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HawkEye.DB;
using HawkEye.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HawkEye.Controllers
{
    public class LocationViewController : Controller
    {
        private readonly ApiContext _context;

        public LocationViewController(ApiContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            return View();
        }

        public async Task<IActionResult> Locations()
        {
            List<Location> locations = await _context.Locations.ToListAsync(); ;
            return Json(locations);
        }

    }
}