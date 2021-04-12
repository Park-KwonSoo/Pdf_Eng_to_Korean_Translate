const axios = require('axios');
const qs = require('querystring');
const processFile = require('../../util/processFile');

exports.translate = async(ctx) => {
    //PDF 파일을 폴더에서 가져옴, 추후에 해당 내용을 수정하여 유저가 직접 PDF 파일을 업로드 할 수 있도록 변경 예정
    const fileList = await processFile.getFileList('data');
    const file = './data/'.concat(fileList[0]);

    const source = 'en';
    const target = 'ko';
    const { title, result } = await processFile.makeText(file);

    const file_array = new Array();
    for (const text of result) {
        const translated = await translate_Papago(source, target, text);
        file_array.push(translated);
    }

    await processFile.makePdf({ 
        title, 
        file_array 
    });

    ctx.status = 200;
}

const translate_Papago = async (source, target, text) => {
    const url = "https://openapi.naver.com/v1/papago/n2mt";
    const { CLIENT_ID, CLIENT_SECRET } = process.env;

    const params = qs.stringify({
        source,
        target,
        text
    });

    const options = {
        headers : {
            'X-Naver-Client-Id':CLIENT_ID, 
            'X-Naver-Client-Secret': CLIENT_SECRET
        }
    };

    // const result = axios.post(url, params, options)
    //     .then(response => {
    //         return response.data.message.result.translatedText;
    //     }, error => {
    //         console.log(error);
    //     });

    const result = await axios.post(url, params, options);

    return result.data.message.result.translatedText;
}