<svelte:options accessors={true} />

<script lang="ts">
	import { flip } from 'svelte/animate';
	import { quintOut } from 'svelte/easing';

    import bananas from './assets/bananas.png';
    import bar from './assets/bar.png';
    import cherry from './assets/cherry.png';
    import coin from './assets/coin2.png';
    import grapes from './assets/grapes.png';
    import orange from './assets/orange.png';
    import star from './assets/star.png';
    import watermelon from './assets/watermelon.png';

    const items = [
        bananas,
        bar,
        cherry,
        coin,
        grapes,
        orange,
        star,
        watermelon,
        bananas //Last element is repeated
    ];

    export let isFlashing = false;
    export let scale = 1;
    export let index = 0;
    export let targetItem = 1; //1 is default for infinite scroll effect, otherwise from 0 to items.length-1
    export let withExtraScroll = false;
    export let hasStopped = false;

    $: unique_items = items.slice(0, items.length-1);
    $: wheel_items = withExtraScroll ? Array(Math.max(2, index+1)).fill(unique_items).flat() : unique_items;
    $: last_items = items.slice(0, targetItem+2);
</script>


<div> 
    {#each wheel_items as item}
    <div class="item">
        <img src={item} alt="item"/>
    </div>
    {/each}
</div>

{#each last_items as item, index (index)}
<div class="item" style="--scale:{isFlashing && (index == targetItem) ? scale : 1};">
    <img src={item} alt="item" class="scaled"/>
</div>
{/each}


<style type="scss">
    .item {
        width: 100px;
        height: 100px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 50px;
    }

    .item img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        transform: scale(var(--scale));

        image-rendering: optimizeSpeed;
        image-rendering: -moz-crisp-edges;          /* Firefox                        */
        image-rendering: -o-crisp-edges;            /* Opera                          */
        image-rendering: -webkit-optimize-contrast; /* Chrome (and eventually Safari) */
        image-rendering: pixelated;                 /* Universal support since 2021   */
        image-rendering: optimize-contrast;         /* CSS3 Proposed                  */
        -ms-interpolation-mode: nearest-neighbor;   /* IE8+                           */
    }
</style>