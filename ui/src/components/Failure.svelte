<script>
  import Button from './Button.svelte'
  export let value

</script>

<p>Unexpected error: {value}</p>

<Button href="auth/logout" value="Logout" />

<style>
  p {
    color: #aa3311;
  }

</style>
