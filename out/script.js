
// For easier generation of hotspots. Nicer output than the normal hotspotDebug mode
viewer.on("mousedown", function (event) {
    let [pitch, yaw] = viewer.mouseEventToCoords(event);
    yaw = yaw.toFixed(1);
    pitch = pitch.toFixed(1);
    id = new Date().getTime();
    scene = viewer.getScene();
    list = document.getElementById("hotspotList");

    // CTRL+Click for Info Hotspot
    if (event.ctrlKey) {
        //console.log("ctr key was pressed during the click");
        viewer.addHotSpot(
            {
                "pitch": pitch,
                "yaw": yaw,
                "type": "info",
                "text": getLabel(),
            });
        hotspots[scene].push(
            {
                "pitch": pitch,
                "yaw": yaw,
                "type": "info",
                "text": getLabel(),
            });
        // Shift+Click for Scene Hotspot
    } else if (event.shiftKey) {
        console.log("shift key was pressed during the click");
        viewer.addHotSpot(
            {
                "pitch": pitch,
                "yaw": yaw,
                "type": "scene",
                "text": getLabel(),
                "scene": getLabel(),
                "id": id,
            });
        hotspots[scene].push(
            {
                "pitch": pitch,
                "yaw": yaw,
                "type": "scene",
                "text": getLabel(),
                "scene": getLabel(),
            });
    } else {
        console.log(`Click: P:${pitch} Y:${yaw}`);
    }
    updateConfig();
})

viewer.on("animatefinished", function (position) {
    yaw = position.yaw.toFixed(1);
    pitch = position.pitch.toFixed(1);
    hfov = position.hfov;
    console.log(`Viewport: P:${pitch} Y:${yaw} FOV:${hfov}°`);
})

function getLabel() {
    textfield = document.getElementById("labelInput");
    return textfield.value;
}

function switchTo(name) {
    viewer.loadScene(sceneId = name);
}

function updateConfig() {
    panel = document.getElementById("config");
    panel.innerHTML = JSON.stringify(hotspots, null, 4);
}

window.onbeforeunload = function () {
    return 'Are you sure you want to leave? Everything will be lost!';
};
