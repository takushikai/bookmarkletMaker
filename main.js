//JavaScript to Bookmarklet Compiler ver0.3
//※正規表現内でも//が2つ続くとコメントとみなされる


const information = document.getElementById("information");
const input_area = document.getElementById("input_area"); 
const compile_button = document.getElementById("compile_button");
const copy_button = document.getElementById("copy_button");
const output_area = document.getElementById("output_area");

compile_button.addEventListener("click", ()=>{
    let input_str = input_area.value;

    const startTime = performance.now(); // 開始時間

    let output_str = compile(input_str);

    const endTime = performance.now(); // 終了時間
    const time_required = endTime - startTime; // 何ミリ秒かかったか
 
    output_area.value = output_str;
    
    //文字列をバイト数で取得
    let input_size = (new Blob([input_str])).size;
    let output_size = (new Blob([output_str])).size;
    
    //サイズ等を表示
    information.innerHTML = `
    <b>Time required:</b>${Math.round(time_required*1000)}μs
    <br>
    <b>Original Size:</b>${input_size/1000 + "KB"}
    <br>
    <b>Compiled Size:</b>${output_size/1000 + "KB"}
    <br>
    ${Math.round(100-(output_size/input_size*100))+"%"} Smaller
    `
});

copy_button.addEventListener("click",()=>{
    // 文字をすべて選択
    output_area.select();
    // コピー
    document.execCommand("copy");
})


function compile(str){
    // //「/*コメント*/」を削除
    // str = str.replace(/\/\*([^*]|\*[^\/])*\*\//g , "");

    // //「//コメント」を削除
    // str = str.replace(/\/\/.*/g , "");
    //コメント削除。ただし、",',`中にある場合は飛ばす・正規表現にも対応したい
    str = str.replace(
        /\/\/.*$|\/\*([^*]|\*[^\/])*\*\/|"([^"]|\\")*"|'([^']|\\')*'|`([^`]|\\`)*`/gm,
        (x) => x.substr(0,1)=="/" ? "" : x
    );

    //tabを半角スペースに置き換え
    str = str.replace(/\t/g," ");
    
    //行頭・行末のスペースを削除
    str = str.replace(/^ +| +$/gm,"");

    //2つ以上連続の半角スペースを1つに
    str = str.replace(/ +/g," ");

    //=の前後の半角スペースを削除
    str = str.replace(/ +=/gm,"=");
    str = str.replace(/= +/gm,"=");
    //<
    str = str.replace(/ +</gm,"<");
    str = str.replace(/< +/gm,"<");
    //>
    str = str.replace(/ +>/gm,">");
    str = str.replace(/> +/gm,">");
    //!
    str = str.replace(/ +!/gm,"!");
    str = str.replace(/! +/gm,"!");
    //:
    str = str.replace(/ +:/gm,":");
    str = str.replace(/: +/gm,":");
    //;
    str = str.replace(/ +;/gm,";");
    str = str.replace(/; +/gm,";");
    //+
    str = str.replace(/ +\+/gm,"+");
    str = str.replace(/; \+/gm,"+");
    //-
    str = str.replace(/ +-/gm,"-");
    str = str.replace(/- +/gm,"-");
    //*
    str = str.replace(/ +\*/gm,"*");
    str = str.replace(/\* +/gm,"*");
    ///
    str = str.replace(/ +\//gm,"/");
    str = str.replace(/\/ +/gm,"/");
    //%
    str = str.replace(/ +%/gm,"%");
    str = str.replace(/% +/gm,"%");
    //,
    str = str.replace(/ +,/gm,",");
    str = str.replace(/, +/gm,",");
    //&
    str = str.replace(/ +&/gm,"&");
    str = str.replace(/& +/gm,"&");
    //|
    str = str.replace(/ +\|/gm,"|");
    str = str.replace(/\| +/gm,"|");
    //?
    str = str.replace(/ +\?/gm,"?");
    str = str.replace(/\? +/gm,"?");
    //~
    str = str.replace(/ +;/gm,";");
    str = str.replace(/; +/gm,";");
    //()
    str = str.replace(/ +\(/gm,"(");
    str = str.replace(/\( +/gm,"(");
    str = str.replace(/ +\)/gm,")");
    str = str.replace(/\) +/gm,")");
    //{}
    str = str.replace(/ +\{/gm,"{");
    str = str.replace(/\{ +/gm,"{");
    str = str.replace(/ +\}/gm,"}");
    str = str.replace(/\} +/gm,"}");
    //{}
    str = str.replace(/ +\[/gm,"[");
    str = str.replace(/\[ +/gm,"[");
    str = str.replace(/ +\]/gm,"]");
    str = str.replace(/\] +/gm,"]");


    
    //空の行を削除
    str = str.replace(/^\n/gm,"");

    str = encodeURI(str);

    //先頭にjavascript: を追加
    str = "javascript:(function(){" + str + "})();";  

    return str;
}