import { TutorialLite as ClientTutorialLite } from 'lib/learn-client/types'
import { useCurrentProduct } from 'contexts'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import CoreDevDotLayout from 'layouts/core-dev-dot-layout'
import {
  generateProductLandingSidebarNavData,
  generateTopLevelSidebarNavData,
} from 'components/sidebar/helpers'
import TutorialsSidebar, {
  CollectionViewSidebarContent,
} from 'components/tutorials-sidebar'
import { getTutorialSlug } from './helpers'
import { CollectionPageProps } from './server'
import CollectionMeta from './components/collection-meta'
import CollectionTutorialList from './components/collection-tutorial-list'
import { formatTutorialCard } from 'components/tutorial-card/helpers'

function CollectionView({
  collection,
  layoutProps,
}: CollectionPageProps): React.ReactElement {
  const currentProduct = useCurrentProduct()
  const { name, slug, description, tutorials, ordered } = collection

  const sidebarNavDataLevels = [
    generateTopLevelSidebarNavData(currentProduct.name),
    generateProductLandingSidebarNavData(currentProduct),
    {
      levelButtonProps: {
        levelUpButtonText: `${currentProduct.name} Home`,
        levelDownButtonText: 'Previous',
      },
      backToLinkProps: {
        text: `${currentProduct.name} Home`,
        href: `/${currentProduct.slug}`,
      },
      title: 'Tutorials',
      children: (
        <CollectionViewSidebarContent sections={layoutProps.sidebarSections} />
      ),
    },
  ]

  return (
    <SidebarSidecarLayout
      breadcrumbLinks={layoutProps.breadcrumbLinks}
      AlternateSidebar={TutorialsSidebar}
      /**
       * @TODO remove casting to `any`. Will require refactoring both
       * `generateTopLevelSidebarNavData` and
       * `generateProductLandingSidebarNavData` to set up `menuItems` with the
       * correct types. This will require chaning many files, so deferring for
       * a follow-up PR since this is functional for the time being.
       */
      sidebarNavDataLevels={sidebarNavDataLevels as any[]}
      sidecarSlot={null}
    >
      <CollectionMeta
        // Note: id is passed here because it is required by <Heading />,
        // it's not used for #anchor linking since there is no sidecar.
        heading={{ text: name, id: collection.id }}
        description={description}
        cta={{ href: getTutorialSlug(tutorials[0].slug, slug) }}
        numTutorials={tutorials.length}
      />
      <CollectionTutorialList
        isOrdered={ordered}
        tutorials={tutorials.map((t: ClientTutorialLite) =>
          formatTutorialCard(t, slug)
        )}
      />
    </SidebarSidecarLayout>
  )
}

CollectionView.layout = CoreDevDotLayout
export default CollectionView
