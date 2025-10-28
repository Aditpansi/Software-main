const apiUrl = "http://localhost:5000/api/loadcells";

// Fetch and update data
async function fetchData() {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error("Network error");
    const data = await response.json();

    console.log("Received data:", data);

    const deviceIds = Object.keys(data);
    deviceIds.forEach((id, index) => {
      const val = data[id] != null ? `${data[id]} g` : "--";
      const num = index + 1;

      // Update Antenna view
      const antennaEl = document.getElementById(`antennaLoadCellValue${num}`);
      if (antennaEl) antennaEl.textContent = val;

      // Update Grid view
      const gridEl = document.getElementById(`loadCellValue${num}`);
      if (gridEl) gridEl.textContent = val;
    });
  } catch (err) {
    console.error("Error fetching:", err);
  }
}

// Fetch repeatedly
setInterval(fetchData, 200);
fetchData();

// Splash screen fade out
window.addEventListener("load", () => {
  const splash = document.getElementById("splash-screen");
  setTimeout(() => {
    splash.classList.add("hide");
    setTimeout(() => splash.remove(), 1000);
  }, 1750);
});

// Create antenna layout
const container = document.getElementById("labelsContainer");
const arrowsSvg = document.getElementById("arrowsSvg");
const totalCells = 30;
const outerRadius = 310;
const innerRadius = 240;
const centerX = 350;
const centerY = 350;
const cellSize = 58;

for (let i = 0; i < totalCells; i++) {
  const angle = (i / totalCells) * 2 * Math.PI - Math.PI / 2;

  const outerX = centerX + outerRadius * Math.cos(angle);
  const outerY = centerY + outerRadius * Math.sin(angle);
  const innerX = centerX + innerRadius * Math.cos(angle);
  const innerY = centerY + innerRadius * Math.sin(angle);

  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("x1", outerX);
  line.setAttribute("y1", outerY);
  line.setAttribute("x2", innerX);
  line.setAttribute("y2", innerY);
  line.setAttribute("class", "arrow-line");
  line.setAttribute("data-cell-id", i + 1);
  arrowsSvg.appendChild(line);

  const arrowHead = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
  const arrowSize = 6;
  const headAngle = Math.atan2(innerY - outerY, innerX - outerX);
  const tip = { x: innerX, y: innerY };
  const left = {
    x: innerX - arrowSize * Math.cos(headAngle - Math.PI / 6),
    y: innerY - arrowSize * Math.sin(headAngle - Math.PI / 6)
  };
  const right = {
    x: innerX - arrowSize * Math.cos(headAngle + Math.PI / 6),
    y: innerY - arrowSize * Math.sin(headAngle + Math.PI / 6)
  };
  arrowHead.setAttribute("points", `${tip.x},${tip.y} ${left.x},${left.y} ${right.x},${right.y}`);
  arrowHead.setAttribute("class", "arrow-head");
  arrowsSvg.appendChild(arrowHead);

  const posX = outerX - cellSize / 2;
  const posY = outerY - cellSize / 2;

  const cell = document.createElement("div");
  cell.className = "load-cell";
  cell.style.left = posX + "px";
  cell.style.top = posY + "px";
  cell.setAttribute("data-cell-id", i + 1);
  cell.innerHTML = `
      <span class="load-cell-label">LC ${i + 1}</span>
      <span class="load-cell-value" id="antennaLoadCellValue${i + 1}">--</span>
  `;

  // Hover highlight effect
  cell.addEventListener("mouseenter", function() {
    const cellId = this.getAttribute("data-cell-id");
    const cellLine = arrowsSvg.querySelector(`.arrow-line[data-cell-id="${cellId}"]`);
    if (cellLine) {
      cellLine.style.stroke = "#ffffff";
      cellLine.style.strokeWidth = "3";
      cellLine.style.opacity = "1";
    }
  });

  cell.addEventListener("mouseleave", function() {
    const cellId = this.getAttribute("data-cell-id");
    const cellLine = arrowsSvg.querySelector(`.arrow-line[data-cell-id="${cellId}"]`);
    if (cellLine) {
      cellLine.style.stroke = "#0056b3";
      cellLine.style.strokeWidth = "2";
      cellLine.style.opacity = "0.6";
    }
  });

  container.appendChild(cell);
}

// --- View Toggle ---
const launchBtn = document.getElementById("launchBtn");
const antennaView = document.getElementById("antennaView");
const gridView = document.getElementById("gridView");
let isGridVisible = false;

launchBtn.addEventListener("click", () => {
  isGridVisible = !isGridVisible;

  if (isGridVisible) {
    antennaView.style.display = "none";
    gridView.style.display = "block";
    launchBtn.textContent = "Antenna View";
  } else {
    antennaView.style.display = "flex";
    gridView.style.display = "none";
    launchBtn.textContent = "Grid View";
  }
});
