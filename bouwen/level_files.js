/* Public playtest: files stay on the device, no upload endpoint or analytics. */
window.TiltwickFiles = {
  dirty: false,
  setDirty(value) { this.dirty = value; },
  choose(callback) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,application/json';
    input.style.display = 'none';
    document.body.appendChild(input);
    let finished = false;
    const finish = (text, name, error) => {
      if (finished) return;
      finished = true;
      input.remove();
      callback(text, name, error);
    };
    input.addEventListener('cancel', () => finish('', '', ''));
    input.addEventListener('change', async () => {
      const file = input.files[0];
      if (!file) return finish('', '', '');
      if (file.size > 8 * 1024 * 1024) return finish('', '', 'Bestand is groter dan 8 MB.');
      try { finish(await file.text(), file.name, ''); }
      catch (_) { finish('', '', 'Bestand kan niet worden gelezen.'); }
    });
    input.click();
  }
};
window.addEventListener('beforeunload', event => {
  if (window.TiltwickFiles.dirty) {
    event.preventDefault();
    event.returnValue = '';
  }
});