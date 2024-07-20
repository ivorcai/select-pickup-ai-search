

// 创建一个AI模型
let AI = null;

// 鼠标抬起事件的坐标
let mouseX = 0;
let mouseY = 0;

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === 'getSelectedText') {
        // 获取选中的文本
        const selectedText = window.getSelection().toString();
        sendResponse({ selectedText: selectedText });
    } else if (request.action === 'processWithAI') {
        const text = request.text;
        // 在这里执行与AI相关的操作
        const answer = processWithAI(text)
            .then(result => {
                console.log(result);
                sendResponse({ answer: result });
            });
        return true;
    } else if (request.action === 'showResult') {
        // 将结果显示在页面上
        console.log(request.result);
        createPopup(request.result);
        sendResponse({ result: '接收结果成功' });
    }
});


async function processWithAI(text) {
    // 在这里调用异步的AI处理方法
    if (AI == null) {
        AI = await window.ai.createTextSession();
    }

    let answer = '';
    // 使用await等待异步操作的完成
    if (text != undefined && text != '') {
        let prompt = '接下来我会提供给你一段内容,如果内容是英文内容,请只输出其中文译文,输出格式为:"译文内容";若给定的内容不是英文,请告诉我此内容的意思是什么。以上是规则说明,下面是给定的内容,内容是：' + text;
        answer = await AI.prompt(prompt);
        // 处理完成后，将结果作为resolve的参数返回
        console.log(answer);
    }
    return new Promise((resolve, reject) => {
        resolve(answer);
    });
}

// 创建浮窗来显示结果
function createPopup(result) {
    const popup = document.createElement('div');
    popup.id = 'popup';
    popup.style.position = 'fixed';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.backgroundColor = 'white';
    popup.style.padding = '10px';
    popup.style.border = '1px solid black';
    popup.style.color = 'black';
    popup.textContent = result;

    document.body.appendChild(popup);

    popup.style.top = `${mouseY + popup.offsetHeight}px`; // 在划词的下方留出一些间距
    popup.style.left = `${mouseX + popup.offsetWidth / 2}px`; // 紧贴划词的左上角

    // 添加点击事件监听器，点击页面其他地方时关闭弹窗
    document.addEventListener('click', function (event) {
        if (!popup.contains(event.target)) {
            popup.remove();
        }
    });
}

// 监听鼠标抬起事件
document.addEventListener('mouseup', function (event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
});