<script>
  import Failure from './components/Failure.svelte'
  import UserInfo from './components/UserInfo.svelte'
  import Spinner from './components/Spinner.svelte'
  import Splash from './components/Splash.svelte'

  const getUser = async () => {
    const res = await fetch('api/v1/private/userInfo')
    if (res.ok) {
      const data = await res.json()
      return data
    } else if (res.status === 401) {
      return null
    } else {
      throw new Error(`${res.status}`)
    }
  }

  const user = getUser()

</script>

<main>
  <section>
    <h1>Backend Example</h1>
    {#await user}
      <Spinner />
    {:then resolve}
      {#if resolve == null}
        <Splash />
      {:else}
        <UserInfo user={resolve} />
      {/if}
    {:catch error}
      <Failure value={error.message} />
    {/await}
  </section>
</main>

<style>
  main {
    display: grid;
    place-items: center;
    padding: 1rem;
  }

  section {
    padding: 2rem 3rem 3rem;
    max-width: 90vw;
    border-radius: 1rem;
    background-color: #fff;
    box-shadow: 0px 3px 5px 6px rgba(0, 0, 0, 0.1);
  }

</style>
