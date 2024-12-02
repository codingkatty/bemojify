document.getElementById("uploadButton").addEventListener("click", async function () {
    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];

    if (!file) {
        alert("Please select a file to upload.");
        return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await fetch("https://bemojify.onrender.com/upload", {
            method: "POST",
            body: formData,
        });

        if (response.ok) {
            const result = await response.json();
            const fileUrl = result.fileUrl;

            document.cookie = `fileUrl=${fileUrl}; path=/`;

            const img = document.createElement("img");
            img.src = fileUrl;
            img.alt = "Uploaded Emoji";
            img.style.cursor = "pointer";
            img.addEventListener("click", () => {
                const format = prompt('Choose format (1: URL, 2: HTML, 3: Markdown):', '1');
                let copyText;
                switch(format) {
                    case '2':
                        copyText = `<img src="${fileUrl}" alt="emoji" width="24" height="24">`;
                        break;
                    case '3':
                        copyText = `![emoji](${fileUrl})`;
                        break;
                    default:
                        copyText = fileUrl;
                }
                navigator.clipboard.writeText(copyText);
                alert("Copied to clipboard in selected format!");
            });

            const emojisContainer = document.getElementById("emojis");
            emojisContainer.appendChild(img);
        } else {
            alert("Failed to upload file.");
        }
    } catch (error) {
        console.error("Error uploading file:", error);
        alert("Error uploading file.");
    }
});

const dropZone = document.getElementById("drop-zone");

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

['dragenter', 'dragover'].forEach(eventName => {
    dropZone.addEventListener(eventName, highlight, false);
});

['dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, unhighlight, false);
});

function highlight(e) {
    dropZone.classList.add('dragover');
}

function unhighlight(e) {
    dropZone.classList.remove('dragover');
}

dropZone.addEventListener('drop', handleDrop, false);

function handleDrop(e) {
    const dt = e.dataTransfer;
    const file = dt.files[0];
    const fileInput = document.getElementById("fileInput");
    
    fileInput.files = dt.files;
    document.getElementById("uploadButton").click();
}
