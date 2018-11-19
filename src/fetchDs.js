import memoize from "memoizee";

const _fetch = memoize(url =>
  fetch(url, {})
    .then(r => r.json())
    .then(json => {
      if (!json.success) {
        throw new Error(`fetch error ${url}`);
      }
      return json.result;
    })
);

export default _fetch;
