const fs = require('fs');
const PdfReader = require('pdfreader/PdfReader');
const pdfDocument = require('pdfkit');

//pdf를 받아서, 페이지별로 text를 변환한 값을 return
exports.makeTextList = async(pdf) => {
    const title = pdfTitle(pdf);

    const decoded = await decodePdfFile(pdf);
    const index = await getPageIndex(decoded);
    const result = await incodeText(index, decoded);

    return {
        title,
        result
    };
}

//title과 text를 받아서 글을 작성한다.
exports.writePdfFile = ({ title, textList }) => {
    const doc = new pdfDocument({ size : 'A4' });

    const { FONT } = process.env;
    const Font = './src/data/font/'.concat(FONT);

    //pdf파일을 만들고, 쓰기 모드의 파일 스트림과 연결
    doc.pipe(fs.createWriteStream('./output/' + 'translated_' + title));
    
    for(const item of textList) {
        doc.font(Font)
            .text(item, {
                width : 410,
                align : 'justify'
            });
        //페이지를 추가하고, 다음 페이지로 넘어간다.
        doc.addPage();
    }

    //파일 쓰기를 끝내고 저장한다.
    doc.end();
}

//pdf file을 받아서 file의 모든 정보를 저장한 array를 가져옴
const decodePdfFile = (file) => {
    return new Promise((resolve, reject) => {
        const undecodeArray = []
        new PdfReader().parseFileItems(file, (err, item) => {
            if(item)    undecodeArray.push(item);
            else    resolve(undecodeArray);
        })
    })
}

//모든 정보가 저장되어 있는 array의 page가 들어있는 index만을 추출
const getPageIndex = (undecodeArray) => {
    return new Promise((resolve, reject) => {
        const pageList = undecodeArray.filter((item) => {
            return (item.page !== undefined)
        })

        const indexInfo = [];
        const pageList_end = pageList.length - 1;
        pageList.forEach(item => {
            indexInfo.push(undecodeArray.indexOf(item));
            if(pageList.indexOf(item) === pageList_end) resolve(indexInfo)
        })

    })
}

const incodeText = (indexInfo, undecodeArray) => {
    return new Promise((resolve, reject) => {
        let i, j;
        const result = [];
        const index_len = indexInfo.length;
        const arr_len = undecodeArray.length;

        let text = "";
        for(i = 0; i < index_len - 1; i++) {
            for(j = indexInfo[i] + 1; j < indexInfo[i + 1]; j++)
                text += undecodeArray[j].text + '\n';
            result.push({
                page : i + 1,
                text
            });
            text = "";
        }

        for(j = j + 1; j < arr_len; j++) 
            text += undecodeArray[j].text +'\n'
        result.push({
            page : i + 1,
            text
        })

        resolve(result);
    })
}

const pdfTitle = (pdf) => {
    const split = pdf.split('/');
    const title = split.pop();

    return title;
}