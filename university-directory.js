const search = document.getElementById('seo-search');
search?.addEventListener('input', () => {
  const value = search.value.trim().toLocaleLowerCase();
  document.querySelectorAll('#seo-directory-list li').forEach(item => {
    item.hidden = !item.textContent.toLocaleLowerCase().includes(value);
  });
});
