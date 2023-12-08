const path = require('path');
const morgan = require('morgan');
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, ".env") });
const express = require('express');
const app = express();

app.set('port', process.env.PORT);

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const Gu = {
    '종로구':108,
    '강남구': 400,
    '서초구': 401,
    '강동구': 402,
    '송파구': 403,
    '강서구': 404,
    '양천구': 405,
    '도봉구': 406,
    '노원구': 407,
    '동대문구': 408,
    '중랑구': 409,
    '동작구':410,
    '마포구': 411,
    '서대문구': 412,
    '광진구': 413,
    '성북구': 414,
    '용산구': 415,
    '은평구': 416,
    '금천구': 417,
    '중구': 419,
    '성동구': 421,
    '구로구': 423,
    '강북구': 424,
    '관악구': 509,
    '영등포구': 510,
};

const reverse_url = `https://dapi.kakao.com/v2/local/geo/coord2address`;
const alarm_url = 'http://apis.data.go.kr/1360000/WthrWrnInfoService/getWthrWrnList';

const kakao_options = {
    headers: {
        Authorization: `KakaoAK ${process.env.KAKAO_REST_KEY}`
    },
    params: {
        y: '37.5714',
        x: '126.9658',
        input_coord: 'WGS84',
    }
};

const alarm_options = {
    params: {
        serviceKey: `${process.env.PUBLIC_KEY}`,
        pageNo: '1',
        numOfRows: '20',
        dataType: 'JSON',
        //stnId: `${gu}`,   
        //stnId: '108',
    }
};

app.get('/alarm', async (req, res) => {
    const reverse_result = await axios.get(reverse_url, kakao_options);
    const gu = Gu[reverse_result.data.documents[0].road_address.region_2depth_name];
    const alarm_result = await axios.get(alarm_url, alarm_options);
    
    let alarm_data = [];
    
    if (alarm_result.data.response.header.resultMsg == 'NORMAL_SERVICE') {
        const items = alarm_result.data.response.body.items.item;
        const tm = items[0].tmFc;

        for (var idx = 0; idx < items.length; idx++){
            if (tm != items[idx].tmFc)
                break;
            alarm_data.push(items[idx].title);
        }

    }
    else { // 데이터 없을때
        
    }
    alarm_data.forEach(alarm => {
        console.log(alarm);
    });

    res.json(alarm_data);
});

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '빈 포트에서 서버 실행중');
});
