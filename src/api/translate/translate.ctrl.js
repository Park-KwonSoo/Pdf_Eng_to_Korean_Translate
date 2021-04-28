const axios = require('axios');
const qs = require('querystring');
const Process = require('../../lib/ProcessPdf');

exports.translate = async(ctx) => {

    const { file } = ctx.request.body;

    const source = 'en';
    const target = 'ko';
    const { title, result } = await Process.makeTextList('./data/' + file);

    const textList = new Array();
    
    for (const text of result) {
        const translated = await translate_Papago(source, target, text.text);
        textList.push(translated);
    }

    await Process.writePdfFile({ 
        title, 
        textList
    });

    ctx.status = 200;
    console.log("Done!");
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

    const result = await axios.post(url, params, options);

    return result.data.message.result.translatedText;
}