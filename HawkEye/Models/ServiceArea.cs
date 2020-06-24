using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HawkEye.Extensions;
using Microsoft.SqlServer.Types;

namespace HawkEye.Models
{
    public class ServiceArea
    {
        public ServiceArea(double[][] points)
        {
            //this.Points = GeometryHelper.Points(this.GeoArea);
            ////POLYGON ((-96.4528919997509 43.5000522259451, -96.0519452026165 43.500570039829, -96.0523830898331 43.8481957164253, -96.454155802039 43.8486800958301, -96.4528919997509 43.5000522259451))
            //SqlGeometryBuilder geo = new SqlGeometryBuilder();
            //geo.BeginGeometry(OpenGisGeometryType.Polygon);
            //geo.BeginFigure(points[0][1], points[0][1]);

            //for (int i = 1; i < points.Length; ++i)
            //{
            //    geo.
            //}

            //foreach(double[] element in points)
            //{

            //}

            //geo.AddLine()
        }

        public int Id { get; set; }
        public string ServiceAreaType { get; set; }
        public string CommunityCity { get; set; }
        public string CommunityState { get; set; }
        public SqlGeometry GeoArea { get; set; }
        public SqlGeometry[] Points { get; set; }
        public string CompanyName { get; set; }
    }

}
