const _fetch = url =>
  fetch(url, {
    headers: { Authorization: "Basic 123" }
  })
    .then(r => r.json())
    .then(json => {
      if (!json.success) {
        throw new Error(`fetch error ${url}`);
      }
      return json.result;
    });

export default _fetch;
