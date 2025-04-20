function balanceColumns(titleText, contentText, imageHeight) {
    const contentLeft = document.getElementById("contentLeft");
    const contentRight = document.getElementById("contentRight");
    const leftColumn = document.getElementById("leftColumn");

    // Clear any existing content
    contentLeft.innerHTML = '';
    contentRight.innerHTML = '';

    const words = contentText.split(' ');

    // Create a temporary container to measure text height
    const tempDiv = document.createElement("div");
    tempDiv.style.position = "absolute";
    tempDiv.style.visibility = "hidden";
    tempDiv.style.width = leftColumn.offsetWidth + "px";
    tempDiv.style.font = window.getComputedStyle(contentLeft).font;
    document.body.appendChild(tempDiv);

    // Estimate how tall the left column can be based on image height
    const totalHeight = leftColumn.offsetHeight;
    const maxLeftHeight = document.querySelector(".right-column").offsetHeight;

    let i = 0;
    let chunk = "";

    while (i < words.length) {
        chunk += words[i] + ' ';
        tempDiv.innerText = chunk;
        const currentHeight = tempDiv.offsetHeight;

        if (currentHeight > maxLeftHeight - 50) break; // leave room for buffer
        i++;
    }

    contentLeft.innerText = chunk;
    contentRight.innerText = words.slice(i).join(' ');

    document.body.removeChild(tempDiv);
}