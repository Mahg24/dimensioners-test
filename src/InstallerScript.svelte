<script>
  export let message = {
    ID: "1",
    Url: "http://www.google.com",
    Cam_type: "Intel",
  };
</script>

<p>
  python Socket.py --ID "{message.ID}" --Url "{message.Url.replaceAll(
    "/api",
    ""
  )}" --Cam_type "{message.Cam_type}"
</p>
