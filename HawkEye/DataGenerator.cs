﻿using HawkEye.DB;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HawkEye
{
    public class DataGenerator
    {
        public static void Initialize(IServiceProvider serviceProvider)
        {
            using (var context = new ApiContext(
                serviceProvider.GetRequiredService<DbContextOptions<ApiContext>>()))
            {
                if (context.Locations.Any())
                {
                    return;
                }

                context.Locations.AddRange(
                    new Models.Location
                    {
                        Id = 1,
                        AddressLine1 = "2705 COUNTRY DREAM Dr ",
                        FullAddress = "2705 COUNTRY DREAM Dr, Albin, WY 82050",
                        City = "Albin",
                        State = "WY",
                        PostalCode = 82050,
                        Country = "US",
                        Latitude = 41.391426,
                        Longitude = -104.469553,
                        LocationType = "NNI"
                    },
                    new Models.Location
                    {
                        Id = 2,
                        AddressLine1 = "125 S Dakota Ave ",
                        FullAddress = "125 S Dakota Ave, Sioux Falls, SD 57104",
                        City = "Sioux Falls",
                        State = "SD",
                        PostalCode = 57104,
                        Country = "US",
                        Latitude = 43.546650,
                        Longitude = -96.729790,
                        LocationType = "SDN Lit Bldgs"

                    },
                    new Models.Location
                    {
                        Id = 3,
                        AddressLine1 = "3935 HWY 14 ",
                        FullAddress = "3935 HWY 14, ROCHESTER, MN 55901",
                        City = "ROCHESTER",
                        State = "MN",
                        PostalCode = 55901,
                        Country = "US",
                        Latitude = 44.038477,
                        Longitude = -92.524339,
                        LocationType = "NNI"
                    },
                    new Models.Location
                    {
                        Id = 4,
                        AddressLine1 = "3935 HWY 14 ",
                        FullAddress = "3935 HWY 14, Brandon, SD 55901",
                        City = "Brandon",
                        State = "SD",
                        PostalCode = 55901,
                        Country = "US",
                        Latitude = 43.5947,
                        Longitude = -96.5720,
                        LocationType = "SDN Lit Bldgs"
                    },
                    new Models.Location
                    {
                        Id = 5,
                        AddressLine1 = "5841 S. Corporate Place",
                        FullAddress = "5841 S. Corporate Place, Sioux Falls, SD 57108",
                        City = "Sioux Falls",
                        State = "SD",
                        PostalCode = 57108,
                        Country = "US",
                        Latitude = 43.4464,
                        Longitude = -96.8359,
                        LocationType = "NNI"
                    });

                context.SaveChanges();
            }
        }
    }
}
