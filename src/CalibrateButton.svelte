<script>
  import { getContext } from "svelte";
  import Surprise from "./Message.svelte";
  import { apiURL } from "./Api";

  const { open } = getContext("simple-modal");
  export let dimensioner;
  const showSurprise = () => {
    const raw = JSON.stringify({
      dimensioner,
    });
    let requestOptions = {
      method: "POST",
      body: raw,
      headers: { "Content-Type": "application/json" },
      redirect: "follow",
    };
    let url = apiURL + "/packages/calibrate";
    fetch(url, requestOptions)
      .then((response) => response.text())
      .then((result) => open(Surprise, { message: result }))
      .catch((error) => open(Surprise, { message: error }));
  };
</script>

<p><button on:click={showSurprise}>Calibrate {dimensioner}</button></p>

<style>
  button {
    margin-bottom: 10px;
    width: 60%;
    height: 50px;
  }
</style>
