async function loadHeatmap() {
    const response = await fetch("http://localhost:3000/getHeatmapData");
    const data = await response.json();

    const canvas = document.getElementById("heatmap");
    const ctx = canvas.getContext("2d");

    const regions = {
        head: { x: 170, y: 50, radius: 40 },
        lungs: { x: 170, y: 200, radius: 60 },
        heart: { x: 170, y: 250, radius: 50 },
        stomach: { x: 170, y: 350, radius: 70 },
        body: { x: 170, y: 450, radius: 80 },
    };

    Object.keys(data).forEach((region) => {
        const intensity = data[region] * 30; // Higher values make the area more red
        if (regions[region]) {
            drawHeatPoint(ctx, regions[region].x, regions[region].y, regions[region].radius, intensity);
        }
    });
}

function drawHeatPoint(ctx, x, y, radius, intensity) {
    const gradient = ctx.createRadialGradient(x, y, radius / 4, x, y, radius);
    gradient.addColorStop(0, `rgba(255, 0, 0, ${Math.min(1, intensity / 100)})`);
    gradient.addColorStop(1, "rgba(255, 0, 0, 0)");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
}

loadHeatmap();