// 소스출처 : http://www.kma.go.kr/weather/forecast/digital_forecast.jsp 
//
// (사용 예)
// var rs = dfs_xy_conv("toLL","60","127");
// console.log(rs.lat, rs.lng);
//


var RE = 6371.00877; // 지구 반경(km)
var GRID = 5.0; // 격자 간격(km)
var SLAT1 = 30.0; // 투영 위도1(degree)
var SLAT2 = 60.0; // 투영 위도2(degree)
var OLON = 126.0; // 기준점 경도(degree)
var OLAT = 38.0; // 기준점 위도(degree)
var XO = 43; // 기준점 X좌표(GRID)
var YO = 136; // 기1준점 Y좌표(GRID)
//
// LCC DFS 좌표변환 ( code : "toXY"(위경도->좌표, v1:위도, v2:경도), "toLL"(좌표->위경도,v1:x, v2:y) )
//


function dfs_xy_conv(code, v1, v2) {
    var DEGRAD = Math.PI / 180.0;
    var RADDEG = 180.0 / Math.PI;

    var re = RE / GRID;
    var slat1 = SLAT1 * DEGRAD;
    var slat2 = SLAT2 * DEGRAD;
    var olon = OLON * DEGRAD;
    var olat = OLAT * DEGRAD;

    var sn = Math.tan(Math.PI * 0.25 + slat2 * 0.5) / Math.tan(Math.PI * 0.25 + slat1 * 0.5);
    sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);
    var sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
    sf = Math.pow(sf, sn) * Math.cos(slat1) / sn;
    var ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
    ro = re * sf / Math.pow(ro, sn);
    var rs = {};
    if (code == "toXY") {
        rs['lat'] = v1;
        rs['lon'] = v2;
        var ra = Math.tan(Math.PI * 0.25 + (v1) * DEGRAD * 0.5);
        ra = re * sf / Math.pow(ra, sn);
        var theta = v2 * DEGRAD - olon;
        if (theta > Math.PI) theta -= 2.0 * Math.PI;
        if (theta < -Math.PI) theta += 2.0 * Math.PI;
        theta *= sn;
        rs['x'] = Math.floor(ra * Math.sin(theta) + XO + 0.5);
        rs['y'] = Math.floor(ro - ra * Math.cos(theta) + YO + 0.5);
    }
    else {
        rs['x'] = v1;
        rs['y'] = v2;
        var xn = v1 - XO;
        var yn = ro - v2 + YO;
        ra = Math.sqrt(xn * xn + yn * yn);
        if (sn < 0.0) - ra;
        var alat = Math.pow((re * sf / ra), (1.0 / sn));
        alat = 2.0 * Math.atan(alat) - Math.PI * 0.5;

        if (Math.abs(xn) <= 0.0) {
            theta = 0.0;
        }
        else {
            if (Math.abs(yn) <= 0.0) {
                theta = Math.PI * 0.5;
                if (xn < 0.0) - theta;
            }
            else theta = Math.atan2(xn, yn);
        }
        var alon = theta / sn + olon;
        rs['lat'] = alat * RADDEG;
        rs['lon'] = alon * RADDEG;
    }
    return rs;
}

function ToXY(startY, startX, endY, endX) {
    const start = dfs_xy_conv('toXY', startY, startX);
    const end = dfs_xy_conv('toXY', endY, endX);
    return { start, end };
}
  
module.exports = {
    dfs_xy_conv: dfs_xy_conv,
    ToXY:ToXY
};


// var locArr = [
//     [60, 127], [61, 127], [60, 126], [59, 126], [61, 126],
//     [62, 126], [62, 127], [62, 128], [60, 128], [61, 128],
//     [61, 129], [62, 129], [59, 127], [59, 128], [58, 127],
//     [58, 126], [57, 126], [58, 125], [57, 127], [57, 125],
//     [59, 124], [59, 125], [58, 124], [60, 125], [61, 125],
//     [61, 124], [62, 125], [63, 125], [63, 126], [63, 127]
// ];

// for (let idx = 0; idx < 30; idx++) {
//     var result = dfs_xy_conv("toLL", locArr[idx][0], locArr[idx][1]);
//     console.log(result.lat + ',' + result.lon);
// }


// // 위도
// var lat_line= [37.67973846, 37.63677895, 37.60262058, 37.55674696, 37.51063517, 37.46494092, 37.42198141];
// // 경도
// var lon_line = [126.7851093, 126.8432583, 126.9010823, 126.9599082, 127.0180783, 127.0766389, 127.1340031, 127.1921521];
// var num = 0;

// for(let lat_idx = 1; lat_idx < lat_line.length; lat_idx++){
//     for(let lon_idx = 0; lon_idx <lon_line.length-1; lon_idx++){
//         // 격자가 서울 밖이면 continue
//         if(lat_idx == 1 && lon_idx != 4 && lon_idx != 5)
//             continue;
//         else if(lat_idx == 2 && lon_idx != 2 && lon_idx != 3 && lon_idx != 4 && lon_idx != 5)
//             continue;
//         else if(lat_idx == 6 && lon_idx != 1 && lon_idx != 2 && lon_idx != 4)
//             continue;
//         num++;  
//         var result = dfs_xy_conv("toXY", lat_line[lat_idx], lon_line[lon_idx]);
//         console.log("%d : %d %d", num, result.x, result.y);
//     }
// }

