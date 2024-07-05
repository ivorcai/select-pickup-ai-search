chrome.commands.onCommand.addListener(async function (command) {
    if (command === 'submit-selection') {
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        const tabId = tabs[0].id;

        const selectedText = getSelectedText(tabs[0].id).then(selectedText => {
            const result = processWithAI(selectedText, tabs[0].id).then(result => {
                console.log(result);
                // 将结果发送给浮窗页面
                chrome.tabs.sendMessage(tabId, { action: 'showResult', result: result }, function (response) {
                    console.log(response.result);
                });
            });
        });
    }
});

function getSelectedText(tabId) {
    return new Promise((resolve, reject) => {
        chrome.tabs.sendMessage(tabId, { action: 'getSelectedText' }, function (response) {
            if (response && response.selectedText) {
                console.log(response.selectedText);
                resolve(response.selectedText);
                return response.selectedText;
            } else {
                console.log('没有获取到选中的文本');
                resolve('');
                return '';
            }
        });
    });
}

function processWithAI(text, tabId) {
    if (text != undefined && text != '') {
        return new Promise((resolve, reject) => {

            chrome.tabs.sendMessage(tabId, { action: 'processWithAI', text: text }, function (response) {
                if (response && response.answer) {
                    console.log(response.answer);
                    resolve(response.answer);
                    return response.answer;
                } else {
                    console.log('无法处理选中的文本');
                    resolve(new Error('无法处理选中的文本'));
                }
            });
        });
    }
}