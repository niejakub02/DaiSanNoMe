const levels = ['new', 'apprentice', 'guru', 'master', 'enlightened', 'burned'];

const generate = () => {
  for (const level of levels) {
    const li = document.createElement('li');
    li.textContent = level;
    const select = document.createElement('select');
    select.dataset.level = level;
    select.classList.add(level);
    for (const color of ['default', 'red', 'blue', 'green']) {
      const option = document.createElement('option');
      option.value = color;
      option.textContent = color;
      select.appendChild(option);
    }
    li.append(select);
    document.querySelector('#colors > ul')?.appendChild(li);
  }
};

const saveOptions = () => {
  const colors = {};
  [...document.querySelectorAll('#colors select')].forEach(
    // @ts-ignore
    (node) => (colors[node.dataset.level] = node.value)
  );
  chrome.storage.sync.set({ colors }, () => {
    console.log('saved');
  });
};

const restoreOptions = () => {
  chrome.storage.sync.get(null, (data) => {
    (document.querySelector('#token input') as HTMLInputElement).value =
      data.token ?? '';
    Object.entries(data.colors).forEach((entry) => {
      const [key, value] = entry;
      (
        document.querySelector(
          `select[data-level="${key}"]`
        ) as HTMLSelectElement
      ).value = value as string;
    });
  });
};

const updateToken = () => {
  const value = (document.querySelector('#token input') as HTMLInputElement)
    .value;
  chrome.storage.sync.set({ token: value });
  if (value.length) {
    chrome.storage.sync.set({ warning: '' });
  }
};

generate();
document.addEventListener('DOMContentLoaded', restoreOptions);
document
  .querySelectorAll('#colors select')
  .forEach((x) => x.addEventListener('change', saveOptions));
document.querySelector('#token button')?.addEventListener('click', updateToken);
