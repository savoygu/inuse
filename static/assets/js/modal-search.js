$(function () {
  $(document).keydown(function (event) {
    // 判断是否按下了 Command / Ctrl 键和 K 键
    if ((event.ctrlKey || event.metaKey) && event.which == 75) {
      event.preventDefault()

      $('#search-modal').modal('show')
      setTimeout(() => {
        $('#m_search-text').focus()
      }, 200)
    }
  })
})
