class RequestMovie {
  small_tab: number
  large_tab: string
  movie_id: number
  page: number
  ip_address: string

  constructor(small_tab: number, large_tab: string,
    movie_id: number, page: number, ip_address: string) {
    this.small_tab = small_tab
    this.large_tab = large_tab
    this.movie_id = movie_id
    this.page = page
    this.ip_address = ip_address
  }

  set setSmallTab(small_tab: number) {
    this.small_tab = small_tab
  }

  set setLargeTab(large_tab: string) {
    this.large_tab = large_tab
  }
}

export default RequestMovie