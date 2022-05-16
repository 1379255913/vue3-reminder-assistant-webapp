export default function transform_cvs(jsonData) {
    let str="";
    for(let i = 0 ; i < jsonData.length ; i++ ){
        for(let item in jsonData[i]){
            str+=`${jsonData[i][item] + '\t'},`;
        }
        str+='\n';
    }
        return str;
}