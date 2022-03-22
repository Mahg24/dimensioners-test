<script>
  import Modal from "svelte-simple-modal";
  import Content from "./Content.svelte";
  import InstallerButton from "./InstallerButton.svelte";
  import CalibrateButton from "./CalibrateButton.svelte";
  import { buscar, send, read, newPackage, activate, desactivate } from "./Api";
  import { onMount } from "svelte";
  import { apiURL } from "./Api";
  let idPackage = "";
  let dim = "";
  let cam = "";
  let resultDataPackage = {};
  let save = false;
  let cameras = [];
  let dimensioners = ["1234567"];
  function assingData(data) {
    save = false;
    document.getElementById("height").value = parseFloat(data.height) || "";
    document.getElementById("width").value = parseFloat(data.width) || "";
    document.getElementById("length").value = parseFloat(data.length) || "";
    document.getElementById("weight").value = parseFloat(data.weight);
  }

  function loadCameras() {
    fetch(apiURL + "/cameras")
      .then((res) => res.json())
      .then((data) => {
        cameras = data.cameras;
        console.log(cameras);
      });
  }

  function loadDimensioners() {
    fetch(apiURL + "/dimensioners")
      .then((res) => res.json())
      .then((data) => {
        dimensioners = data.dimensioners;
      });
  }

  function changeCamera() {
    let camera = document.getElementById("camera").value;
    if (cameras.indexOf(camera) == -1) {
      let save = document.getElementById("saveCamara");
      save.style.display = "inline";
    } else {
      let save = document.getElementById("saveCamara");
      cam = camera;
      save.style.display = "none";
    }
  }

  function changeDimensioner() {
    let dimensioner = document.getElementById("dimensioner").value;
    if (dimensioners.indexOf(dimensioner) == -1) {
      let save = document.getElementById("saveDimensioner");
      save.style.display = "inline";
    } else {
      let save = document.getElementById("saveDimensioner");
      dim = dimensioner;
      save.style.display = "none";
    }
  }

  async function saveCamera() {
    fetch(apiURL + "/cameras", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: document.getElementById("camera").value,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        cameras.push(data.name);
        let save = document.getElementById("saveCamara");
        save.style.display = "none";
      });
  }

  function saveDimensioner() {
    fetch(apiURL + "/dimensioners", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: document.getElementById("dimensioner").value,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        dimensioners.push(data.name);
        let save = document.getElementById("saveDimensioner");
        save.style.display = "none";
      });
  }

  async function getRealdata() {
    const result = await buscar(document.getElementById("serial").value);
    if (result.Data) {
      idPackage = result._id;

      assingData(result.Data);
    } else {
      idPackage = "";
    }
  }

  async function saveButton() {
    if (
      isNaN(parseFloat(document.getElementById("length").value)) ||
      isNaN(parseFloat(document.getElementById("height").value)) ||
      isNaN(parseFloat(document.getElementById("width").value)) ||
      isNaN(parseFloat(document.getElementById("weight").value))
    ) {
      alert("The values must be numbers");
      return;
    }
    if (
      parseFloat(document.getElementById("width").value) >
      parseFloat(document.getElementById("length").value)
    ) {
      alert("The width must be less than the length");
      return false;
    }
    if (
      parseFloat(document.getElementById("length").value) <= 0 ||
      parseFloat(document.getElementById("height").value) <= 0 ||
      parseFloat(document.getElementById("width").value) <= 0 ||
      parseFloat(document.getElementById("weight").value) <= 0
    ) {
      alert("The values must be greater than 0");
      return false;
    }
    if (
      parseFloat(document.getElementById("length").value) > 60 ||
      parseFloat(document.getElementById("height").value) > 60 ||
      parseFloat(document.getElementById("width").value) > 60 ||
      parseFloat(document.getElementById("weight").value) > 60
    ) {
      alert("The values must be smaller than 60 inches");
      return false;
    }
    let raw = JSON.stringify({
      Serial: document.getElementById("serial").value,
      dimensioner: dim,
      camera: cam,
      Data: {
        height: parseFloat(document.getElementById("height").value),
        width: parseFloat(document.getElementById("width").value),
        length: parseFloat(document.getElementById("length").value),
        weight: parseFloat(document.getElementById("weight").value),
      },
    });

    const result = await send(raw);
    console.log(result);
    if (result.statusCode == undefined) {
      idPackage = result._id;
      alert("Guardado");
    } else if (result.statusCode == 400) {
      alert("Error");
    }
  }
  async function readButton() {
    if (dim == "") {
      alert("You must select a dimensioner");
      return;
    }
    if (cam == "") {
      alert("You must select a camera");
      return;
    }
    if (idPackage == "") {
      alert("You must save the package first");
      return;
    }
    if (save) {
      if (!confirm("Are you sure you want to read the data again?")) {
        return false;
      }
    }
    save = true;
    document.getElementById("btn").style.display = "none";
    const result = await read(idPackage, cam, dim);
    console.log(result);
    if (!result.error) {
      const ObjIR = {
        name: "IR",
        High: result.result.Info_IR.High,
        Weight: result.result.Info_IR.Weight,
        L1a: result.result.Info_IR.L1a.Length,
        L2a: result.result.Info_IR.L2a.Length,
        L1b: result.result.Info_IR.L1b.Length,
        L2b: result.result.Info_IR.L2b.Length,
      };

      const ObjRGB = {
        name: "RGB",
        High: result.result.Info_RGB.High,
        Weight: result.result.Info_RGB.Weight,
        L1a: result.result.Info_RGB.L1a.Length,
        L2a: result.result.Info_RGB.L2a.Length,
        L1b: result.result.Info_RGB.L1b.Length,
        L2b: result.result.Info_RGB.L2b.Length,
      };
      resultDataPackage = {
        IR: ObjIR,
        RGB: ObjRGB,
      };
    } else {
      resultDataPackage = {
        result,
      };
    }
    document.getElementById("btn").style.display = "inline";
  }

  async function Activate() {
    let raw = JSON.stringify({
      Serial: document.getElementById("serial").value,
    });

    const result = await send(raw);
    console.log(result);
    if (result.statusCode == undefined) {
      idPackage = result._id;
      alert("Guardado");
    } else if (result.statusCode == 400) {
      alert("Error");
    }
  }
  async function Desactivate() {
    if (dim == "") {
      alert("You must select a dimensioner");
      return;
    }
    if (cam == "") {
      alert("You must select a camera");
      return;
    }
    if (idPackage == "") {
      alert("You must save the package first");
      return;
    }
    if (save) {
      if (!confirm("Are you sure you want to read the data again?")) {
        return false;
      }
    }
    save = true;
    document.getElementById("btn").style.display = "none";
    const result = await read(idPackage, cam, dim);
    console.log(result);
    if (!result.error) {
      const ObjIR = {
        name: "IR",
        High: result.result.Info_IR.High,
        Weight: result.result.Info_IR.Weight,
        L1a: result.result.Info_IR.L1a.Length,
        L2a: result.result.Info_IR.L2a.Length,
        L1b: result.result.Info_IR.L1b.Length,
        L2b: result.result.Info_IR.L2b.Length,
      };

      const ObjRGB = {
        name: "RGB",
        High: result.result.Info_RGB.High,
        Weight: result.result.Info_RGB.Weight,
        L1a: result.result.Info_RGB.L1a.Length,
        L2a: result.result.Info_RGB.L2a.Length,
        L1b: result.result.Info_RGB.L1b.Length,
        L2b: result.result.Info_RGB.L2b.Length,
      };
      resultDataPackage = {
        IR: ObjIR,
        RGB: ObjRGB,
      };
    } else {
      resultDataPackage = {
        result,
      };
    }
    document.getElementById("btn").style.display = "inline";
  }

  async function getNew() {
    const newpackage = await newPackage();
    let num = parseInt(newpackage.Serial.split("-")[1]) + 1;
    document.getElementById("serial").value = "Box-" + pad(num, 4);
    assingData({});
  }
  function pad(num, size) {
    num = num.toString();
    while (num.length < size) num = "0" + num;
    return num;
  }
  onMount(() => {
    loadCameras();
    loadDimensioners();
  });
