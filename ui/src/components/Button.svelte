<script>
  export let href
  export let value
</script>

<style>
  a {
    border: 1px solid #aaa;
    padding: 1rem;
    margin: auto;
    text-align: center;
    border-radius: 100rem;
    display: block;
  }
  a:hover {
    background-color: #efefef;
    text-decoration: none;
  }
</style>

<a {href}>{value}</a>
