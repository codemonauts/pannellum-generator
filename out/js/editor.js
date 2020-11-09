// Hide current Position indicator
document.getElementById("currentPos").style.display = "none";

// For easier generation of hotspots. Nicer output than the normal hotspotDebug mode
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
        document.getElementById("target_scene_picker").style.display = "none";
        modal.style.display = "block";
    } else {
        console.log(`Click position: P:${pitch} Y:${yaw}`);
    }

})

function createHotSpot() {
    type = document.getElementById("input_type").value;
    yaw = document.getElementById("input_yaw").value;
    pitch = document.getElementById("input_pitch").value;
    text = document.getElementById("input_text").value;
    target_scene = document.getElementById("input_scene").value;
    current_scene = viewer.getScene();

    data = {
        "pitch": pitch,
        "yaw": yaw,
        "type": type,
        "text": text,
    };

    if (type == "scene") {
        data["sceneId"] = target_scene;
    }

    viewer.addHotSpot(data);

    updateConfig();

    // Hide model when we are finished
    modal.style.display = "none";
}

viewer.on("animatefinished", function (position) {
    yaw = position.yaw.toFixed(1);
    pitch = position.pitch.toFixed(1);
    hfov = position.hfov.toFixed(0);
    document.getElementById("currentPitch").innerText = pitch;
    document.getElementById("currentYaw").innerText = yaw;
    document.getElementById("currentFOV").innerText = hfov;
})

viewer.on("error", function () {
    viewer.loadScene(savedSceneName);
})

function switchTo(name) {
    viewer.loadScene(sceneId = name);
}

function updateConfig() {
    panel = document.getElementById("config");
    sceneList = viewer.getConfig().scenes
    panel.innerHTML = JSON.stringify(sceneList, null, 4);
}

function setHotspotType() {
    type = document.getElementById("input_type").value;
    scene_div = document.getElementById("target_scene_picker");
    if (type == "info") {
        scene_div.style.display = "none";
    } else {
        scene_div.style.display = "block";

    }
}

window.onbeforeunload = function () {
    return 'Are you sure you want to leave? Everything will be lost!';
};

let savedSceneName = "";

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

// "Set Viewport" Button
document.getElementById('pan-set').addEventListener('click', function (e) {
    pitch = viewer.getPitch().toFixed(1);
    yaw = viewer.getYaw().toFixed(1);
    hfov = viewer.getHfov();

    current_scene = viewer.getScene();
    scene_config = viewer.getConfig().scenes[current_scene];

    scene_config.pitch = parseFloat(pitch);
    scene_config.yaw = parseFloat(yaw);
    scene_config.hfov = parseInt(hfov);

    savedSceneName = current_scene;

    // Add with tmp name
    viewer.addScene("foobar", scene_config);
    // Switch to tmp scene
    viewer.loadScene("foobar");
    // Remove original scene
    viewer.removeScene(current_scene);
    // Newly add original scene with updated config
    viewer.addScene(current_scene, scene_config);
    // Switch to original scene
    viewer.loadScene(current_scene);
    // Remove tmp scene
    viewer.removeScene("foobar");

    updateConfig();
});
