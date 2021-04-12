const axios = require('axios');
const qs = require('querystring');
const processFile = require('../../util/processFile');

exports.translate = async(ctx) => {
    const source = 'en';
    const target = 'ko';
    const { file, result } = await processFile.makeText();

    const file_array = new Array();
    for (const text of result) {
        const translated = await translate_Papago(source, target, text);
        file_array.push(translated);
    }

    await processFile.makePdf({ 
        file, file_array 
    });

    ctx.status = 200;
}

const translate_Papago = async(source, target, text) => {
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

    const result = await axios.post(url, params, options);

    return result.data.message.result.translatedText;
}