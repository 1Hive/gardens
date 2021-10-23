# Garden Connector

Connector for the Garden frontend implemented using [Aragon Connect](https://aragon.org/connect). It connects to a [garden subgraph](https://github.com/1Hive/gardens/tree/master/packages/subgraph) created using [The Graph](https://thegraph.com/) indexing protocol.

The garden subgraph collects, stores and indexes garden-related data from the blockchain and serves it through a [GraphQL](https://graphql.org/) endpoint. The connector is an abstraction over this subgraph which offers an API that can be use by any client to fetch data.

## Documentation

Check out the [documentation](https://1hive.github.io/gardens-connector/modules.html) for an in-depth explanation of the API.

## Usage of Garden Connector

### Set up

1.  Add the following dependencies to your project:

    ```sh
    yarn add @1hive/connect
    yarn add @1hive/connect-gardens
    ```

2.  Import them:

    ```js
    import connect from '@1hive/connect'
    import { connectGarden } from '@1hive/connect-gardens'
    ```

3.  Set up the connector:

    ```js
    const org = await connect(DAO_ADDRESS_OR_ENS, 'thegraph', { network: CHAIN_ID })

    const gardenConnector = await connectGarden(org)
    ```


### Set up in a React App

1.  Add the following dependencies to your project:

    ```sh
    yarn add @1hive/connect-react
    yarn add @1hive/connect-gardens
    ```

2.  Wrap your main `<App/>` component in the `<Connect/>` component provided by the `@1hive/connect-react` library.

    ```jsx
    import { Connect } from '@1hive/connect-react'

    <Connect
        location={DAO_ADDRESS_OR_ENS}
        connector="thegraph"
        options={{
        network: CHAIN_ID,
        }}
    >
        <App />
    </Connect>
    ```

3.  Set up the connector:

    ```js
    import {
        useOrganization,
    } from '@1hive/connect-react'

    function App() {
        const [gardenConnector, setGardenConnector] = useState(null)
        const [organization] = useOrganization()

        useEffect(() => {
            if (!organization) {
                return
            }

            let cancelled = false

            const fetchGardenConnector = async () => {
                try {
                    const gardenConnector = await connectGarden(organization)

                    if (!cancelled) {
                        setGardenConnector(gardenConnector)
                    }
                } catch (err) {
                    console.error(`Error fetching hatch connector: ${err}`)
                }
            }

            fetchGardenConnector()

            return () => {
                cancelled = true
            }
        }, [organization])
    }
    ```

### Data fetch example

Below there is an example of how to fetch 100 proposals, sorted in ascending order by their creation time and skipping the first 50. Filtering by all proposal types and all proposal statuses with an empty metadata (proposal name) filter. 

```js
const ALL_PROPOSAL_TYPES = [0, 1, 2] // [Suggestion, Proposal, Decision]
const ALL_PROPOSAL_STATUSES = [0, 1, 2] // [Active, Cancelled, Executed]

const proposals = await gardenConnector.proposals({
    first: 100,
    skip: 50,
    orderBy: 'createdAt',
    orderDirection: 'asc',
    types: ALL_PROPOSAL_TYPES,
    statuses: ALL_PROPOSAL_STATUSES,
    metadata: ''
})
```

### Data updates subscription example

This is an example of how to set a proposals data subscription of the first 20 proposals, sorted in descending order by their creation time and skipping the first 5. Filtering by proposals of type Suggestion and Proposal with Active status and that has metadata "funding" in their names. 

```js
const handler = gardenConnector.onProposals(
    {
        first: 20,
        skip: 5,
        orderBy: 'totalAmount',
        orderDirection: 'desc',
        types: [0, 1],
        statuses: [0],
        metadata: 'funding'
    },
    proposals => {
        console.log('Updated proposals: ', proposals)
    }
)

// ...

handler.unsubscribe()
```

## Usage of useGardens and useUser

### Data fetch example of useGardens

This is an example of how to create a React hook to fetch a list of Gardens order by they HNY liquidity. 

```jsx
import { getGardens } from '@1hive/connect-gardens'

function useGardensList() {
  const [gardens, setGardens] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const fetchGardens = async () => {
      try {
        setLoading(true)

        const result = await getGardens(
          { network: CHAIN_ID },
          { orderBy: 'honeyLiquidity' }
        )

        setGardens(result)
      } catch (err) {
        setGardens([])
        console.error(`Error fetching gardens ${err}`)
      }
      setLoading(false)
    }

    fetchGardens()
  }, [sorting.queryArgs])

  return [gardens, loading]
}
```

### Data fetch example of useUser

This is an example of how to create a React hook to fetch a user data given their address. 

```jsx
import { getUser } from '@1hive/connect-gardens'

function useUser(address) {
  const [user, setUser] = useState(null)
  const mounted = useMounted()

  useEffect(() => {
    if (!address) {
      return
    }

    const fetchUser = async () => {
      try {
        const user = await getUser(
          { network: CHAIN_ID },
          { id: address.toLowerCase() }
        )
        if (mounted()) {
          setUser(transformUserData(user))
        }
      } catch (err) {
        console.error(`Failed to fetch user: ${err}`)
      }
    }

    fetchUser()
  }, [address, mounted])

  return user
}
```

For more information check out the Aragon Connect [docs](https://connect.aragon.org/).

## Contributing

We welcome community contributions!

Please check out our open [Issues](https://github.com/1Hive/gardens/issues?q=is%3Aissue+is%3Aopen+sort%3Aupdated-desc) to get started.


