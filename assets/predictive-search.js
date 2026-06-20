class PredictiveSearch extends HTMLElement {
  constructor() {
    super();
    this.input = this.querySelector('input[type="search"]') || this.querySelector('input[type="text"]');
    this.predictiveSearchResults = this.querySelector('#predictive-search-results');
    this.setupEventListeners();
  }

  setupEventListeners() {
    let debounceTimer;
    this.input.addEventListener('input', (event) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        this.onChange(event);
      }, 300);
    });
    
    // Close on click outside
    document.addEventListener('click', (event) => {
      if (!this.contains(event.target)) {
        this.close();
      }
    });
  }

  onChange(event) {
    const searchTerm = event.target.value.trim();

    if (!searchTerm.length) {
      this.close();
      return;
    }

    this.getSearchResults(searchTerm);
  }

  getSearchResults(searchTerm) {
    fetch(`/search/suggest?q=${searchTerm}&resources[type]=product,query&resources[limit]=4&section_id=predictive-search`)
      .then((response) => {
        if (!response.ok) {
          var error = new Error(response.status);
          this.close();
          throw error;
        }
        return response.text();
      })
      .then((text) => {
        const resultsMarkup = new DOMParser().parseFromString(text, 'text/html').querySelector('#shopify-section-predictive-search').innerHTML;
        this.predictiveSearchResults.innerHTML = resultsMarkup;
        this.open();
      })
      .catch((error) => {
        this.close();
        throw error;
      });
  }

  open() {
    this.predictiveSearchResults.classList.remove('hidden');
  }

  close() {
    this.predictiveSearchResults.classList.add('hidden');
  }
}

customElements.define('predictive-search', PredictiveSearch);
