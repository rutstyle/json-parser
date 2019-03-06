var width = 100;
var height = 100;
var div = document.createElement('div');
div.style.outline = "1px solid rgba(255, 0, 0, 0.5)";
div.style.outlineOffset = "-1px";
div.style.position = "fixed";
div.style.zIndex = 10000;
document.body.appendChild(div);
document.body.onmousemove = function (e) {
    div.style.left = e.clientX - width + "px";
    div.style.top = e.clientY - height + "px";
}
document.body.onkeydown = function (e) {
    if (e.code === 'ArrowUp') {
        setSize(this.width, --this.height);
    }
    else if (e.code === 'ArrowDown') {
        setSize(this.width, ++this.height);
    }
    else if (e.code === 'ArrowLeft') {
        setSize(--this.width, this.height);
    }
    else if (e.code === 'ArrowRight') {
        setSize(++this.width, this.height);
    }
    e.preventDefault();
    e.stopPropagation();
}.bind(this);

function setSize(width, height) {
    this.width = width;
    this.height = height;
    div.style.width = width + 'px';
    div.style.height = height + 'px';
    div.innerText = width + "x" + height;
}
setSize(width, height);