<script>
  export let message;
</script>

{#if !message.error}
  <p>🎉Calibrated! 🍾</p>
{:else}
  <p>
    ❌❌❌ {message.error} ❌❌❌
  </p>
{/if}
