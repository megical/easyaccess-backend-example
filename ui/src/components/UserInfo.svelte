<script>
  // import QrCode from './QrCode.svelte'
  import Button from './Button.svelte'

  export let user = {}

  const { idToken, subject, claims } = user

</script>

<dl>
  <dt>Subject</dt>
  <dd>{claims.sub}</dd>

  <dt>ID-token</dt>
  <dd><pre>{idToken}</pre></dd>

  <dt>Claims</dt>
  <dd><pre>{JSON.stringify(claims, null, 2)}</pre></dd>
</dl>

<Button href="auth/logout" value="Logout" />

<style>
  dl {
    overflow: hidden;
  }

  dt {
    color: #999;
    padding-top: 0.5rem;
  }

  dd {
    margin: 0;
    overflow: scroll;
    white-space: normal;
  }

</style>
