'use client'

import classnames from 'classnames'

import Link from '@/components/Link'

import { horizontalLayoutClasses } from '@layouts/utils/layoutClasses'

const FooterContent = () => {
  return (
    <div
      className={classnames(horizontalLayoutClasses.footerContent, 'flex items-center justify-between flex-wrap gap-4')}
    >
      <p>
        <span className='text-textSecondary'>{`© ${new Date().getFullYear()}, Made with `}</span>
        <span>{`❤️`}</span>
        <span className='text-textSecondary'>{` by `}</span>
        <Link href='/' target='_blank' className='font-medium text-primary'>
          Neighbors team
        </Link>
      </p>
    </div>
  )
}

export default FooterContent
