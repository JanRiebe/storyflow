/*
This script allows adding beats and scenes to the scene based beatsheet document.

*/


var beatCount = 0;
function addFreshBeat(list)
{
    addBeat(list, "beat"+beatCount, "", []);
    beatCount++;
};

function addBeat(list, id, text, metadata_list) {
    var beatsList = document.getElementById(list);
    var newBeat = document.createElement("div");
    newBeat.setAttribute("class", "beat");
    newBeat.setAttribute("id", id);

    var newHandle = document.createElement("span");
    newHandle.setAttribute("class", "handle");
    var handleText = document.createTextNode("::::: ");    //TODO give better icon
    newHandle.appendChild(handleText);
    newBeat.appendChild(newHandle);

    var newTextSpan = document.createElement("span");
    newTextSpan.setAttribute("contenteditable", "true");
    newTextSpan.setAttribute("class", "beatText");
    newTextSpan.innerHTML = text;
    newBeat.appendChild(newTextSpan);

    for(i in metadata_list)
    {
        var newMetaDataSpan = document.createElement("span");
        newMetaDataSpan.setAttribute("contenteditable", "true");
        newMetaDataSpan.setAttribute("class", "metaData");
        newMetaDataSpan.innerHTML = metadata_list[i];
        newBeat.appendChild(newMetaDataSpan);
    }

    beatsList.appendChild(newBeat);
    newTextSpan.focus();
};


function addFreshScene()
{
    addScene("new scene "+sceneCount);
}

var sceneCount = 0;
function addScene(sceneTitle)
{
    var beatSheetNode = document.getElementById("beatSheet");
    var newScene = document.createElement("div");
    newScene.setAttribute("class", "scene");

    var title = document.createElement("h1");
    title.setAttribute("class", "sceneTitle");
    title.setAttribute("contenteditable", "true");
    title.innerHTML = "unnamed scene";//sceneTitle;
    newScene.appendChild(title);

    sceneCount+=1;
    var listID = "scene"+sceneCount;
    var beatList = document.createElement("div");
    beatList.setAttribute("class", "listHalf");
    beatList.setAttribute("id", listID);
    newScene.appendChild(beatList);

    var newBeatButton = document.createElement("button");
    newBeatButton.setAttribute("class", "addBeatButton");
    newBeatButton.setAttribute("onclick", "addFreshBeat('"+listID+"')");
    //var buttonText = document.createTextNode("+");
    //newBeatButton.appendChild(buttonText);
    newBeatButton.innerHTML = '<span class="material-icons">add_box</span>';
    newScene.appendChild(newBeatButton);

    beatSheetNode.appendChild(newScene);

    new Sortable(document.getElementById(listID), { group: 'shared' });

    return listID;
}

function filterByMetaData(filter)
{
    var beats = document.getElementsByClassName("beat");
    for(var b=0; b < beats.length;b++)
    {
        var metaData = beats[b].getElementsByClassName("metaData");
        for(var m=0; m < metaData.length;m++)
        {
            var text = metaData[m].innerHTML;
            if (text===filter || filter.length==0) {
                beats[b].style.display = "block";
                break;
            } else {
                beats[b].style.display = "none";
            }
        }
    }
}
document.getElementById('filter').oninput = function(e) {
    filterByMetaData(e.target.value);
};

