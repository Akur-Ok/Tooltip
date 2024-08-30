class TooltipPlugin {
    constructor(tooltips) {
        this.tooltips = tooltips;
        this.currentStep = 0;

        const styles = `
        .tooltip {
            position: absolute;
            color: #000000;
            padding: 15px 20px;
            border-radius: 5px;
            z-index: 9;
            font-size: var(--font-size-small);
            background-color: white;
        }

        .tooltip::after {
            content: '';
            position: absolute;
            width: 0;
            height: 0;
            border-left: 10px solid transparent;
            border-right: 10px solid transparent;
            border-top: 10px solid #c9c9c9;
            bottom: -10px;
            left: var(--after-left, 15px);
            transform: translateX(-50%);
        }

        .tooltip::before {
            content: '';
            position: absolute;
            width: 0;
            height: 0;
            border-left: 10px solid transparent;
            border-right: 10px solid transparent;
            border-bottom: 10px solid #c9c9c9;
            top: -10px;
            left: var(--after-left, 15px);
            transform: translateX(-50%);
        }

        .hide-after::after {
            display: none;
        }

        .hide-before::before {
            display: none;
        }

        #close-tooltip {
            padding: 0px 5px;
            background: none;
            border: none;
            color: #000000;
            cursor: pointer;
            position: absolute;
            top: 0px;
            right: 0px;
        }
    `;

    const styleSheet = document.createElement('style');
    styleSheet.type = 'text/css';
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

        this.tooltipContainer = document.createElement('div');
        this.tooltipContainer.id = 'tooltip-container';
        document.body.appendChild(this.tooltipContainer);

        this.tooltip = document.createElement('div');
        this.tooltip.id = 'tooltip';
        this.tooltip.className = 'tooltip';
        this.tooltipContainer.appendChild(this.tooltip);

        this.tooltipText = document.createElement('span');
        this.tooltipText.id = 'tooltip-text';
        this.tooltip.appendChild(this.tooltipText);

        this.closeTooltipButton = document.createElement('button');
        this.closeTooltipButton.id = 'close-tooltip';
        this.closeTooltipButton.textContent = '×';
        this.tooltip.appendChild(this.closeTooltipButton);

        this.closeTooltipButton.addEventListener('click', () => this.nextTooltip());

        this.showTooltip(this.currentStep);
    }

    showTooltip(step) {
        if (step >= this.tooltips.length) {
            this.tooltip.style.display = 'none';
            return;
        }

        const tooltipElement = document.getElementById(this.tooltips[step].elementId);
        if (!tooltipElement) return;

        const rect = tooltipElement.getBoundingClientRect();
        const windowH = window.innerHeight;

        this.tooltipText.textContent = this.tooltips[step].text;
        this.tooltip.style.display = 'block';

        if (window.innerWidth / 2 < windowH - rect.top) {
            this.tooltip.style.bottom = `${windowH - rect.width * 2}px`;
            this.tooltip.classList.remove('hide-before');
            this.tooltip.classList.add('hide-after');
        } else {
            this.tooltip.style.bottom = `${windowH - rect.top}px`;
            this.tooltip.classList.add('hide-before');
            this.tooltip.classList.remove('hide-after');
        }

        if (window.innerWidth / 2 > rect.left + rect.width / 2 - 15) {
            this.tooltip.style.right = "";
            this.tooltip.style.left = `${rect.left + rect.width / 2 - 15}px`;
            this.tooltip.style.setProperty('--after-left', '15px');
            this.tooltip.style.setProperty('--before-left', '15px');
        } else {
            this.tooltip.style.left = "";
            this.tooltip.style.right = `${window.innerWidth - rect.right + rect.width / 2 - 15}px`;
            this.tooltip.style.setProperty('--after-left', `${this.tooltip.getBoundingClientRect().width - 15}px`);
            this.tooltip.style.setProperty('--before-left', `${this.tooltip.getBoundingClientRect().width - 15}px`);
        }
    }

    nextTooltip() {
        this.currentStep++;
        this.showTooltip(this.currentStep);
    }
}

export default TooltipPlugin;
