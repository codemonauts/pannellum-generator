// Hide config block
document.getElementById("config").style.display = "none";
document.getElementById("pan-set").style.display = "none";
document.getElementById("target_scene_picker").style.display = "none";
document.getElementById("editor_fields").style.display = "none";

function switchTo(name) {
    viewer.loadScene(sceneId = name);
}

let hotspots = {}

// Get the modal
var modal = document.getElementById("myModal");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];


// When the user clicks on <span> (x), close the modal
span.onclick = function () {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

viewer.on("mousedown", function (event) {
    let [pitch, yaw] = viewer.mouseEventToCoords(event);
    yaw = yaw.toFixed(1);
    pitch = pitch.toFixed(1);
    scene = viewer.getScene();

    // CTRL+Click for Hotspot
    if (event.ctrlKey) {
        document.getElementById("input_type").value = "info";
        document.getElementById("input_yaw").value = yaw;
        document.getElementById("input_pitch").value = pitch;
        document.getElementById("input_text").value = "Test"
        modal.style.display = "block";
    }

})

viewer.on("animatefinished", function (position) {
    yaw = position.yaw.toFixed(1);
    pitch = position.pitch.toFixed(1);
    hfov = position.hfov.toFixed(0);
    document.getElementById("currentPitch").innerText = pitch;
    document.getElementById("currentYaw").innerText = yaw;
    document.getElementById("currentFOV").innerText = hfov;
})

viewer.on("load", function (event) {
    current_scene = viewer.getScene();
    if (current_scene in hotspots) {
        console.log("Adding");
        hotspots[current_scene].forEach(elem => {
            viewer.addHotSpot(elem, current_scene);
        });
    }
    delete hotspots[current_scene];
})

async function createHotSpot() {
    type = document.getElementById("input_type").value;
    yaw = document.getElementById("input_yaw").value;
    pitch = document.getElementById("input_pitch").value;
    text = document.getElementById("input_text").value;
    current_scene = viewer.getScene();

    data = {
        "pitch": pitch,
        "yaw": yaw,
        "type": type,
        "text": text,
    };

    viewer.addHotSpot(data);

    // add more keys for dynamodb
    data.scene = current_scene;
    data.hotSpotId = new Date().getTime();

    // Push new hotspot to backend
    const response = await fetch(backendURL, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const myJson = await response.json(); //extract JSON from the http response
    console.log(myJson);

    // Hide model when we are finished
    modal.style.display = "none";
}

window.onload = async () => {
    const response = await fetch(backendURL);
    hotspots = await response.json(); //extract JSON from the http response

    // Reload current scene after we got the data
    current_scene = viewer.getScene();
    switchTo(current_scene);
}
