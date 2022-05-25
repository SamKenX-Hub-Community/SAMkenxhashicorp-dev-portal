import { useState } from 'react'
import classNames from 'classnames'
import { useId } from '@react-aria/utils'
import { DisclosureProps } from './types'
import s from './disclosure.module.css'

/**
 * @TODO
 *  - add onOpen callback
 *  - add onClosed callback
 */
const Disclosure = ({
  activatorClassName,
  activatorContent,
  children,
  containerClassName,
  containerCollapsedClassName,
  containerExpandedClassName,
  contentContainerClassName,
  open = false,
}: DisclosureProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(open)
  const uniqueId = `disclosure-${useId()}`
  const contentContainerId = `${uniqueId}-content`

  const containerClasses = classNames(s.root, containerClassName, {
    [containerCollapsedClassName]: !isOpen,
    [containerExpandedClassName]: isOpen,
  })

  return (
    <div className={containerClasses}>
      <button
        aria-controls={contentContainerId}
        aria-expanded={isOpen}
        className={classNames(s.activator, activatorClassName)}
        onClick={() => setIsOpen(!isOpen)}
      >
        {activatorContent}
      </button>
      <div
        className={classNames(s.contentContainer, contentContainerClassName)}
        id={contentContainerId}
      >
        {children}
      </div>
    </div>
  )
}

export type { DisclosureProps }
export default Disclosure
