import VerticalLayout from './VerticalLayout.js'

export default () => {

  return (`
    <div class='layout'  data-testid="loading-page">
      ${VerticalLayout()}
      <div class='content' id='loading'>
        Loading...
      </div>
    </div>`
  )
}