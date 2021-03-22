window.addEventListener('resize', resize)
function resize(){
    let designSize = 1366; // 设计图尺寸
    let html = document.documentElement;
    let wW = html.clientWidth;// 窗口宽度
    let rem = wW * 100 / designSize; 
    document.documentElement.style.fontSize = rem + 'px';
    //设计宽度/100=视口宽度/fontsize
}
resize()