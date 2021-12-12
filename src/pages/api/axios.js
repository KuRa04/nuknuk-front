class RequestMovie {
  small_tab
  large_tab
  movie_id
  page
  ip_address

  constructor(small_tab, large_tab,
    movie_id, page, ip_address) {
    this.small_tab = small_tab
    this.large_tab = large_tab
    this.movie_id = movie_id
    this.page = page
    this.ip_address = ip_address
  }

  set smallTab(small_tab) {
    this.small_tab = small_tab
  }

  set largeTab(large_tab) {
    this.large_tab = large_tab
  }
}

export default RequestMovie