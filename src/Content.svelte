<script>
  import { getContext } from "svelte";
  import Surprise from "./Result.svelte";
  const { open } = getContext("simple-modal");
  export let data;
  const showSurprise = () => {
    console.log("show surprise", { ...data });
    open(Surprise, { message: { ...data } });
  };
</script>

<button id="btn" style="display: none;" on:click={() => showSurprise()}
  >Show Surprise</button
>
