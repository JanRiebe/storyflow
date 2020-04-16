
/*
This script deals with loading JSON files.

*/


function loadScenesWithBeats(jsonString)
{
	// Clearing the old beats
	var beatSheetNode = document.getElementById("beatSheet");
	while (beatSheetNode.firstChild) {
		beatSheetNode.removeChild(beatSheetNode.lastChild);
	}

	// Adding beats from file
	var obj = JSON.parse(jsonString);
    var projectTitle = document.getElementById('projectTitle');
	projectTitle.innerHTML = obj.name;
	for(scene in obj.scenes)
	{
		var sceneID = addScene(obj.scenes[scene].title);
		for(beat in obj.scenes[scene].beats)
		{
            var beatID = obj.scenes[scene].beats[beat];
            var beatText = obj.beats[beatID];
			addBeat(sceneID, beatID, beatText);
		}
	}
}

function readFile(file) {
    var reader = new FileReader();
    reader.onload = readSuccess;
    function readSuccess(evt) {
        var text = evt.target.result;
        loadScenesWithBeats(text);
    };
    reader.readAsText(file);
}
document.getElementById('fileinput').onchange = function(e) {
    readFile(e.srcElement.files[0]);
};

function download(content, fileName, contentType) {
    var a = document.createElement("a");
    var file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}

function encodeScenesWithBeats()
{
    var beatSheetNode = document.getElementById("beatSheet");
    var obj = {}
    var projectTitle = document.getElementById('projectTitle');
    obj.name = projectTitle.innerHTML;
    var beatNodes = document.getElementsByClassName("beat");
    obj.beats = {};
    for(var i = 0; i < beatNodes.length; i++)
    {
        var beatID = beatNodes[i].getAttribute("id");
        var beatText = beatNodes[i].getElementsByClassName("beatText")[0].innerHTML;
        obj.beats[beatID] = beatText;
    }
    var sceneNodes = beatSheetNode.children;
	obj.scenes = [];
	for(var i = 0; i < sceneNodes.length; i++)
    {
        var sceneTitle = sceneNodes[i].getElementsByClassName("sceneTitle")[0].innerHTML;
        var sceneBeatNodes = sceneNodes[i].getElementsByClassName("beat");
		var sceneBeats = [];
		for(var b = 0; b < sceneBeatNodes.length; b++)
	    {
	        var beatID = sceneBeatNodes[b].getAttribute("id");
			sceneBeats[b] = beatID;
	    }
        obj.scenes[i] = {"title": sceneTitle, "beats": sceneBeats};
    }

	var json = JSON.stringify(obj);
	console.log(json);
	return json;
}

function saveProject()
{
	var jsonData = encodeScenesWithBeats();
	download(jsonData, "testsave.story", 'text/plain');
}
