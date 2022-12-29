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

var leftMouse = 0, rightMouse = 2, deleteKey = 46;
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
            const colorStroke = document.getElementById("color-stroke").value;
            selectLine.style.stroke = colorStroke;
        }

        if (drawing == "ellipse") {
            setEllipseCoordinates(selectEllipse, x1, y1, x1, y1);
            selectEllipse.style.display = "block";
            const color = document.getElementById("color-picker").value;
            selectEllipse.style.fill = color;
            const colorStroke = document.getElementById("color-stroke").value;
            selectEllipse.style.stroke = colorStroke;
        }

        if (drawing == "rect") {
            setRectCoordinates(selectRect, x1, y1, x1, y1);
            selectRect.style.display = "block";
            const color = document.getElementById("color-picker").value;
            selectRect.style.fill = color;
            const colorStroke = document.getElementById("color-stroke").value;
            selectRect.style.stroke = colorStroke;
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

//stop selectedElement
unselected.addEventListener("click", function (e) {
    if (selectedElement) {
        selectedElement.classList.remove("selected");
        selectedElement = null;
        this.innerText = "Selection stopped";
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
        alert("No object selected!");
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
        }

        if (drawing == "ellipse") {
            newElement = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
            setEllipseCoordinates(newElement, x1, y1, x2, y2);

            const color = document.getElementById("color-picker").value;
            newElement.setAttribute("fill", color);
            const colorStroke = document.getElementById("color-stroke").value;
            newElement.setAttribute("stroke", colorStroke);
        }

        if (drawing == "rect") {
            newElement = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            setRectCoordinates(newElement, x1, y1, x2, y2);

            const color = document.getElementById("color-picker").value;
            newElement.setAttribute("fill", color);
            const colorStroke = document.getElementById("color-stroke").value;
            newElement.setAttribute("stroke", colorStroke);
        }

        newElement.onmousedown = function (e) {
            if (e.button == rightMouse) {
                //pentru toate elementele scoatem pe cele cu clasa selected si il setam doar pe cel care este selectat cu click dreapta
                var childElements = document.querySelectorAll("#elements *");
                childElements.forEach(el => el.classList.remove("selected"));
                e.target.classList.add("selected");

                selectedElement = e.target;

                const color = document.getElementById("color-picker").value;
                selectedElement.setAttribute("fill",color);
                const colorStroke = document.getElementById("color-stroke").value;              
                selectedElement.setAttribute("stroke",colorStroke);
            }
        }
        elements.appendChild(newElement);
    }
})

editor.oncontextmenu = function () {
    return false;
}

document.onkeydown = function (e) {
    if (e.keyCode == deleteKey && selectedElement) {
        selectedElement.remove();
    }
}

