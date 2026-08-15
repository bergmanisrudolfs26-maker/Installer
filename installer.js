// ===============================
//  BASIC WEB SERIAL FLASHER
// ===============================

let port;
let writer;

// Connect to Arduino UNO R4 WiFi
async function connectSerial() {
    try {
        port = await navigator.serial.requestPort();
        await port.open({ baudRate: 115200 });

        writer = port.writable.getWriter();
        document.getElementById("status").innerText = "Status: Connected";
        return true;

    } catch (err) {
        alert("Failed to connect: " + err);
        return false;
    }
}

// Read firmware file from GitHub Pages
async function loadFirmware(version) {
    const url = `https://bergmanisrudolfs26-maker.github.io/Installer/firmware-${version}.bin`;

    try {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        return new Uint8Array(arrayBuffer);

    } catch (err) {
        alert("Failed to load firmware: " + err);
        return null;
    }
}

// Flash firmware to Arduino
async function flashFirmware(data) {
    document.getElementById("status").innerText = "Status: Flashing...";

    try {
        // Send raw bytes to Arduino bootloader
        await writer.write(data);

        document.getElementById("status").innerText = "Status: Firmware installed!";
        alert("Firmware installed successfully!");

    } catch (err) {
        alert("Flash error: " + err);
    }
}

// ===============================
//  INSTALL BUTTON HANDLER
// ===============================

document.getElementById("install").onclick = async () => {
    const version = document.getElementById("versionSelect").value;

    if (!version) {
        alert("Please select firmware version first!");
        return;
    }

    // Step 1: Connect
    const ok = await connectSerial();
    if (!ok) return;

    // Step 2: Load firmware file
    const firmware = await loadFirmware(version);
    if (!firmware) return;

    // Step 3: Flash firmware
    await flashFirmware(firmware);
};

// ===============================
//  DELETE BUTTON HANDLER
// ===============================

document.getElementById("delete").onclick = async () => {
    alert("Delete firmware function will erase flash (not implemented yet)");
};
