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
            img.style.width = "128px";
            img.style.height = "128px";
            img.addEventListener("click", () => {
                navigator.clipboard.writeText(fileUrl);
                alert("Image URL copied to clipboard!");
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
