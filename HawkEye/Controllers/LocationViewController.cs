using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HawkEye.DB;
using HawkEye.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
//using Microsoft.EntityFrameworkCore.Relational;

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
            List<Location> locations = new List<Location>();
            try
            {
                locations = await _context.Locations.FromSql(
                    "SELECT tblCPQ_Location.LocationId, tblCPQ_Location.AddressLine1, tblCPQ_Location.FullAddress, tblCPQ_Location.City, tblCPQ_Location.County, tblCPQ_Location.State, tblCPQ_Location.PostalCode, tblCPQ_Location.Country, tblCPQ_Location.Latitude, tblCPQ_Location.Longitude, case when tblCPQ_ProviderLocation.IsEthernetNni = 1 then 'NNI' else 'SDN Lit Bldgs' end as LocationType FROM tblCPQ_Location INNER JOIN  tblCPQ_ProviderLocation ON tblCPQ_Location.LocationId = tblCPQ_ProviderLocation.LocationId WHERE tblCPQ_Location.Active=1 AND tblCPQ_ProviderLocation.Active=1 AND (tblCPQ_ProviderLocation.IsEthernetNni=1 OR tblCPQ_ProviderLocation.ProviderId=1255)"
                //"SELECT tblCPQ_Location.LocationId," +
                //   "tblCPQ_Location.AddressLine1," +
                //   "tblCPQ_Location.FullAddress," +
                //   "tblCPQ_Location.City," +
                //   "tblCPQ_Location.County," +
                //   "tblCPQ_Location.State," +
                //   "tblCPQ_Location.PostalCode," +
                //   "tblCPQ_Location.Country," +
                //   "tblCPQ_Location.Latitude," +
                //   "tblCPQ_Location.Longitude," +
                //"case when tblCPQ_ProviderLocation.IsEthernetNni = 1 then 'NNI' else 'SDN Lit Bldgs' end as LocationType" +
                //"FROM " +
                //    "tblCPQ_Location " +
                //"INNER JOIN " +
                //    "tblCPQ_ProviderLocation ON tblCPQ_Location.LocationId = tblCPQ_ProviderLocation.LocationId " +
                //"WHERE " +
                //    "tblCPQ_Location.Active = 1 " +
                //    "AND tblCPQ_ProviderLocation.Active = 1 " +
                //    "AND(tblCPQ_ProviderLocation.IsEthernetNni = 1 OR tblCPQ_ProviderLocation.ProviderId = 1255) "
                ).ToListAsync();


            }
            catch (Exception ex)
            {
                //TODO log
            }
            return Json(locations);
        }

    }
}