chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.runtime.openOptionsPage();
});

chrome.windows.onCreated.addListener(function(window) {

	const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
	
	chrome.storage.sync.get(['homeTabs'], result => {
		const { homeTabs } = result;
		let d = new Date();
		console.log(homeTabs);
		Object.keys(homeTabs).map((url, index) => {
			console.log(''+url+' '+index);
			console.log(weekdays[d.getDay()]);
			if (homeTabs[url][weekdays[d.getDay()]]) {
				chrome.tabs.create({
					url,
					index,
					'active': index == 0,
				});
			}
		});

	});
});