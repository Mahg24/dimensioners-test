export const apiURL =
  "http://ec2-34-239-111-77.compute-1.amazonaws.com:3334/api";
export async function buscar(serial) {
  const requestOptions = {
    method: "GET",
    redirect: "follow",
  };
  const result = await fetch(
    apiURL + "/packages?Serial=" + serial,
    requestOptions,
    {
      mode: "no-cors",
    }
  );
  return result.json();
}

export async function send(data) {
  const requestOptions = {
    method: "POST",
    redirect: "follow",
    headers: {
      "Content-Type": "application/json",
    },
    body: data,
  };
  const result = await fetch(apiURL + "/packages", requestOptions);
  return result.json();
}

export async function read(id, camara, dim) {
  console.log(dim);
  console.time("Medir");
  const requestOptions = {
    method: "POST",
    redirect: "follow",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ dimensioner: dim, Package: camara }),
  };
  const result = await fetch(apiURL + "/packages/" + id, requestOptions);
  console.timeEnd("Medir");
  return result.json();
}

export async function newPackage() {
  const requestOptions = {
    method: "GET",
    redirect: "follow",
  };
  const result = await fetch(apiURL + "/packages/newPackage", requestOptions, {
    mode: "no-cors",
  });
  return result.json();
}

export async function loadCameras() {
  return await fetch(apiURL + "/cameras")
    .then((res) => res.json())
    .then((data) => {
      return data.cameras;
    });
}

export async function loadDimensioners() {
  return await fetch(apiURL + "/cameras")
    .then((res) => res.json())
    .then((data) => {
      return data.dimensioners;
    });
}

export async function activate(data) {
  const requestOptions = {
    method: "POST",
    redirect: "follow",
    headers: {
      "Content-Type": "application/json",
    },
    body: data,
  };
  const result = await fetch(apiURL + "/activate", requestOptions);
  return result.json();
}

export async function desactivate(data) {
  const requestOptions = {
    method: "POST",
    redirect: "follow",
    headers: {
      "Content-Type": "application/json",
    },
    body: data,
  };
  const result = await fetch(apiURL + "/desactivate", requestOptions);
  return result.json();
}
