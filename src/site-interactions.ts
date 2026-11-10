const mobile = document.querySelector<HTMLDetailsElement>('.mobile-nav');
mobile?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => { mobile.open = false; }));

for (const image of document.querySelectorAll('main img, header img')) {
  const hide = () => { image.hidden = true; };
  image.addEventListener('error', hide);
  if (image.complete && !image.naturalWidth) hide();
}

const gallery = document.querySelector('.gallery');
const filters = document.querySelector<HTMLElement>('.filters');
const dialog = document.querySelector<HTMLDialogElement>('#lightbox');
if (gallery && dialog && typeof dialog.showModal === 'function') {
  const figures = [...gallery.querySelectorAll<HTMLElement>('[data-category]')];
  const photo = dialog.querySelector('img')!;
  const caption = dialog.querySelector<HTMLElement>('[data-caption-live]')!;
  const prev = dialog.querySelector<HTMLButtonElement>('[data-prev]')!;
  const next = dialog.querySelector<HTMLButtonElement>('[data-next]')!;
  let active = 0;
  let trigger: HTMLAnchorElement | undefined;
  function visibleLinks() {
    return figures.filter(figure => !figure.hidden).map(figure => figure.querySelector<HTMLAnchorElement>('[data-lightbox]')!);
  }
  function show(index: number) {
    const links = visibleLinks();
    active = (index + links.length) % links.length;
    const link = links[active];
    const label = link.dataset.caption ?? '';
    photo.hidden = false;
    photo.alt = link.querySelector('img')?.alt ?? '';
    photo.src = link.href;
    caption.textContent = label;
    prev.disabled = next.disabled = links.length < 2;
  }
  photo.addEventListener('error', () => {
    photo.hidden = true;
    caption.textContent = 'Ảnh hiện không tải được.';
  });
  figures.forEach(figure => {
    const link = figure.querySelector<HTMLAnchorElement>('[data-lightbox]')!;
    link.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return;
      event.preventDefault();
      trigger = link;
      show(visibleLinks().indexOf(link));
      dialog.showModal();
    });
  });
  dialog.querySelector('[data-close]')?.addEventListener('click', () => dialog.close());
  prev.addEventListener('click', () => show(active - 1));
  next.addEventListener('click', () => show(active + 1));
  dialog.addEventListener('keydown', event => {
    if (visibleLinks().length < 2) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      show(active + (event.key === 'ArrowLeft' ? -1 : 1));
    }
  });
  dialog.addEventListener('close', () => trigger?.focus());
  if (filters) {
    filters.hidden = false;
    const buttons = filters.querySelectorAll<HTMLButtonElement>('button');
    buttons.forEach(button => button.addEventListener('click', () => {
      buttons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      figures.forEach(figure => { figure.hidden = Boolean(button.dataset.filter) && figure.dataset.category !== button.dataset.filter; });
    }));
  }
}
