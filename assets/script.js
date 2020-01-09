var fileNames = [];
let zip = new JSZip();

function downloadZip() {
	zip.generateAsync({type:"blob"})
	.then(function(content) {
		saveAs(content, "icons.zip");
	});
}

var playGround = function() {
	let whSizeEnabled = document.getElementById("wh-checkbox").checked;
	let resizeValueW, resizeValueH;

	if (!whSizeEnabled) {
		resizeValueW = document.getElementById("resize_value").value;
		resizeValueH = document.getElementById("resize_value").value;
	} else {
		resizeValueW = document.getElementById("resizew_value").value;
		resizeValueH = document.getElementById("resizeh_value").value;
	}

	const previews = document.getElementById("preview-wrapper").childNodes;
	for (var i = 0; i < document.getElementById("preview-wrapper").childElementCount; i++) {
		previews.item(i).childNodes.item(0).setAttribute("width", resizeValueW);
		previews.item(i).childNodes.item(0).setAttribute("height", resizeValueH);
	}
	document.getElementById("download_wrapper").style.display = "block";
}

var fileUpload = document.getElementById("file_upload");

fileUpload.addEventListener("change", function(e){
	fileNames = [];
	const previews = document.getElementById("preview-wrapper");
	while(previews.firstChild){
		previews.removeChild(previews.firstChild);
	}

	const list = document.getElementById("list-wrapper");
	while(list.firstChild){
		list.removeChild(list.firstChild);
	}

	zip = new JSZip();

	for (var i = 0; i < fileUpload.files.length; i++) {
		const name = fileUpload.files.item(i).name;
		fileNames.push(name.split('.')[0] + '.png');

		const elt = document.createElement('li');
		elt.innerHTML = name;

		document.getElementById("list-wrapper").appendChild(elt);

		var fileSvg = fileUpload.files[i];
		const reader = new FileReader();
		reader.readAsText(fileSvg);
		reader.onload = function(){
			const preview = document.createElement('div');
			preview.classList.add('preview');
			preview.innerHTML = reader.result;
			const svg = preview.childNodes.item(0);
			const resizeValue = document.getElementById("resize_value").value;
			svg.setAttribute("width", resizeValue);
			svg.setAttribute("height", resizeValue);
			document.getElementById("preview-wrapper").appendChild(preview);
			document.getElementById("svg_form").style.display = "block";
		}
	}
});

function exportResizedSvg() {
	const previews = document.getElementById("preview-wrapper").childNodes;
	for (var i = 0; i < document.getElementById("preview-wrapper").childElementCount; i++) {
		const name = fileNames[i];
		const preview = previews.item(i);
		const svg = preview.childNodes.item(0);
		svg.toDataURL("image/png", {
			callback: function(data) {
				data = data.substring(22);
				zip.file(name, data, {base64: true});
			}
		})
	}
}

document.getElementById("wh-checkbox").addEventListener("change", (event) => {
	if (event.target.checked) {
		document.getElementById("wh-wrapper").classList.remove('hidden');
		document.getElementById("resize_value").classList.add('hidden');
	} else {
		document.getElementById("wh-wrapper").classList.add('hidden');
		document.getElementById("resize_value").classList.remove('hidden');
	}
});