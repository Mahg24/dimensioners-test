<script>
  import { getContext } from "svelte";
  import Surprise from "./InstallerScript.svelte";
  const { open } = getContext("simple-modal");
  export let data;
  const showSurprise = () => {
    console.log("show surprise", { ...data });
    open(Surprise, { message: data });
  };
</script>

<button id="btn" on:click={() => showSurprise()}>Instalar</button>

<style>
  button {
    width: 60%;
    height: 50px;
  }
</style>
