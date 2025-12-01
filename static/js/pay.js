// Copy button functionality
document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        navigator.clipboard.writeText(btn.dataset.copy);
        btn.textContent = '[copied!]';
        setTimeout(() => btn.textContent = '[copy]', 1500);
    });
});

// QR button toggle functionality
document.querySelectorAll('.qr-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const card = btn.closest('.pay-card');
        const details = card.querySelector('.qr-foldout');
        const container = card.querySelector('.qr-container');

        if (!details.open) {
            // Generate QR if not already done
            if (!container.hasChildNodes()) {
                const address = container.dataset.qrAddress;
                const qr = qrcode(0, 'M');
                qr.addData(address);
                qr.make();
                const svg = createQrSvg(qr, 400);
                container.appendChild(svg);
            }
            details.open = true;
            btn.textContent = '[hide]';
        } else {
            details.open = false;
            btn.textContent = '[qr]';
        }
    });
});

function createQrSvg(qr, size) {
    const count = qr.getModuleCount();
    const cellSize = size / count;
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    // Let CSS control actual size, viewBox defines coordinate space
    svg.setAttribute('viewBox', '0 0 ' + size + ' ' + size);

    // Background
    const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    bg.setAttribute('width', size);
    bg.setAttribute('height', size);
    bg.setAttribute('fill', '#1a1a1a');
    svg.appendChild(bg);

    // QR modules
    for (let row = 0; row < count; row++) {
        for (let col = 0; col < count; col++) {
            if (qr.isDark(row, col)) {
                const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                rect.setAttribute('x', col * cellSize);
                rect.setAttribute('y', row * cellSize);
                rect.setAttribute('width', cellSize + 0.5);
                rect.setAttribute('height', cellSize + 0.5);
                rect.setAttribute('fill', '#e6e8ee');
                svg.appendChild(rect);
            }
        }
    }
    return svg;
}
