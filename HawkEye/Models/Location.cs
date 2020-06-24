using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HawkEye.Models
{
    public class Location
    {
        public int LocationId { get; set; }
        public string AddressLine1 { get; set; }
        public string FullAddress { get; set; }
        public string City { get; set; }
        public string County { get; set; }
        public string State { get; set; }
        public string PostalCode { get; set; }
        public string Country { get; set; }
        public decimal Latitude { get; set; }
        public decimal Longitude { get; set; }
        public string LocationType { get; set; }
    }
}
