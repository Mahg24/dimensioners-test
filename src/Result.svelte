<script>
  export let message;
</script>

{#if message}
  {#if message.IR && message.RGB}
    <ul>
      {#each Object.keys(message.IR) as K, i}
        <li>{K}: {message.IR[K]}</li>
      {/each}
    </ul>

    <ul>
      {#each Object.keys(message.RGB) as K, i}
        <li>{K}: {message.RGB[K]}</li>
      {/each}
    </ul>
  {:else}
    <h2>{message.result.error}</h2>
  {/if}
{/if}
