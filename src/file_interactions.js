
/*
This script deals with loading JSON files.

*/

/*
*************************************************
Entry points
*************************************************
*/

function saveProject()
{
    //TODO project object separatly
    var beatsObj =  {};//encodeScenesWithBeats();
    //TODO scenes object separately
    var questionsObj = {} // encodeDramaticQuestions();
    var combinedObj = {"beats": beatsObj, "questions": questionsObj}
	var jsonData = encodeObjectToJson(combinedObj);
	download(jsonData, "testsave.story", 'text/plain');
}


document.getElementById('fileinput').onchange = function(e) {
    readFile(e.srcElement.files[0]);
};


function loadClicked()
{
    var fileupload = document.getElementById("fileinput");
    fileupload.click();
}

/*
*************************************************
*/



function readFile(file) {
    var reader = new FileReader();
    reader.onload = readSuccess;
    function readSuccess(evt) {
        var text = evt.target.result;
        displayScenesWithBeats(text);
    };
    reader.readAsText(file);
}

function download(content, fileName, contentType) {
    var a = document.createElement("a");
    var file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}

function encodeObjectToJson(obj)
{
	var json = JSON.stringify(obj);
	console.log(json);
	return json;
}

function displayScenesWithBeats(jsonString)
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
    
    return obj;
}

function encodeDramaticQuestions()
{
    var tableNode = document.getElementById("myTable");
    var questionsRowNode = document.getElementById("questions");
    var questionsObject = {}
    var questionNodes = questionsRowNode.getElementsByClassName("headerCell");
    var rowNodes = tableNode.getElementsByClassName("row");
    console.log("rows "+rowNodes.length);
    for(var i = 0; i < questionNodes.length-1; i++)
    {
        var questionID = questionNodes[i].getAttribute("question");
        console.log("questionID "+questionID);
        var text = questionNodes[i].innerHTML;
        var beats = [];
        for(var r = 0; r < rowNodes.length; r++)
        {
            console.log(r);
            var cells = rowNodes[r].getElementsByClassName("cell"); //TODO improve datastructure
            var cellText = cells[i].innerHTML;
            console.log(cellText);
            if(cellText!=="")
            {
                var beatNode = rowNodes[r].getElementsByClassName("beat")[0];
                var beatID = beatNode.getAttribute("id");
                beats.push({"id":beatID, "text":cellText});
            }
        }
        questionsObject[questionID] = {text, beats};
    }

    return questionsObject;
}


function displayDramaticQuestions(jsonString)
{
    // Clearing the old questions but leaving the beats
	var tableNode = document.getElementById("myTable");
    var questionsRowNode = document.getElementById("questions");
	while (questionsRowNode.firstChild) {
		questionsRowNode.removeChild(questionsRowNode.lastChild);
	}
    var rowNodes = tableNode.getElementsByClassName("row");
    for(var r = 0; r < rowNodes.length; r++)
    {
        while (rowNodes[r].firstChild) {
            rowNodes[r].removeChild(rowNodes[r].lastChild);
        }
    }

	// Adding questions from file
    var obj = JSON.parse(jsonString);
	for(var i; i<obj.questions.length;i++)
	{
        var lastQuestion = document.getElementsByClassName("headerClass")[i];
        var questionID = addDramaticQuestion(lastQuestion, 
                                            obj.questions[i].text, 
                                            obj.questions[i].beats);
	}
}