using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HawkEye.Models
{
    public class Location
    {
        public int Id { get; set; }
        public string AddressLine1 { get; set; }
        public string FullAddress { get; set; }
        public string City { get; set; }
        public string County { get; set; }
        public string State { get; set; }
        public int PostalCode { get; set; }
        public string Country { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
    }
}