</script>

<div>
  <h1>Tests api</h1>
  <div class="container-lists">
    <div class="Cameras">
      <h2>Camera</h2>
      <div class="list-cameras">
        <input id="camera" list="cameras" on:blur={changeCamera} />
        <button class="save-button" id="saveCamara" on:click={saveCamera}
          >Save</button
        >
        <datalist id="cameras">
          {#each cameras as camera}
            <option value={camera} />
          {/each}
        </datalist>
      </div>
    </div>
    <div class="Dimensioners">
      <h2>Dimensioner</h2>
      <div class="list-dimensioners">
        <input
          id="dimensioner"
          list="dimensioners"
          on:blur={changeDimensioner}
        />
        <button
          class="save-button"
          id="saveDimensioner"
          on:click={saveDimensioner}>Save</button
        >
        <datalist id="dimensioners">
          {#each dimensioners as dimensioner}
            <option value={dimensioner} />
          {/each}
        </datalist>
        <Modal>
          <InstallerButton data={{ ID: dim, Url: apiURL, Cam_type: cam }} />
        </Modal>
      </div>
    </div>
  </div>
  <div>
    <div class="flex-data">
      <h2>Serial</h2>
      <input type="text" id="serial" name="serial" on:blur={getRealdata} />
      <button on:click={getNew}>New..</button>
    </div>

    <div class="data">
      <div>
        <h2>Height</h2>
        <input type="number" id="height" name="height" />
        <h2>Width</h2>
        <input type="number" id="width" name="width" />
      </div>
      <div>
        <h2>Length</h2>
        <input type="number" id="length" name="length" />
        <h2>Weight...</h2>
        <input type="number" id="weight" name="weight" />
      </div>
    </div>
    <div class="flex-data">
      <button on:click={saveButton}>Save</button>
      <button on:click={readButton}>Read</button>
    </div>
    <div class="flex-data">
      <button>Activate package</button>
      <button>Desactivate package</button>
    </div>

    <Modal>
      <CalibrateButton dimensioner={dim} />
    </Modal>
    <Modal>
      <Content data={resultDataPackage} />
    </Modal>
  </div>
</div>

<style>
  .save-button {
    margin-left: 10px;
    width: auto;
    height: auto;
    display: none;
  }
  .container-lists {
    display: flex;
    justify-content: space-evenly;
  }
  .data {
    display: flex;
    justify-content: space-evenly;
  }

  input {
    margin-bottom: 10px;
  }
  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 1em;
    font-weight: 100;
  }
  button {
    margin-bottom: 10px;
    width: 60%;
    height: 50px;
  }

  .flex-data {
    flex-direction: column;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
