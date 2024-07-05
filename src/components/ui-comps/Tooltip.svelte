<script>
    export let tip = "";
    export let top = false;
    export let right = false;
    export let bottom = false;
    export let left = false;
    export let active = false;
    export let color = "#0f172a";
  
    let arrowTopGap = 0;
  
    const tooltip = (element) => {
      const slot = element.getBoundingClientRect();
      const tooltip = element.querySelector(".tooltip");
      const tip = element.querySelector(".tip");
      tooltip.style.setProperty("--tooltip-color", color);
  
      const showTooltip = () => {
        tooltip.style.opacity = 1;
        tooltip.style.zIndex = "10";
      };
  
      const hideTooltip = () => {
        tooltip.style.opacity = 0;
        tooltip.style.zIndex = "-1";
      };
  
      element.addEventListener("mouseover", showTooltip);
      element.addEventListener("mouseout", hideTooltip);
  
      const elHeight = slot.height;
      const elWidth = slot.width;
      const { height, width } = tooltip.getBoundingClientRect();
      let topGap;
      let rightGap;
      let bottomGap;
      let leftGap;
      if (top) {
        leftGap = -(width / 2 - elWidth / 2);
        bottomGap = elHeight + 12;
      } else if (right) {
        leftGap = elWidth + 12;
        bottomGap = Math.abs(elHeight / 2 - height / 2);
        arrowTopGap = height / 2;
      } else if (bottom) {
        leftGap = -(width / 2 - elWidth / 2);
        topGap = elHeight + 12;
      } else if (left) {
        leftGap = -(width + 12);
        bottomGap = Math.abs(elHeight / 2 - height / 2);
        arrowTopGap = height / 2;
      } else {
        leftGap = -Math.floor(width / 2 - elWidth / 2);
        topGap = Math.floor(elHeight + 8);
        tooltip.style.bottom = "unset";
        tooltip.style.right = "unset";
      }
      tooltip.style.top = `${topGap}px`;
      tooltip.style.bottom = `${bottomGap}px`;
      tooltip.style.right = `${rightGap}px`;
      tooltip.style.left = `${leftGap}px`;
      tip.style.setProperty("--top-gap", `${arrowTopGap - 4}px`);
      return {
        destroy() {
          element.removeEventListener("mouseover", showTooltip);
          element.removeEventListener("mouseout", hideTooltip);
        },
      };
    };
  </script>
  
  <span class="tooltip-slot" use:tooltip>
    <slot />
    <div class:tooltip={true} class:active {...$$restProps}>
      {#if tip}
        <div class:tip={true} class:top class:right class:bottom class:left>
          {@html tip}
        </div>
      {:else}
        <slot name="custom-tip" />
      {/if}
    </div>
  </span>
  
  <style>
    .tooltip-slot {
      position: relative;
      display: inline-block;
    }
    .tooltip {
      position: absolute;
      display: block;
      white-space: nowrap;
      opacity: 0;
      z-index: -1;
      background-color: var(--tooltip-color);
    }
    .tooltip.active {
      opacity: 1;
      z-index: 10;
    }
    .tooltip {
      padding-top: 0.25rem;
      padding-bottom: 0.25rem;
      padding-left: 0.5rem;
      padding-right: 0.5rem;
      transition-duration: 300ms;
      color: #ffffff;
      border-radius: 0.25rem;
    }
    .tip::before {
      content: "";
      position: absolute;
      border: 8px solid transparent;
      border-top: 0;
      border-bottom: 8px solid var(--tooltip-color);
      z-index: -1;
    }
    .tip.top::before {
      left: 50%;
      bottom: 0;
      transform: translate(-50%, 100%) rotate(180deg);
    }
    .tip.right::before {
      left: -12px;
      top: var(--top-gap);
      transform: rotate(270deg);
    }
    .tip.bottom::before {
      left: 50%;
      top: 0;
      transform: translate(-50%, -100%);
    }
    .tip.left::before {
      right: -12px;
      top: var(--top-gap);
      transform: rotate(90deg);
    }
    .tooltip.active {
      opacity: 1;
      visibility: initial;
    }
  </style>