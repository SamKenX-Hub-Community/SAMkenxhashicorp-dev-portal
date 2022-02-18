import PackerIoLayout from 'layouts/_proxied-dot-io/packer'
import DocsPage from '@hashicorp/react-docs-page'
import productData from 'data/packer.json'
import { isVersionedDocsEnabled } from 'lib/env-checks'
import PluginBadge from 'components/_proxied-dot-io/packer/plugin-badge'
// Imports below are used in getStatic functions only
import { getStaticGenerationFunctions } from '@hashicorp/react-docs-page/server'
import { appendRemotePluginsNavData } from 'components/_proxied-dot-io/packer/remote-plugin-docs/server'

const product = { name: productData.name, slug: productData.slug }
const basePath = 'plugins'
const navDataFile = `../data/${basePath}-nav-data.json`
const localContentDir = `../content/${basePath}`
const localPartialsDir = `../content/partials`
const enableVersionedDocs = isVersionedDocsEnabled(productData.slug)
const additionalComponents = { PluginBadge }

// path relative to the `website` directory of the Packer GitHub repo
const remotePluginsFile = 'data/plugins-manifest.json'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function DocsView(props) {
  return (
    <DocsPage
      product={product}
      baseRoute={basePath}
      staticProps={props}
      additionalComponents={additionalComponents}
      showVersionSelect={false}
      algoliaConfig={productData.algoliaConfig}
    />
  )
}

const { getStaticProps: baseGetStaticProps } = getStaticGenerationFunctions(
  enableVersionedDocs
    ? {
        strategy: 'remote',
        basePath,
        fallback: 'blocking',
        revalidate: 360, // 1 hour
        product: productData.slug,
      }
    : {
        strategy: 'fs',
        localContentDir,
        navDataFile,
        localPartialsDir,
        product: productData.slug,
      }
)

async function getStaticProps(ctx) {
  const staticProps = await baseGetStaticProps({ params: {}, ...ctx })
  const navData = await appendRemotePluginsNavData(
    remotePluginsFile,
    staticProps.props.navData,
    ''
  )
  staticProps.props.navData = navData
  return staticProps
}

// Export getStatic functions
export { getStaticProps }
// Export view with layout
DocsView.layout = PackerIoLayout
export default DocsView
