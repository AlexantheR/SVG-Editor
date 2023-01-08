function setLineCoordinnates(obj, x1, y1, x2, y2) {
    obj.setAttributeNS(null, "x1", x1);
    obj.setAttributeNS(null, "y1", y1);
    obj.setAttributeNS(null, "x2", x2);
    obj.setAttributeNS(null, "y2", y2);
}

function setEllipseCoordinates(obj, x1, y1, x2, y2) {
    obj.setAttributeNS(null, "cx", (x1 + x2) / 2);
    obj.setAttributeNS(null, "cy", (y1 + y2) / 2);
    obj.setAttributeNS(null, "rx", (Math.max(x1, x2) - Math.min(x1, x2)) / 2);
    obj.setAttributeNS(null, "ry", (Math.max(y1, y2) - Math.min(y1, y2)) / 2);
}

function setRectCoordinates(obj, x1, y1, x2, y2) {
    obj.setAttributeNS(null, "x", Math.min(x1, x2));
    obj.setAttributeNS(null, "y", Math.min(y1, y2));
    obj.setAttributeNS(null, "width", Math.max(x1, x2) - Math.min(x1, x2));
    obj.setAttributeNS(null, "height", Math.max(y1, y2) - Math.min(y1, y2));
}

var leftMouse = 0, rightMouse = 2, deleteKey = 46, resetKey = 82;
var x1 = 0, y1 = 0; //coordonate mouse down x si y
var selectedElement = null;
var drawing = "";

var editor = document.getElementById("editSVG");
var selectLine = document.getElementById("selectLine");
var selectEllipse = document.getElementById("selectEllipse");
var selectRect = document.getElementById("selectRect");
var elements = document.getElementById("drawings");
var movement = document.getElementById("move");
var unselected = document.getElementById("unselect");
var stopClick = document.getElementById("stopClick");

function drawLine() {
    drawing = "line";
}

function drawEllipse() {
    drawing = "ellipse";
}

function drawRect() {
    drawing = "rect";
}

editor.addEventListener("mousedown", function (e) {
    if (e.button == leftMouse && drawing != "") {
        x1 = e.pageX - this.getBoundingClientRect().left;
        y1 = e.pageY - this.getBoundingClientRect().top;

        if (drawing == "line") {
            setLineCoordinnates(selectLine, x1, y1, x1, y1);
            selectLine.style.display = "block";
            //aplicam culoarea pentru stroke
            const colorStroke = document.getElementById("color-stroke").value;
            selectLine.style.stroke = colorStroke;

            //aplicam grosimea pt stroke
            const strokeWidth = document.getElementById("stroke-width").value;
            selectLine.style.strokeWidth = strokeWidth;
        }

        if (drawing == "ellipse") {
            setEllipseCoordinates(selectEllipse, x1, y1, x1, y1);
            selectEllipse.style.display = "block";

            //aplicam culoarea pentru fundal
            const color = document.getElementById("color-picker").value;
            selectEllipse.style.fill = color;

            //aplicam culoarea pentru stroke
            const colorStroke = document.getElementById("color-stroke").value;
            selectEllipse.style.stroke = colorStroke;

            //aplicam grosimea pt stroke
            const strokeWidth = document.getElementById("stroke-width").value;
            selectEllipse.style.strokeWidth = strokeWidth;
        }

        if (drawing == "rect") {
            setRectCoordinates(selectRect, x1, y1, x1, y1);
            selectRect.style.display = "block";
            const color = document.getElementById("color-picker").value;
            selectRect.style.fill = color;
            const colorStroke = document.getElementById("color-stroke").value;
            selectRect.style.stroke = colorStroke;

            const strokeWidth = document.getElementById("stroke-width").value;
            selectRect.style.strokeWidth = strokeWidth;
        }
    }
})

editor.addEventListener("mousemove", function (e) {
    x2 = e.pageX - this.getBoundingClientRect().left;
    y2 = e.pageY - this.getBoundingClientRect().top;

    if (drawing == "line") {
        setLineCoordinnates(selectLine, x1, y1, x2, y2);
    }
    if (drawing == "ellipse") {
        setEllipseCoordinates(selectEllipse, x1, y1, x2, y2);
    }
    if (drawing == "rect") {
        setRectCoordinates(selectRect, x1, y1, x2, y2);
    }
})

