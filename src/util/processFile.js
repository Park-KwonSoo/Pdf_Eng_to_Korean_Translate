const fs = require('fs');
const pdfRead = require('pdf-parse');
const pdfDocument = require('pdfkit');
const data = 'data';
const Font = './src/data/font/HANBatang-LVT.ttf'

//pdf파일을 받아서 각 페이지를 나누고 페이지의 text 문자열을 배열에 저장 후 파일 제목과 배열을 리턴
exports.makeText = async() => {
    const file = await readFileList();
    const result = await getPdfToText(file);

    return {
        file,
        result
    };
}

//페이지의 정보를 저장한 file array를 받아와서, A4 사이즈의 pdf로 생성
exports.makePdf = async({ file, file_array }) => {
    const doc = new pdfDocument({ size : 'A4' });

    //pdf파일을 만들고, 쓰기 모드로 변경
    doc.pipe(fs.createWriteStream('./output/' + 'translated_' + file + '.pdf'));
    
    for(const text of file_array) {
        doc.font(Font)
            .text(text, {
                width : 410,
                align : 'justify'
            });
        //페이지를 추가하고, 다음 페이지로 넘어간다.
        doc.addPage();
    }

    //파일 쓰기를 끝내고 저장한다.
    doc.end();
}

//data 폴더의 파일명을 가져옴
const readFileList = () => {
    const result = fs.readdirSync(data);

    return result;
}

//data 폴더의 PDF 파일을 문자열로 파싱한다
const getPdfToText = async(filelist) => {
    const buffer = fs.readFileSync(data + '/' + filelist[0]);
    const result = await pdfRead(buffer);

    const result_text = result.text;

    let index, beforeIndex = 0;
    const text_length = result_text.length;

    const resultTextArray = new Array();
    for(let i = 1; i < result.numpages; i++) {
        index = result_text.indexOf(String(i) + '\n\n') + String(i).length + 2;
        resultTextArray.push(result_text.slice(beforeIndex, index));
        beforeIndex = index;
    }

    resultTextArray.push(result_text.slice(beforeIndex, text_length));

    return resultTextArray;
};