editor.addEventListener("mouseup", function (e) {
    if (e.button == leftMouse && drawing != "") {
        x2 = e.pageX - this.getBoundingClientRect().left;
        y2 = e.pageY - this.getBoundingClientRect().top;

        selectLine.style.display = "none";
        selectEllipse.style.display = "none";
        selectRect.style.display = "none";

        if (drawing == "line") {
            newElement = document.createElementNS("http://www.w3.org/2000/svg", "line");
            setLineCoordinnates(newElement, x1, y1, x2, y2);

            const colorStroke = document.getElementById("color-stroke").value;
            newElement.setAttribute("stroke", colorStroke);

            const strokeWidth = document.getElementById("stroke-width").value;
            newElement.style.strokeWidth = strokeWidth;
        }

        if (drawing == "ellipse") {
            newElement = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
            setEllipseCoordinates(newElement, x1, y1, x2, y2);

            const color = document.getElementById("color-picker").value;
            newElement.setAttribute("fill", color);
            const colorStroke = document.getElementById("color-stroke").value;
            newElement.setAttribute("stroke", colorStroke);

            const strokeWidth = document.getElementById("stroke-width").value;
            newElement.style.strokeWidth = strokeWidth;
        }

        if (drawing == "rect") {
            newElement = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            setRectCoordinates(newElement, x1, y1, x2, y2);

            const color = document.getElementById("color-picker").value;
            newElement.setAttribute("fill", color);
            const colorStroke = document.getElementById("color-stroke").value;
            newElement.setAttribute("stroke", colorStroke);

            const strokeWidth = document.getElementById("stroke-width").value;
            newElement.style.strokeWidth = strokeWidth;

            //DRAG AND DROP 
            newElement.onmousedown = function (event) {
                // (1) prepare to moving: make absolute and on top by z-index
                newElement.style.position = 'absolute'
                newElement.style.zIndex = 1000

                // move it out of any current parents directly into body
                // to make it positioned relative to the body
                document.editor.append(newElement)

                // centers the ball at (pageX, pageY) coordinates
                function moveAt(pageX, pageY) {
                    newElement.style.left = pageX - newElement.offsetWidth / 2 + 'px'
                    newElement.style.top = pageY - newElement.offsetHeight / 2 + 'px'
                }

                // move our absolutely positioned ball under the pointer
                moveAt(event.pageX, event.pageY)

                function onMouseMove(event) {
                    moveAt(event.pageX, event.pageY)
                }

                // (2) move the ball on mousemove
                document.addEventListener('mousemove', onMouseMove)

                // (3) drop the ball, remove unneeded handlers
                newElement.onmouseup = function () {
                    document.removeEventListener('mousemove', onMouseMove)
                    newElement.onmouseup = null
                }
            }
        }

        newElement.onmousedown = function (e) {
            if (e.button == rightMouse) {
                //pentru toate elementele scoatem pe cele cu clasa selected si il setam doar pe cel care este selectat cu click dreapta
                var childElements = document.querySelectorAll("#elements *");
                childElements.forEach(el => el.classList.remove("selected"));
                e.target.classList.add("selected");

                selectedElement = e.target;

                //suport pt modificare culoare si grosime pt elementul selectat
                const color = document.getElementById("color-picker").value;
                selectedElement.setAttribute("fill", color);
                const colorStroke = document.getElementById("color-stroke").value;
                selectedElement.setAttribute("stroke", colorStroke);

                const strokeWidth = document.getElementById("stroke-width").value;
                newElement.style.strokeWidth = strokeWidth;
            }
        }
        elements.appendChild(newElement);
    }
})

//stop selectedElement
unselected.addEventListener("click", function (e) {
    if (selectedElement) {
        selectedElement.classList.remove("selected");
        selectedElement = null;
    }
    else {
        alert("No object selected!");
    }
})

//stop desenat
stopClick.addEventListener("click", function (e) {
    if (drawing === "line") {
        drawing = "";
    }
    else if (drawing === "ellipse") {
        drawing = "";
    }
    else if (drawing === "rect") {
        drawing = "";
    }
    else {
        alert("No drawing clicked!");
    }
})

editor.oncontextmenu = function () {
    return false;
}

//DELETE SELECTED ELEMENT
document.onkeydown = function (e) {
    if (e.keyCode == deleteKey && selectedElement) {
        selectedElement.remove();
    }
}

//DELETE ALL ELEMENTS
document.onkeydown = function (e) {
    if (e.keyCode == resetKey) {
        var drawings = document.getElementById('drawings');
        drawings.innerHTML = '';
    }
}

//SALVARE IMAGINE PNG
document.getElementById("savePNG").onclick = function (e) {

    //Luam svg-ul drept string
    const svgElement = new XMLSerializer().serializeToString(editor);

    //Convertim svg string-ul in data url
    const svgURL = 'data:image/svg+xml;base64,' + btoa(svgElement);

    //Cream un element nou de tip image
    const img = new Image();
    img.src = svgURL;   //Sursa imaginii este url-ul svg-ului

    img.onload = () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;

        context.drawImage(img, 0, 0);
        //url-ul canvasului
        const pngData = canvas.toDataURL('image/png');

        //link temporar
        const link = document.createElement('a');
        //numele pozei salvate/descarcate
        link.download = 'pngImage.png';

        //setam href cu data pt png
        link.href = pngData;

        //click pt descarcare
        link.click();
    };
};

//SALVARE IMAGINE SVG
document.getElementById("saveSVG").onclick = function (e) {

    //Luam svg-ul drept string
    const svgElement = new XMLSerializer().serializeToString(editor);

    //link temporar
    const link = document.createElement('a');

    //numele pozei salvate/descarcate
    link.download = 'svgImage.svg';

    //setam href cu data pt svg
    link.href = 'data:image/svg+xml;base64,' + btoa(svgElement);
    link.click();
};